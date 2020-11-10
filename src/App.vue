<template>
  <div id="main-wrapper">
    <div class="left">
      <h1>Is green transportation supported more in parking places that are situated in environmental zones?</h1>
      <div id="sankey">
        sankey
      </div>
      <div id="table">
        <div class="select">
          <p>Statistics for</p>
          <select @change="selectMunicipality()" v-model="zone" name="environmentZone" id="environmentZone">
            <option
            style="text-transform: capitalize;"
              v-for="name in environmentZoneNames"
              :key="name"
              :value="name">{{ name }}</option>
          </select>
          <p>All parkings</p>
        </div>
        <table-comp v-if="selectedZone"/>
      </div>
    </div>
    <div id="map">
      <map-comp width="1000" height="1000" v-if="ready"/>
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
  name: "App",
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
  computed: {
    data() {
      return this.$store.getters.parkingData;
    },
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
  methods: {
    selectMunicipality() {
      const zone = this.environmentZoneCities.find(x => x.properties.name.toLowerCase().replace('-', ' ') === this.zone);
      if(!zone) return;
      if(this.selectedZone && zone.properties.name === this.selectedZone.properties.name) {
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
  margin-bottom: 2rem;
  margin-top: 0;
}
p {
  margin: 0;
}
#main-wrapper {
  max-height: 100vw;
  min-height: 100vw;
  margin: 0;
  display: flex;
  margin-left: 10rem;
  margin-top: 4rem;
  .left {
    max-width: 600px;
    margin-right: 4rem;
    #sankey {
      width: 100%;
      height: 350px;
      background-color: red;
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
  #map {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>