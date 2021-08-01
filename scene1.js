var svg1 = d3.select("#svg1"),
margin1 = {top: 10, right: 20, bottom: 10, left: 10},
chartWidth = +svg1.attr("width") - margin1.left - margin1.right,
chartHeight = +svg1.attr("height") - margin1.top - margin1.bottom;
// g1 = svg1.append("g").attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");


const colorsDonut = [ '#6929c4', '#9f1853', '#198038', '#b28600', '#8a3800','#1192e', '#fa4d56','#002d9c', '#009d9a','#a56eff','#005d5d','#570408','#ee538b'];

const  radius = Math.min(chartWidth, chartHeight) / 2,
  innerRadius = radius*0.8;

const formatter = d3.format('$,');

const arc = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(radius);

const pie = d3.pie()
  .sort(null)
  .value(d => d.hours);

var donutChart = svg1
  .append('g')
  .attr('transform', `translate(${chartWidth / 2.2},${chartHeight / 2})`);

var donutTooltip = d3
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

d3.csv("scene1.csv", function(d) {
    return d;
    }).then(function(data) {
    //console.log(data);

    var g = donutChart.selectAll(".arc")
        .data(pie(data))
        .enter().append("g"); 
    
    g.append("path")    
    	.attr("d", arc)
        .style("fill", function(d,i) {
      	    return colorsDonut[i];
        })
        .on('mouseover', function (d) {
            donutTooltip
              .html(
                `<div>${d.data.label}</div>`
              )
              .style('visibility', 'visible');

        })
        .on('mousemove', function () {
            donutTooltip
              .style('top', d3.event.pageY - 10 + 'px')
              .style('left', d3.event.pageX + 10 + 'px');
        })
        .on('mouseout', function (d,i) {
            donutTooltip.html(``).style('visibility', 'hidden');
        });

      
    g.append("text")
      .attr("transform", function(d) {
      var _d = arc.centroid(d);
      _d[0] *= 1;	//multiply by a constant factor
      _d[1] *= 1                            ;	//multiply by a constant factor
      return "translate(" + _d + ")";
    })
    .attr("dy", ".2em")
    .style("text-anchor", "middle")
    .style("fill","#FFFFFF")
    .text(function(d) {
       return d.data.hours;
    });

    g.append("text")
    .attr("dy", ".100em")
    .style("text-anchor", "middle")
    .style("fill","#000000")
    .text("Avg Time Spent (hours) per Day");
       
    const legendGroup = svg1
        .append('g')
        .attr('transform', `translate(${chartWidth*0.75} 20)`)
        .attr('class', 'legend-group');


    const legendItems = legendGroup
           .selectAll('g')
           .data(data)
           .enter()
           .append('g')
           .attr('role', 'presentation')
           .attr('transform', (d,i) => `translate(20 ${(i + 1) * 30})`);

    legendItems.append('rect')
           .attr('role', 'presentation')
           .attr('y', -13)
           .attr('width', 15)
           .attr('height', 15)
           .attr('fill', (d,i) => colorsDonut[i])

    legendItems.append('text')
           .attr('x', 20)
           .attr("font-size", 12)
           .text(d => `${d.label}`)

});
