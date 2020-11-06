<template>
  <div id="main-wrapper">
    <div class="left">
      <h1>Is green transportation supported more in parking places that are situated in environmental zones?</h1>
      <div id="sankey">
        sankey
      </div>
      <div id="table">
        <bar-chart v-if="ready"/>
      </div>
    </div>
    <div id="map">
      Map
    </div>
  </div>
</template>

<script>
import BarChart from './components/practice/BarChart';

export default {
  components: {
    BarChart
  },
  name: "App",
  data() {
    return {
      ready: false
    }
  },
  mounted() {
    this.$store.dispatch("initializeData").then(() => {
      console.log(this.data.filter(x => x.specifications && x.specifications[0] && x.specifications[0].usage && x.environmentalZone));
      this.ready = true;
    });
  },
  computed: {
    data() {
      return this.$store.getters.parkingData;
    }
  }
};
</script>

<style lang="scss">
body {
  margin: 0;
  min-height: 100vw;
  max-height: 100vw;
  overflow: hidden;
  background-color: #fffaec;
}
h1 {
  margin-bottom: 2rem;
  margin-top: 0;
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
    #sankey {
      width: 100%;
      height: 300px;
      background-color: red;
      margin-bottom: 2rem;
    }
  }
}
</style>