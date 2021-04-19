/**
 * CONSTANTS AND GLOBALS
 * */
 
 //console.log(rangeslider.value)

 const margin = { top: 30, bottom: 20, left: 20, right: 20 };
 width = window.innerWidth * 0.8 - margin.left - margin.right;
 height = window.innerHeight * 0.6 - margin.top - margin.bottom;

 //var tickDuration = 500;
    
 //var height = 300;
 //var width = 600;


let state = {
  
  female: null,
  male: null,
  state_name: null,
  hover: {
    screenPosition: null, // will be array of [x,y] once mouse is hovered on something
    mapPosition: null, // will be array of [long, lat] once mouse is hovered on something
    visible: false,
  },
  selectedState: null,
  selectedGender: "F",
  selectedS: null,
  selectedY: "1920",
};
// var dataset;
const top_ten = 10;
let init_year = 1920;
let barPadding = (height-(margin.bottom+margin.top))/(top_ten*5);
let svgPlot = d3.select("#vis")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "barchart");

let y_scale = d3.scaleLinear()
  .range([height-margin.bottom, margin.top]);

let x_scale = d3.scaleLinear()
  .range([margin.left, width-margin.right-65]);

let yearText = svgPlot.append('text')
  .attr('class', 'yearText')
  .attr('x', width-margin.right)
  .attr('y', height-25)
  .style('text-anchor', 'end')
  .html(init_year + "s")
  .call(halo, 10);

let xAxis = d3.axisTop()
  .scale(x_scale)
  .ticks(width > 500 ? 5:2)
  .tickSize(-(height-margin.top-margin.bottom))
  .tickFormat(d => d);

Promise.all([
  d3.csv("data/names_female.csv", d3.autoType),
  d3.csv("data/USstate.csv", d3.autoType),
  d3.csv("data/names_male.csv", d3.autoType),
]).then(([female_data, statedata, male_data]) => {
  state.female = female_data
  state.male = male_data
  state.state_name = statedata
  console.log("state: ", state.female);
  console.log("state: ", state);
  init();

});


function init() {

  let filterStates = state.female.filter(d => d.state === "All");
  state.selectedS = filterStates
  state.selectedState = "All"
  console.log("selectedstate", state.selectedS)

  //const top_ten = 10;
  //let init_year = 1920;
  //let barPadding = (height-(margin.bottom+margin.top))/(top_ten*5);
  //console.log(d3.group(data, d => d.year));
  let yearSlice = filterStates.filter(d => d.year == init_year)
  console.log("init_yearSlice", yearSlice)

  y_scale.domain([top_ten, 0]);
  x_scale.domain([0, d3.max(yearSlice, d => d.count)]);

  let xAxis = d3.axisTop()
    .scale(x_scale)
    .ticks(width > 500 ? 5:2)
    .tickSize(-(height-margin.top-margin.bottom))
    .tickFormat(d => d);

  svgPlot.append('g')
    .attr('class', 'axis xAxis')
    .attr('transform', `translate(0, ${margin.top})`)
    .call(xAxis)
    .selectAll('.tick line')
    .classed('origin', d => d == 0);
  
  svgPlot.selectAll("rect.bar")
    .data(yearSlice, d => d.name)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', x_scale(0)+1)
    .attr('width', d => x_scale(d.count)-x_scale(0)-1)
    .attr('y', d => y_scale(d.rank) +5)
    .attr('height', y_scale(1)-y_scale(0)-barPadding)
    .style('fill', "#52b788")
    .style("opacity", 0.7);

  svgPlot.selectAll('text.label')
    .data(yearSlice, d => d.name)
    .enter()
    .append('text')
    .attr('class', 'label')
    .attr('x', d => x_scale(d.count)-8)//// -8, so ot won't reach the edge of left
    .attr('y', d => y_scale(d.rank)+5+((y_scale(1)-y_scale(0))/2)+1)
    .style('text-anchor', 'end')
    .style("fill", "white")
    .html(d => d.name);

  
  ///////// RRANGE BAR ////////////
  let range = document.getElementById('range');
  let rangeV = document.getElementById('rangeV');
  rangeV.innerHTML = range.value;
  range.oninput = function() {

    //console.log(filterStates)
      //console.log("selectedstate", state.selectedS)
      let newValue = Number( (this.value - 1920) / (2020 -1920) * 100 );
      rangeV.innerHTML = this.value;
      rangeV.style.left = newValue + "%";
      state.selectedY = this.value;
      //filteredData = filterStates.filter(d => d.year === Number(this.value))
      //console.log(filteredData)
    updateChart(state.selectedS, state.selectedY)

  };
  //console.log("year before dropdown:", range.value)

  //////////// GENDER SELECT DROPDOWN /////////////////
  const selectGender = d3.select("#dropdown1")
  selectGender
    .selectAll("option")
    .data([{key: "F", label: "Female"}, 
      {key: "M", label: "Male"}])
    .join("option")
    .attr("value", d => d.key) 
    .text(d => d.label);

  selectGender.on("change", event => {
    // 'event' holds all the event information that triggered this callback
    console.log("DROPDOWN CALLBACK: new value is", event.target.value);
    // save this new selection to application state
    state.selectedGender = event.target.value
    //console.log("NEW STATE:", state.selectedGender);
    //console.log(state.selectedState)
    if (state.selectedGender === "F") state.selectedS = state.female.filter(d => state.selectedState === d.state)
    if (state.selectedGender === "M") state.selectedS = state.male.filter(d => state.selectedState === d.state)
    console.log(state.selectedS)
    //state.selectedS = state.female.filter(d => state.selectedState === d.state)
    //console.log(state.selectedS)
   // console.log(state.selectedY)
    updateChart(state.selectedS, state.selectedY)
    
  });

  ////////////////////STATE SELECT DROPDOWN/////////////////////
  const selectElement = d3.select("#dropdown")
  selectElement
    .selectAll("option")
    .data(state.state_name)
    .join("option")
    .attr("value", d => d.statecode) // set the key to the 'value' -- what we will use to FILTER our data later
    .text(d => d.statename);

  selectElement.on("change", event => {
    // 'event' holds all the event information that triggered this callback
    console.log("DROPDOWN CALLBACK: new value is", event.target.value);
    // save this new selection to application state
    state.selectedState = event.target.value
    //console.log("NEW STATE:", state.selectedState);
    if (state.selectedGender === "F") state.selectedS = state.female.filter(d => state.selectedState === d.state)
    if (state.selectedGender === "M") state.selectedS = state.male.filter(d => state.selectedState === d.state)
    console.log(state.selectedS)
    //state.selectedS = state.female.filter(d => state.selectedState === d.state)
    //console.log(state.selectedS)
    //console.log(state.selectedY)
    updateChart(state.selectedS, state.selectedY)
    
  }); 

};


function updateChart(selectdata, h) {

  //console.log(state.selected_s_data)
  h1 = Number(h)
  console.log(h1)
  
  filteredData = selectdata.filter(d => d.year === h1)
  console.log(filteredData)
  x_scale.domain([0, d3.max(filteredData, d => d.count)])
  svgPlot.select('.xAxis')
    .transition()
    .duration(500)
    .ease(d3.easeLinear)
    .call(xAxis);
  
  let bars = svgPlot.selectAll('.bar').data(filteredData, d => d.name);
  bars
    .enter()
      .append('rect')
      .attr('class', d => `bar ${d.name.replace(/\s/g,'_')}`)
      .attr("x", x_scale(0)+1)
      .attr('width', d => x_scale(d.count)-x_scale(0)-1)
      .attr("y", d => y_scale(top_ten+1)+5)
      .attr('height', y_scale(1)-y_scale(0)-barPadding)
      .style('fill', "#52b788")
      .style("opacity", 0.7)
      .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr('y', d => y_scale(d.rank)+5)
        .style("fill", d=> {
          if (d.pre_rank === -1) return "#e56b6f"
          else if (d.pre_rank === -2) return "#ffbf69"
          else if (d.rank === d.pre_rank) return "#52b788"
          else if (d.rank < d.pre_rank) return "#ffbf69"
          else if (d.rank > d.pre_rank) return "#4ea8de"
        })
        .style("opacity", 0.7);
  bars
    .style("fill", "#52b788")
    .style("opacity", 0.7)
    .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr('width', d => x_scale(d.count)-x_scale(0)-1)
      .attr('y', d => y_scale(d.rank)+5)
      .style("fill",  d=> {
        if (d.rank === d.pre_rank) return "#52b788"
        else if (d.pre_rank === -1) return "#e56b6f"
        else if (d.pre_rank === -2) return "#ffbf69"
        else if (d.rank < d.pre_rank) return "#ffbf69"
        else if (d.rank > d.pre_rank) return "#4ea8de"
      })
      .style("opacity", 0.7);
  bars
    .exit()
    .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr('width', d => x_scale(d.count)-x_scale(0)-1)
      .attr('y', d => y_scale(top_ten+1)+5)
      .remove();
  let labels = svgPlot.selectAll('.label')
    .data(filteredData, d => d.name);

  labels
    .enter()
    .append('text')
    .attr('class', 'label')
    .attr('x', d => x_scale(d.count)-8)
    .attr('y', d => y_scale(top_ten+1)+5+((y_scale(1)-y_scale(0))/2))
    .style('text-anchor', 'end')
    .style("fill", "white")
    .html(d => d.name)    
    .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .style("fill", "white")
      .attr('y', d => y_scale(d.rank)+5+((y_scale(1)-y_scale(0))/2)+1);

  labels
    .transition()
    .duration(500)
      .ease(d3.easeLinear)
      .attr('x', d => x_scale(d.count)-8)
      .style("fill", "white")
      .attr('y', d => y_scale(d.rank)+5+((y_scale(1)-y_scale(0))/2)+1);

  labels
    .exit()
    .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr('x', d => x_scale(d.count)-8)
      .attr('y', d => y_scale(top_ten+1)+5)
      .remove();

  YearDisplay = h1
  if (YearDisplay >=1920 && YearDisplay < 1930) yearText.html(1920 + "s")
  if (YearDisplay >=1930 && YearDisplay < 1940) yearText.html(1930 + "s")
  if (YearDisplay >=1940 && YearDisplay < 1950) yearText.html(1940 + "s")
  if (YearDisplay >=1950 && YearDisplay < 1960) yearText.html(1950 + "s")
  if (YearDisplay >=1960 && YearDisplay < 1970) yearText.html(1960 + "s")
  if (YearDisplay >=1970 && YearDisplay < 1980) yearText.html(1970 + "s")
  if (YearDisplay >=1980 && YearDisplay < 1990) yearText.html(1980 + "s")
  if (YearDisplay >=1990 && YearDisplay < 2000) yearText.html(1990 + "s")
  if (YearDisplay >=2000 && YearDisplay < 2010) yearText.html(2000 + "s")
  if (YearDisplay >=2010 && YearDisplay < 2020) yearText.html(2010 + "s")
 
};

function halo(text, strokeWidth) {
  text.select(function() { return this.parentNode.insertBefore(this.cloneNode(true), this); })
    .style('fill', '#ffffff')
      .style( 'stroke','#ffffff')
      .style('stroke-width', strokeWidth)
      .style('stroke-linejoin', 'round')
      .style('opacity', 1);
};



