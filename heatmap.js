function updateHeatmap(data) {
    // Clear existing content
    d3.select("#chart2").selectAll("*").remove();

    const margin = { top: 50, right: 330, bottom: 50, left: 100 },
        width = 1100 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#chart2")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const avgRangeData = d3.rollup(
        data,
        v => d3.mean(v, d => d['Electric Range']),
        d => d['Model Year'],
        d => d['Make']
    );

    const modelYears = Array.from(new Set(data.map(d => d['Model Year']))).sort((a, b) => a - b);
    const makes = Array.from(new Set(data.map(d => d['Make']))).sort();

    const xScale = d3.scaleBand().domain(modelYears).range([0, width]).padding(0.05);
    const yScale = d3.scaleBand().domain(makes).range([0, height]).padding(0.05);

    const colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateBlues)
        .domain([0, d3.max(data, d => d['Electric Range'])]);

    svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
    svg.append("g").call(d3.axisLeft(yScale));

    
    svg.append("text")
    .attr("x", 800)
    .attr("y", 10)
    .style("text-anchor", "middle")
    .text("Legend (miles)")

    legend_outline = 2

    svg.append("rect")
        .attr("x", 700 - legend_outline)
        .attr("y", 20 - legend_outline)
        .attr("width", 200 + legend_outline*2)
        .attr("height", 10 + legend_outline*2)
        .attr("fill", "#000000");

    for (i=0; i < 10; i++) {
        value = 10*i
        svg.append("rect")
            .attr("x", 700 + 20*i)
            .attr("y", 20)
            .attr("width", 20)
            .attr("height", 10)
            .attr("fill", colorScale(value));

        console.log(d3.max(data, d => d['Electric Range']))
    }

    svg.append("text")
        .attr("x", 710)
        .attr("y", 50)
        .style("text-anchor", "middle")
        .text("0")

    svg.append("text")
        .attr("x", 890)
        .attr("y", 50)
        .style("text-anchor", "middle")
        .text("290")

    svg.append("text")
        .attr("x", 800)
        .attr("y", 50)
        .style("text-anchor", "middle")
        .text("145")


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
                            <strong>Average Electric Range:</strong> ${avgRange.toFixed(2)} miles
                        `);
                })
                .on("mouseout", function() {
                    d3.select(this).attr("stroke", "none");
                    d3.select(".tooltip").remove();
                });
        });
    });
}