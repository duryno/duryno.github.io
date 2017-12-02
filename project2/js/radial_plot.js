/**
 * Created by Juraj on 02/12/2017.
 */
d3.select(window).on('load', init);

function init() {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    d3.tsv("copenhagen.txt", function(error, data) {

        var svg = d3.select('svg');
        var margin = {top: 100, right: 100, bottom: 100, left: 100};
        var width = +svg.node().getBoundingClientRect().width - margin.left - margin.right;
        var height = +svg.node().getBoundingClientRect().height - margin.top - margin.bottom;

        var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleBand().rangeRound([0, width]).padding(0.1)
            .domain(data.map(function(d,i) { return months[(i%12)]; }));

        var y = d3.scaleLinear().rangeRound([height, 0])
            .domain([0, 28]); //try to come up with a dynamic solution for max temperature

        g.append("g")
            .attr("class", "axis x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis y")
            .call(d3.axisLeft(y).ticks(10));

        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("x", function(d,i) { return x(months[(i%12)]); })
            .attr("y", function(d,i) {
                return y(getMonthAverage(data, d, i));
            })
            .attr("width", x.bandwidth())
            .attr("height", function(d,i) { return height - y(getMonthAverage(data, d, i));
            });

    });

    function getMonthAverage(data, d, i) {
        var month = months[(i%12)].toUpperCase();
        return d3.mean(data, function(d) { return d[month]; });
    }

    // var width = 960,
    //     height = 500,
    //     barHeight = height / 2 - 40;
    //
    // var formatNumber = d3.format("s");
    //
    // var color = d3.scaleOrdinal()
    //     .range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]);
    //
    // var svg = d3.select('body').append("svg")
    //     .attr("width", width)
    //     .attr("height", height)
    //     .append("g")
    //     .attr("transform", "translate(" + width/2 + "," + height/2 + ")");
    //
    // d3.tsv("copenhagen.txt", function(error, data) {
    //
    //     data.sort(function(a,b) { return b.YEAR - a.YEAR; });
    //
    //     // var extent = d3.extent(data, function(d) { return d.YEAR; });
    //     var barScale = d3.scaleLinear()
    //         .domain(0, 30)
    //         .range([50, barHeight]);
    //
    //     // var keys = data.map(function(d,i) {
    //     //     if(i < 12)
    //     //         return months[i];
    //     // });
    //     var numBars = months.length;
    //
    //     var x = d3.scaleLinear()
    //         .domain(0, 30)
    //         .range([0, -barHeight]);
    //
    //     var xAxis = d3.axisLeft()
    //         .scale(x)
    //         .ticks(3)
    //         .tickFormat(formatNumber);
    //
    //     var circles = svg.selectAll("circle")
    //         .data(x.ticks(3))
    //         .enter().append("circle")
    //         .attr("r", function(d) {return barScale(d);})
    //         .style("fill", "none")
    //         .style("stroke", "black")
    //         .style("stroke-dasharray", "2,2")
    //         .style("stroke-width",".5px");
    //
    //     var arc = d3.arc()
    //         .startAngle(function(d,i) { return (i * 2 * Math.PI) / numBars; })
    //         .endAngle(function(d,i) { return ((i + 1) * 2 * Math.PI) / numBars; })
    //         .innerRadius(50);
    //
    //     var segments = svg.selectAll("path")
    //         .data(data)
    //         .enter().append("path")
    //         .each(function(d) { d.outerRadius = 0; })
    //         .style("fill", function (d,i) { return color(months[i]); })
    //         .attr("d", arc);
    //
    //     // segments.transition().ease("elastic").duration(1000).delay(function(d,i) {return (25-i)*100;})
    //     //     .attrTween("d", function(d,index) {
    //     //         var i = d3.interpolate(d.outerRadius, barScale(+d));
    //     //         return function(t) { d.outerRadius = i(t); return arc(d,index); };
    //     //     });
    //
    //     svg.append("circle")
    //         .attr("r", barHeight)
    //         .classed("outer", true)
    //         .style("fill", "none")
    //         .style("stroke", "black")
    //         .style("stroke-width","1.5px");
    //
    //     svg.append("g")
    //         .attr("class", "x axis")
    //         .call(xAxis);
    //
    //     // Labels
    //     var labelRadius = barHeight * 1.025;
    //
    //     var labels = svg.append("g")
    //         .classed("labels", true);
    //
    //     labels.append("def")
    //         .append("path")
    //         .attr("id", "label-path")
    //         .attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");
    //
    //     labels.selectAll("text")
    //         .data(months)
    //         .enter().append("text")
    //         .style("text-anchor", "middle")
    //         .style("font-weight","bold")
    //         .style("fill", function(d, i) {return "#3e3e3e";})
    //         .append("textPath")
    //         .attr("xlink:href", "#label-path")
    //         .attr("startOffset", function(d, i) {return i * 100 / numBars + 50 / numBars + '%';})
    //         .text(function(d) {return d.toUpperCase(); });
    //
    // });
}