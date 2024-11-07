(function() {
    var family = {
      name: "root",
      children: [
        { name: "child #1" },
        {
          name: "child #2",
          children: [
            { name: "grandchild #1" },
            { name: "grandchild #2" },
            { name: "grandchild #3" }
          ]
        }
      ]
    };
  
    var root = d3.hierarchy(family); // Create a hierarchical layout
  
    var width = 500;
    var height = 500;
  
    let layout = d3.tree().size([height, width - 50]); // Set up the tree layout
    layout(root);
  
    var svg = d3.select("#hierarchy")
      .style("width", width)
      .style("height", height);
  
    let bound = svg.append("g")
      .attr("transform", `translate(10,0)`);
  
    let link = bound.insert("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 2)
      .selectAll("path")
      .data(root.links()) // Generate and pass the links
      .join("path")
      .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x));
  
    const node = bound.append("g")
      .selectAll("circle")
      .data(root.descendants()) // Generate and pass the descendants
      .enter()
      .append("circle")
      .attr("transform", d => `translate(${d.y},${d.x})`)
      .attr("fill", d => d.children ? "#555" : "#999")
      .attr("r", 4);
  })();