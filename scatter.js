window.sharedData = [];

(function() {
    var margin = { top: 20, right: 30, bottom: 50, left: 60 },
              width = 500 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;
    var svg = d3.select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Load the dataset (replace 'Electric_Vehicle_Population_Data.csv' with your file path)
    d3.csv("Electric_Vehicle_Population_Data.csv").then(data => {
    
    window.sharedData = data;
    console.log(window.sharedData);
    // Parse data and convert necessary attributes to numbers
    data.forEach(d => {
        d['Model Year'] = +d['Model Year'];
        d['Electric Range'] = +d['Electric Range'];
    });

    // Define scales
    var xScale = d3.scaleLinear()
       .domain(d3.extent(data, d => d['Model Year']))
       .range([0, width]);

    var yScale = d3.scaleLinear()
       .domain([0, d3.max(data, d => d['Electric Range'])])
       .range([height, 0]);

    var colorScale = d3.scaleOrdinal()
           .domain(['Battery Electric Vehicle (BEV)', 'Plug-in Hybrid Electric Vehicle (PHEV)'])
           .range(['#1f77b4', '#ff7f0e']);

    // Add X axis
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    // Add Y axis
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Add labels
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .style("text-anchor", "middle")
        .text("Model Year");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 15)
        .attr("x", -height / 2)
        .style("text-anchor", "middle")
        .text("Electric Range (miles)");

    // Add circles for each car
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d['Model Year']))
        .attr("cy", d => yScale(d['Electric Range']))
        .attr("r", 4)
        .attr("fill", d => colorScale(d['Electric Vehicle Type']))
        .attr("opacity", 0.7)
        .on("mouseover", function(event, d) {
            d3.select(this)
                .attr("fill", "orange")
                .attr("r", 8);

            // Show tooltip
            const tooltip = d3.select("body")
               .append("div")
               .attr("class", "tooltip")
               .style("left", `${event.pageX + 10}px`)
               .style("top", `${event.pageY - 20}px`)
               .html(`
                   <strong>Make:</strong> ${d['Make']}<br>
                   <strong>Model:</strong> ${d['Model']}<br>
                   <strong>Model Year:</strong> ${d['Model Year']}<br>
                   <strong>Type:</strong> ${d['Electric Vehicle Type']}<br>
                   <strong>Electric Range:</strong> ${d['Electric Range']} miles
               `);
        })
        
        .on("mouseout", function() {
            d3.select(this)
            .attr("fill", d => colorScale(d['Electric Vehicle Type']))
            .attr("r", 5);
            d3.select(".tooltip").remove();
        });
    });
})();