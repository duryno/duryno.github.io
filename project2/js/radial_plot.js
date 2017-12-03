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

    var y = d3.scaleRadial()
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
        y.domain([0, d3.max(data, function(d,i) { var month = months[(i%12)].toUpperCase(); return d[month]; })])
         .range([50, 1000]);
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

        g.append("g")
            .selectAll("g")
            .data(d3.stack().keys(data.columns.slice(1))(data))
            .enter().append("g")
            .selectAll("path")
            .data(function(d) { return d; })
            .enter().append("path")
            .attr("d", d3.arc()
                .innerRadius(function(d) { return 50; })
                .outerRadius(function(d,i) { return y(getMonthAverage(data, d.data, i)); })
                .startAngle(function(d,i) { return x(months[(i%12)]); })
                .endAngle(function(d,i) { return x(months[(i%12)]) + x.bandwidth(); })
                .padAngle(0.02)
                .padRadius(innerRadius));

        var label = g.append("g")
            .selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("text-anchor", "middle")
            .attr("transform", function(d,i) { return "rotate(" + ((x(months[(i%12)]) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)"; });

        label.append("text")
            .attr("transform", function(d) { return "rotate(90)"; })
            .text(function(d,i) { return months[(i%12)]; });

        // var yAxis = g.append("g")
        //     .attr("text-anchor", "end");
        //
        // var yTick = yAxis
        //     .selectAll("g")
        //     .data(y.ticks(10).slice(1))
        //     .enter().append("g");
        //
        // yTick.append("circle")
        //     .attr("fill", "none")
        //     .attr("stroke", "#000")
        //     .attr("stroke-opacity", 0.5)
        //     .attr("r", y);
        //
        // yTick.append("text")
        //     .attr("x", -6)
        //     .attr("y", function(d) { return -y(d); })
        //     .attr("dy", "0.35em")
        //     .attr("fill", "none")
        //     .attr("stroke", "#fff")
        //     .attr("stroke-width", 5)
        //     .text(y.tickFormat(10, "s"));
        //
        // yTick.append("text")
        //     .attr("x", -6)
        //     .attr("y", function(d) { return -y(d); })
        //     .attr("dy", "0.35em")
        //     .text(y.tickFormat(10, "s"));
        //
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