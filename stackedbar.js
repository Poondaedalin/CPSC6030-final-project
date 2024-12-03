(function() {
// Set dimensions and margins
    const margin = { top: 20, right: 230, bottom: 50, left: 60 },
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // Create an SVG container
    var svg = d3.select("#chart1")
        
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Load the dataset (replace with your dataset path)
    
    d3.csv("Electric_Vehicle_Population_Data.csv").then(data => {
        // Process data to get counts per year and vehicle type

        const nestedData = d3.group(data, d => d['Model Year'], d => d['Electric Vehicle Type']);


        const processedData = Array.from(nestedData, ([year, typeData]) => {
            // Create an array with both types and ensure BEV comes first and PHEV second
            const types = [
            {
                type: 'Battery Electric Vehicle (BEV)',
                count: typeData.get('Battery Electric Vehicle (BEV)') ? typeData.get('Battery Electric Vehicle (BEV)').length : 0
            },
            {
                type: 'Plug-in Hybrid Electric Vehicle (PHEV)',
                count: typeData.get('Plug-in Hybrid Electric Vehicle (PHEV)') ? typeData.get('Plug-in Hybrid Electric Vehicle (PHEV)').length : 0
            }
            ];
        
            return {
            year: +year,
            types: types
            };
        });
        // Sort processedData by year
        processedData.sort((a, b) => a.year - b.year);

        console.log(processedData);

        // Define scales
        const xScale = d3.scaleBand()
                    .domain(processedData.map(d => d.year))
                
                    .range([0, width])
                    //.padding(0.2);

        const yScale = d3.scaleLinear()
                    .domain([0, d3.max(processedData, d => d3.sum(d.types, t => t.count))])
                    .range([height, 0]);

        const colorScale = d3.scaleOrdinal()
                        .domain(['Battery Electric Vehicle (BEV)', 'Plug-in Hybrid Electric Vehicle (PHEV)'])
                        .range(['#1f77b4', '#ff7f0e']);

        // Add X axis
        svg.append("g")
            .attr("transform", `translate(0, ${height})`, "rotate(-45")
            .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Add Y axis
        svg.append("g")
            .call(d3.axisLeft(yScale));

        svg.append("text")
            .attr("x", 450)
            .attr("y", 30)
            .text("Battery");
        svg.append("rect")
            .attr("x", 435)
            .attr("y", 20)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", '#1f77b4');

        svg.append("text")
            .attr("x", 450)
            .attr("y", 50)
            .text("Hybrid");
        svg.append("rect")
            .attr("x", 435)
            .attr("y", 40)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", '#ff7f0e');



        processedData.forEach(dataPoint => {
            const yearGroup = svg.append("g")
                .attr("transform", `translate(${xScale(dataPoint.year)}, 0)`);

            // Initialize a variable to keep track of the y-position for stacking
            let yOffset = height;

            dataPoint.types.forEach(typeData => {
                const barHeight = height - yScale(typeData.count);

                yearGroup.append("rect")
                    .attr("x", 0) // Keep bars aligned at the same x position for stacking
                    .attr("y", yOffset - barHeight) // Start each bar at the top of the previous bar
                    .attr("width", xScale.bandwidth())
                    .attr("height", barHeight)
                    .attr("fill", colorScale(typeData.type))
                    .on("mouseover", function(event) {
                        d3.select(this).attr("opacity", 0.8);
                        d3.select("body").append("div")
                            .attr("class", "tooltip")
                            .style("left", `${event.pageX + 10}px`)
                            .style("top", `${event.pageY - 20}px`)
                            .html(`
                                <strong>Type:</strong> ${typeData.type}<br>
                                <strong>Count:</strong> ${typeData.count}
                            `);
                    })
                    .on("mouseout", function() {
                        d3.select(this).attr("opacity", 1);
                        d3.select(".tooltip").remove();
                    });

                // Update yOffset for the next bar in the stack
                yOffset -= barHeight;
            });
        });
    }); 
})();