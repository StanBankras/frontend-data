<template>
  <svg ref="svg" width="100%" height="100%">
    <g class="provinces">
      <path
        v-for="province in provinceData"
        :key="province.geometry"
        :d="pathGenerator(province)"
      />
    </g>
    <g class="parkings">
      <circle
        v-for="parking in parkingsMapped"
        :key="parking.id"
        r="5"
        :cx="parking.x"
        :cy="parking.y"/>
    </g>
    <g class="environment-zones">
      <path
        v-for="zone in environmentZones"
        :key="zone.geometry.coordinates"
        :d="pathGenerator(zone)"
      />
    </g>
    <g class="municipalities">
      <path
        v-for="zone in environmentZoneCities"
        :key="zone.properties.code"
        @click="selectMunicipality(zone)"
        :d="pathGenerator(zone)"
      />
    </g>
  </svg>
</template>

<script>
// Help from https://makeshiftinsights.com/blog/d3-vue-choropleth/
import * as d3 from 'd3';
import * as provinces from '@/assets/data/provinces.json';
import * as municipalities from '@/assets/data/townships.json'; // https://www.webuildinternet.com/articles/2015-07-19-geojson-data-of-the-netherlands/townships.geojson
import { getCenterCoordFromPolygon } from '@/utils/helpers';

export default {
  computed: {
    projection() {
      return d3.geoMercator()
        .center(this.centerPoint)
        .scale(this.selectedZone ? 50000 : 17000)
    },
    pathGenerator() {
      return d3.geoPath().projection(this.projection);
    },
    provinceData() {
      return provinces.default.features; // https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/the-netherlands.geojson
    },
    environmentZones() {
      return this.$store.getters.environmentZones.features;
    },
    environmentZoneNames() {
      return this.environmentZones.map(x => x.properties.Gemeente.toLowerCase().replace('-', ' '));
    },
    environmentZoneCities() {
      return municipalities.default.features
        .filter(x => this.environmentZoneNames.includes(x.properties.name.toLowerCase()
        .replace('-', ' ')));
    },
    parkingData() {
      return this.$store.getters.parkingData;
    },
    parkingsMapped() {
      return this.parkingData
        .filter(p => p.centerCoord.length > 1 && !isNaN(p.centerCoord[0]) && !isNaN(p.centerCoord[1]))
        .map(parking => {
          return {
            id: parking.areaId,
            x: this.projection(parking.centerCoord)[0],
            y: this.projection(parking.centerCoord)[1]
          }
      })
    },
    selectedZone() {
      return this.$store.getters.selectedZone;
    },
    centerPoint() {
      if(!this.selectedZone) return [4.55, 52.1];
      return getCenterCoordFromPolygon(this.selectedZone.geometry.coordinates[0][0]);
    }
  },
  methods: {
    selectMunicipality(zone) {
      this.$store.commit('SET_SELECTED_ZONE', zone);
    }
  }
}
</script>

<style lang="scss" scoped>
path, circle, g {
  transition: .7s ease-in-out;
}
.provinces {
  fill: #ddb89b;
  stroke-width: 5px;
  stroke: #fffaec;
}
.environment-zones {
  fill: rgba(255, 0, 0, 0.705);
  stroke: rgb(124, 0, 0);
  stroke-width: 2px;
}
.parkings {
  fill: rgba(0, 0, 0, 0.1);
}
.municipalities {
  fill: rgba(255, 255, 0, 0.438);
  path {
    stroke: black;
    stroke-width: 1px;
    &:hover {
      stroke-width: 3px;
      cursor: pointer;
    }
  }
}
</style>