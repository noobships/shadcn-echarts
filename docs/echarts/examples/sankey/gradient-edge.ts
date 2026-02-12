// import * as echarts from 'echarts';

// var ROOT_PATH = 'https://echarts.apache.org/examples';
// type EChartsOption = echarts.EChartsOption;

// var chartDom = document.getElementById('main')!;
// var myChart = echarts.init(chartDom, null, {
//   renderer: 'svg'
// });
// var option: EChartsOption;

// myChart.showLoading();
// $.get(ROOT_PATH + '/data/asset/data/energy.json', function (data) {
//   myChart.hideLoading();

//   myChart.setOption(
//     (option = {
//       title: {
//         text: 'Sankey Diagram'
//       },
//       tooltip: {
//         trigger: 'item',
//         triggerOn: 'mousemove'
//       },
//       series: [
//         {
//           type: 'sankey',
//           data: data.nodes,
//           links: data.links,
//           emphasis: {
//             focus: 'adjacency'
//           },
//           lineStyle: {
//             color: 'gradient',
//             curveness: 0.5
//           }
//         }
//       ]
//     })
//   );
// });

// option && myChart.setOption(option);
