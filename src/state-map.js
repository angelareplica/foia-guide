import * as d3 from 'd3'

import * as topojson from 'topojson'

const margin = { top: 80, left: 10, right: 10, bottom: 10 }

const height = 520 - margin.top - margin.bottom

const width = 700 - margin.left - margin.right

const svg = d3
  .select('#state-foi-map')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// add a div for the tooltip
var div = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip-map')
  .style('opacity', 0)

const colorAllowedResponse = d3
  .scaleLinear()
  .domain([0, 15])
  .range(['#8EE6B7', '#F0AB51'])

const colorActualResponse = d3
  .scaleLinear()
  .domain([11, 130])
  .range(['#F4D981', '#B6423F'])

d3.csv(require('./data/state-foi-laws-map.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  console.log(datapoints)
  var gridMap = svg
    .selectAll('g')
    .data(datapoints)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      // console.log(d)
      return 'translate(' + d.x * 47.5 + ',' + d.y * 47.5 + ')'
    })

  gridMap
    .append('rect')
    .attr('class', 'state-square')
    .attr('width', 43)
    .attr('height', 43)
    .attr('fill', '#8ec1bc')
    .attr('stroke', '#464555')
    .attr('opacity', '0.7')
    .on('mouseover', function(d) {
      // make the square highlight on mouseover
      d3.select(this)
        .transition()
        .duration(200)
        .style('opacity', 1)

      div
        .transition()
        .duration(200)
        .style('opacity', 0.9)

      div
        // .html(
        //   "<a href='" +
        //     d.url +
        //     "' target='_blank'><button type='button'> TKTK more info </button></a>"
        // )
        .html(
          '<strong>' +
            d.state +
            '</strong> <br> Response deadline: ' +
            d.allowed_response_time +
            '<br> Avgerage response time: ' +
            d.avg_response_time
        )
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px')
    })
    .on('click', function(d) {
      window.open(d.url, '_blank')
    })

    .on('mouseout', function(d) {
      d3.select(this)
        .transition()
        .duration(200)
        .style('opacity', 0.6)

      div
        .transition()
        .duration(200)
        .style('opacity', 0)
    })

  gridMap
    .append('text')
    .attr('class', 'state-square-label')
    .attr('x', 43 / 2)
    .attr('y', 43 / 2 + 5)
    .style('text-anchor', 'middle')
    .text(function(d) {
      return d.abbrev
    })
    .style('font-family', 'Ubuntu Mono')
    .on('mouseover', function(d) {
      // make sure the text triggers tooltip too, not just the square
      d3.select(this)
        .transition()
        .duration(200)

      div
        .transition()
        .duration(200)
        .style('opacity', 0.9)

      div
        .html(
          '<strong>' +
            d.state +
            '</strong> <br> Response deadline: ' +
            d.allowed_response_time +
            '<br> Avgerage response time: ' +
            d.avg_response_time
        )
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px')
    })
    .on('click', function(d) {
      window.open(d.url, '_blank')
    })
    .on('mouseout', function(d) {
      d3.select(this)
        .transition()
        .duration(200)

      div
        .transition()
        .duration(200)
        .style('opacity', 0)
    })

  d3.select('#start-map').on('stepin', () => {
    // console.log('first step entered')
    svg
      .selectAll('rect')
      .transition()
      .duration(200)
      .attr('fill', '#8ec1bc')
  })

  d3.select('#allowed-response-map').on('stepin', () => {
    svg
      .selectAll('rect')
      .transition()
      .duration(400)
      .attr('opacity', '0.7')
      .attr('fill', function(d) {
        if (+d.allowed_response_time_int === 0) {
          return '#C25451'
        } else {
          return colorAllowedResponse(+d.allowed_response_time_int)
        }
      })
  })

  d3.select('#actual-response-map').on('stepin', () => {
    svg
      .selectAll('rect')
      .transition()
      .duration(400)
      .attr('opacity', '0.7')
      .attr('fill', d => colorActualResponse(+d.avg_response_time_int))
      .attr('opacity', '0.8')
  })

  d3.select('#end-map').on('stepin', () => {
    svg
      .selectAll('rect')
      .transition()
      .duration(400)
      .attr('fill', '#8ec1bc')
      .attr('opacity', '0.7')
  })
}
