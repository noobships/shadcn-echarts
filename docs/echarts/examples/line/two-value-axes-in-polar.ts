// import * as echarts from 'echarts';

// type EChartsOption = echarts.EChartsOption;

// var chartDom = document.getElementById('main')!;
// var myChart = echarts.init(chartDom, null, {
//   renderer: 'svg'
// });
// var option: EChartsOption;

// const data: number[][] = [];

// for (let i = 0; i <= 100; i++) {
//   let theta = (i / 100) * 360;
//   let r = 5 * (1 + Math.sin((theta / 180) * Math.PI));
//   data.push([r, theta]);
// }

// option = {
//   title: {
//     text: 'Two Value-Axes in Polar'
//   },
//   legend: {
//     data: ['line']
//   },
//   polar: {},
//   tooltip: {
//     trigger: 'axis',
//     axisPointer: {
//       type: 'cross'
//     }
//   },
//   angleAxis: {
//     type: 'value',
//     startAngle: 0
//   },
//   radiusAxis: {},
//   series: [
//     {
//       coordinateSystem: 'polar',
//       name: 'line',
//       type: 'line',
//       data: data
//     }
//   ]
// };

// option && myChart.setOption(option);
