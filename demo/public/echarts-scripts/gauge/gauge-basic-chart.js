var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom, null, {
    renderer: 'svg'
});
var option;
option = {
    tooltip: {
        formatter: '{a} <br/>{b} : {c}%'
    },
    series: [
        {
            name: 'Pressure',
            type: 'gauge',
            detail: {
                formatter: '{value}'
            },
            data: [
                {
                    value: 50,
                    name: 'SCORE'
                }
            ]
        }
    ]
};
option && myChart.setOption(option);
