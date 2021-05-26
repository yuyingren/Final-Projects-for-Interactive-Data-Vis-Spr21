


/**
 * CONSTANTS AND GLOBALS
 * */
 width = 600,
 height = 500,
 margin = { top: 40, bottom: 60, left: 60, right: 30 };




let state = {
 // + INITIALIZE STATE
  regular: null,
  odd: null,
  Uregular: null,
  Uodd: null,
  hover: {
    screenPosition: null, // will be array of [x,y] once mouse is hovered on something
    hoverY: null,
    hoverC: null,
    hoverMC: null,
    hoverFC: null, // will be array of [long, lat] once mouse is hovered on something
    hoverN: null,
    hoverG: null,
    visible: false,
  },
  SelectData: null,
  SelectN: "Elsa",
  IniN: "Chris",

};

/**
* LOAD DATA
* */
Promise.all([
  d3.csv("../data/uniname.csv", (d) => {
    const formattedObj = {
      
      
      year: d.year,
      name: d.name,
      countM: +d.countM,
      countF: +d.countF,
      countT: +d.totalcount,
      pattern: d.pattern,
      gender: d.gender,
      
    }
      return formattedObj
    }),

  d3.csv("../data/fmnames.csv", (d) => {
    const formattedObj = {
      
      
      year: d.year,
      name: d.name,
      count: +d.count,
      pattern: d.pattern,
      gender: d.gender,
      
    }
      return formattedObj
    }) 
])
  .then(([uni, fm]) => {
    //console.log(data)
    /*state.regular = Array.from(d3.group(fm, d => d.pattern, d => d.name).get("regular"))
    state.odd = Array.from(d3.group(fm, d => d.pattern, d => d.name).get("odd"))
    state.Uregular = Array.from(d3.group(uni, d => d.pattern, d => d.name).get("regular"))
    state.Uodd = Array.from(d3.group(uni, d => d.pattern, d => d.name).get("odd"))*/

    state.regular = d3.group(fm, d => d.pattern, d => d.name).get("regular")
    state.odd = d3.group(fm, d => d.pattern, d => d.name).get("odd")
    state.Uregular = d3.group(uni, d => d.pattern, d => d.name).get("regular")
    state.Uodd = d3.group(uni, d => d.pattern, d => d.name).get("odd")
    
  Unireg(state.IniN);
  FModd(state.SelectN);
  
});


///////////////////// SCALE GROUP /////////////////////
//let formatYear = d3.timeFormat("%Y")

let xScale = d3.scaleBand()
  .range([margin.left, width - margin.right])
  
let yScale = d3.scaleLinear()
  .range([height - margin.bottom, margin.top])

formatNumber = d3.format(",d")


let colScaleF = d3.scaleLinear()
  .range(["#F9C8C8", "#EA4848"]);//#04a6c2

let colScaleM = d3.scaleLinear()
  .range(["#B1E5E7", "#267A7D"])


Y_ind = ['1920', '1930', '1940', '1950', '1960', '1970', '1980', '1990', '2000', '2010', '2020']

function colorFunc(d) {
  //console.log(d)
  if (d.gender === "female") return colScaleF(d.count);
  if  (d.gender === "male") return colScaleM(d.count);
}

function colUniFunc(d) {
  //console.log(d)
  if (d[2] === "Fcount") return colScaleF(d[3].countF);
  if  (d[2] === "Mcount") return colScaleM(d[3].countM);
}

///////////////////// SCALE GROUP /////////////////////

///////////////////// SVG GROUP /////////////////////
let oddPlot = d3.select("#vis3")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "oddchart");

let regPlot = d3.select("#vis4")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "regchart");
  
function getInputValue(){
  // Selecting the input element and get its value 
    state.SelectN = document.getElementById("typename").value;
   

    odd = Array.from(state.odd)
    reg = Array.from(state.regular)
    Uodd = Array.from(state.Uodd)
    Ureg = Array.from(state.Uregular)
    //console.log(keys.filter(d => state.SelectN === d[0]).length)
    
    
    if (reg.filter(d => state.SelectN === d[0]).length !==0) return FMreg(state.SelectN);
    if (odd.filter(d => state.SelectN === d[0]).length !== 0) return UpdateFModd(state.SelectN);
    if (Uodd.filter(d => state.SelectN === d[0]).length !== 0) return Uniodd(state.SelectN);
    if (Ureg.filter(d => state.SelectN === d[0]).length !==0) return updateUniReg(state.SelectN);
  
  console.log(state.SelectN);
}

let legend2Plot = d3.select("#legend2")
  .append("svg")
  .attr("width", 400)
  .attr("height", 50)

///////////////////// SVG GROUP /////////////////////

legend2Plot.append('rect')
  .attr("class", "legends")
  .attr("x", 20)
  .attr("y", 5)
  .attr("width", 30)
  .attr("height", 10)
  .attr("fill", "#EA4848")
legend2Plot.append('text')
  .attr("class", "legends")
  .attr("x", 60)
  .attr("y", 10)
  .text("count of female")
  .style("font-size", "16px")
  .attr("alignment-baseline", "middle")

legend2Plot.append('rect')
  .attr("class", "legends")
  .attr("x", 250)
  .attr("y", 5)
  .attr("width", 30)
  .attr("height", 10)
  .attr("fill", "#267A7D")
legend2Plot.append('text')
  .attr("class", "legends")
  .attr("x", 290)
  .attr("y", 10)
  .text("count of male")
  .style("font-size", "16px")
  .attr("alignment-baseline", "middle")


function FModd() {
  console.log(state.odd)
  let oddData = Array.from(state.odd)
  let getod = oddData.filter(d => state.SelectN === d[0])
  //console.log(getod[0])
 
  
  
  yScale
    .domain([0, d3.max(getod[0][1], d => d.count)]).nice()


  let xAxisScale = d3.scaleTime()
    .domain(d3.extent(Y_ind, d => new Date(+d, 0, 1)))
    .range([margin.left, width - margin.right])
  //console.log(d3.map(oddN[0], d => d.year))
  xScale
    .domain(d3.map(getod[0][1], d => d.year))

  


  // AXES
  let xAxis = d3.axisBottom(xAxisScale)
  let yAxis = d3.axisLeft(yScale)

  oddPlot.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(${0}, ${height-margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", 'xLabel')
    .text("year")
    .attr("transform", `translate(${width-margin.right}, ${40})`)
    .attr("text-anchor", "middle")
    .attr("font-size","14")
    .attr("fill","black")

  oddPlot.append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin.left-1}, ${0})`)
    .call(yAxis)
    .append("text")
    .attr("class", 'yLabel')
    .attr("transform", `translate(${-margin.left+40}, ${margin.top-20})`)
    .attr("text-anchor", "middle")
    .attr("font-size","14")
    .attr("fill","black")
    .text("population")


  oddPlot.append("text")
    .attr("class", "xTitle")
    .attr("x", width / 2)
    .attr("y", height)
    .attr("text-anchor", "middle")
    .attr("font-size","16")
    .attr("fill","black")
    .text("Names with odd Trend Pattern")
  

  oddBars = oddPlot.append("g")
    .attr("class", "uniHover")
    .selectAll('rect')
    .data(getod[0][1])
    .join("rect")
    .attr("class", "sinbars")
    .attr('x', d => xScale(d.year))
    .attr('width', (width-margin.left-margin.right) /110)
    .attr('y', d => yScale(d.count))
    .attr('height', d => height - yScale(d.count)-margin.bottom)
    .style('fill', d => colorFunc(d))
    .style("opacity", 1)


  oddbars = oddPlot.append("g")
    .attr("class", "uniregs")
    .selectAll('rect')
    .data(getod[0][1])
    .join("rect")
    .attr('x', d => xScale(d.year))
    .attr('width', (width-margin.left-margin.right) /110)
    .attr('y', d => yScale(d.count))
    .attr('height', d => height - yScale(d.count)-margin.bottom)
    .style('fill', "white")
    .style("opacity", 0)
    .on("mouseover", function(event, d) {
      console.log(d)
      xScale
        .domain(d3.map(getod[0][1], d => d.year))

      yScale
        .domain([0, d3.max(getod[0][1], d => d.count)]).nice()
      console.log(d.count)
      console.log(yScale(d.count))

      d3.select(this)
        .transition()
        .duration("50")
        .style("fill", "#ADADAD")
        .style("opacity", 1)

      
      oddPlot
        .append("line")
        .attr("class", "hover-line")
        .attr("x1", xScale(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("x2", xScale(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("y1", 0)
        .attr("y2", yScale(d.count))
        .attr("stroke", "#0A0A0A")
        .style("stroke-dasharray", ("5, 3"))
      oddPlot
        .append("circle")
        .attr("class", "hover-dot")
        .attr("cx", xScale(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("cy", 1.5)
        .attr("r", 3)
        .attr("fill", "#0A0A0A")
      
      xp = event.clientX
      
      state.hover= {
        screenPosition: xp,
        hoverY: d.year,
        hoverG: d.gender,
        hoverN: d.name,
        hoverC: d.count,
        visible: true}
      console.log(state.hover)
      hoverdraw();

      })

    .on("mouseout", function(event, d) {
      d3.select(this).transition()
        .duration("50")
        .style('fill', "white")
        .style("opacity", 0)
      state.hover.visible = false
      d3.selectAll("line.hover-line").remove()
      d3.selectAll("circle.hover-dot").remove()
      hoverdraw();
    });

}


function FMreg(inp) {
  console.log(state.regular)
  console.log(inp)
  regData = Array.from(state.regular)
  getreg = regData.filter(d => inp === d[0])
  console.log(getreg[0][1])
  regPlot.selectAll("g.uniregs").remove()
  regPlot.selectAll("g.uniHover").remove()
  

  yScale
    .domain([0, d3.max(getreg[0][1], d => d.count)]).nice()

  min_max = d3.extent(getreg[0][1], d => d.count)

  yAxis = d3.axisLeft(yScale)

  
  regPlot.select('.yAxis')
    .transition()
    .duration(500)
    .ease(d3.easeLinear)
    .call(yAxis)


  xScale
    .domain(d3.map(getreg[0][1], d => d.year))

  colScaleF
    .domain(d3.extent(getreg[0][1], d => d.count))
  colScaleM
    .domain(d3.extent(getreg[0][1], d => d.count))
 
    

  regbars = regPlot.append("g")
    .attr("class", "uniHover")
    .selectAll("g")
    .data(getreg[0][1])
    .join("rect")
    .attr("class", "sinbars")
    .attr('x', d => xScale(d.year))
    .attr('width', (width-margin.left-margin.right) /110)
    .attr('y', d => yScale(d.count))
    .attr('height', d => height - yScale(d.count)-margin.bottom)
    .style('fill', d => colorFunc(d))
    .style("opacity", 1)

  regBars = regPlot.append("g")
    .attr("class", "uniregs")
    .selectAll("rect")
    .data(getreg[0][1])
    .join("rect")
    .attr('x', d => xScale(d.year))
    .attr('width', (width-margin.left-margin.right) /110)
    .attr('y', d => yScale(d.count))
    .attr('height', d => height - yScale(d.count)-margin.bottom)
    .style('fill', "white")
    .style("opacity", 0)
    .on("mouseover", function(event, d) {
      //console.log(d)
      xScale
        .domain(d3.map(getreg[0][1], d => d.year))

      yScale
        .domain([0, d3.max(getreg[0][1], d => d.count)]).nice()
      //console.log(d.count)
      //console.log(yScale(d.count))

      d3.select(this)
        .transition()
        .duration("50")
        .style("fill", "#ADADAD")
        .style("opacity", 1)

      regPlot
        .append("line")
        .attr("class", "hover-line")
        .attr("x1", xScale(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("x2", xScale(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("y1", 0)
        .attr("y2", yScale(d.count))
        .attr("stroke", "#0A0A0A")
        .style("stroke-dasharray", ("5, 3"))
      regPlot
        .append("circle")
        .attr("class", "hover-dot")
        .attr("cx", xScale(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("cy", 1.5)
        .attr("r", 3)
        .attr("fill", "#0A0A0A")
      
      xp = event.clientX
      //yp = yScale(d.count)
      
      state.hover= {
        screenPosition: xp,
        hoverY: d.year,
        hoverG: d.gender,
        hoverN: d.name,
        hoverC: d.count,
        visible: true}
      console.log(state.hover)
      hoverdraw();

      })

    .on("mouseout", function(event, d) {
      d3.select(this).transition()
        .duration("50")
        .style('fill', "white")
        .style("opacity", 0)
      state.hover.visible = false
      d3.selectAll("line.hover-line").remove()
      d3.selectAll("circle.hover-dot").remove()
      hoverdraw();
    });

    
    
  
}

function Uniodd(inp) {
  console.log(state.Uodd)
  oddData = Array.from(state.Uodd)
  getod = oddData.filter(d => inp === d[0])
  console.log(getod[0][1])

  oddPlot.selectAll("g.uniregs").remove()
  oddPlot.selectAll("g.uniHover").remove()

  let stack = d3.stack()
    .keys(["countM", "countF"])
    (getod[0][1]);
  console.log("seriesPop:", stack)

  datacall = stack.map(function(d, i) {
    if (i === 0) return d.map(function(d1) {
      return [d1[0], d1[1], "Mcount", d1.data]});
    if (i === 1) return d.map(function(d1) {
      return [d1[0], d1[1], "Fcount", d1.data]});
  })


  yScale
    .domain([0, d3.max(stack, d => d3.max(d, d => d[1]))]).nice()

  yAxis = d3.axisLeft(yScale)

  oddPlot.select('.yAxis')
    .transition()
    .duration(500)
    .ease(d3.easeLinear)
    .call(yAxis)
    

  xScale
    .domain(d3.map(getod[0][1], d => d.year))

  Mmaxmin = [d3.min(getod[0][1], d => d.countM), d3.max(getod[0][1], d => d.countM)]
  Fmaxmin = [d3.min(getod[0][1], d => d.countF), d3.max(getod[0][1], d => d.countF)]
  console.log(Mmaxmin)

  colScaleF
    .domain(Fmaxmin)
  colScaleM
    .domain(Mmaxmin)

  uniodds = oddPlot.append("g")
    .attr("class", "uniregs")
    .selectAll("g")
    .data(datacall)
    .join("g")
    .attr("class", "unis")
    
  console.log(datacall)

  uniodds
    .selectAll('rect')
    .data(d=>d)
    .join("rect")
    .attr('x', d => xScale(d[3].year))
    .attr('width', (width-margin.left-margin.right) /110)
    .attr('y', d => yScale(d[1]))
    .attr('height', d => yScale(d[0]) - yScale(d[1]))
    .style('fill', d => colUniFunc(d))
    .style("opacity", 1)


    
  oddhover = oddPlot.append("g")
    .attr("class", "uniHover")
    .selectAll('rect')
    .data(getod[0][1])
    .join("rect")
    .attr("class", "rectuni")
    .attr('x', d => xScale(d.year))
    .attr('width', (width-margin.left-margin.right) /110)
    .attr('y', d => yScale(d.countT))
    .attr('height', d => height - yScale(d.countT)-margin.bottom)
    .style('fill', "white")
    .style("opacity", 0)
    .on("mouseover", function(event, d) {
      d3.select(this)
        .transition()
        .duration("50")
        .style("fill", "#ADADAD")
        .style("opacity", 1)

      xScale
        .domain(getod[0][1].map(d => d.year))
      oddPlot
        .append("line")
        .attr("class", "hover-line")
        .attr("x1", xScale(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("x2", xScale(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("y1", 0)
        .attr("y2", yScale(d.countT))
        .attr("stroke", "#0A0A0A")
        .style("stroke-dasharray", ("5, 3"))

      oddPlot
        .append("circle")
        .attr("class", "hover-dot")
        .attr("cx", xScale(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("cy", 1.5)
        .attr("r", 3)
        .attr("fill", "#0A0A0A")

      yScale
        .domain([0, d3.max(stack, d => d3.max(d, d => d[1]))]).nice()
    
      xp = event.clientX
      
      state.hover= {
        screenPosition: xp,
        hoverY: d.year,
        hoverG: d.gender,
        hoverN: d.name,
        hoverC: d.countT,
        hoverMC: d.countM,
        hoverFC: d.countF,
        visible: true}
      console.log(state.hover)
      hoverdraw1();

      })

    .on("mouseout", function(event, d) {
      d3.select(this).transition()
        .duration("50")
        .style('fill', "white")
        .style("opacity", 0)
      state.hover.visible = false
      d3.selectAll("line.hover-line").remove()
      d3.selectAll("circle.hover-dot").remove()
      hoverdraw1();
    });
  
}

function Unireg(inp) {
  console.log(state.Uregular)
  let regData = Array.from(state.Uregular)
  let getreg = regData.filter(d => inp === d[0])
  console.log(getreg[0][1])

  let stack = d3.stack()
    .keys(["countM", "countF"])
    (getreg[0][1]);
  console.log("seriesPop:", stack)

  let datacall = stack.map(function(d, i) {
    if (i === 0) return d.map(function(d1) {
      return [d1[0], d1[1], "Mcount", d1.data]});
    if (i === 1) return d.map(function(d1) {
      return [d1[0], d1[1], "Fcount", d1.data]});
  })
  //console.log(d3.max(stack, d => d3.max(d, d => d[1])))
  yScale
    .domain([0, d3.max(stack, d => d3.max(d, d => d[1]))]).nice()
    
  let xAxisScale = d3.scaleTime()
    .domain(d3.extent(Y_ind, d => new Date(+d, 0, 1)))
    .range([margin.left, width - margin.right])
  //console.log(d3.map(oddN[0], d => d.year))
  
  //colScaleR
  //  .domain(d3.extent(getreg[0][1], d => d.count))


  // AXES
  let xAxis = d3.axisBottom(xAxisScale)
  
  let yAxisReg = d3.axisLeft(yScale)

  
  regPlot.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(${0}, ${height-margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", 'xLabel')
    .text("year")
    .attr("transform", `translate(${width-margin.right}, ${40})`)
    .attr("text-anchor", "middle")
    .attr("font-size","14")
    .attr("fill","black")


  regPlot.append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin.left-1}, ${0})`)
    .call(yAxisReg)
    .append("text")
    .attr("class", 'yLabel')
    .attr("transform", `translate(${-margin.left+40}, ${margin.top-20})`)
    .attr("text-anchor", "middle")
    .attr("font-size","14")
    .attr("fill","black")
    .text("population")


  regPlot.append("text")
    .attr("class", "xTitle")
    .attr("x", width / 2)
    .attr("y", height)
    .attr("text-anchor", "middle")
    .attr("font-size","16")
    .attr("fill","black")
    .text("Names with normal Trend Pattern")

  xScale
    .domain(getreg[0][1].map(d => d.year))


  Mmaxmin = [d3.min(getreg[0][1], d => d.countM), d3.max(getreg[0][1], d => d.countM)]
  Fmaxmin = [d3.min(getreg[0][1], d => d.countF), d3.max(getreg[0][1], d => d.countF)]
  console.log(Mmaxmin)

  colScaleF
    .domain(Fmaxmin)
  colScaleM
    .domain(Mmaxmin)

  

  uniregs = regPlot.append("g")
    .attr("class", "uniregs")
    .selectAll("g")
    .data(datacall)
    .join("g")
    .attr("class", "unis")
  
  console.log(datacall)

  uniregs
    .selectAll('rect')
    .data(d=>d)
    .join("rect")
    .attr('x', d => xScale(d[3].year))
    .attr('width', (width-margin.left-margin.right) /110)
    .attr('y', d => yScale(d[1]))
    .attr('height', d => yScale(d[0]) - yScale(d[1]))
    .style('fill', d => colUniFunc(d))
    .style("opacity", 1)

  
  //console.log(regPlot.selectAll("rect.rectuni"))
  //console.log(regPlot.select("g.uniregs"))
  //regPlot.select("g.uniregs").remove() 
    
  unihover = regPlot.append("g")
    .attr("class", "uniHover")
    .selectAll('rect')
    .data(getreg[0][1])
    .join("rect")
    .attr("class", "rectuni")
    .attr('x', d => xScale(d.year))
    .attr('width', (width-margin.left-margin.right) /110)
    .attr('y', d => yScale(d.countT))
    .attr('height', d => height - yScale(d.countT)-margin.bottom)
    .style('fill', "white")
    .style("opacity", 0)
    .on("mouseover", function(event, d) {
      d3.select(this)
        .transition()
        .duration("50")
        .style("fill", "#ADADAD")
        .style("opacity", 1)

      xScale
        .domain(getreg[0][1].map(d => d.year))
      regPlot
        .append("line")
        .attr("class", "hover-line")
        .attr("x1", xScale(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("x2", xScale(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("y1", 0)
        .attr("y2", yScale(d.countT))
        .attr("stroke", "#0A0A0A")
        .style("stroke-dasharray", ("5, 3"))
      regPlot
        .append("circle")
        .attr("class", "hover-dot")
        .attr("cx", xScale(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("cy", 1.5)
        .attr("r", 3)
        .attr("fill", "#0A0A0A")

      yScale
        .domain([0, d3.max(stack, d => d3.max(d, d => d[1]))]).nice()
    
      xp = event.clientX
      
      state.hover= {
        screenPosition: xp,
        hoverY: d.year,
        hoverG: d.gender,
        hoverN: d.name,
        hoverC: d.countT,
        hoverMC: d.countM,
        hoverFC: d.countF,
        visible: true}
      console.log(state.hover)
      hoverdraw1();

      })

    .on("mouseout", function(event, d) {
      d3.select(this).transition()
        .duration("50")
        .style('fill', "white")
        .style("opacity", 0)
      state.hover.visible = false
      d3.selectAll("line.hover-line").remove()
      d3.selectAll("circle.hover-dot").remove()
      hoverdraw1();
    });
}


function updateUniReg(inp) {
  regData = Array.from(state.Uregular)
  getreg = regData.filter(d => inp === d[0])
  console.log(getreg[0][1])

  regPlot.selectAll("g.uniregs").remove()
  regPlot.selectAll("g.uniHover").remove()

  let stack = d3.stack()
    .keys(["countM", "countF"])
    (getreg[0][1]);
  console.log("seriesPop:", stack)

  let datacall = stack.map(function(d, i) {
    if (i === 0) return d.map(function(d1) {
      return [d1[0], d1[1], "Mcount", d1.data]});
    if (i === 1) return d.map(function(d1) {
      return [d1[0], d1[1], "Fcount", d1.data]});
  })
  

  yScale
    .domain([0, d3.max(stack, d => d3.max(d, d => d[1]))]).nice()
 

  xScale
    .domain(getreg[0][1].map(d => d.year))

  Mmaxmin = [d3.min(getreg[0][1], d => d.countM), d3.max(getreg[0][1], d => d.countM)]
  Fmaxmin = [d3.min(getreg[0][1], d => d.countF), d3.max(getreg[0][1], d => d.countF)]
  console.log(Mmaxmin)

  colScaleF
    .domain(Fmaxmin)
  colScaleM
    .domain(Mmaxmin)

  
  yAxis = d3.axisLeft(yScale)

  regPlot.select('.yAxis')
    .transition()
    .duration(500)
    .ease(d3.easeLinear)
    .call(yAxis)

 uniregs = regPlot.append("g")
    .attr("class", "uniregs")
    .selectAll("g")
    .data(datacall)
    .join("g")
    .attr("class", "unis")
    
  console.log(datacall)

  uniregs
    .selectAll('rect')
    .data(d=>d)
    .join("rect")
    .attr('x', d => xScale(d[3].year))
    .attr('width', (width-margin.left-margin.right) /110)
    .attr('y', d => yScale(d[1]))
    .attr('height', d => yScale(d[0]) - yScale(d[1]))
    .style('fill', d => colUniFunc(d))
    .style("opacity", 1)


  unihover = regPlot.append("g")
    .attr("class", "uniHover")
    .selectAll('rect')
    .data(getreg[0][1])
    .join("rect")
    .attr("class", "rectuni")
    .attr('x', d => xScale(d.year))
    .attr('width', (width-margin.left-margin.right) /110)
    .attr('y', d => yScale(d.countT))
    .attr('height', d => height - yScale(d.countT)-margin.bottom)
    .style('fill', "white")
    .style("opacity", 0)
    .on("mouseover", function(event, d) {
      d3.select(this)
        .transition()
        .duration("50")
        .style("fill", "#ADADAD")
        .style("opacity", 1)

      xScale
        .domain(getreg[0][1].map(d => d.year))
      regPlot
        .append("line")
        .attr("class", "hover-line")
        .attr("x1", xScale(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("x2", xScale(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("y1", 0)
        .attr("y2", yScale(d.countT))
        .attr("stroke", "#0A0A0A")
        .style("stroke-dasharray", ("5, 3"))
      regPlot
        .append("circle")
        .attr("class", "hover-dot")
        .attr("cx", xScale(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("cy", 1.5)
        .attr("r", 3)
        .attr("fill", "#0A0A0A")

      yScale
        .domain([0, d3.max(stack, d => d3.max(d, d => d[1]))]).nice()
    
      xp = event.clientX
      
      state.hover= {
        screenPosition: xp,
        hoverY: d.year,
        hoverG: d.gender,
        hoverN: d.name,
        hoverC: d.countT,
        hoverMC: d.countM,
        hoverFC: d.countF,
        visible: true}
      console.log(state.hover)
      hoverdraw1();

      })

    .on("mouseout", function(event, d) {
      d3.select(this).transition()
        .duration("50")
        .style('fill', "white")
        .style("opacity", 0)
      state.hover.visible = false
      d3.selectAll("line.hover-line").remove()
      d3.selectAll("circle.hover-dot").remove()
      hoverdraw1();
    });
}
  

function UpdateFModd() {
  console.log(state.odd)
  let oddData = Array.from(state.odd)
  let getod = oddData.filter(d => state.SelectN === d[0])
  //console.log(getod[0])
  oddPlot.selectAll("g.uniregs").remove()
  oddPlot.selectAll("g.uniHover").remove()
 
  yScale
    .domain([0, d3.max(getod[0][1], d => d.count)]).nice()

  
  xScale
    .domain(d3.map(getod[0][1], d => d.year))

  //let min_max = d3.extent(getO[0][1], d => d.count)
  //console.log(min_max)
  colScaleF
    .domain(d3.extent(getod[0][1], d => d.count))
  colScaleM
    .domain(d3.extent(getod[0][1], d => d.count))


  // AXES
  
  let yAxis = d3.axisLeft(yScale)


  oddPlot.select('.yAxis')
    .transition()
    .duration(500)
    .ease(d3.easeLinear)
    .call(yAxis)

  oddBars = oddPlot.append("g")
    .attr("class", "uniHover")
    .selectAll('rect')
    .data(getod[0][1])
    .join("rect")
    .attr("class", "sinbars")
    .attr('x', d => xScale(d.year))
    .attr('width', (width-margin.left-margin.right) /110)
    .attr('y', d => yScale(d.count))
    .attr('height', d => height - yScale(d.count)-margin.bottom)
    .style('fill', d => colorFunc(d))
    .style("opacity", 1)

  oddbars = oddPlot.append("g")
    .attr("class", "uniregs")
    .selectAll('rect')
    .data(getod[0][1])
    .join("rect")
    .attr('x', d => xScale(d.year))
    .attr('width', (width-margin.left-margin.right) /110)
    .attr('y', d => yScale(d.count))
    .attr('height', d => height - yScale(d.count)-margin.bottom)
    .style('fill', "white")
    .style("opacity", 0)
    .on("mouseover", function(event, d) {
      //console.log(d)
      xScale
        .domain(d3.map(getod[0][1], d => d.year))

      yScale
        .domain([0, d3.max(getod[0][1], d => d.count)]).nice()
      //console.log(d.count)
      //console.log(yScale(d.count))
      d3.select(this)
        .transition()
        .duration("50")
        .style("fill", "#ADADAD")
        .style("opacity", 1)

      oddPlot
        .append("line")
        .attr("class", "hover-line")
        .attr("x1", xScale(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("x2", xScale(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("y1", 0)
        .attr("y2", yScale(d.count))
        .attr("stroke", "#0A0A0A")
        .style("stroke-dasharray", ("5, 3"))
      oddPlot
        .append("circle")
        .attr("class", "hover-dot")
        .attr("cx", xScale(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("cy", 1.5)
        .attr("r", 3)
        .attr("fill", "#0A0A0A")
      
      xp = event.clientX
      //yp = yScale(d.count)
      
      state.hover= {
        screenPosition: xp,
        hoverY: d.year,
        hoverG: d.gender,
        hoverN: d.name,
        hoverC: d.count,
        visible: true}
      console.log(state.hover)
      hoverdraw();

      })

    .on("mouseout", function(event, d) {
      d3.select(this).transition()
        .duration("50")
        .style('fill', "white")
        .style("opacity", 0)
      state.hover.visible = false
      d3.selectAll("line.hover-line").remove()
      d3.selectAll("circle.hover-dot").remove()
      hoverdraw();
    });

}

  

function hoverdraw() {
  
  d3.select("#vis3")
    .selectAll("div.hover-content")
    .data([state.hover])
    .join("div")
    .attr("class", 'hover-content')
      .classed("visible", d=> d.visible)
      .style("position", 'absolute')
      .style("transform", d=> {
        // only move if we have a value for screenPosition
        //console.log("screenPosiiton", d.screenPosition)
        
        if (d.screenPosition)
        return `translate(${d.screenPosition-150}px, ${-45}px)`
      })
      .html(d=>
            
        `<div>
        ${d.hoverN}, ${d.hoverG} name
        </div>
        <div>
        count: ${formatNumber(d.hoverC)} year: ${d.hoverY}
        </div>
        `)
}

function hoverdraw1() {


    
  d3.select("#vis4")
    .selectAll("div.hover-contentR")
    .data([state.hover])
    .join("div")
    .attr("class", 'hover-contentR')
      .classed("visible", d=> d.visible)
      .style("position", 'absolute')
      .style("transform", d=> {
        // only move if we have a value for screenPosition
        //console.log("screenPosiiton", d.screenPosition)
        if (d.screenPosition)
        return `translate(${d.screenPosition -150}px, ${-45}px)`
      })
      .html(d=> 

        
        `<div>
        ${d.hoverN}, ${d.hoverG} name, year: ${d.hoverY}
        </div>
        
        <div>
        female: ${formatNumber(d.hoverFC)}, male: ${formatNumber(d.hoverMC)}, total: ${formatNumber(d.hoverC)}
        </div>
        `)



}

