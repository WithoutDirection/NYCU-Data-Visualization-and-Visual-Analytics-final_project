sessionStorage.setItem("selectedGeo", "Africa");

const svg = d3.select("svg");
const projection = d3.geoMiller();
const pathGenerator = d3.geoPath().projection(projection);

const tooltip = d3.select("#tooltip");

d3.json("./data/countries/AF/AF-topojson.json").then(function(geojson) {
    const countries = topojson.feature(geojson, geojson.objects.AF);
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