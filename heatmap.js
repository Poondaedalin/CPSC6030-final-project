const margin = { top: 50, right: 30, bottom: 50, left: 100 },
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Create an SVG container
const svg = d3.select("#chart2")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load the dataset from the global sharedData variable
d3.csv("Electric_Vehicle_Population_Data.csv").then(data => {
    

    // Process the data to calculate the average Electric Range for each Make and Model Year
    const avgRangeData = d3.rollup(
        data,
        v => d3.mean(v, d => d['Electric Range']),
        d => d['Model Year'],
        d => d['Make']
    );

    // Extract unique Model Years and Makes for the axes
    const modelYears = Array.from(new Set(data.map(d => d['Model Year']))).sort((a, b) => a - b);
    const makes = Array.from(new Set(data.map(d => d['Make']))).sort();

    // Define scales
    const xScale = d3.scaleBand()
        .domain(modelYears)
        .range([0, width])
        .padding(0.05);

    const yScale = d3.scaleBand()
        .domain(makes)
        .range([0, height])
        .padding(0.05);

    const colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateBlues)
        .domain([0, d3.max(data, d => d['Electric Range'])]);

    // Add X axis
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Draw the heatmap cells
    modelYears.forEach(year => {
        makes.forEach(make => {
            const avgRange = avgRangeData.get(year)?.get(make) || 0;
            svg.append("rect")
                .attr("x", xScale(year))
                .attr("y", yScale(make))
                .attr("width", xScale.bandwidth())
                .attr("height", yScale.bandwidth())
                .attr("fill", avgRange > 0 ? colorScale(avgRange) : '#f0f0f0')
                .on("mouseover", function(event) {
                    d3.select(this).attr("stroke", "black").attr("stroke-width", 2);
                    d3.select("body").append("div")
                        .attr("class", "tooltip")
                        .style("left", `${event.pageX + 10}px`)
                        .style("top", `${event.pageY - 20}px`)
                        .html(`
                            <strong>Make:</strong> ${make}<br>
                            <strong>Model Year:</strong> ${year}<br>
                            <strong>Average Electric Range:</strong> ${avgRange.toFixed(2)} miles
                        `);
                })
                .on("mouseout", function() {
                    d3.select(this).attr("stroke", "none");
                    d3.select(".tooltip").remove();
                });
        });
    });
});