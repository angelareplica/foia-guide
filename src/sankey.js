import * as d3 from 'd3'
import * as D3sankey from 'd3-sankey'

const margin = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 70
}

const width = 700 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const svg = d3
  .select('#sankey')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Color scale used
// var color = d3.scaleOrdinal(d3.schemeCategory20)
// Set the sankey diagram properties
var sankey = D3sankey.sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([width, height]);

var graph = {"nodes":[
  {"node":0,"name":"Submit"},
  {"node":1,"name":"Wait"},
  {"node":2,"name":"Fulfilled"},
  {"node":3,"name":"Rejected"},
  {"node":4,"name":"No Response"},
  {"node":5,"name":"Re-submit"},
  {"node":6,"name":"Appeal"},
  {"node":7,"name":"Mediation"},
  {"node":8,"name":"Follow Up"},
  {"node":9,"name":"Litigation"}
  ],
  "links":[
  {"source":0,"target":1,"value":6},
  {"source":1,"target":2,"value":2},
  {"source":1,"target":3,"value":2},
  {"source":1,"target":4,"value":2},
  {"source":3,"target":5,"value":1},
  {"source":3,"target":6,"value":1},
  {"source":3,"target":7,"value":1},
  {"source":4,"target":8,"value":1},
  {"source":4,"target":9,"value":1}
  ]}

  // var path = sankey.link();

  // console.log(graph.nodes)

  D3sankey
  .nodes(graph.nodes)
  .links(graph.links)
  .layout(32);
