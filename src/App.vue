<template>
  <img alt="Vue logo" src="./assets/logo.png">
</template>

<script>

export default {
  name: 'App',
  mounted() {
    this.$store.dispatch('initializeData').then(() => {
      console.log(this.$store.getters.parkingData);
    })
  }
}
</script>