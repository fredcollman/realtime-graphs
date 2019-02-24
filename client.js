const MARGIN = { top: 10, right: 10, bottom: 20, left: 50 }
const OUTER = { width: 800, height: 300}
const INNER = { 
  width: OUTER.width - MARGIN.left - MARGIN.right,
  height: OUTER.height - MARGIN.top - MARGIN.bottom,
};
const BARS = ["min", "max", "avg", "cur"]

let state = {
  total: 0,
  count: 0,
  min: 1,
  max: 0,
  latest: 0,
};

const reducer = (state, data) => ({
  total: state.total + data,
  count: state.count + 1,
  min: Math.min(state.min, data),
  max: Math.max(state.max, data),
  latest: data,
});

const data = [
  {value: 0.7},
  {value: 0.3},
  {value: 0.4},
]

const addStopButton = ({ws}) => {
  const button = document.createElement("button");
  button.innerText = "Stop";
  button.onclick = () => ws.close();
  document.body.appendChild(button);
}

const xScale = d3.scaleLinear()
  .domain([0, data.length - 1])
  .range([0, INNER.width])

const yScale = d3.scaleLinear()
  .domain([0, 1])
  .range([INNER.height, 0])

const addChart = () => {
  const svg = d3.select('#app')
    .append('svg')
    .attr('width', OUTER.width)
    .attr('height', OUTER.height);

  const axisContainer = svg.append('g')
    .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

  axisContainer.append('g')
    .attr('transform', `translate(0, ${INNER.height})`)
    .call(d3.axisBottom(xScale).ticks(2))
  axisContainer.append('g').call(d3.axisLeft(yScale))
  return axisContainer;
}

const render = (chart) => {
  const line = d3.line()
    .x((d, i) => xScale(i))
    .y(d => yScale(d.value));

  chart.append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('d', line);
}

// const handle = event => {
//   state = reducer(state, parseFloat(event.data));
//   // console.log(state);
//   render(state);
// }

const init = () => {
  const app = document.querySelector('#app')
  // const ws = new WebSocket("ws://127.0.0.1:8765/");
  // ws.onmessage = handle;
  const chart = addChart();
  render(chart);
  // addStopButton({ws, app});
}

init();
