
let scatterXScale, scatterYScale;

function randomSample(array, sampleSize) {
    const shuffled = array.slice().sort(() => 0.5 - Math.random());
    console.log(shuffled.slice(0, sampleSize).length)
    return shuffled.slice(0, sampleSize);
}


function initializeScatterScales(data) {

    data.forEach(d => {
        d['Model Year'] = +d['Model Year'];
        d['Electric Range'] = +d['Electric Range'];
    });

    const xDomain = d3.extent(data, d => d['Model Year']); 
    const yDomain = [0, d3.max(data, d => d['Electric Range'])]; 
   
    scatterXScale = d3.scaleLinear().domain(xDomain).range([0, 700 - 60 - 230]);
    scatterYScale = d3.scaleLinear().domain(yDomain).range([500 - 60 - 50, 0]);
}


function updateScatter(data,sampleSize = 100) {
    // Clear existing content
    d3.select("#chart").selectAll("*").remove();

    let margin = { top: 60, right: 230, bottom: 50, left: 60 },
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    let svg = d3.select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Parse and preprocess data
    data.forEach(d => {
        d['Model Year'] = +d['Model Year'];
        d['Electric Range'] = +d['Electric Range'];
    });

    // let xScale = d3.scaleLinear()
    //     .domain(d3.extent(data, d => d['Model Year']))
    //     .range([0, width]);

    // let yScale = d3.scaleLinear()
    //     .domain([0, d3.max(data, d => d['Electric Range'])])
    //     .range([height, 0]);

    // Randomly sample points
    const sampledData = randomSample(data, sampleSize);

    let colorScale = d3.scaleOrdinal()
        .domain(['Battery Electric Vehicle (BEV)', 'Plug-in Hybrid Electric Vehicle (PHEV)'])
        .range(['#1f77b4', '#ff7f0e']);



    // // Add axes
    // svg.append("g")
    //     .attr("transform", `translate(0, ${height})`)
    //     .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    // svg.append("g")
    //     .call(d3.axisLeft(yScale));

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(scatterXScale).tickFormat(d3.format("d")));

    svg.append("g").call(d3.axisLeft(scatterYScale));  


    // Add labels
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -30)
        .style("text-anchor", "middle")
        .text("Model Year vs. Electric Range for Battery Electric & Hybrid");

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

    // Add legend for colors

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
    // Draw circles
    svg.selectAll("circle")
        .data(sampledData)
        .enter()
        .append("circle")
        // .attr("cx", d => xScale(d['Model Year']))
        // .attr("cy", d => yScale(d['Electric Range']))
        .attr("cx", d => scatterXScale(d['Model Year']))
        .attr("cy", d => scatterYScale(d['Electric Range']))

        .attr("r", 4)
        .attr("fill", d => colorScale(d['Electric Vehicle Type']))
        .attr("opacity", 0.7)
        .on("mouseover", function(event, d) {
            d3.select(".tooltip").remove();
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

        // Attach slider listener to control sample size
    d3.select("#sampleSize").on("input", function () {
        const sampleSize = +this.value;
        d3.select("#sampleSizeValue").text(sampleSize); // Update displayed value
        updateScatter(data, sampleSize); // Re-render scatter plot with new sample size
    });
}