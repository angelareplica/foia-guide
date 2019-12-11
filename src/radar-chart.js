import * as d3 from 'd3'

const margin = { top: 20, left: 0, right: 0, bottom: 10 }
const height = 400 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#radar-chart')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const radius = 150

const radiusScale = d3
  .scaleLinear()
  .domain([0, 0.4])
  .range([0, radius])

const categories = [
  'Businesses',
  'Law Firms',
  'News Media',
  'Nonprofits',
  'Universities',
  'Individuals',
  'Uncategorized'
]

var angleScale = d3
  .scaleBand()
  .domain(categories)
  .range([0, Math.PI * 2])

var line = d3
  .radialLine()
  .radius(d => radiusScale(d.use_percent))
  .angle(d => angleScale(d.user))

d3.csv(require('./data/who_uses_foia_foiamapper.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])

  var holder = svg
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  holder
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', '#8ec1bc')
    .attr('stroke', '#464555')
    .attr('stroke-width', 2)
    .attr('opacity', 0.8)

  const bands = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4]

  holder
    .selectAll('.scale-band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', 'none')
    .attr('stroke', '#B6423F')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('opacity', 0.4)
    .lower()

  holder
    .append('circle')
    .attr('r', 150)
    .attr('fill', '#F4D981')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('opacity', 0.4)
    .lower()

  const bandLabels = [0.1, 0.25, 0.4]

  holder
    .selectAll('.scale-text')
    .data(bandLabels)
    .enter()
    .append('text')
    .text(d => d * 100 + '%')
    .attr('class', 'radar-band-labels')
    .attr('text-anchor', 'middle')
    .attr('font-size', 10)
    .attr('x', 0)
    .attr('y', d => radiusScale(d))
    .attr('dy', -2)
    .attr('fill', '#464555')

  holder
    .selectAll('.lines')
    .data(datapoints)
    .enter()
    .append('line')
    .attr('y1', 0)
    .attr('y2', -radius - 10)
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('stroke', '#B6423F')
    .attr('transform', d => `rotate(${(angleScale(d.user) / Math.PI) * 180})`)
    .attr('opacity', 0.3)
    .lower()

  holder
    .selectAll('.angle-text')
    .data(datapoints)
    .enter()
    .append('text')
    .text(d => d.user)
    .attr('class', 'radar-labels')
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', -radiusScale(0.44))
    .attr('transform', d => {
      return `rotate(${(angleScale(d.user) / Math.PI) * 180})`
    })
    .attr('font-size', 10)
    .attr('font-weight', '600')
    .attr('fill', '#464555')
}
