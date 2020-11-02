<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <p v-for="zone in environmentZones" :key="zone.polygon">
    {{ zone.municipality }}
  </p>
  <p>{{ parkingData.length }}</p>
</template>

<script>
export default {
  name: "App",
  computed: {
    environmentZones() {
      return this.$store.getters.environmentZones;
    },
    parkingData() {
      return this.$store.getters.parkingData;
    }
  },
  mounted() {
    this.$store.dispatch("initializeData");
  },
};
</script>