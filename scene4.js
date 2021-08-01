hoverColor = '#fcb603';
var svg4 = d3.select("#svg4"),
margin4 = {top: 20, right: 20, bottom: 80, left: 50},
width4 = +svg4.attr("width") - margin4.left - margin4.right,
height4 = +svg4.attr("height") - margin4.top - margin4.bottom,
g4 = svg4.append("g").attr("transform", "translate(" + margin4.left + "," + margin4.top + ")");

// The scale spacing the groups:
var x0 = d3.scaleBand()
.rangeRound([0, width])
.paddingInner(0.1);

// The scale for spacing each group's bar:
var x1 = d3.scaleBand()
.padding(0.1);

var y = d3.scaleLinear()
.rangeRound([height, 0]);

var z = d3.scaleOrdinal()
.range(["#2B61A5","#e58741"]);

var tooltip4 = d3
.select('body')
.append('div')
.attr('class', 'd3-tooltip')
.style('position', 'absolute')
.style('z-index', '10')
.style('visibility', 'hidden')
.style('padding', '10px')
.style('background', '#edeae1')
.style('border-radius', '4px')
.style('color', '#032327')
.text('a simple tooltip');

d3.csv("scene4.csv", function(d, i, columns) {
for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
return d;
}).then(function(data) {
//console.log(data);

var keys = data.columns.slice(1,3);
var activities = data.map(function (d) { return d.Activity});
var yoy = data.map(function (d) { return d.Var});
let activeAct = '';

//console.log('keys');
//console.log(keys);
//console.log('activities');
//console.log(activities);
x0.domain(data.map(function(d) { return d.Activity; }));
x1.domain(keys).rangeRound([0, x0.bandwidth()]);
y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

g4.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("class","bar")
    .attr("transform", function(d) { return "translate(" + x0(d.Activity) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) {
        return {key: key, value: d[key]}; 
        });
    })
    .enter().append("rect")
    .attr("x", function(d) { return x1(d.key); })
    .attr("y", function(d) { return y(d.value); })
    .attr("width", x1.bandwidth())
    .attr("height", function(d) { return height - y(d.value); })
    .attr("fill", function(d) { return z(d.key); })
    .on('mouseover', function (d, i) {
        tooltip4
          .html(
            `<div>${d.value}</div>`
          )
          .style('visibility', 'visible');
        d3.select(this).transition().attr('fill', hoverColor);
    })
    .on('mousemove', function () {
        tooltip4
          .style('top', d3.event.pageY - 10 + 'px')
          .style('left', d3.event.pageX + 10 + 'px');
    })
    .on('mouseout', function () {
        tooltip4.html(``).style('visibility', 'hidden');
        d3.select(this).transition().attr('fill', function(d) { return z(d.key); });
    });

g4.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x0));
    //.call(g => g.select(".domain").remove());           

g4.append("text")             
    .attr("transform",
          "translate(" + (width/2) + " ," + 
                         (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .attr("font-weight", "bold")    
    .text("Education Attainment");

g4.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y).ticks(null, "s"));

    g4.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .attr("font-weight", "bold")
    .style("text-anchor", "middle")
    .text("Percent of Working at Home"); 

var legend4 = g4.append("g")                      
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * 30 + ")"; });

legend4.append("rect")
    .attr("x", width - 17)
    .attr("width", 22)
    .attr("height", 22)
    .attr("fill", z)
    .attr("stroke", z)
    .attr("stroke-width",2)
    .on("click",function(d) { update(d) });

legend4.append("text")
    .attr("x", width - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(function(d) { return d; });

var filtered = [];

////
//// Update and transition on click:
////

function update(d) {

    //
    // Update the array to filter the chart by:
    //

    // add the clicked key if not included:
    if (filtered.indexOf(d) == -1) {
        filtered.push(d);
        // if all bars are un-checked, reset:
        if(filtered.length == keys.length) filtered = [];
    }
    // otherwise remove it:
    else {
        filtered.splice(filtered.indexOf(d), 1);
    }

    //
    // Update the scales for each group(/states)'s items:
    //
    var newKeys = [];
    keys.forEach(function(d) {
        if (filtered.indexOf(d) == -1 ) {
            newKeys.push(d);
        }
    })
    x1.domain(newKeys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { if (filtered.indexOf(key) == -1) return d[key]; }); })]).nice();

    // update the y axis:
    svg3.select(".y")
        .transition()
        .call(d3.axisLeft(y).ticks(null, "s"))
        .duration(500);


    //
    // Filter out the bands that need to be hidden:
    //
    var bars = svg4.selectAll(".bar").selectAll("rect")
        .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })

    bars.filter(function(d) {
            return filtered.indexOf(d.key) > -1;
        })
        .transition()
        .attr("x", function(d) {
            return (+d3.select(this).attr("x")) + (+d3.select(this).attr("width"))/2;
        })
        .attr("height",0)
        .attr("width",0)
        .attr("y", function(d) { return height; })
        .duration(500);

    //
    // Adjust the remaining bars:
    //
    bars.filter(function(d) {
            return filtered.indexOf(d.key) == -1;
        })
        .transition()
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", x1.bandwidth())
        .attr("fill", function(d) { return z(d.key); })
        .duration(500);


    // update legend:
    legend4.selectAll("rect")
        .transition()
        .attr("fill",function(d) {
            if (filtered.length) {
                if (filtered.indexOf(d) == -1) {
                    return z(d);
                }
                else {
                    return "white";
                }
            }
            else {
                return z(d);
            }
        })
        .duration(100);


}

});