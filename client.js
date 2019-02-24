const MARGIN = { top: 10, right: 10, bottom: 20, left: 50 }
const OUTER = { width: 800, height: 300}
const INNER = { 
  width: OUTER.width - MARGIN.left - MARGIN.right,
  height: OUTER.height - MARGIN.top - MARGIN.bottom,
};
const BARS = ["min", "max", "avg", "cur"]

let state = [];
let emptyState = {
  total: 0,
  count: 0,
  min: 1,
  max: 0,
  latest: 0,
};

const baseReducer = (state, data) => ({
  total: state.total + data,
  count: state.count + 1,
  min: Math.min(state.min, data),
  max: Math.max(state.max, data),
  latest: data,
});

const reducer = (state, data) => {
  const previous = state.length ? state[state.length - 1] : emptyState;
  return [...state, baseReducer(previous, data.value)];
};

const addStopButton = ({ws}) => {
  const button = document.createElement("button");
  button.innerText = "Stop";
  button.onclick = () => ws.close();
  document.body.appendChild(button);
}

const xScale = d3.scaleLinear()
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

  axisContainer.append('path')
    .datum([])
    .attr('class', 'line')
    .attr('d', line);
  axisContainer.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${INNER.height})`)
    .call(d3.axisBottom(xScale))
  axisContainer.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale))

  return axisContainer;
}

const line = d3.line()
  .x((d, i) => xScale(i))
  .y(d => yScale(d.latest));
  // .y(d => yScale(d.max));

const render = (state, chart) => {
  xScale.domain([0, state.length]);

  chart.select('path')
    .datum(state)
    .attr('class', 'line')
    .attr('d', line);
  chart.select('.x-axis').call(d3.axisBottom(xScale));
}

const parseEvent = event => ({
  value: parseFloat(event.data)
})

const getHandler = chart => event => {
  state = reducer(state, parseEvent(event))
  // console.log(state);
  render(state, chart);
}

const init = () => {
  const app = document.querySelector('#app')
  const ws = new WebSocket("ws://127.0.0.1:8765/");
  const chart = addChart();
  ws.onmessage = getHandler(chart);
  addStopButton({ws, app});
}

init();
