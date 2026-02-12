var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom, null, {
    renderer: 'svg'
});
var option;
const axisData = ['Mon', 'Tue', 'Wed', 'Very Loooong Thu', 'Fri', 'Sat', 'Sun'];
const data = axisData.map(function (item, i) {
    return Math.round(Math.random() * 1000 * (i + 1));
});
const links = data.map(function (item, i) {
    return {
        source: i,
        target: i + 1
    };
});
links.pop();
option = {
    title: {
        text: 'Graph on Cartesian'
    },
    tooltip: {},
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: axisData
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            type: 'graph',
            layout: 'none',
            coordinateSystem: 'cartesian2d',
            symbolSize: 40,
            label: {
                show: true
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            data: data,
            links: links,
            lineStyle: {
                color: '#2f4554'
            }
        }
    ]
};
option && myChart.setOption(option);
