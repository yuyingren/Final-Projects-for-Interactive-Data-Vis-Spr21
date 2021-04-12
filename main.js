/**
 * CONSTANTS AND GLOBALS
 * */
 const width = window.innerWidth * 0.9,
 height = window.innerHeight * 0.7,
 margin = { top: 20, bottom: 50, left: 60, right: 40 };

let svg;
let tooltip;
let tooltip1;

let state = {
 // + INITIALIZE STATE
 data: null,
 hover:null,
};
data1 = [{month: 2008, apples1: 10, bananas1: 20, oranges1: 15, pears1: 5, apples: "aa", bananas: "bb", oranges: "oo", pears: "pp"}, 
        {month: 2009, apples1: 15, bananas1: 5, oranges1: 10, pears1: 20, apples: "aa", bananas: "pp", oranges: "bb", pears: "oo"}, 
        {month: 2010, apples1: 5, bananas1: 10, oranges1: 5, pears1: 15, apples: "pp", bananas: "aa", oranges: "oo", pears: "bb"}]

console.log(data1)
stack = d3.stack()
  .keys(["apples1", "bananas1", "oranges1", "pears1"])
  (data1)
console.log(stack[0][0].data)

color = d3.scaleOrdinal()
    .domain(["apples1", "bananas1", "oranges1", "pears1"])
    .range(["red", "blue", "yellow", "pink"])

col = d3.scaleOrdinal()
    .domain(["aa", "oo", "bb", "pp"])
    .range(["red", "blue", "yellow", "pink"])


x = d3.scaleBand()
    .domain(data1.map(d => d.month))
    .range([0, width])

y = d3.scaleLinear()
    .domain([0, d3.max(stack, d => d3.max(d, d => d[1]))])
    .rangeRound([height, 0])

svg = d3.select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

svg.append("g")
.selectAll("g")
.data(stack)
.join("g")
.selectAll("rect")
.data(d => d)
.join("rect")
  .attr("x", (d, i) => x(d.data.month))
  .attr("y", d => y(d[1]))
  .attr("height", d => y(d[0]) - y(d[1]))
  .attr("width", x.bandwidth())
  .attr("fill", d => function(d) {
    return ["apples", "bananas", "oranges", "pears"].map(function(g, j) {
    console.log(d.data[g])
      if (j === 0) return col(d.map(function(f) {return f.data[g]}))
      if (j === 1) return col(d.map(function(f) {return f.data[g]}))
      if (j === 2) return col(d.map(function(f) {return f.data[g]}))
      if (j === 3) return col(d.map(function(f) {return f.data[g]}))
    })
    
  }
)
/**
* LOAD DATA
* */
/*d3.json("../data/flare.json", d3.autotype).then(data => {
 state.data = data;
 init();
});*/


