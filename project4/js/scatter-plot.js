d3.select(window).on('load', init);

function init() {

    var svg = d3.select('#scatter-plot');
    var margin = {top: 50, right: 50, bottom: 50, left: 50};
    var width = +svg.node().getBoundingClientRect().width;
    var height = +svg.node().getBoundingClientRect().height;

    var g = svg.append("g")

    d3.tsv("handsPCA.txt", function(error, data) {
        if(error) throw error;

        var x = d3.scaleLinear()
            .domain([-0.8, 0.8])
            .range([margin.left, width - margin.right]);

        var y = d3.scaleLinear()
            .domain([0.8, -0.5])
            .range([margin.top, height - margin.bottom]);

        svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr("r", "5px")
            .attr("cx", function (d) {
                return x(d.V1) + "px";
            })
            .attr("cy", function(d) {
                return y(d.V2) + "px";
            })
            .attr("fill", "red")
            .attr("stroke", "white")
            .append("svg:title")
            .text(function(d) {
                return d.V1;
            })
            .on("mouseover", handleMouseOver);

        var xAxis = d3.axisBottom()
            .scale(x)
            .ticks(10);

        var yAxis = d3.axisLeft()
            .scale(y)
            .ticks(10);

        //Create X axis
        svg.append("g")
            .attr("class", "axis")
            .call(xAxis)
            .attr("transform","translate( 0," + (height - margin.bottom) + ")");

        // //Create Y axis
        svg.append("g")
            .attr("class", "axis")
            .call(yAxis)
            .attr("transform","translate(" + margin.left + ", 0)");

        function handleMouseOver(d,i) {

        }

    });
}