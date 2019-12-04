import * as d3 from 'd3'

const margin = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 20
}

const height = 500 - margin.top - margin.bottom
const width = 800 - margin.left - margin.right

const svg = d3
  .select('#force')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr('fill', 'lightgrey')

const radiusScale = d3.scaleSqrt().domain([75, 6300])
  .range([10, 80])

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#8ec1bc',
    '#727FAD',
    '#8A496B'
  ])

var div = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip force')
  .style('opacity', 0)

// the simulation is a collection of forces about where we want our circles to go
// and how we want our circles to interact
// forceX forces it to go somewhere on X-axis, etc
// force collide makes it not collide
var simulation = d3.forceSimulation()
  .force('x', d3.forceX(width / 2).strength(0.05))
  .force('y', d3.forceY(height / 2).strength(0.05))
  .force('collide', d3.forceCollide(d => {
    return radiusScale(d.number_requests) + 3
  }))
  .force('charge', d3.forceManyBody().strength(-20))
// forceCollide makes the circles not collide. takes the radius of the area we want to not collide

var forceXSeparate = d3
  .forceX(d => {
    if (d['jurisdiction-level'] === 'Federal') {
      return 155
    } else if (d['jurisdiction-level'] === 'State') {
      return 435
    } else if (d['jurisdiction-level'] === 'Local') {
      return 685
    }
  })
  .strength(0.04)

var forceYSeparate = d3
  .forceY(d => {
    if (d['jurisdiction-level'] === 'Federal') {
      return 270
    } else if (d['jurisdiction-level'] === 'Local') {
      return 180
    } else {
      return 140
    }
  })
  .strength(0.03)

var forceXSeparateRate = d3
  .forceX(d => {
    if (d.success_category === '0-25%') {
      return 140
    } else if (d.success_category === '26-50%') {
      return 460
    } else if (d.success_category === '51-75%') {
      return 700
    }
  })
  .strength(0.04)

var forceYSeparateRate = d3
  .forceY(d => {
    if (d.success_category === '0-25%') {
      return 220
    } else if (d.success_category === '26-50%') {
      return 200
    } else if (d.success_category === '51-75%') {
      return 160
    }
  })
  .strength(0.04)

var forceXCombine = d3.forceX(width / 2).strength(0.05)
var forceYCombine = d3.forceY(height / 2).strength(0.05)

// the simulation is a collection of forces about where we want our circles to go
// and how we want our circles to interact
// forceX forces it to go somewhere on X-axis, etc
// force collide makes it not collide
var simulation = d3.forceSimulation()
  .force('x', d3.forceX(width / 2).strength(0.05))
  .force('y', d3.forceY(height / 2).strength(0.05))
  .force('collide', d3.forceCollide(d => {
    return radiusScale(d.number_requests) + 3
  }))
// forceCollide makes the circles not collide. takes the radius of the area we want to not collide

d3.csv(require('./data/muckrock_top_100_agencies.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready (datapoints) {
  var circles = svg
    .selectAll('.agency')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'agency')
    .attr('r', d => {
      return radiusScale(d.number_requests)
    })
    .attr('fill', d => colorScale(d['jurisdiction-level']))
    .attr('opacity', 0.8)
    .on('mousemove', function (d) {
      div
        .html(
          'Agency: '.bold() +
            d.name +
            '<br>' +
            'Jurisdiction: '.bold() +
            d['jurisdiction name'] +
            '<br>' +
            'Requests received: '.bold() +
            d.number_requests
        )
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px')
        .style('display', 'block')
    })
    .on('mouseover', function (d) {
      d3.select(this)
        .transition()
        .duration(100)
        .attr('opacity', 1)
        .attr('stroke', '#FFD67C')
        .attr('stroke-width', 2)
      div
        .transition()
        .duration(200)
        .style('opacity', 1)
    })
    .on('mouseout', function (d) {
      d3.select(this)
        .transition()
        .duration(100)
        .attr('opacity', 0.7)
        .attr('stroke', 'none')
      div
        .transition()
        .duration(500)
        .style('opacity', 0)
    })

  // group data for clusters
  var jurisNested = d3
    .nest()
    .key(d => d['jurisdiction-level'])
    .entries(datapoints)

  var successNested = d3
    .nest()
    .key(d => d.success_category)
    .entries(datapoints)

  svg
    .selectAll('label-jurisdiction')
    .data(jurisNested)
    .enter()
    .append('text')
    .text(d => d.key)
    .attr('class', 'label-jurisdiction')
    .attr('font-weight', 'bold')
    .attr('x', function (d) {
      if (d.key === 'Federal') {
        return 110
      } else if (d.key === 'State') {
        return 400
      } else if (d.key === 'Local') {
        return 660
      }
    })
    .attr('y', function (d) {
      return 50
    })
    .style('visibility', 'hidden')

  svg
    .selectAll('label-success')
    .data(successNested)
    .enter()
    .append('text')
    .text(d => d.key)
    .attr('class', 'label-success')
    .attr('font-weight', 'bold')
    .attr('x', function (d) {
      if (d.key === '0-25%') {
        return 100
      } else if (d.key === '26-50%') {
        return 420
      } else if (d.key === '51-75%') {
        return 660
      }
    })
    .attr('y', function (d) {
      return 50
    })
    .style('visibility', 'hidden')

  simulation.nodes(datapoints) // every node is a circle
    .on('tick', ticked)

  function ticked () {
    circles.attr('cx', function (d) {
      return d.x
    })
      .attr('cy', function (d) {
        return d.y + 20
      })
  }

  // button click stuff

  d3.select('#jurisdiction-button').on('click', () => {
    svg
      .selectAll('.label-jurisdiction')
      .transition()
      .style('visibility', 'hidden')
    svg.selectAll('.agency').attr('fill', d => colorScale(d['jurisdiction-level'
    ]))

    simulation
      .force('x', forceXCombine)
      .force('y', forceYCombine)
      .alphaTarget(0.01)
      .restart()
  })

  d3.select('#jurisdiction-button').on('click', () => {
    svg
      .selectAll('.label-jurisdiction')
      .transition()
      .style('fill', 'black')
      .style('visibility', 'visible')

    svg
      .selectAll('.label-success')
      .transition()
      .style('fill', 'black')
      .style('visibility', 'hidden')

    simulation
      .force('x', forceXSeparate)
      .force('y', forceYSeparate)
      .alphaTarget(0.7)
      .restart()
  })


  d3.select('#success-rate-button').on('click', () => {
    svg
      .selectAll('.label-success')
      .transition()
      .style('fill', 'black')
      .style('visibility', 'visible')

    svg
      .selectAll('.label-jurisdiction')
      .transition()
      .style('fill', 'black')
      .style('visibility', 'hidden')

    simulation
      .force('x', forceXSeparateRate)
      .force('y', forceYSeparateRate)
      .alphaTarget(0.7)
      .restart()
  })

  d3.select('#reset-button').on('click', () => {
    svg
      .selectAll('.label-success')
      .transition()
      .style('fill', 'black')
      .style('visibility', 'hidden')

    svg
      .selectAll('.label-jurisdiction')
      .transition()
      .style('fill', 'black')
      .style('visibility', 'hidden')

    simulation
      .force('x', forceXCombine)
      .force('y', forceYCombine)
      .alphaTarget(0.01)
      .restart()
  })

  // // Scrollytelling stuff

  // d3.select('#start').on('stepin', () => {
  //   svg
  //     .selectAll('.label-jurisdiction')
  //     .transition()
  //     .style('visibility', 'hidden')
  //   svg.selectAll('.death').attr('fill', d => colorScale(d['jurisdiction-level'
  //   ]))

  //   simulation
  //     .force('x', forceXCombine)
  //     .force('y', forceYCombine)
  //     .alphaTarget(0.01)
  //     .restart()
  // })

  // d3.select('#split-jurisdiction').on('stepin', () => {
  //   svg
  //     .selectAll('.label-jurisdiction')
  //     .transition()
  //     .style('visibility', 'visible')

  //   svg
  //     .selectAll('.agency')
  //     .transition()
  //     .attr('fill', function (d) {
  //       return colorScale(d['jurisdiction-level'])
  //     })

  //   simulation
  //     .force('x', forceXSeparate)
  //     .force('y', forceYSeparate)
  //     .alphaTarget(0.7)
  //     .restart()
  // })
}
