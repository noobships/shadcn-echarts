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

//   data.children.forEach(function (
//     datum: { collapsed: boolean },
//     index: number
//   ) {
//     index % 2 === 0 && (datum.collapsed = true);
//   });

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

//           top: '1%',
//           left: '15%',
//           bottom: '1%',
//           right: '7%',

//           symbolSize: 7,

//           orient: 'RL',

//           label: {
//             position: 'right',
//             verticalAlign: 'middle',
//             align: 'left'
//           },

//           leaves: {
//             label: {
//               position: 'left',
//               verticalAlign: 'middle',
//               align: 'right'
//             }
//           },

//           emphasis: {
//             focus: 'descendant'
//           },

//           expandAndCollapse: true,
//           animationDuration: 550,
//           animationDurationUpdate: 750
//         }
//       ]
//     })
//   );
// });

// option && myChart.setOption(option);
