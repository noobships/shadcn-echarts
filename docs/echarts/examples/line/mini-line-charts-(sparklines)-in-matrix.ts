// import * as echarts from 'echarts';
// import type { EChartsOption } from 'echarts';

// // Type definitions
// interface MatrixYDataItem {
//   value: string;
//   size?: number;
// }

// interface MatrixDimensionData {
//   x: string[];
//   y: MatrixYDataItem[];
// }

// interface MatrixCell {
//   coord: [number | null, number];
//   coordClamp: boolean;
//   mergeCells: boolean;
//   value: string;
//   label: {
//     color: string;
//     fontSize: number;
//   };
// }

// // Initialize chart
// const chartDom = document.getElementById('main') as HTMLElement;
// const myChart = echarts.init(chartDom, null, {
//   renderer: 'svg'
// });

// // Data definitions
// const _matrixDimensionData: MatrixDimensionData = {
//   x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
//   y: [
//     { value: '8:00\n~\n10:00' },
//     { value: '10:00\n~\n12:00' },
//     { value: '12:00\n~\n14:00', size: 55 },
//     { value: '14:00\n~\n16:00' },
//     { value: '16:00\n~\n18:00' },
//     { value: '18:00\n~\n20:00' }
//   ]
// };

// const _yBreakTimeIndex: number = 2; // '12:00 - 14:00'
// const _seriesFakeDataLength: number = 365;

// // Initialize option with explicit typing
// const option: any = { // Using 'any' because 'matrix' is a custom property not in EChartsOption
//   matrix: {
//     x: {
//       data: _matrixDimensionData.x,
//       levelSize: 40,
//       label: {
//         fontSize: 16,
//         color: '#555'
//       }
//     },
//     y: {
//       data: _matrixDimensionData.y,
//       levelSize: 70,
//       label: {
//         fontSize: 14,
//         color: '#777'
//       }
//     },
//     corner: {
//       data: [
//         {
//           coord: [-1, -1],
//           value: 'Time'
//         }
//       ],
//       label: {
//         fontSize: 16,
//         color: '#777'
//       }
//     },
//     body: {
//       data: [
//         {
//           coord: [null, _yBreakTimeIndex],
//           coordClamp: true,
//           mergeCells: true,
//           value: 'Break',
//           label: {
//             color: '#999',
//             fontSize: 16
//           }
//         } as MatrixCell
//       ]
//     },
//     top: 30,
//     bottom: 80,
//     width: '90%',
//     left: 'center'
//   },
//   tooltip: {
//     trigger: 'axis'
//   },
//   dataZoom: [
//     {
//       type: 'slider',
//       xAxisIndex: 'all',
//       left: '10%',
//       right: '10%',
//       bottom: 30,
//       height: 30,
//       throttle: 120
//     },
//     {
//       type: 'inside',
//       xAxisIndex: 'all',
//       throttle: 120
//     }
//   ],
//   grid: [] as any[],
//   xAxis: [] as any[],
//   yAxis: [] as any[],
//   series: [] as any[]
// };

// // Helper functions with type annotations
// function makeId(xidx: number, yidx: number): string {
//   return `${xidx}|${yidx}`;
// }

// function eachMatrixCell(
//   cb: (xval: string, yval: string, xidx: number, yidx: number) => void
// ): void {
//   _matrixDimensionData.y.forEach((yvalItem: MatrixYDataItem, yidx: number) => {
//     const yval = yvalItem.value;
//     if (yidx === _yBreakTimeIndex) {
//       return;
//     }
//     _matrixDimensionData.x.forEach((xval: string, xidx: number) => {
//       cb(xval, yval, xidx, yidx);
//     });
//   });
// }

// function generateFakeSeriesData(
//   dayCount: number,
//   xidx: number,
//   yidx: number
// ): [string, number][] {
//   const dayStart = new Date('2025-05-05T00:00:00.000Z'); // Monday
//   dayStart.setDate(xidx + 5);
//   const timeStart = dayStart.getTime();
//   const sevenDay = 7 * 1000 * 3600 * 24;
//   const cellData: [string, number][] = [];
//   let lastVal = +(Math.random() * 300).toFixed(0);
//   let turnCount: number | null = null;
//   let sign = -1;

//   for (let idx = 0; idx < dayCount; idx++) {
//     if (turnCount == null || idx >= turnCount) {
//       turnCount =
//         idx + Math.round((dayCount / 4) * ((Math.random() - 0.5) * 0.1));
//       sign = -sign;
//     }
//     const deltaMag = 50;
//     const delta = +(
//       Math.random() * deltaMag -
//       deltaMag / 2 +
//       (sign * deltaMag) / 3
//     ).toFixed(0);
//     const val = Math.max(0, (lastVal += delta));
//     const xTime = timeStart + idx * sevenDay;
//     const dataXVal = echarts.time.format(xTime, '{yyyy}-{MM}-{dd}');
//     cellData.push([dataXVal, val]);
//   }
//   return cellData;
// }

// // Build the option
// eachMatrixCell((xval: string, yval: string, xidx: number, yidx: number) => {
//   const id = makeId(xidx, yidx);
//   option.grid.push({
//     id: id,
//     coordinateSystem: 'matrix',
//     coord: [xval, yval],
//     top: 10,
//     bottom: 10,
//     left: 'center',
//     width: '90%',
//     containLabel: true
//   });
//   option.xAxis.push({
//     type: 'category',
//     id: id,
//     gridId: id,
//     scale: true,
//     axisTick: { show: false },
//     axisLabel: { show: false },
//     axisLine: { show: false },
//     splitLine: { show: false }
//   });
//   option.yAxis.push({
//     id: id,
//     gridId: id,
//     interval: Number.MAX_SAFE_INTEGER,
//     scale: true,
//     axisLabel: {
//       showMaxLabel: true,
//       fontSize: 9
//     },
//     axisLine: { show: false },
//     axisTick: { show: false }
//   });
//   option.series.push({
//     xAxisId: id,
//     yAxisId: id,
//     type: 'line',
//     symbol: 'none',
//     lineStyle: {
//       lineWidth: 1
//     },
//     data: generateFakeSeriesData(_seriesFakeDataLength, xidx, yidx)
//   });
// });

// // Set the option
// if (option) {
//   myChart.setOption(option);
// }