var chartDom = document.getElementById("main");
var myChart = echarts.init(chartDom, null, {
    renderer: "svg",
});
var option;
option = {
    xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
        type: "value",
    },
    series: [
        {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
        },
    ],
};
option && myChart.setOption(option);
