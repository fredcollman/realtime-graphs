const ws = new WebSocket("ws://127.0.0.1:8765/");
let state = {
  total: 0,
  count: 0,
  min: 1,
  max: 0,
  latest: 0,
}

const reducer = (state, data) => ({
  total: state.total + data,
  count: state.count + 1,
  min: Math.min(state.min, data),
  max: Math.max(state.max, data),
  latest: data,
})
ws.onmessage = (event) => {
  state = reducer(state, parseFloat(event.data));
  d3.select('#app')
    .selectAll('div')
    .data([state.min, state.max, state.total/state.count, state.latest])
    .attr('class', 'bar')
    .style('width', d => `${d * 100}%`)
  console.log(state)
};
