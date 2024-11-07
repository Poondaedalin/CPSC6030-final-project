
d3.json("miserables.json").then(data => {
  var nodes = data.nodes;  
  var arcs = data.links;   
   
 
  var width = 500;
  var height = 500;

  var svg = d3.select("#fdl")
      .style("width", width)
      .style("height", height);

  
  var layout = d3.forceSimulation(nodes)
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide(15)) 
    .force('link', d3.forceLink(arcs)
      .distance(d => 10 + d.value * 10) 
      .strength(d => Math.min(1, d.value*5)) 
    )
    .on('tick', ticked); 

 
  var color = d3.scaleOrdinal(d3.schemeCategory10);


  var edges = svg.append("g")
                .selectAll("line")
                .data(arcs)
                .enter()
                .append("line")
                .attr("stroke", "black")
                .attr("stroke-width", 1);

  
  var node = svg.append("g")
                .selectAll("circle")
                .data(nodes)
                .enter()
                .append("circle")
                .attr("fill", d => color(d.group)) 
                .attr("r", 5);


  function ticked() {
    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    edges
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
  }
});