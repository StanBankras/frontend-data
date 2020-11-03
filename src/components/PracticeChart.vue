<template>
  <div id="d3-container"></div>
  <button @click="addBar()">Click</button>
</template>

<script>
import * as d3 from 'd3';

export default {
  computed: {
    environmentZones() {
      return this.$store.getters.environmentZones;
    },
    parkingData() {
      return this.$store.getters.parkingData;
    },
    biggestEnvironmentzone() {
      let biggest = 0;
      this.data.forEach(zone => {
        return biggest = Math.max(biggest, zone.polygon.length);
      });
      return biggest;
    },
    xScale() {
      return d3.scaleBand()
        .domain(d3.range(this.data.length))
        .range([this.margin.left, this.width - this.margin.right])
        .padding(0.1);
    },
    yScale() {
      return d3.scaleLinear()
        .domain([0, this.biggestEnvironmentzone])
        .range([this.height - this.margin.bottom, this.margin.top]);
    },
    sortedData() {
      return this.data.slice().sort((a, b) => d3.descending(a.polygon.length, b.polygon.length));
    }
  },
  data() {
    return {
      width: 800,
      height: 300,
      margin: { top: 50, bottom: 50, left: 50, right: 50 },
      svg: undefined,
      data: undefined
    }
  },
  methods: {
    createBarChart() {        
      this.svg.append('g')
        .attr('fill', 'royalblue')
        .selectAll('rect')
        .data(this.sortedData)
        .join('rect')
          .attr('x', (d, i) => this.xScale(i))
          .attr('y', d => this.yScale(d.polygon.length))
          .attr('height', d => this.yScale(0) - this.yScale(d.polygon.length))
          .attr('width', this.xScale.bandwidth)
          .attr('fill', 'red');

      const xAxis = d3.axisBottom()
        .scale(this.xScale);

      this.svg.append('g')
        .attr("transform", "translate(0, 260)")
        .call(xAxis);

      this.svg.node();
    },
    removeChart() {
      document.querySelector('#d3-container svg').innerHTML = '';
    },
    addBar() {
      this.data.push({
        municipality: 'Hoorn',
        polygon: ['','','', '', '', '']
      });
      this.updateChart();
    },
    updateChart() {
      this.removeChart();
      this.createBarChart();
    }
  },
  mounted() {
    this.svg = d3.select('#d3-container')
      .append('svg')
      .attr('height', this.height - this.margin.top)
      .attr('width', this.width - this.margin.left - this.margin.right)
      .attr('viewBox', [0, 0, this.width, this.height]);
    this.data = this.environmentZones;
    this.createBarChart();
  }
}
</script>

<style lang="scss" scoped>
</style>