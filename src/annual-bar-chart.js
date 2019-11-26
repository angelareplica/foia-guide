import * as d3 from 'd3'

const margin = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 70
}

const width = 700 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const svg = d3
  .select('#bar-chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
// .style('stroke', 'red')

const xPositionScale = d3
  .scaleBand()
  .range([0, width])
  .padding(0.2)

const yPositionScale = d3
  .scaleLinear()
  .domain([300000, 900000])
  .range([height, 0])

// add a div for the tooltip
var div = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0)

// add var for formatting tooltip numbers
var formatComma = d3.format(',')

// var to turn year into datetime object
var parseTime = d3.timeParse('%Y')

d3.csv(require('./data/annual_foia_data.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  // console.log(datapoints)

  datapoints.forEach(function(d) {
    d.datetime = parseTime(d.year)
  })
  const years = datapoints.map(function(d) {
    return d.datetime
  })


  xPositionScale.domain(years)


  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('x', d => {
      return xPositionScale(d.datetime)
    })
    .attr('y', height)
    .attr('width', xPositionScale.bandwidth())
    .attr('height', 0)
    .attr('fill', '#8ec1bc')
    .attr('opacity', '75%')
    .on('mouseover', function(d) {
      // console.log(d)

      // make the bar chart highlight on mouseover
      d3.select(this)
        .transition()
        .duration(100)
        .attr('opacity', '100%')

      div
        .transition()
        .duration(100)
        .style('opacity', 0.8)

      div
        .html(formatComma(+d['requests']) + ' requests filed')
        .style('left', d3.event.pageX + 'px')
        // .style('right', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px')
    })
    .on('mouseout', function(d) {
      d3.select(this)
        .transition()
        .duration(100)
        .attr('opacity', '75%')

      div
        .transition()
        .duration(200)
        .style('opacity', 0)
    })

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(5)
    .ticks(6)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .style('visibility', 'hidden') // set to hidden for scrollytelling

  // remove solid line on y-axis
  d3.select('.y-axis .domain').remove()

  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.timeFormat('%Y'))
    .tickSize(5)


  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .style('visibility', 'hidden') // set to hidden for scrollytelling

  d3.select('#intro').on('stepin', () => {
    // unhide axes
    svg
      .selectAll('.axis')
      .transition()
      .duration(500)
      .style('visibility', 'visible')

    // add width of bars
    svg
      .selectAll('rect')
      .transition()
      .duration(500)
      .attr('y', d => {
        return yPositionScale(+d['requests'])
      })
      .attr('height', d => {
        return height - yPositionScale(+d['requests'])
      })
  })
}
