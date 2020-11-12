<template>
  <svg ref="svg" width="100%" height="100%">
    <g class="provinces transition">
      <path
        v-for="province in provinceData"
        :key="province.geometry"
        :d="pathGenerator(province)"
      />
    </g>
    <g class="parkings">
      <!-- <g class="transition">
        <circle
          v-for="parking in parkingsMapped"
          :key="parking.id"
          r="5"
          :cx="parking.x"
          :cy="parking.y"/>
      </g> -->
      <g class="municipality-parkings">
        <transition-group name="fade" tag="g">
          <circle
            v-for="parking in selectedZoneParkings"
            :key="parking.id"
            r="3"
            :cx="parking.x"
            :cy="parking.y"
            class="active"
            :class="{ ezone: parking.ezone }"/>   
        </transition-group>       
      </g>
    </g>
    <g class="environment-zones transition">
      <path
        v-for="zone in environmentZones"
        :key="zone.geometry.coordinates"
        :class="{ selected: zone.properties.Gemeente.toLowerCase().replace('-', '') === (selectedZone ? selectedZone.properties.name.toLowerCase().replace('-', '') : '') }"
        :d="pathGenerator(zone)"
      />
    </g>
    <g class="municipalities transition">
      <path
        v-for="zone in environmentZoneCities"
        :key="zone.properties.code"
        @click="selectMunicipality(zone)"
        :d="pathGenerator(zone)"
        :class="{ active: zone.properties.name === (selectedZone ? selectedZone.properties.name : '') }"
      />
    </g>
  </svg>
</template>

<script>
// Help from https://makeshiftinsights.com/blog/d3-vue-choropleth/
import { geoMercator, geoPath } from 'd3';
import * as provinces from '@/assets/data/provinces.json';
import * as municipalities from '@/assets/data/townships.json';
import { getCenterCoordFromPolygon } from '@/services/zoneservice';

export default {
  computed: {
    projection() {
      return geoMercator()
        .center(this.centerPoint)
        .scale(this.selectedZone ? 50000 : 19000);
    },
    centerPoint() {
      if(!this.selectedZone) return [4.69, 52.1];
      return getCenterCoordFromPolygon(this.selectedZone.geometry.coordinates[0][0]);
    },
    pathGenerator() {
      return geoPath().projection(this.projection);
    },
    environmentZones() {
      console.log(this.$store.getters.environmentZones.features);
      return this.$store.getters.environmentZones.features;
    },
    environmentZoneNames() {
      return this.environmentZones.map(x => x.properties.Gemeente.toLowerCase().replace('-', ' '));
    },
    environmentZoneCities() {
      return this.municipalities.features
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
      });
    },
    selectedZone() {
      return this.$store.getters.selectedZone;
    },
    selectedZoneParkings() {
      return this.$store.getters.selectedZoneParkings
        .map(parking => {
          return {
            ezone: parking.environmentalZone,
            id: parking.areaId,
            x: this.projection(parking.centerCoord)[0],
            y: this.projection(parking.centerCoord)[1]
          }
        });
    }
  },
  data() {
    return {
      municipalities: municipalities.default,
      provinceData: provinces.default.features
    }
  },
  methods: {
    selectMunicipality(zone) {
      if(this.selectedZone && zone.properties.name === this.selectedZone.properties.name) {
        this.$store.commit('SET_SELECTED_ZONE', undefined);
      } else {
        this.$store.commit('SET_SELECTED_ZONE', zone);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.transition, .transition g, .transition path, .transition circle {
  transition: 1s ease-in-out;
}
.provinces {
  fill: #ddb89b;
  stroke-width: 5px;
  stroke: #fffaec;
}
.environment-zones {
  fill: green;
  transition: 1s;
  .selected {
    fill: transparent;
    stroke: rgb(0, 238, 255);
    stroke-width: 3px;
  }
}
.parkings {
  circle {
    fill: rgba(0, 0, 0, 0.1);
    &.active {
      fill: red;
    }
    &.ezone {
      fill: lightgreen;
      z-index: 100;
    }
  }
}
.municipalities {
  path {
    stroke: black;
    stroke-width: 1px;
    fill: rgba(255, 255, 0, 0.438);
    &:hover {
      stroke-width: 3px;
      cursor: pointer;
    }
    &.active {
      stroke-width: 3px;
      fill: transparent;
    }
  }
}
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  animation: fadeIn 2s linear;
}
.fade-leave, .fade-leave-active, .fade-leave-to {
  transition: 0s;
  opacity: 0;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  50%   { opacity: 0; }
  100%   { opacity: 1; }
}
</style>