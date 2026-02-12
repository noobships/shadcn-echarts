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

//           left: '2%',
//           right: '2%',
//           top: '8%',
//           bottom: '20%',

//           symbol: 'emptyCircle',

//           orient: 'vertical',

//           expandAndCollapse: true,

//           label: {
//             position: 'top',
//             rotate: -90,
//             verticalAlign: 'middle',
//             align: 'right',
//             fontSize: 9
//           },

//           leaves: {
//             label: {
//               position: 'bottom',
//               rotate: -90,
//               verticalAlign: 'middle',
//               align: 'left'
//             }
//           },

//           animationDurationUpdate: 750
//         }
//       ]
//     })
//   );
// });

// option && myChart.setOption(option);
