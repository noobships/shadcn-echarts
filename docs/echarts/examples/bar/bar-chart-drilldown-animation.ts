// import * as echarts from 'echarts';

// type EChartsOption = echarts.EChartsOption;

// var chartDom = document.getElementById('main')!;
// var myChart = echarts.init(chartDom, null, {
//   renderer: 'svg'
// });
// var option: EChartsOption;

// interface DataItem {
//   value: number;
//   groupId: string;
// }
// option = {
//   xAxis: {
//     data: ['Animals', 'Fruits', 'Cars']
//   },
//   yAxis: {},
//   dataGroupId: '',
//   animationDurationUpdate: 500,
//   series: {
//     type: 'bar',
//     id: 'sales',
//     data: [
//       {
//         value: 5,
//         groupId: 'animals'
//       },
//       {
//         value: 2,
//         groupId: 'fruits'
//       },
//       {
//         value: 4,
//         groupId: 'cars'
//       }
//     ] as DataItem[],
//     universalTransition: {
//       enabled: true,
//       divideShape: 'clone'
//     }
//   }
// };

// const drilldownData = [
//   {
//     dataGroupId: 'animals',
//     data: [
//       ['Cats', 4],
//       ['Dogs', 2],
//       ['Cows', 1],
//       ['Sheep', 2],
//       ['Pigs', 1]
//     ]
//   },
//   {
//     dataGroupId: 'fruits',
//     data: [
//       ['Apples', 4],
//       ['Oranges', 2]
//     ]
//   },
//   {
//     dataGroupId: 'cars',
//     data: [
//       ['Toyota', 4],
//       ['Opel', 2],
//       ['Volkswagen', 2]
//     ]
//   }
// ];

// myChart.on('click', function (event) {
//   if (event.data) {
//     var subData = drilldownData.find(function (data) {
//       return data.dataGroupId === (event.data as DataItem).groupId;
//     });
//     if (!subData) {
//       return;
//     }
//     myChart.setOption<echarts.EChartsOption>({
//       xAxis: {
//         data: subData.data.map(function (item) {
//           return item[0];
//         })
//       },
//       series: {
//         type: 'bar',
//         id: 'sales',
//         dataGroupId: subData.dataGroupId,
//         data: subData.data.map(function (item) {
//           return item[1];
//         }),
//         universalTransition: {
//           enabled: true,
//           divideShape: 'clone'
//         }
//       },
//       graphic: [
//         {
//           type: 'text',
//           left: 50,
//           top: 20,
//           style: {
//             text: 'Back',
//             fontSize: 18
//           },
//           onclick: function () {
//             myChart.setOption<echarts.EChartsOption>(option);
//           }
//         }
//       ]
//     });
//   }
// });

// option && myChart.setOption(option);
