<template>
  <div id="main-wrapper">
    <div class="left">
      <h1>Is green transportation supported more in parking places that are situated in environmental zones?</h1>
      <p class="subtitle">
        Select a 
        <span class="legend-dot municipality-dot"/> <b>municipality</b> 
        to find out more in comparison to the 
        <span class="legend-dot environment-dot"/> <b>environmental zone</b> 
        inside it
      </p>
      <div id="sankey">
        sankey will come here
      </div>
      <div id="table">
        <div class="select">
          <p>Statistics for</p>
          <select @change="selectMunicipality()" v-model="zone" name="environmentZone" id="environmentZone">
            <option :value="undefined">All</option>
            <option
              style="text-transform: capitalize;"
              v-for="name in environmentZoneNames"
              :key="name"
              :value="name">{{ name }}</option>
          </select>
          <p>parkings</p>
        </div>
        <table-comp v-if="selectedZone"/>
      </div>
    </div>
    <div class="map-wrapper">
      <div id="map">
        <map-comp class="map" width="1000" height="1000" v-if="ready"/>
        <div class="loader-container" v-else>
          <img src="@/assets/img/loader.svg" alt="loader">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TableComp from './components/Table';
import MapComp from './components/Map';
import * as municipalities from '@/assets/data/townships.json';

export default {
  components: {
    TableComp, MapComp
  },
  computed: {
    selectedZone() {
      return this.$store.getters.selectedZone;
    },
    parkingData() {
      return this.$store.getters.parkingData;
    },
    environmentZoneNames () {
      return this.$store.getters.environmentZoneNames;
    },
    environmentZoneCities() {
      return this.municipalities.features
        .filter(x => this.environmentZoneNames.includes(x.properties.name.toLowerCase().replace('-', ' ')));
    },
  },
  data() {
    return {
      ready: false,
      zone: undefined,
      municipalities: municipalities.default
    }
  },
  mounted() {
    this.$store.dispatch("initializeData").then(() => {
      this.ready = true;
    });
  },
  methods: {
    selectMunicipality() {
      const zone = this.environmentZoneCities.find(x => x.properties.name.toLowerCase().replace('-', ' ') === this.zone);

      if(!zone || this.selectedZone && zone.properties.name === this.selectedZone.properties.name) {
        this.$store.commit('SET_SELECTED_ZONE', undefined);
      } else {
        this.$store.commit('SET_SELECTED_ZONE', zone);
      }
    }
  },
  watch: {
    selectedZone(oldVal) {
      if(!oldVal) return;
      this.zone = oldVal.properties.name.toLowerCase().replace('-', ' ');
    }
  }
};
</script>

<style lang="scss">
body {
  margin: 0;
  min-height: 100vw;
  max-height: 100vw;
  background-color: #fffaec;
}
h1 {
  margin-bottom: 1rem;
  margin-top: 0;
}
p {
  margin: 0;
  &.subtitle {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  b {
    margin-right: 0.5rem;
  }
}
#main-wrapper {
  max-height: 100vw;
  min-height: 100vw;
  margin: 0;
  display: grid;
  grid-template-columns: 675px 1fr;
  margin-left: 10rem;
  margin-top: 4rem;
  .left {
    max-width: 600px;
    margin-right: 4rem;
    #sankey {
      width: 100%;
      height: 300px;
      border: 1px solid red;
      padding: 1rem;
      margin-bottom: 2rem;
    }
    #table {
      .select {
        display: flex;
        align-items: center;
        margin-bottom: 2rem;
        p {
          font-weight: bold;
          font-size: 20px;
        }
        select {
          width: 150px;
          padding: 0 10px !important;
          margin: 0 1.3rem;
          height: 40px;
        }
      }
    }
  }
  .map-wrapper {
    width: 100%;
  }
  #map {
    .map {
      max-width: 1000px;
      position: absolute;
      right: 0;
      top: 0;
    }
    .loader-container {
      width: 100%;
      height: 100%;
      min-height: 80vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.legend-dot {
  display: block;
  height: 15px;
  width: 15px;
  background-color: black;
  border: 2px solid black;
  margin: 0 0.5rem;
  &.municipality-dot {
    background-color: rgb(255 227 205);
  }
  &.environment-dot {
    background-color: rgb(16, 202, 16);
  }
}
</style>