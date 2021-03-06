<template>
  <div class="wrap-svg">
    <svg ref="svg" width="100%" height="100%">
      <g class="provinces transition">
        <path
          v-for="province in provinceData"
          :key="province.geometry"
          :d="pathGenerator(province)"
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
      <transition-group class="municipality-parkings" name="fade" tag="g">
        <circle
          v-for="parking in selectedZoneParkings"
          :key="parking.id"
          r="3"
          :cx="parking.x"
          :cy="parking.y"
          class="active"
          :class="{ ezone: parking.ezone }"/>   
      </transition-group> 
      <g class="environment-zones transition">
        <path
          v-for="zone in environmentZones"
          :key="zone.geometry.coordinates"
          :class="{ selected: zone.properties.Gemeente.toLowerCase().replace('-', '') === (selectedZone ? selectedZone.properties.name.toLowerCase().replace('-', '') : '') }"
          :d="pathGenerator(zone)"
        />
      </g>
    </svg>
    <transition name="fade">
      <div v-if="selectedZone" class="labels">
        <p>
          <span class="circle red"></span>
          Parking outside environmental zone
        </p>
        <p>
          <span class="circle green"></span>
          Parking inside environmental zone
        </p>
      </div>  
    </transition>  
  </div>
</template>

<script>
// Help from https://makeshiftinsights.com/blog/d3-vue-choropleth/
import { geoMercator, geoPath, zoom, selectAll, select, zoomIdentity } from 'd3';
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
    selectedZone() {
      this.resetZoom();
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
    },
    zoom() {
      return zoom()
        .on('zoom', (e) => this.zoomed(e));
    }
  },
  data() {
    return {
      municipalities: municipalities.default,
      provinceData: provinces.default.features,
    }
  },
  mounted() {
    select('svg')
      .call(this.zoom);
  },
  methods: {
    selectMunicipality(zone) {
      if(this.selectedZone && zone.properties.name === this.selectedZone.properties.name) {
        this.$store.commit('SET_SELECTED_ZONE', undefined);
      } else {
        this.$store.commit('SET_SELECTED_ZONE', zone);
      }
    },
    zoomed(e) {
      selectAll('svg g').attr("transform", e.transform);
    },
    resetZoom() {
      // https://stackoverflow.com/questions/48790190/how-to-reset-zoom-in-d3-js
      selectAll('svg g').call(this.zoom.transform, zoomIdentity);
    }
  }
}
</script>

<style lang="scss" scoped>
.transition, .transition g, .transition path, .transition circle {
  transition: .3s ease-in-out;
}
.provinces {
  fill: #ddb89b;
  stroke-width: 5px;
  stroke: #fffaec;
  cursor: grabbing;
}
.environment-zones {
  fill: rgb(16, 202, 16);
  transition: .3s ease-in-out;
  pointer-events: none;
  .selected {
    fill: transparent;
    stroke: rgb(16, 202, 16);
    stroke-width: 3px;
  }
}
.municipality-parkings {
  transition: .3s ease-in-out;
  pointer-events: none;
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
    fill: rgb(255 227 205);
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

.wrap-svg {
  position: relative;
  width: 100%;
  height: 100%;
}

.labels {
  position: absolute;
  left: 0;
  top: 0;
  background-color: #fffaec;
  padding: 1rem;
  p {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
    &:last-child {
      margin-bottom: 0;
    }
    .circle {
      display: block;
      border-radius: 50%;
      background-color: black;
      width: 15px;
      height: 15px;
      margin-right: 0.5rem;
      &.red {
        background-color: red;
      }
      &.green {
        background-color: lightgreen;
      }
    }
  }
}

.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  animation: fadeIn 1.5s linear;
}
.fade-leave, .fade-leave-active, .fade-leave-to {
  transition: 0s;
  opacity: 0;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}
</style>