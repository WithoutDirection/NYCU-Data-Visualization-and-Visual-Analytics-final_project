import { get_country_data } from "./deathData.js";
sessionStorage.setItem("selectedGeo", "Asia");

const svg = d3.select("svg");
const projection = d3.geoMiller();
const pathGenerator = d3.geoPath().projection(projection);

const tooltip = d3.select("#tooltip");

d3.json("./data/countries/AS/AS-topojson.json").then(function(geojson) {
    const countries = topojson.feature(geojson, geojson.objects.AS);
    console.log(countries);
    svg.selectAll("path").data(countries.features)
        .enter().append("path")
        .attr("class", "countries")
        .attr("d", pathGenerator)
        .attr("fill", "#808080")
        .on("mouseover", function(event, d) {
            tooltip.transition()
                    .duration(100)
                    .style("opacity", 1);
            tooltip.text(findEnglishNameByCode(d.properties.country_a2));
            present_info_by_country_code(d.properties.country_a3);

        })
        .on("mousemove", function(event) {
            tooltip.style("top", (event.pageY) + "px")
                   .style("left", (event.pageX + 20) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(100)
                .style("opacity", 0);
        });

}).catch(function(error) {
    console.error(error);
});

document.getElementById("backButton").addEventListener("click", function() {
    window.history.back();
});

function present_info_by_country_code(country_code) {
    let country_data; 
    country_data =  get_country_data(country_code)[0];
    //console.log(country_data);
    let presenting_data = [];
    let drawing_data = [];
    let keys = Object.keys(country_data);
    presenting_data.push({label: "Country/Territory", value: country_data["Country/Territory"]});
    for(let i = 0; i < keys.length; i++) {
        if(keys[i] !== "Country/Territory" && keys[i] !== "Code" && keys[i] !== "Year") {
            presenting_data.push({label: keys[i], value: +country_data[keys[i]]});
            drawing_data.push({label: keys[i], value: +country_data[keys[i]]});
        }
    }

    console.log(presenting_data);

    svg.selectAll("text").remove();

    svg.selectAll("text")
        .data(presenting_data)
        .enter()
        .append("text")
        .attr("x", 900) // Adjust this value to position your text
        .attr("y", function(d, i) { return 50 + i * 30; }) // Adjust this value to position your text
        .text(function(d) { return d.label + ": " + d.value; })
        .attr("font-family", "Times New Roman")
        .attr("font-size", "12px")
        .attr("fill", "black");

    svg.selectAll(".bar").remove();
    const width = 240, height = 125;

    let x = d3.scaleBand()
        .range([0, width])
        .domain(drawing_data.map(function(d) { return d.label; }))
        .padding(0.1);
    let y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(drawing_data, function(d) { return d.value; })]);

    
    // console.log(x);
    // console.log(y);

    let chartGroup = svg.append("g")
                        .attr("transform", "translate(1200, 200)");

    
 
     // Add y-axis to the SVG
    chartGroup.append("g")
        .call(d3.axisLeft(y));

     // Add bars
    let bars = chartGroup.selectAll(".bar")
                    .data(presenting_data)
                    .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.label); })
                    .attr("width", x.bandwidth())
                    .attr("y", function(d) { return y(d.value); })
                    .attr("height", function(d) { return height - y(d.value); });

    bars.on("mouseover", function(event, d) {
        tooltip.transition()
                .duration(100)
                .style("opacity", .9);
        tooltip.text(d.label + ": " + d.value);

    })

    bars.on("mousemove", function(event) {
        tooltip.style("top", (event.pageY) + "px")
               .style("left", (event.pageX + 20) + "px");
    })

    bars.on("mouseout", function() {
        tooltip.transition()
            .duration(100)
            .style("opacity", 0);
    });

    
    
    
    
}