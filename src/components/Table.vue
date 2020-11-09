<template>
  <div class="table">
    <div class="row">
      <p class="title">Average</p>
      <p class="title">Environmental zone</p>
      <p class="title">Non-environmental zone</p>
    </div>
    <div class="row">
      <p class="title">% of spots with a charging point</p>
      <p>{{ chargingPointPercentage.ezone }}</p>
      <p>{{ chargingPointPercentage.nzone }}</p>
    </div>
    <div class="row">
      <p class="title">€ cost / hour parking</p>
      <p>9</p>
      <p>9</p>
    </div>
    <div class="row">
      <p class="title">Parking spots / household</p>
      <p>9</p>
      <p>9</p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    selectedParkings() {
      return this.$store.getters.selectedZoneParkings;
    },
    selectedParkingsMapped() {
      return {
        ezone: this.selectedParkings.filter(p => p.environmentalZone), // environmental zone
        nzone: this.selectedParkings.filter(p => !p.environmentalZone) // normal zone
      }
    },
    chargingPointPercentage() {
      const parkings = this.selectedParkingsMapped;
      return {
        ezone: parkings.ezone.filter(p => p.chargingPoints).length / parkings.ezone.length * 100,
        nzone: parkings.nzone.filter(p => p.chargingPoints).length / parkings.nzone.length * 100,
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  .row {
    display: grid;
    grid-template-columns: 3fr 180px 200px;
    gap: 1rem;
    > p {
      background-color: #A59789;
      color: white;
      padding: 0.8rem 1rem;
      &.title {
        font-weight: bold;
      }
    }
  }
  margin-top: 1rem;
}
</style>