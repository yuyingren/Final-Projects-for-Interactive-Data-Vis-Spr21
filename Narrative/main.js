

/**
 * CONSTANTS AND GLOBALS
 * */
let width = 600,
 height = 500,
 margin = { top: 40, bottom: 60, left: 60, right: 30 };



let state2 = {
 // + INITIALIZE STATE
  data: null,
  hover: {
    screenPosition: null, // will be array of [x,y] once mouse is hovered on something
    newYear: null,
    topCount: null, // will be array of [long, lat] once mouse is hovered on something
    bottomCount: null,
    visible: false,
  },
  SelectData: null,
  selectedG: "F",

};

/**
* LOAD DATA
* */
d3.csv("../data/NameStat.csv", (d) => {
  const formattedObj = {
    gender: d.gender,
    Tcount: +d.totalcount,
    year: d.year,
    countTen: +d.count_ten,
    countNine: +d.count_ninety,
    Tpop: +d.totalpop,
    popTen: +d.pop_ten,
    popNine: +d.pop_ninety,
    gen: d.gen
  }
  return formattedObj
})
  .then(data => {
    state2.data = data;
    dataGender = d3.group(data, d => d.gender)
    state2.SelectData = dataGender.get("F");
    console.log(state2)
    init();
  });


///////////////////// SCALE GROUP /////////////////////

let xScale2 = d3.scaleBand()
  .range([margin.left, width - margin.right])
  
let yScale2 = d3.scaleLinear()
  .range([height - margin.bottom, margin.top])

let formatNumber = d3.format(",d")

let colorScale = d3.scaleOrdinal()
  .domain(["ten", "ninety"])
  .range(["#8CA5BA", "#F08080"])

let Y_ind = ['1920', '1930', '1940', '1950', '1960', '1970', '1980', '1990', '2000', '2010', '2020']

///////////////////// SCALE GROUP /////////////////////

///////////////////// SVG GROUP /////////////////////
let CountPlot = d3.select("#vis1")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "countchart");

let PopPlot = d3.select("#vis2")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "popchart");

let legendPlot = d3.select("#legend1")
  .append("svg")
  .attr("width", 680)
  .attr("height", 50)
  
///////////////////// SVG GROUP /////////////////////
legendPlot.append('rect')
  .attr("class", "legends")
  .attr("x", 20)
  .attr("y", 5)
  .attr("width", 30)
  .attr("height", 10)
  .attr("fill", "#F08080")
legendPlot.append('text')
  .attr("class", "legends")
  .attr("x", 60)
  .attr("y", 10)
  .text("count & population of top 10% names")
  .style("font-size", "14px")
  .attr("alignment-baseline", "middle")

legendPlot.append('rect')
  .attr("class", "legends")
  .attr("x", 350)
  .attr("y", 5)
  .attr("width", 30)
  .attr("height", 10)
  .attr("fill", "#8CA5BA")
legendPlot.append('text')
  .attr("class", "legends")
  .attr("x", 390)
  .attr("y", 10)
  .text("count & population of bottom 90% names")
  .style("font-size", "14px")
  .attr("alignment-baseline", "middle")





function init() {
  const iniData = d3.group(state2.SelectData, d => d.gen).get("decade")
  const iniData1 = d3.group(state2.SelectData, d => d.gen).get("regular")
  //console.log(iniData1)
  console.log(iniData)
  
  CountStack = d3.stack()
    .keys(["countTen", "countNine"])
    (iniData1);
  
  DataCallcount = CountStack.map(function(d, i) {
    if (i === 0) return d.map(function(d1) {
      return [d1[0], d1[1], "ten", d1.data]});
    if (i === 1) return d.map(function(d1) {
      return [d1[0], d1[1], "ninety", d1.data]});
  })
  madeline = []
  Y_ind.map(function(d) {
    return madeline.push([d, 0])
  })
  console.log(madeline)


  yScale2
    .domain([0, d3.max(CountStack, d => d3.max(d, d => d[1]))]).nice()
    
  //console.log(d3.extent(Countseries, d => d3.max(d, d => d[1])))
  let xAxisScale = d3.scaleTime()
    .domain(d3.extent(Y_ind, d => new Date(+d, 0, 1)))
    .range([margin.left, width - margin.right])

  let LineFunc = d3.line()
    .x(d => xAxisScale(new Date(+d.year, 0, 1)))
    .y(d => yScale2(d.Tcount))
  //console.log(LineFunc(iniData))
  //console.log(xAxisScale(new Date(+[iniData][0][0].year, 0, 1)))

  // AXES
  let xAxis = d3.axisBottom(xAxisScale)
  let yAxis = d3.axisLeft(yScale2)
  
  CountPlot.append("g")
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

  CountPlot.append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin.left-1}, ${0})`)
    .call(yAxis.ticks(10, "s"))
    .append("text")
    .attr("class", 'yLabel')
    .attr("transform", `translate(${-margin.left+25}, ${margin.top-20})`)
    .attr("text-anchor", "middle")
    .attr("font-size","14")
    .attr("fill","black")
    .text("count")

  CountPlot.append("text")
    .attr("class", "xTitle")
    .attr("x", width / 2)
    .attr("y", height)
    .attr("text-anchor", "middle")
    .attr("font-size","16")
    .attr("fill","black")
    .text("Number of Unique Names from 1920~2019")
  
  

  xScale2
    .domain(iniData1.map(d => d.year))

  barCount = CountPlot.append("g")
    .attr("class", "barPlot")
    .selectAll("g")
    .data(DataCallcount)
    .join("g")
    .attr("class", "bars")
    

  barCount
    .selectAll('rect')
    .data(d=>d)
    .join("rect")
    .attr('class', d => `${d[2]}`)
    .attr('x', d => xScale2(d[3].year))
    .attr('width', (width-margin.left-margin.right) /110)
    .attr('y', height-margin.bottom)
    .style('fill', d => colorScale(d[2]))
    .attr('height', 0)
    .style("opacity", 0)

  CountPlot.selectAll("rect.ten")
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .delay(500)
      .attr('y', d => yScale2(d[1]))
      .attr('height', d => yScale2(d[0]) - yScale2(d[1]))
      .style("opacity", 1)
    

  CountPlot.selectAll("rect.ninety")
    .attr('y', d => yScale2(d[0]))
    .transition()
    .duration(800)
    .ease(d3.easeLinear)
    .delay(5000)
    .attr('y', d => yScale2(d[1]))
    .attr('height', d => yScale2(d[0]) - yScale2(d[1]))
    .style("opacity", 1)
  console.log(CountPlot)
    
  barhover = CountPlot.append("g")
    .attr("class", "barHover")
    .selectAll('rect')
    .data(iniData1)
    .join("rect")
    .attr("class", "rects")
    .attr('x', d => xScale2(d.year))
    .attr('width', (width-margin.left-margin.right) /110)
    .attr('y', d => yScale2(d.Tcount))
    .attr('height', d => height - yScale2(d.Tcount)-margin.bottom)
    .style('fill', "white")
    .style("opacity", 0)
    .on("mouseover", function(event, d) {

      
      d3.select(this)
        .transition()
        .duration("50")
        .style("opacity", 0.3)


      xScale2
        .domain(iniData1.map(d => d.year))

      yScale2
        .domain([0, d3.max(CountStack, d => d3.max(d, d => d[1]))]).nice()

      CountPlot
        .append("line")
        .attr("class", "hover-line")
        .attr("x1", xScale2(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("x2", xScale2(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("y1", 0)
        .attr("y2", yScale2(d.Tcount))
        .attr("stroke", "#0A0A0A")
        .style("stroke-dasharray", ("5, 3"))
      CountPlot
        .append("circle")
        .attr("class", "hover-dot")
        .attr("cx", xScale2(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("cy", 0)
        .attr("r", 3)
        .attr("fill", "#0A0A0A")
      console.log(event.offsetY)
      console.log(event.clientY)

      xp = event.clientX
      
      state2.hover= {
        screenPosition: xp,
        newYear: d.year,
        topCount: d.countNine,
        bottomCount: d.countTen,
        visible: true}
      console.log(state2.hover)
      hoverdraw2();

      })

    .on("mouseout", function(event, d) {
      d3.select(this).transition()
        .duration("50")
        .style('fill', "white")
        .style("opacity", 0)
      state2.hover.visible = false
      d3.selectAll("line.hover-line").remove()
      d3.selectAll("circle.hover-dot").remove()
      hoverdraw2();
    });

  //console.log(CountPlot.selectAll("rect.rects"))
  let LineFuncMade = d3.line()
    .x(d => xAxisScale(new Date(+d[0], 0, 1)))
    .y(d => yScale2(d[1]))

  countLine = CountPlot.append("g")
    .selectAll("path")  
    .data([madeline])
    .enter()
    .append("path")
    .attr("class", "countline")
      .attr("d", d => LineFuncMade(d))
      .attr("stroke", "white")
      .style("opacity", 0)
      .attr("stroke-width", "0px")
      .attr("fill", "none")

  countLine
  .data([iniData])
  .transition()
  .duration(1000)
  .ease(d3.easeLinear)
  .delay(9000)
    .attr("d", d => LineFunc(d))
    .attr("stroke", "#168aad")
      .style("opacity", 1)
      .attr("stroke-width", "2px")
      .attr("fill", "none")   
  
  
  
  let PopStack = d3.stack()
    .keys(["popTen", "popNine"])
    (iniData1);
  console.log("seriesPop:", PopStack)

  let DataCallpop = PopStack.map(function(d, i) {
    if (i === 0) return d.map(function(d1) {
      return [d1[0], d1[1], "ten", d1.data]});
    if (i === 1) return d.map(function(d1) {
      return [d1[0], d1[1], "ninety", d1.data]});
  })

  yScale2
    .domain([0, d3.max(PopStack, d => d3.max(d, d => d[1]))]).nice()
    
  
  let yAxisP = d3.axisLeft(yScale2)


  
  PopPlot.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(${0}, ${height-margin.bottom})`)
    .call(xAxis)
    .append("text")
    .attr("class", 'xLabel')
    .text("year")
    .attr("transform", `translate(${width-30}, ${40})`)
    .attr("text-anchor", "middle")
    .attr("font-size","14")
    .attr("fill","black")

  PopPlot.append("text")
    .attr("class", "xTitle")
    .attr("x", width / 2)
    .attr("y", height)
    .attr("text-anchor", "middle")
    .attr("font-size","16")
    .attr("fill","black")
    .text("Number people with top 10% names")



  PopPlot.append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin.left-1}, ${0})`)
    .call(yAxisP.ticks(10, "s"))
    .append("text")
    .attr("class", 'yLabel')
    .attr("transform", `translate(${-margin.left+40}, ${margin.top-20})`)
    .attr("text-anchor", "middle")
    .attr("font-size","14")
    .attr("fill","black")
    .text("population")

  xScale2
    .domain(iniData1.map(d => d.year))

  barPop = PopPlot.append("g")
    .attr("class", "barPlot")
    .selectAll("g")
    .data(DataCallpop)
    .join("g")
    .attr("class", "pops")
    

  barPop
    .selectAll('rect')
    .data(d=>d)
    .join("rect")
    .attr('class', d => `${d[2]}`)
    .attr('x', d => xScale2(d[3].year))
    .attr('width', (width-margin.left-margin.right) /110)
    .attr('y', height-margin.bottom)
    .style('fill', d => colorScale(d[2]))
    .style("opacity", 0)
    .attr('height', 0)

  PopPlot.selectAll("rect.ten")
    .transition()
    .duration(800)
    .ease(d3.easeLinear)
    .delay(3000)
    .attr('y', d => yScale2(d[1]))
    .attr('height', d => yScale2(d[0]) - yScale2(d[1]))
    .style("opacity", 1)
    //.style('fill', d => colorScale(d[2]))
    //

  PopPlot.selectAll("rect.ninety")
    .attr('y', d => yScale2(d[0]))
    .transition()
    .duration(2000)
    .ease(d3.easeLinear)
    .delay(6500)
    .attr('y', d => yScale2(d[1]))
    .attr('height', d => yScale2(d[0]) - yScale2(d[1]))
    .style("opacity", 1)
    
    
    
  pophover = PopPlot.append("g")
    .attr("class", "barHover")
    .selectAll('rect')
    .data(iniData1)
    .join("rect")
    .attr("class", "rectpop")
    .attr('x', d => xScale2(d.year))
    .attr('width', (width-margin.left-margin.right) /110)
    .attr('y', d => yScale2(d.Tpop))
    .attr('height', d => height - yScale2(d.Tpop)-margin.bottom)
    .style('fill', "white")
    .style("opacity", 0)
    .on("mouseover", function(event, d) {
      d3.select(this)
        .transition()
        .duration("50")
        .style("opacity", 0.3)

        yScale2
        .domain([0, d3.max(PopStack, d => d3.max(d, d => d[1]))]).nice()

      PopPlot
        .append("line")
        .attr("class", "hover-line")
        .attr("x1", xScale2(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("x2", xScale2(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("y1", 0)
        .attr("y2", yScale2(d.Tpop))
        .attr("stroke", "#0A0A0A")
        .style("stroke-dasharray", ("5, 3"))
    
    
      PopPlot
        .append("circle")
        .attr("class", "hover-dot")
        .attr("cx", xScale2(d.year)+ ((width-margin.left-margin.right) /220))
        .attr("cy", 0)
        .attr("r", 3)
        .attr("fill", "#0A0A0A")
      
      xp = event.clientX
     
      state2.hover= {
        screenPosition: xp,
        newYear: d.year,
        topCount: d.popNine,
        bottomCount: d.popTen,
        visible: true}
      //console.log(state2.hover)
      hoverdraw3();
      

    })

    .on("mouseout", function(event, d) {
      d3.select(this).transition()
        .duration("50")
        .style('fill', "white")
        .style("opacity", 0)
      state2.hover.visible = false
      d3.selectAll("line.hover-line").remove()
      d3.selectAll("circle.hover-dot").remove()
      hoverdraw3();
    });


  LineFuncMade = d3.line()
    .x(d => xAxisScale(new Date(+d[0], 0, 1)))
    .y(d => yScale2(d[1]))

  popLine = PopPlot.append("g")
    .selectAll("path")  
    .data([madeline])
    .enter()
    .append("path")
    .attr("class", "countline")
      .attr("d", d => LineFuncMade(d))
      .attr("stroke", "white")
      .style("opacity", 0)
      .attr("stroke-width", "0px")
      .attr("fill", "none")

  LineFunc = d3.line()
    .x(d => xAxisScale(new Date(+d.year, 0, 1)))
    .y(d => yScale2(d.Tpop))

  popLine
  .data([iniData])
  .transition()
  .duration(1000)
  .ease(d3.easeLinear)
  .delay(9000)
    .attr("d", d => LineFunc(d))
    .attr("stroke", "#168aad")
      .style("opacity", 1)
      .attr("stroke-width", "2px")
      .attr("fill", "none")   
    
  

  const selectGender = d3.select("#dropdown")
  selectGender
    .selectAll("option")
    .data([{key: "F", label: "Female"}, 
      {key: "M", label: "Male"}])
    .join("option")
    .attr("value", d => d.key) 
    .text(d => d.label);

  selectGender.on("change", event => {
    console.log("DROPDOWN CALLBACK: new value is", event.target.value);
  
    state2.selectedG = event.target.value
    
    if (state2.selectedG === "F") state2.SelectData = state2.data.filter(d => state2.selectedG === d.gender)
    if (state2.selectedG === "M") state2.SelectData = state2.data.filter(d => state2.selectedG === d.gender)
    console.log("gender changed:", state2.SelectData)
    
    updateChart()
    
  });

}

function updateChart() {
  let TYData = d3.group(state2.SelectData, d => d.gen).get("decade")

  let RYData = d3.group(state2.SelectData, d => d.gen).get("regular")
  

  CountStack = d3.stack()
    .keys(["countTen", "countNine"])
    (RYData);
  
  DataCallcount = CountStack.map(function(d, i) {
    if (i === 0) return d.map(function(d1) {
      return [d1[0], d1[1], "ten", d1.data]});
    if (i === 1) return d.map(function(d1) {
      return [d1[0], d1[1], "ninety", d1.data]});
  })

  yScale2
    .domain([0, d3.max(CountStack, d => d3.max(d, d => d[1]))]).nice()
    
  //console.log(d3.extent(Countseries, d => d3.max(d, d => d[1])))
  xAxisScale = d3.scaleTime()
    .domain(d3.extent(TYData, d => new Date(+d.year, 0, 1)))
    .range([margin.left, width - margin.right])

  
  // AXES
  //xAxis = d3.axisBottom(xScale2)
  yAxis = d3.axisLeft(yScale2)


  CountPlot.select('.yAxis')
    .transition()
    .duration(500)
    .ease(d3.easeLinear)
    .call(yAxis.ticks(10, "s"))

    
  CountPlot.selectAll("g.bars")
    .data(DataCallcount)
    .selectAll("rect")
    .data(d=>d)
    .transition()
    .duration(500)
    .ease(d3.easeLinear)
      .attr('x', d => xScale2(d[3].year))
      .attr('width', (width-margin.left-margin.right) /110)
      .attr('y', d => yScale2(d[1]))
      .attr('height', d => yScale2(d[0]) - yScale2(d[1]))
      .style('fill', d => colorScale(d[2]))
      .style("opacity", 1)

  
  let barHover = CountPlot.selectAll("rect.rects")
    .data(RYData)
    .style('fill', "white")
    .style("opacity", 0)

  barHover
    .transition()
    .duration(500)
    .ease(d3.easeLinear)
      .attr('x', d => xScale2(d.year))
      .attr('width', (width-margin.left-margin.right) /110)
      .attr('y', d => yScale2(d.Tcount))
      .attr('height', d => height - yScale2(d.Tcount)-margin.bottom)
      
  barHover.on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration("50")
          .style("opacity", 0.3)

        yScale2
          .domain([0, d3.max(CountStack, d => d3.max(d, d => d[1]))]).nice()

        CountPlot
          .append("line")
          .attr("class", "hover-line")
          .attr("x1", xScale2(d.year)+ ((width-margin.left-margin.right) /220))
          .attr("x2", xScale2(d.year)+ ((width-margin.left-margin.right) /220))
          .attr("y1", 0)
          .attr("y2", yScale2(d.Tcount))
          .attr("stroke", "#0A0A0A")
          .style("stroke-dasharray", ("5, 3"))
        CountPlot
          .append("circle")
          .attr("class", "hover-dot")
          .attr("cx", xScale2(d.year)+ ((width-margin.left-margin.right) /220))
          .attr("cy", 0)
          .attr("r", 3)
          .attr("fill", "#0A0A0A")
        
          xp = event.clientX
      
          state2.hover= {
            screenPosition: xp,
            newYear: d.year,
            topCount: d.countNine,
            bottomCount: d.countTen,
            visible: true}
          console.log(state2.hover)
          hoverdraw2();
    
        })
        .on("mouseout", function(event, d) {
          d3.select(this).transition()
            .duration("50")
            .style('fill', "white")
            .style("opacity", 0)
          state2.hover.visible = false
          d3.selectAll("line.hover-line").remove()
          d3.selectAll("circle.hover-dot").remove()
          hoverdraw2();

        })

  LineFunc = d3.line()
    .x(d => xAxisScale(new Date(+d.year, 0, 1)))
    .y(d => yScale2(d.Tcount))
    
    //console.log(LineFunc(TYData))
  countLine
    .data([TYData])
    .transition()
    .duration(500)
      .attr("d", d => LineFunc(d))    


  PopStack = d3.stack()
    .keys(["popTen", "popNine"])
    (RYData);
  //console.log("seriesPop:", PopStack)

  DataCallpop = PopStack.map(function(d, i) {
    if (i === 0) return d.map(function(d1) {
      return [d1[0], d1[1], "ten", d1.data]});
    if (i === 1) return d.map(function(d1) {
      return [d1[0], d1[1], "ninety", d1.data]});
  })
  //console.log(DataCallpop)
  yScale2
    .domain([0, d3.max(PopStack, d => d3.max(d, d => d[1]))]).nice()

  //console.log(d3.max(PopStack, d => d3.max(d, d => d[1])))

  
  yAxisPop = d3.axisLeft(yScale2)

  
  PopPlot.select('.yAxis')
    .transition()
    .duration(500)
    .ease(d3.easeLinear)
    .call(yAxis.ticks(10, "s"))
  
  PopPlot.selectAll("g.pops")
    .data(DataCallpop)
    .selectAll("rect")
    .data(d=>d)
    .transition()
    .duration(500)
    .ease(d3.easeLinear)
      .attr('x', d => xScale2(d[3].year))
      .attr('width', (width-margin.left-margin.right) /110)
      .attr('y', d => yScale2(d[1]))
      .attr('height', d => yScale2(d[0]) - yScale2(d[1]))
      .style('fill', d => colorScale(d[2]))
      .style("opacity", 1)

  let popHover = PopPlot.selectAll("rect.rectpop")
  .data(RYData)
  .style('fill', "white")
  .style("opacity", 0)

  popHover
    .transition()
    .duration(500)
    .ease(d3.easeLinear)
      .attr('x', d => xScale2(d.year))
      .attr('width', (width-margin.left-margin.right) /110)
      .attr('y', d => yScale2(d.Tpop))
      .attr('height', d => height - yScale2(d.Tpop)-margin.bottom)
        
  popHover.on("mouseover", function(event, d) {
    d3.select(this)
      .transition()
      .duration("50")
      .style("opacity", 0.3)

    yScale2
      .domain([0, d3.max(PopStack, d => d3.max(d, d => d[1]))]).nice()


    PopPlot
      .append("line")
      .attr("class", "hover-line")
      .attr("x1", xScale2(d.year)+ ((width-margin.left-margin.right) /220))
      .attr("x2", xScale2(d.year)+ ((width-margin.left-margin.right) /220))
      .attr("y1", 0)
      .attr("y2", yScale2(d.Tpop))
      .attr("stroke", "#0A0A0A")
      .style("stroke-dasharray", ("5, 3"))
  
  
    PopPlot
      .append("circle")
      .attr("class", "hover-dot")
      .attr("cx", xScale2(d.year)+ ((width-margin.left-margin.right) /220))
      .attr("cy", 0)
      .attr("r", 3)
      .attr("fill", "#0A0A0A")
    
    xp = event.clientX
   
    state2.hover= {
      screenPosition: xp,
      newYear: d.year,
      topCount: d.popNine,
      bottomCount: d.popTen,
      visible: true}
    //console.log(state2.hover)
    hoverdraw3();
    
  
    })

  .on("mouseout", function(event, d) {
    d3.select(this).transition()
      .duration("50")
      .style("opacity", 0)
    state2.hover.visible = false
    d3.selectAll("line.hover-line").remove()
    d3.selectAll("circle.hover-dot").remove()
    hoverdraw3();
  });

  LineFunc = d3.line()
    .x(d => xAxisScale(new Date(+d.year, 0, 1)))
    .y(d => yScale2(d.Tpop))

  popLine
    .data([TYData])
    .transition()
    .duration(500)
      .attr("d", d => LineFunc(d))   

}

function hoverdraw2() {

  d3.select("#sec1charts")
  .selectAll("div.hover-contentsec1")
  .data([state2.hover])
  .join("div")
  .attr("class", 'hover-contentsec1')
    .classed("visible", d=> d.visible)
    .style("position", 'absolute')
    .style("transform", d=> {
      // only move if we have a value for screenPosition
      //console.log("screenPosiiton", d.screenPosition)
      if (d.screenPosition)
      return `translate(${d.screenPosition - 115}px, ${-60}px)`
    })
    .html(d=>
          
      `<div>
      Year ${d.newYear}, total count: ${formatNumber(d.topCount + d.bottomCount)}
      </div>
      <div>
      common name count: ${formatNumber(d.topCount)}
      </div>
      <div>
      uncommon name count: ${formatNumber(d.bottomCount)}
      </div>`)


}
function hoverdraw3() {

  d3.select("#sec1charts")
  .selectAll("div.hover-contentsec1")
  .data([state2.hover])
  .join("div")
  .attr("class", 'hover-contentsec1')
    .classed("visible", d=> d.visible)
    .style("position", 'absolute')
    .style("transform", d=> {
      // only move if we have a value for screenPosition
      //console.log("screenPosiiton", d.screenPosition)
      if (d.screenPosition)
      return `translate(${d.screenPosition - 115}px, ${-60}px)`
    })
    .html(d=>
          
      `<div>
      Year ${d.newYear}, total population: ${formatNumber(d.topCount + d.bottomCount)}
      </div>
      <div>
      common name population: ${formatNumber(d.topCount)}
      </div>
      <div>
      uncommon name population: ${formatNumber(d.bottomCount)}
      </div>`)


}