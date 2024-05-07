// Load data from JSON
const api =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

fetch(api)
  .then((response) => response.json())
  .then((data) => {
    // Extracting necessary data
    const dataset = data.data;

    // Set up of chart dimensions
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };
    const width = 850 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Appending SVG element
    const svg = d3
      .select("#svg-container")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Parsing date and GDP
    const parseDate = d3.timeParse("%Y-%m-%d");
    dataset.forEach((d) => {
      d.date = parseDate(d[0]);
      d.gdp = +d[1];
    });

    // Setting up scales
    const xScale = d3
      .scaleTime()
      .domain([d3.min(dataset, (d) => d.date), d3.max(dataset, (d) => d.date)])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataset, (d) => d.gdp)])
      .range([height, 0]);

    // Creating x and y axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    svg.append("g").attr("id", "y-axis").call(yAxis);

    // Add text at the bottom of the chart
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.top + 25)
      .style("text-anchor", "right")
      .style("font-size", "12px")
      .text(
        "For more Information: http://www.bea.gov/national/pdf/nipaguid.pdf"
      );

    // Creating bars
    svg
      .selectAll(".bar")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", (d) => d3.timeFormat("%Y-%m-%d")(d.date)) 
      .attr("data-gdp", (d) => d.gdp)
      .attr("x", (d) => xScale(d.date))
      .attr("y", (d) => yScale(d.gdp))
      .attr("width", width / dataset.length)
      .attr("height", (d) => height - yScale(d.gdp))
      .on("mouseover", function (event, d) {
        d3.select(this).style("fill", "orange"); 
        const tooltip = d3.select("#tooltip");
        tooltip.style("display", "block");
        tooltip.style("left", event.pageX + 10 + "px");
        tooltip.style("top", event.pageY - 50 + "px");
        tooltip.attr("data-date", d3.timeFormat("%Y-%m-%d")(d.date)); 
        tooltip.html(`${d3.timeFormat("%Y-%m-%d")(d.date)}: $${d.gdp} Billion`);
      })
      .on("mouseout", function () {
        d3.select(this).style("fill", "steelblue"); 
        d3.select("#tooltip").style("display", "none");
      });
    // .on("click", function () {
    //   d3.selectAll(".bar").style("fill", "steelblue"); // Reset all bars to default color
    //   d3.select(this).style("fill", "red"); // Change fill color on click
    // });
  });
