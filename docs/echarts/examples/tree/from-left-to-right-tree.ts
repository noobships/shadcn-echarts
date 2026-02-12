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
//           left: '7%',
//           bottom: '1%',
//           right: '20%',

//           symbolSize: 7,

//           label: {
//             position: 'left',
//             verticalAlign: 'middle',
//             align: 'right',
//             fontSize: 9
//           },

//           leaves: {
//             label: {
//               position: 'right',
//               verticalAlign: 'middle',
//               align: 'left'
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
