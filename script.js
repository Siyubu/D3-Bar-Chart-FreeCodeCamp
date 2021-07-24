
let dataset = []

let width = 800
let height = 600
let padding = 40

let heightScale
let xScale
let xAxisScale
let yAxisScale
let valueline

let svg = d3.select('svg')

window.addEventListener('load', async(event) => {
   const response= await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }
      let data= await response.json();
      dataset = data.data
    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()

  });

const drawCanvas = () =>{
    svg.attr("width",width)
    svg.attr("height",height)
}
const generateScales = () =>{
    heightScale = d3.scaleLinear()
                     .domain([0,d3.max(dataset,(item)=>{
                         return item[1]
                     })])
                     .range([0,height - (2*padding)])

                
    xScale = d3.scaleLinear()
                 .domain([0,dataset.length-1])
                 .range([padding, width-padding])

    let dateArray = dataset.map((item)=>{
        return new Date(item[0])
    })

    xAxisScale = d3.scaleTime()
                   .domain([d3.min(dateArray), d3.max(dateArray)])
                   .range([padding,width-padding])

    yAxisScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset,(item)=>{
                        return item[1]
                    })])
                    .range([height-padding,padding])

    valueline = d3.line()
                    .x(function(d,i) { return xScale(i); })
                    .y(function(d) { return (height - padding) - heightScale(d[1]); });

}

const drawBars = () =>{
    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('visibility', 'hidden')
                    .style('width', 'auto')
                    .style('height', 'auto')

    svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', (width - (2 * padding)) / dataset.length)
        .attr('data-date', (item) => {
            return item[0]
        })
        .attr('data-gdp', (item) => {
            return item[1]
        })
        .attr('height', (item) => {
            return heightScale(item[1])
        })
        .attr('x', (item, index) => {
            return xScale(index)
        })
        .attr('y', (item) => {
            return (height - padding) - heightScale(item[1])
        })
        .on('mouseover', (item) => {
            tooltip.transition()
                .style('visibility', 'visible')

            tooltip.text(item[0])

            document.querySelector('#tooltip').setAttribute('data-date', item[0])
        })
        .on('mouseout', (item) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })
         

}

const generateAxes = () =>{
    let xAxis = d3.axisBottom(xAxisScale)
    let yAxis = d3.axisLeft(yAxisScale)
    svg.append('g')
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform","translate(0,"+ (height-padding)+")")

    svg.append('g')
        .call(yAxis)
        .attr('id','y-axis')
        .attr("transform","translate("+padding+",0)")

}

