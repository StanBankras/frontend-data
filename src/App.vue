<template>
  <smiley/>
  <bar-chart v-if="ready"/>
</template>

<script>
import BarChart from './components/practice/BarChart';
import Smiley from './components/practice/Smiley';

export default {
  name: "App",
  components: {
    BarChart, Smiley
  },
  data() {
    return {
      ready: false
    }
  },
  mounted() {
    this.$store.dispatch("initializeData").then(() => this.ready = true);
  },
};
</script>