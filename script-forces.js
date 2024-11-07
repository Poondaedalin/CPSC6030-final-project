
var width = 500
var height= 500

var svg = d3.select("#forces")
  .style("width", width)
  .style("height", height)
  
let nodes = [{id: 1, r:10}, {id: 2, r:30}, {id: 3, r:15}, {id: 4, r:2}] 

let layout = d3.forceSimulation(nodes)
              .force('center', d3.forceCenter(width/2, height/2))
              //.force('collisions', d3.forceCollide(4))
              .force('collisions', d3.forceCollide(d=>d.r))
              .on('tick', ticked)

let node = svg.append("g")
              .selectAll("circle")
              .data(nodes).enter()
              .append("circle")
              .attr('cx', d => d.x)
              .attr('cy', d => d.y)
              .attr("fill", "black")
              .attr("opacity", 0.4)
              .attr("r", d => d.r)
            
function ticked(){
  svg.selectAll("circle")
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
}