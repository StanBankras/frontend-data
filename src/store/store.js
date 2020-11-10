import { createStore } from 'vuex';
import { fetchEnvironmentalZones } from '../services/zoneservice';
import { isCoordInEnvironmentalZone, getCenterCoord, isCoordInMunicipality } from '../services/zoneservice';
import { newDataset } from '../utils/mergedata';
import { getNpropendata } from '../services/nprservice';
import { settings } from './settings';
import * as municipalities from '@/assets/data/townships.json'; // https://www.webuildinternet.com/articles/2015-07-19-geojson-data-of-the-netherlands/townships.geojson

function state() {
  return {
    parkingData: [],
    parkingIdPerMunicipality: {},
    environmentZones: [],
    selectedZone: undefined
  }
}

const getters = {
  parkingData(state) { return state.parkingData },
  municipalityNames(getters) {
    return municipalities.features
      .filter(x => getters.environmentZoneNames.includes(x.properties.name.toLowerCase()
      .replace('-', ' ')));
  },
  environmentZones(state) { return state.environmentZones },
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
  environmentZoneNames(state) { return [... new Set((state.environmentZones.features || []).map(x => x.properties.Gemeente.toLowerCase().replace('-', ' ')))] },
  selectedZone(state) { return state.selectedZone },
  parkingsPerMunicipality(state, getters) {
    const filteredMunicipalities = {
      features: municipalities.features
        .filter(x => getters.environmentZoneNames.includes(x.properties.name.toLowerCase()
        .replace('-', ' ')))
    }

    const map = {};
    state.parkingData.slice().forEach(parking => {
      const result = isCoordInMunicipality(parking.centerCoord, filteredMunicipalities);
      if(!map.unknown) map.unknown = [];
      if(!result) return map.unknown.push(parking.areaId);
      if(!map[result]) map[result] = [];
      return map[result].push(parking);
    });
    return map;
  },
  selectedZoneParkings(state, getters) {
    if(!state.selectedZone) return [];
    return getters.parkingsPerMunicipality[state.selectedZone.properties.name]
      .filter(p => p.centerCoord.length > 1 && !isNaN(p.centerCoord[0]) && !isNaN(p.centerCoord[1]));
  }
}

const mutations = {
  SET_PARKING_DATA(state, payload) {
    state.parkingData = payload;
  },
  SET_ENVIRONMENT_ZONES(state, payload) {
    state.environmentZones = payload;
  },
  SET_SELECTED_ZONE(state, payload) {
    state.selectedZone = payload;
  }
}

const actions = {
  async initializeData({ commit }) {
    const dataset = newDataset(settings.endpoints, settings.sharedKey);

    const requestedData = await Promise.all([fetchEnvironmentalZones(), dataset]);
    const data = requestedData[1];
    const environmentalZones = requestedData[0];

    commit('SET_ENVIRONMENT_ZONES', environmentalZones)

    const filteredData = data
      .filter(x => Object.keys(settings.keys).every(key => {
        if (settings.strictKeys) return Object.prototype.hasOwnProperty.call(x, key); // https://stackoverflow.com/a/41439924
        return true;
      }))
      .map(x => {
        const obj = {};
        Object.keys(settings.keys).forEach(key => {
          return obj[settings.keys[key]] = (x[key] || undefined);
        });
        return obj;
      })
      .map(x => {
        const obj = x;
        obj.centerCoord = getCenterCoord(x.area);
        obj.environmentalZone = isCoordInEnvironmentalZone(obj.centerCoord, environmentalZones);
        return obj;
      })
      .map(async (x) => {
        const obj = x;
        const npropendata = await getNpropendata(obj.areaId);
        obj.tariffs = npropendata.tariffs;
        obj.specifications = npropendata.specifications;
        obj.overallAverageTariff = Object.values(obj.tariffs || [])
          .map(x => x.averageTariff)
          .reduce((prev, cur) => prev + cur, 0) / Object.keys(obj.tariffs || []).length;

        return obj;
      });

    return commit('SET_PARKING_DATA', await Promise.all(filteredData));
  }
}


const store = createStore({
  state: state(),
  getters,
  mutations,
  actions
});

export default store;