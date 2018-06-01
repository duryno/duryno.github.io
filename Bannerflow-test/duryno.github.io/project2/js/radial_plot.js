/**
 * Created by Juraj Orszag on 02/12/2017.
 * Partially based on the example by Mike Bostock available at https://bl.ocks.org/mbostock/5479367295dfe8f21002fc71d6500392
 */

d3.select(window).on('load', init);

function init() {
//Copenhagen plot

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var sectionWidth = d3.select("section").node().getBoundingClientRect().width;
    var svg = d3.select("#radial-plot");
    var width = +svg.attr("width");
    var height = +svg.attr("height");
    var radius = 180;

    var g = svg.append("g").attr("transform", "translate(" + ((sectionWidth * 0.46) /2) + "," + height / 2 + ")");

    var x = d3.scaleBand().range([0, 2 * Math.PI]);
    var y = d3.scaleLinear();

    d3.tsv("copenhagen.txt", function(error, data) {
        x.domain(data.map(function(d,i) { return months[(i%12)]; }));
        y.domain([0, 20])
         .range([50, 150]);

        var label = g.append("g")
            .selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("transform", function(d,i) {
                return "rotate(" + ((x(months[(i%12)]) + x.bandwidth() / 2) * 180 / Math.PI - 90)
                    + ")translate(" + radius + ",0)";
            });

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
            .attr("r", y(24));

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

        var colorScale = d3.scaleLinear()
            .domain(d3.extent(data,function(d,i){return getMonthAverage(data, i);}))
            .range([0,0.8]);

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
                .outerRadius(function(d,i) { return y(getMonthAverage(data, i)); })
                .startAngle(function(d,i) { return x(months[(i%12)]); })
                .endAngle(function(d,i) { return x(months[(i%12)]) + x.bandwidth(); })
                .padAngle(0.02)
                .padRadius(radius))
            .attr("fill", function(d,i) {
                return d3.interpolatePlasma(colorScale(getMonthAverage(data, i)));
            })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);

        function handleMouseOver(d, i) {
            d3.select(this).attr("fill", "#FF6D00");
            var avgTemp = document.getElementById("avg-temp");
            var month = months[(i%12)];
            avgTemp.innerHTML = month + " | " + parseFloat(getMonthAverage(data, i)).toFixed(2) + "°C";
        }

        function handleMouseOut(d, i) {
            d3.select(this).attr("fill", d3.interpolatePlasma(colorScale(getMonthAverage(data, i))));
            var avgTemp = document.getElementById("avg-temp");
            avgTemp.innerHTML = "- | -";
        }

//Aalborg plots
        var w = 500;
        var h = 400;

        var w2 = 500;
        var h2 = 400;
        var padding2 = 30;
        var datasetAalborgMelt;

        var rowConverter = function(d){
            return {
                YEAR: parseFloat(d.YEAR),
                JAN: parseFloat(d.JAN),
                FEB: parseFloat(d.FEB),
                MAR: parseFloat(d.MAR),
                APR: parseFloat(d.APR),
                MAY: parseFloat(d.MAY),
                JUN: parseFloat(d.JUN),
                JUL: parseFloat(d.JUL),
                AUG: parseFloat(d.AUG),
                SEP: parseFloat(d.SEP),
                OCT: parseFloat(d.OCT),
                NOV: parseFloat(d.NOV),
                DEC: parseFloat(d.DEC)};
        };

        var rowConverter2 = function(d){
            return {
                value: parseFloat(d.value),
                dates1: new Date(+d.YEAR, (+d.month_nr - 1))
            };
        };

        d3.csv('stationAalborg.csv',rowConverter, function(error, data) {
            if (error) {console.log(error);}

            datasetAa = data;

            var svg1 = d3.select('#scatter-plot')
                .append('svg')
                .attr("width", w)
                .attr("height", h)
                .attr("transform", "translate(0, 30)");

            var padding = 20;

            var xmax = d3.max(data, function(d){return d.YEAR;});
            var xmin = d3.min(data, function(d){return d.YEAR;});

            var ymax = 20;
            var ymin = -10;

            var xScale = d3.scaleLinear()
                .domain([ xmin,xmax ])
                .range([padding, w - padding]);

            var yScale = d3.scaleLinear()
                .domain([ymin, ymax ])
                .range([h - padding, padding]);

            var xAxis = d3.axisBottom()
                .scale(xScale)
                .tickFormat(d3.format('d'))
                .ticks(5);

            var yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(5);

            g = svg1.selectAll("g")
                .data(data)
                .enter()
                .append("g");

            for(var j=0; j<months.length; j++) {
                g.append("circle")
                    .attr("cx", function(d){return xScale(d.YEAR);})
                    .attr("cy", function(d){
                        var value = isNaN(d[(months[j].toUpperCase())]) ? 0 : d[(months[j].toUpperCase())];
                        return yScale(value);
                    })
                    .attr("r", 4)
                    .attr("class", months[j]);
            }

            //Create X axis
            svg1.append("g")
                .attr("class", "axis")
                .call(xAxis)
                .attr("transform","translate(0," + (h - padding) + ")");

            //Create Y axis
            svg1.append("g")
                .attr("class", "axis")
                .call(yAxis)
                .attr("transform","translate(" +  padding + ",0)");

        });


        d3.tsv('meltedStation Aalborg_20171205.txt', rowConverter2,
            function(error, data) {
                if (error) {console.log(error);}

                datasetAalborgMelt = data;

                var svg2 = d3.select('#temperature-change')
                    .append('svg')
                    .attr("width", w2)
                    .attr("height", h2)
                    .attr("transform", "translate(0, 30)");

                var xmax = d3.max(data, function(d){return d.dates1;});
                var xmin = d3.min(data, function(d){return d.dates1;});

                var ymax = 20;
                var ymin = d3.min(data, function(d){return d.value;});

                var xScale = d3.scaleTime()
                    .domain([ xmin - 365*24*3600*1000, xmax ])  // Why is it ipossible to add tne number to xmax?
                    .range([padding2, w2 - padding2]);

                var yScale = d3.scaleLinear()
                    .domain([ymin -1 , ymax + 1 ])
                    .range([h2 - padding2, padding2]);

                //Define line generator
                lineKW = d3.line()
                    .defined(function(d) { return d.value < 100; })
                    .x(function(d) { return xScale(d.dates1); })
                    .y(function(d) { return yScale(d.value); });

                var xAxis = d3.axisBottom()
                    .scale(xScale)
                    .ticks(5);

                var yAxis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(5);

                circles = svg2.selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d){return xScale(d.dates1);})
                    .attr("cy", function(d){return yScale(d.value);})
                    .attr("r", 1)
                    .attr("fill" , "grey")
                    .attr("stroke" , "grey");

                //Create line
                svg2.append("path")
                    .datum(data)
                    .attr("class", "line")
                    .attr("d", lineKW)
                    .attr("stroke" , "grey")
                    .attr("fill", "none");

                //Create X axis
                svg2.append("g")
                    .attr("class", "axis")
                    .call(xAxis)
                    .attr("transform","translate(0," + (h2 - padding2) + ")");

                //Create Y axis
                svg2.append("g")
                    .attr("class", "axis")
                    .call(yAxis)
                    .attr("transform","translate(" +  padding2 + ",0)");
            }
        );

    });

//helper function for Copenhagen plot
    function getMonthAverage(data, i) {
        var month = months[(i%12)].toUpperCase();
        return d3.mean(data, function(d) {
            return d[month] !== '999.9' ? d[month] : 0;
        });
    }

}