// import * as echarts from 'echarts';

// var ROOT_PATH = 'https://echarts.apache.org/examples';
// type EChartsOption = echarts.EChartsOption;

// var chartDom = document.getElementById('main')!;
// var myChart = echarts.init(chartDom, null, {
//   renderer: 'svg'
// });
// var option: EChartsOption;

// myChart.showLoading();
// $.get(ROOT_PATH + '/data/asset/data/flare.json', function (data) {
//   myChart.hideLoading();

//   myChart.setOption(
//     (option = {
//       tooltip: {
//         trigger: 'item',
//         triggerOn: 'mousemove'
//       },
//       series: [
//         {
//           type: 'tree',

//           data: [data],

//           top: '18%',
//           bottom: '14%',

//           layout: 'radial',

//           symbol: 'emptyCircle',

//           symbolSize: 7,

//           initialTreeDepth: 3,

//           animationDurationUpdate: 750,

//           emphasis: {
//             focus: 'descendant'
//           }
//         }
//       ]
//     })
//   );
// });

// option && myChart.setOption(option);
