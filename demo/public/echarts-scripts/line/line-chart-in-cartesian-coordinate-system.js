var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom, null, {
    renderer: 'svg'
});
var option;
option = {
    xAxis: {},
    yAxis: {},
    series: [
        {
            data: [
                [10, 40],
                [50, 100],
                [40, 20]
            ],
            type: 'line'
        }
    ]
};
option && myChart.setOption(option);
