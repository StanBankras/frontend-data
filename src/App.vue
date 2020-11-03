<template>
  <chart v-if="ready"/>
</template>

<script>
import Chart from './components/PracticeChart';

export default {
  name: "App",
  components: {
    Chart
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