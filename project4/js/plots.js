d3.select(window).on('load', init);

function init() {

    var defaultHandId = "id1";
    var svg = d3.select('#scatter-plot');
    var margin = {top: 50, right: 50, bottom: 50, left: 50};
    var width = +svg.node().getBoundingClientRect().width;
    var height = +svg.node().getBoundingClientRect().height;

    d3.tsv("handsPCA.txt", function(error, data) {
        if(error) throw error;

        handsPCAdata = data;

        var headers = d3.keys(data[0]);
        populatePCASelectors(headers);

        select = document.getElementById("pca1-select");
        select2 = document.getElementById("pca2-select");

        var selectedVar = select.options[select.selectedIndex].value;
        var selectedVar2 = select.options[select2.selectedIndex].value;

        x = d3.scaleLinear()
            .domain([-0.8, 0.8])
            .range([margin.left, width - margin.right]);

        y = d3.scaleLinear()
            .domain([0.8, -0.5])
            .range([margin.top, height - margin.bottom]);

        svg.selectAll('circle')
            .data(handsPCAdata)
            .enter()
            .append('circle')
            .attr("r", "5px")
            .attr("cx", function (d) {
                return x(d[selectedVar]) + "px";
            })
            .attr("cy", function(d) {
                return y(d[selectedVar2]) + "px";
            })
            .attr("fill", "red")
            .attr("stroke", "white")
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

    });

    d3.tsv('hands.txt', function(error, data) {
        if (error) throw error;

        svg2 = d3.select('#hand_outline');
        var width = +svg2.node().getBoundingClientRect().width;
        var height = +svg2.node().getBoundingClientRect().height;
        var margin = {top: 30, right: 30, bottom: 50, left: 30};

        xScale = d3.scaleTime()
            .domain(d3.range(0, 1.5))
            .range([margin.left, width - margin.right]);

        yScale = d3.scaleLinear()
            .domain([0 , 0.8 ])
            .range([height - margin.top, margin.bottom]);

        handsData = data;
        drawHand(defaultHandId, data);

    });

    function handleMouseOver(d,i) {
        updateHand(d.id);
    }

    function drawHand(id) {
        //Create line
        svg2.append("path")
            .datum(handsData)
            .attr("class", "line")
            .attr("d", getLine(id))
            .attr("stroke" , "grey")
            .attr("stroke-width", "5px")
            .attr("fill", "none")
            .attr("transform", "translate(" + (-width / 6) + "," + (height / 6 ) + ")");
    }

    function updateHand(id) {
        //Update line
        svg2.select("path")
            .attr("d", getLine(id));
    }

    function getLine(id) {
        //Define line generator
        return d3.line()
            .defined(function(d) { return d.id === id; })
            .x(function(d) { return xScale(d.x); })
            .y(function(d) { return yScale(d.y); })
            .curve(d3.curveCatmullRom);
    }

}

function updatePoints() {
    var var1 = select.options[select.selectedIndex].value;
    var var2 = select.options[select2.selectedIndex].value;

    d3.select('#scatter-plot')
        .selectAll('circle')
        .transition()
        .ease(d3.easeCubic)
        .attr("cx", function (d) {
            return x(d[var1]) + "px";
        })
        .attr("cy", function(d) {
            return y(d[var2]) + "px";
        });
}

function populatePCASelectors(vars) {
    var select = document.getElementById("pca1-select");
    var select2 = document.getElementById("pca2-select");
    for(var i=0; i < 39; i++) {
        var elem = vars[i];
        select.options.add(createOpt(elem));
        select2.options.add(createOpt(elem));
    }
    select.selectedIndex = 0;
    select2.selectedIndex = 1;
}

function createOpt(elem) {
    var opt = document.createElement("option");
    opt.value= elem;
    opt.text = elem;
    return opt;
}