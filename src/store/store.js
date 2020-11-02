import { createStore } from 'vuex';
import { getEnvironmentalZones } from '../utils/esri';
import { isCoordInPolygon, getCenterCoord } from '../utils/helpers';
import { newDataset } from '../utils/mergedata';
import { getTariffs } from '../services/tariffservice';

const settings = {
  endpoints: [
    'https://opendata.rdw.nl/resource/nsk3-v9n7.json', // geoData parking areas // https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-GEOMETRIE-GEBIED/nsk3-v9n7
    'https://opendata.rdw.nl/resource/b3us-f26s.json' // Charging points // https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-SPECIFICATIES-PARKEERGEBIED/b3us-f26s
  ],
  sharedKey: 'areaid',
  keys: {
    areageometryastext: 'area',
    chargingpointcapacity: 'chargingPoints',
    areaid: 'areaId'
  },
  strictKeys: false
}

const store = createStore({
  state() {
    return {
      parkingData: [],
      environmentZones: []
    }
  },
  getters: {
    parkingData(state) {
      return state.parkingData;
    }
  },
  mutations: {
    SET_PARKING_DATA(state, payload) {
      state.parkingData = payload;
    },
    SET_ENVIRONMENT_ZONES(state, payload) {
      state.environmentZones = payload;
    }
  },
  actions: {
    async initializeData({ commit }) {
      const dataset = newDataset(settings.endpoints, settings.sharedKey);

      const requestedData = await Promise.all([getEnvironmentalZones(), dataset]);
      const data = requestedData[1];
      const environmentalZones = requestedData[0];

      commit('SET_ENVIRONMENT_ZONES', environmentalZones);

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
          return obj;
        })
        .map(x => {
          const obj = x;
          obj.environmentalZone = isCoordInPolygon(obj.centerCoord, environmentalZones);
          return obj;
        })
        .map(async (x) => {
          const obj = x;
          obj.tariffs = await getTariffs(obj.areaId);
          obj.overallAverageTariff = Object.values(obj.tariffs || [])
            .map(x => x.averageTariff)
            .reduce((prev, cur) => prev + cur, 0) / Object.keys(obj.tariffs || []).length;

          return obj;
        });

      return commit('SET_PARKING_DATA', await Promise.all(filteredData));
    }
  }
});

export default store;