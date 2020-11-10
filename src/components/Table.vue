<template>
  <div class="table">
    <div class="row">
      <p class="title">Average</p>
      <p class="title">Environmental zone</p>
      <p class="title">Non-environmental zone</p>
    </div>
    <div class="row">
      <p class="title">Park with charge point</p>
      <p>{{ Number(chargingPointPercentage.ezone).toFixed(2) }}%</p>
      <p>{{ Number(chargingPointPercentage.nzone).toFixed(2) }}%</p>
    </div>
    <div class="row">
      <p class="title">€ cost / hour parking</p>
      <p>{{ Number(averageCostPerHour.ezone * 60).toFixed(2) }}</p>
      <p>{{ Number(averageCostPerHour.nzone * 60).toFixed(2) }}</p>
    </div>
    <div class="row">
      <p class="title">Park and ride %</p>
      <p>{{ Number(parkAndRidePercentage.ezone).toFixed(2) }}%</p>
      <p>{{ Number(parkAndRidePercentage.nzone).toFixed(2) }}%</p>
    </div>
  </div>
</template>

<script>
import { hasItems } from '@/utils/helpers.js';
 
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
        ezone: !hasItems(parkings.ezone) ? 0 : this.getParkingsWithChargingPointsPercentage(parkings.ezone),
        nzone: !hasItems(parkings.nzone) ? 0 : this.getParkingsWithChargingPointsPercentage(parkings.nzone),
      }
    },
    averageCostPerHour() {
      const parkings = this.selectedParkingsMapped;
      return {
        ezone: !hasItems(parkings.ezone) ? 0 : this.getAverageCostPerHour(parkings.ezone),
        nzone: !hasItems(parkings.nzone) ? 0 : this.getAverageCostPerHour(parkings.nzone),
      }
    },
    parkAndRidePercentage() {
      const parkings = this.selectedParkingsMapped;
      return {
        ezone: !hasItems(parkings.ezone) ? 0 : this.getParkAndRidePrecentage(parkings.ezone),
        nzone: !hasItems(parkings.nzone) ? 0 : this.getParkAndRidePrecentage(parkings.nzone),
      }
    }
  },
  methods: {
    hasUsage(parking) {
      return parking.specifications && parking.specifications[0].usage;
    },
    isParkAndRide(parking) {
      return parking.specifications[0].usage.toLowerCase().includes('park') && parking.specifications[0].usage.toLowerCase().includes('ride');
    },
    getParkAndRidePrecentage(parkings) {
      return parkings
        .reduce((acc, curr) => acc + (this.hasUsage(curr) && this.isParkAndRide(curr) ? 1 : 0), 0) / parkings.length * 100;
    },
    getAverageCostPerHour(parkings) {
      return parkings
        .reduce((acc, curr) => acc + (curr.overallAverageTariff ? curr.overallAverageTariff : 0), 0) / parkings.length;
    },
    getParkingsWithChargingPointsPercentage(parkings) {
      return parkings
        .filter(p => p.chargingPoints && Number(p.chargingPoints) > 0).length / parkings.length * 100;
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