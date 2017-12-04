/**
 * Created by Juraj on 02/12/2017.
 */
d3.select(window).on('load', init);

function init() {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        innerRadius = 180,
        outerRadius = Math.min(width, height) * 0.67,
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 3 + ")");

    // var g = svg.append("g")
    //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // var x = d3.scaleBand().rangeRound([0, width]).padding(0.1)
    //     .domain(data.map(function(d,i) { return months[(i%12)]; }));

    var x = d3.scaleBand()
        .range([0, 2 * Math.PI])
        .align(0);

    var y = d3.scaleLinear()
        .range([innerRadius, outerRadius]);

    d3.tsv("copenhagen.txt", function(error, data) {

        // var svg = d3.select('svg');
        // var margin = {top: 100, right: 100, bottom: 100, left: 100};
        // var width = +svg.node().getBoundingClientRect().width - margin.left - margin.right;
        // var height = +svg.node().getBoundingClientRect().height - margin.top - margin.bottom;


        // var y = d3.scaleLinear().rangeRound([height, 0])
        //     .domain([0, 28]); //try to come up with a dynamic solution for max temperature

        // data.sort(function(a, b) { return b[data.columns[6]] -  a[data.columns[6]]; });
        x.domain(data.map(function(d,i) { return months[(i%12)]; }));
        y.domain([0, 30])//d3.max(data, function(d,i) { var month = months[(i%12)].toUpperCase(); return d[month]; })]) --remove missing values (999)
         .range([50, 150]);
        // z.domain(data.columns.slice(1));

        // var y = d3.scaleRadial()
        //     .domain([0, d3.mean(data, function(d,i) { var month = months[(i%12)].toUpperCase(); return d[month]; })]);

        // g.append("g")
        //     .attr("class", "axis x")
        //     .attr("transform", "translate(0," + height + ")")
        //     .call(d3.axisBottom(x));
        //
        // g.append("g")
        //     .attr("class", "axis y")
        //     .call(d3.axisLeft(y).ticks(10));
        //
        // g.selectAll(".bar")
        //     .data(data)
        //     .enter().append("rect")
        //     .attr("x", function(d,i) { return x(months[(i%12)]); })
        //     .attr("y", function(d,i) {
        //         return y(getMonthAverage(data, d, i));
        //     })
        //     .attr("width", x.bandwidth())
        //     .attr("height", function(d,i) { return height - y(getMonthAverage(data, d, i));
        //     });

        var label = g.append("g")
            .selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("text-anchor", "middle")
            .attr("transform", function(d,i) { return "rotate(" + ((x(months[(i%12)]) + x.bandwidth() / 2) * 180 / Math.PI - 90)  + ")translate(" + innerRadius + ",0)"; });

        label.append("text")
            .attr("transform", function(d) { return "rotate(90)"; })
            .style("font-size", "14px")
            .text(function(d,i) { return months[(i%12)]; });

        var yAxis = g.append("g")
            .attr("text-anchor", "end");

        var yTick = yAxis
            .selectAll("g")
            .data(y.ticks(5).slice(1))
            .enter().append("g");

        yTick.append("circle")
            .attr("fill", "none")
            .attr("stroke", "#000")
            .attr("stroke-dasharray", "3,5")
            .attr("stroke-opacity", 0.2)
            .attr("r", y);

        yTick.append("circle")
            .attr("fill", "none")
            .attr("stroke", "#000")
            .attr("r", y(35));

        //weird hack
        yTick.append("text")
            .attr("x", 0)
            .attr("y", function(d) { return -y(d); })
            .attr("dy", "0.15em")
            .attr("transform", "rotate(18)")
            .attr("stroke", "#fff")
            .attr("stroke-width", 5)
            .text(y.tickFormat(10, "s"));

        yTick.append("text")
            .attr("x", 0)
            .attr("y", function(d) { return -y(d); })
            .attr("fill", "rgba(0,0,0,0.38)")
            .attr("dy", "0.15em")
            .attr("transform", "rotate(18)")
            .text(y.tickFormat(10, "s"));

        var colorScale =
            d3.scaleLinear()
                .domain(d3.extent(data,
                    function(d,i){
                        return getMonthAverage(data, d.data, i);}))
                .range([0,0.75]);

        g.append("g")
            .selectAll("g")
            .data(d3.stack().keys(data.columns.slice(1))(data))
            .enter()
            .append("g")
            .selectAll("path")
            .data(function(d) { return d; })
            .enter()
            .append("path")
            .attr("d", d3.arc()
                .innerRadius(function(d) { return 50; })
                .outerRadius(function(d,i) { return y(getMonthAverage(data, d.data, i)); })
                .startAngle(function(d,i) { return x(months[(i%12)]); })
                .endAngle(function(d,i) { return x(months[(i%12)]) + x.bandwidth(); })
                .padAngle(0.02)
                .padRadius(innerRadius))
            .attr("fill", function(d,i) {
                return d3.interpolatePlasma(colorScale(getMonthAverage(data, d.data, i)));
            })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);

        function handleMouseOver(d, i) {

            // Use D3 to select element, change color and size
            d3.select(this).attr("fill", "#FF6D00");
            console.log(getMonthAverage(data, d.data, i));
        }

        function handleMouseOut(d, i) {
            // Use D3 to select element, change color back to normal
            d3.select(this).attr("fill", d3.interpolatePlasma(colorScale(getMonthAverage(data, d.data, i))));
        }
        // yAxis.append("text")
        //     .attr("x", -6)
        //     .attr("y", function(d) { return -y(y.ticks(10).pop()); })
        //     .attr("dy", "-1em")
        //     .text("Population");
        //
        // var legend = g.append("g")
        //     .selectAll("g")
        //     .data(data.columns.slice(1).reverse())
        //     .enter().append("g")
        //     .attr("transform", function(d, i) { return "translate(-40," + (i - (data.columns.length - 1) / 2) * 20 + ")"; });
        //
        // legend.append("rect")
        //     .attr("width", 18)
        //     .attr("height", 18)
        //     .attr("fill", z);
        //
        // legend.append("text")
        //     .attr("x", 24)
        //     .attr("y", 9)
        //     .attr("dy", "0.35em")
        //     .text(function(d) { return d; });

    });

    function getMonthAverage(data, d, i) {
        var month = months[(i%12)].toUpperCase();
        return d3.mean(data, function(d) { return d[month]; });
    }

}