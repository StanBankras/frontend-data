<template>
  <svg :width="width + 'px'" :height="height + 'px'"></svg>
</template>

<script>
import { select, arc } from 'd3';

export default {
  data() {
    return {
      svg: undefined,
      height: 400,
      width: 800
    }
  },
  mounted() {
    const eyeSpacingX = 60;
    const eyeSpacingY = 40;
    const eyeRadius = 30;
    
    this.svg = select('svg');

    const g = this.svg.append('g')
      .attr('transform', `translate(${ this.width / 2 }, ${ this.height / 2 })`);
    
    g.append('circle')
      .attr('r', this.height / 2)
      .attr('fill', 'yellow')
      .attr('stroke', 'black');

    const eyeG = g.append('g')
      .attr('transform', `translate(0, ${ -eyeSpacingY })`);

    eyeG.append('circle')
      .attr('r', eyeRadius)
      .attr('cx', -eyeSpacingX)
      .attr('fill', 'black');

    eyeG.append('circle')
      .attr('r', eyeRadius)
      .attr('cx', eyeSpacingX)
      .attr('fill', 'black');

    g.append('path')
      .attr('d', arc()({
        innerRadius: 0,
        outerRadius: 100,
        startAngle: Math.PI / 2,
        endAngle: Math.PI * 3 / 2
      }));
  }
}
</script>