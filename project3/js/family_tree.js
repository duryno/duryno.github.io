// Solution based on the sample tree by d3noob availabe at: https://bl.ocks.org/d3noob/5537fe63086c4f100114f87f124850dd

d3.select(window).on('load', init);

function init() {

    var margin = {top: 0, right: 100, bottom: 0, left: 100};
    var width = 1000 - margin.left - margin.right;
    var height = 1700;

    d3.json('trump.json', function(error, json) {

        if (error)
            return console.error(error);

        var treemap = d3.tree()
            .size([height, width]);

        var nodes = d3.hierarchy(json, function (d) {
            return d.children ? d.children : d.partners;
        });

        nodes = treemap(nodes);

        var svg = d3.select("#plot")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height);

        var g = svg.append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // adds the links between the nodes
        var link = g.selectAll(".link")
            .data(nodes.descendants().slice(1))
            .enter().append("path")
            .attr("class", "link")
            .attr("d", function (d) {
                //move partners one depth level back
                if(d.parent) {
                    if(!d.parent.data.children) {
                        d.x = (d.parent.x + (d.parent.children.indexOf(d)+1) * 50);
                        if(!(d.parent.data.name === "Donald Trump"))
                            d.parent.x -= 50;
                        else
                            d.parent.x = height / 2 + 150 ;
                        d.y = d.parent.y;
                        //add the node's parent as the second parent ('parent2') of the node's children if it has any
                        if(d.children)
                            for(var i=0; i<d.children.length; i++)
                                d.children[i].parent2 = d.parent;
                        d.depth -= 1;

                        if(d.depth === 0)
                            d.x = height / 2 - (d.parent.children.indexOf(d)) * 100 + 50;
                    }
                }
                var dx = d.data.partners ? (d.x - 50) : d.x;
                return "M" + d.parent.y + "," + d.parent.x
                    + "C" + (d.parent.y + d.y) / 2 + "," + d.parent.x
                    + " " + (d.parent.y + d.y) / 2 + "," + dx
                    + " " + d.y + "," + dx;
            });

        //add link to parent2
        var link2 = svg.append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")")
            .selectAll(".link")
            .data(nodes.descendants().slice(1))
            .enter().append("path")
            .attr("class", "link")
            .attr("d", function (d) {
                if(d.parent2)
                    return "M" + d.parent2.y + "," + d.parent2.x
                        + "C" + (d.parent2.y + d.y) / 2 + "," + d.parent2.x
                        + " " + (d.parent2.y + d.y) / 2 + "," + d.x
                        + " " + d.y + "," + d.x;
            });

        // adds each node as a group
        var node = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .selectAll(".node")
            .data(nodes.descendants())
            .enter().append("g")
            .attr("class", function (d) {
                if(d.depth === 0)
                    return "node red";
                else if(d.depth === 2)
                    return "node blue";
                else
                    return "node green";
            })
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });


        // adds the circle to the node
        node.append("circle")
            .attr("r", 50)
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);

        // adds the text to the node
        node.append("text")
            .attr("dy", ".35em")
            .style("text-anchor", function (d) {
                return "middle";
            })
            .style("stroke", "none")
            .text(function (d) {
                return d.data.name;
            })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);
    });

    function handleMouseOver(d, i) {
        var bioContainer = d3.select("#bio")
            .style("bottom", "0px")
            .style("visibility", "visible");

        bioContainer.select("img")
            .attr("src", d.data.img);

        bioContainer.select("#bio-name")
            .text(d.data.name);

        bioContainer.select("#bio-content")
            .text(d.data.bio);


        bioContainer.select("img")
            .attr("src", d.data.img ?
                d.data.img : "http://www.iconninja.com/files/734/223/678/user-people-profile-human-account-avatar-icon.svg"); //avatar by iconninja.com
    }

    function handleMouseOut(d, i) {
        var bioContainer = d3.select("#bio")
            .style("bottom", "-300px")
            .style("visibility", "hidden");

        bioContainer.select("img")
            .attr("src", "");
    }

}