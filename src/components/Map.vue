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

export default {
  computed: {
    projection() {
      return d3.geoMercator()
        .center([4.55, 52.1])
        .scale(17000)
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
      return this.parkingData.map(parking => {
        return {
          id: parking.areaId,
          x: parking.centerCoord ? this.projection(parking.centerCoord)[0] : 0,
          y: parking.centerCoord? this.projection(parking.centerCoord)[1] : 0
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
}
</style>