import * as d3 from 'd3'

const margin = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 70
}

const width = 736 - margin.left - margin.right
const height = 550 - margin.top - margin.bottom

const svg = d3
  .select('#dendrogram')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var data = {
  children: [
    {
      name: 'Fulfilled',
      colname: 'level2',
      description: 'Best case scenario!'
    },
    {
      name: 'Rejected',
      children: [
        {
          name: 'Re-submit',
          colname: 'level3',
          description:
            'File your request again, re-wording the language of the request to comply with any reasons for denial cited by the agency.'
        },
        {
          name: 'Appeal',
          colname: 'level3',
          description:
            'You can appeal a denied request by sending a letter describing why your request should be reconsidered.'
        },
        {
          name: 'Mediation',
          colname: 'level3',
          description:
            'Mediation services are offered under FOIA to resolve disputes between requesters and Federal agencies. Even if you use a mediator, you can still file an appeal.'
        }
      ],
      colname: 'level2',
      description:
        "An agency might determine your request didn't adequately describe what documents you seek, no relevant documents exist, or the documents fall under one of FOIA's nine exemptions."
    },
    {
      name: 'No Response',
      children: [
        {
          name: 'Follow Up',
          colname: 'level3',
          description:
            "Reach out to the agency's FOIA officer to follow up on your request."
        },
        {
          name: 'Litigation',
          colname: 'level3',
          description:
            'Filing a federal lawsuit costs $400 and necessitates a response. This is also an option if an appeal is denied.'
        }
      ],
      colname: 'level2',
      description:
        'Despite the statute, you may not actually get a response in 20 business days.'
    }
  ],
  name: 'Submit',
  description:
    'Federal agencies have 20 working days to respond. They may deliberately ask you to clarify parts of your request, thereby delaying the clock.'
}

// Create the cluster layout:
var cluster = d3.cluster().size([height, width - 80]) // 80 = the margin on the right

// Give the data to this cluster layout:
var root = d3.hierarchy(data, function(d) {
  return d.children
})
cluster(root)

// add a div for the tooltip
var div = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip-dend')
  .style('opacity', 0)

// Add the links between nodes:
svg
  .selectAll('path')
  .data(root.descendants().slice(1))
  .enter()
  .append('path')
  .attr('d', function(d) {
    return (
      'M' +
      d.y +
      ',' +
      d.x +
      'C' +
      (d.parent.y + 50) +
      ',' +
      d.x +
      ' ' +
      (d.parent.y + 150) +
      ',' +
      d.parent.x + // 50 and 150 are coordinates of inflexion, play with it to change links shape
      ' ' +
      d.parent.y +
      ',' +
      d.parent.x
    )
  })
  .style('fill', 'none')
  // .attr("stroke", '#C6CCC1')
  .attr('stroke', '#8ec1bc')
  .attr('stroke-width', '3')
  .style('opacity', 0.5)
  .lower()

// add a circle for each node
svg
  .selectAll('g')
  .data(root.descendants())
  .enter()
  .append('g')
  .attr('transform', function(d) {
    return 'translate(' + d.y + ',' + d.x + ')'
  })
  .append('circle')
  .attr('r', 9)
  .style('fill', '#B8A1A8')
  .attr('stroke', 'black')
  .style('stroke-width', 1)
  .on('mouseover', function(d) {
    // console.log(d)

    // make the circle highlight on mouseover
    d3.select(this)
      .transition()
      .duration(100)
      .attr('r', 11)
      .style('fill', '#BB1427')

    // make tooltip visible
    div
      .transition()
      .duration(100)
      .style('opacity', 1)

    div
      .html(d.data.description)
      .style('left', d3.event.pageX - 70 + 'px')
      // .style('right', d3.event.pageX + 'px')
      .style('top', d3.event.pageY + 15 + 'px')
  })
  .on('mouseout', function(d) {
    d3.select(this)
      .transition()
      .duration(100)
      .attr('r', 9)
      .style('fill', '#B8A1A8')

    // hide tooltip again
    div
      .transition()
      .duration(200)
      .style('opacity', 0)
  })

// add yellow rectangles under text to simulate highlight
svg
  .selectAll('rect')
  .data(root.descendants())
  .enter()
  .append('rect')
  .attr('class', 'dend-labels-rects')
  .attr('transform', function(d) {
    return 'translate(' + (d.y + 13) + ',' + (d.x - 10) + ')' // d.x is y-axis; d.y moves horizontal
  })
  .attr('width', function(d) {
    // console.log(d)
    if (d.data.name === 'Submit' || d.data.name === 'Appeal') {
      return 55
    } else if (d.data.name === 'No Response' || d.data.name === 'Litigation') {
      return 100
    } else if (d.data.name === 'Rejected') {
      return 75
    } else {
      return 80
    }
  })
  .attr('height', 20)
  // .attr('fill', '#FFD67C')
  .attr('fill', '#8ec1bc')
  .style('opacity', 0.6)

// add step labels
svg
  .selectAll('text')
  .data(root.descendants())
  .enter()
  .append('text')
  .attr('class', 'dend-labels')
  .attr('transform', function(d) {
    return 'translate(' + (d.y + 15) + ',' + (d.x + 5) + ')' // d.x is y-axis; d.y moves horizontal
  })
  .text(function(d) {
    // console.log(d)
    return d.data.name
  })
