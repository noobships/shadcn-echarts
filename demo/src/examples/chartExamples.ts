import type { EChartsCoreOption } from "echarts/core";
import {
  customersByCountry,
  signupsByMonth,
  signupsByYear,
  signupsByQuarter,
} from "../utils/csvData";

type CustomRenderItemApi = {
  value: (dim: number) => number;
  coord: (value: [number, number]) => [number, number];
  style: () => Record<string, unknown>;
};

export type ChartGroup =
  | "line-area"
  | "bar"
  | "pie"
  | "scatter"
  | "radar-gauge"
  | "statistical"
  | "hierarchical"
  | "flow"
  | "custom";

export const chartGroupLabels: Record<ChartGroup, string> = {
  "line-area": "Line & Area",
  bar: "Bar",
  pie: "Pie & Donut",
  scatter: "Scatter",
  "radar-gauge": "Radar & Gauge",
  statistical: "Statistical",
  hierarchical: "Hierarchical",
  flow: "Flow",
  custom: "Custom",
};

export interface ChartExample {
  name: string;
  title: string;
  description: string;
  category: "2d";
  group: ChartGroup;
  option: EChartsCoreOption;
}

// ── Helpers ─────────────────────────────────────────────────────────

const months = signupsByMonth.map((d) => d.month);
const monthCounts = signupsByMonth.map((d) => d.count);

// Cumulative monthly signups
const cumulativeMonthCounts = monthCounts.reduce<number[]>((acc, v) => {
  acc.push((acc.length > 0 ? acc[acc.length - 1] : 0) + v);
  return acc;
}, []);

// Split months into two "series" for stacked/multi demos
const monthCountsA = monthCounts.map((v) => Math.round(v * 0.6));
const monthCountsB = monthCounts.map(
  (_v, i) => monthCounts[i] - monthCountsA[i],
);

const yearLabels = signupsByYear.map((d) => d.year);
const yearCounts = signupsByYear.map((d) => d.count);

const quarterLabels = signupsByQuarter.map((d) => d.quarter);
const quarterCounts = signupsByQuarter.map((d) => d.count);

const countryNames = customersByCountry.map((d) => d.name);
const countryCounts = customersByCountry.map((d) => d.value);

// ════════════════════════════════════════════════════════════════════
// CHART EXAMPLES
// ════════════════════════════════════════════════════════════════════

export const chartExamples: ChartExample[] = [
  // ── LINE & AREA ───────────────────────────────────────────────────

  {
    name: "line-chart",
    title: "Line Chart",
    description: "Monthly customer signups over time",
    category: "2d",
    group: "line-area",
    option: {
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: months },
      yAxis: { type: "value" },
      series: [{ name: "Signups", type: "line", data: monthCounts }],
    },
  },
  {
    name: "multi-line-chart",
    title: "Multi-Line Chart",
    description: "Direct vs organic signups comparison",
    category: "2d",
    group: "line-area",
    option: {
      tooltip: { trigger: "axis" },
      legend: { bottom: 0 },
      xAxis: { type: "category", data: months },
      yAxis: { type: "value" },
      series: [
        { name: "Direct", type: "line", data: monthCountsA },
        { name: "Organic", type: "line", data: monthCountsB },
      ],
    },
  },
  {
    name: "smooth-line-chart",
    title: "Smooth Line Chart",
    description: "Cumulative signups with smoothed curve",
    category: "2d",
    group: "line-area",
    option: {
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: months },
      yAxis: { type: "value" },
      series: [
        {
          name: "Cumulative",
          type: "line",
          smooth: true,
          data: cumulativeMonthCounts,
        },
      ],
    },
  },
  {
    name: "step-line-chart",
    title: "Step Line Chart",
    description: "Monthly signups as step function",
    category: "2d",
    group: "line-area",
    option: {
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: months },
      yAxis: { type: "value" },
      series: [
        { name: "Signups", type: "line", step: "middle", data: monthCounts },
      ],
    },
  },
  {
    name: "area-chart",
    title: "Area Chart",
    description: "Monthly signups with filled area",
    category: "2d",
    group: "line-area",
    option: {
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: months },
      yAxis: { type: "value" },
      series: [
        { name: "Signups", type: "line", areaStyle: {}, data: monthCounts },
      ],
    },
  },
  {
    name: "stacked-area-chart",
    title: "Stacked Area Chart",
    description: "Direct vs organic signups stacked",
    category: "2d",
    group: "line-area",
    option: {
      tooltip: { trigger: "axis" },
      legend: { bottom: 0 },
      xAxis: { type: "category", data: months },
      yAxis: { type: "value" },
      series: [
        {
          name: "Direct",
          type: "line",
          stack: "total",
          areaStyle: {},
          data: monthCountsA,
        },
        {
          name: "Organic",
          type: "line",
          stack: "total",
          areaStyle: {},
          data: monthCountsB,
        },
      ],
    },
  },
  {
    name: "gradient-area-chart",
    title: "Gradient Area Chart",
    description: "Cumulative signups with gradient fill",
    category: "2d",
    group: "line-area",
    option: {
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: months },
      yAxis: { type: "value" },
      series: [
        {
          name: "Cumulative",
          type: "line",
          smooth: true,
          data: cumulativeMonthCounts,
          areaStyle: {
            opacity: 0.25,
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "var(--chart-1)" },
                { offset: 1, color: "transparent" },
              ],
            },
          },
        },
      ],
    },
  },

  // ── BAR ───────────────────────────────────────────────────────────

  {
    name: "bar-chart",
    title: "Bar Chart",
    description: "Top 10 countries by customer count",
    category: "2d",
    group: "bar",
    option: {
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: countryNames },
      yAxis: { type: "value" },
      series: [{ name: "Customers", type: "bar", data: countryCounts }],
    },
  },
  {
    name: "grouped-bar-chart",
    title: "Grouped Bar Chart",
    description: "Yearly signups by quarter comparison",
    category: "2d",
    group: "bar",
    option: {
      tooltip: { trigger: "axis" },
      legend: { bottom: 0 },
      xAxis: { type: "category", data: yearLabels },
      yAxis: { type: "value" },
      series: [
        {
          name: "H1",
          type: "bar",
          data: yearCounts.map((v) => Math.round(v * 0.45)),
        },
        {
          name: "H2",
          type: "bar",
          data: yearCounts.map((v, i) => yearCounts[i] - Math.round(v * 0.45)),
        },
      ],
    },
  },
  {
    name: "stacked-bar-chart",
    title: "Stacked Bar Chart",
    description: "Signups by quarter, stacked by channel",
    category: "2d",
    group: "bar",
    option: {
      tooltip: { trigger: "axis" },
      legend: { bottom: 0 },
      xAxis: { type: "category", data: quarterLabels },
      yAxis: { type: "value" },
      series: [
        {
          name: "Direct",
          type: "bar",
          stack: "total",
          data: quarterCounts.map((v) => Math.round(v * 0.6)),
        },
        {
          name: "Organic",
          type: "bar",
          stack: "total",
          data: quarterCounts.map(
            (v, i) => quarterCounts[i] - Math.round(v * 0.6),
          ),
        },
      ],
    },
  },
  {
    name: "horizontal-bar-chart",
    title: "Horizontal Bar Chart",
    description: "Top 10 countries, horizontal layout",
    category: "2d",
    group: "bar",
    option: {
      tooltip: { trigger: "axis" },
      xAxis: { type: "value" },
      yAxis: {
        type: "category",
        data: [...countryNames].reverse(),
        inverse: false,
      },
      series: [
        {
          name: "Customers",
          type: "bar",
          data: [...countryCounts].reverse(),
        },
      ],
    },
  },
  {
    name: "pictorial-bar-chart",
    title: "Pictorial Bar Chart",
    description: "Yearly signups with pictorial markers",
    category: "2d",
    group: "bar",
    option: {
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: yearLabels },
      yAxis: { type: "value" },
      series: [
        {
          name: "Signups",
          type: "pictorialBar",
          symbol: "rect",
          symbolSize: [20, 4],
          symbolOffset: [0, -2],
          data: yearCounts,
        },
      ],
    },
  },

  // ── PIE & DONUT ───────────────────────────────────────────────────

  {
    name: "pie-chart",
    title: "Pie Chart",
    description: "Customer distribution by country",
    category: "2d",
    group: "pie",
    option: {
      tooltip: { trigger: "item" },
      series: [
        {
          name: "Countries",
          type: "pie",
          radius: "60%",
          label: { show: true },
          labelLine: { show: true },
          data: customersByCountry.slice(0, 6),
        },
      ],
    },
  },
  {
    name: "donut-chart",
    title: "Donut Chart",
    description: "Customer distribution with center hole",
    category: "2d",
    group: "pie",
    option: {
      tooltip: { trigger: "item" },
      legend: { bottom: 0 },
      series: [
        {
          name: "Countries",
          type: "pie",
          radius: ["40%", "70%"],
          label: { show: true, position: "outside" },
          labelLine: { show: true },
          data: customersByCountry.slice(0, 6),
        },
      ],
    },
  },
  {
    name: "rose-chart",
    title: "Rose / Nightingale Chart",
    description: "Customer distribution with radius encoding",
    category: "2d",
    group: "pie",
    option: {
      tooltip: { trigger: "item" },
      legend: { bottom: 0 },
      series: [
        {
          name: "Countries",
          type: "pie",
          radius: ["20%", "70%"],
          roseType: "area",
          label: { show: true },
          labelLine: { show: true },
          data: customersByCountry.slice(0, 8),
        },
      ],
    },
  },
  {
    name: "half-donut-chart",
    title: "Half Donut Chart",
    description: "Semi-circle donut visualization",
    category: "2d",
    group: "pie",
    option: {
      tooltip: { trigger: "item" },
      legend: { bottom: 0 },
      series: [
        {
          name: "Countries",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["50%", "70%"],
          startAngle: 180,
          endAngle: 360,
          label: { show: true },
          labelLine: { show: true },
          data: customersByCountry.slice(0, 5),
        },
      ],
    },
  },

  // ── SCATTER ───────────────────────────────────────────────────────

  {
    name: "scatter-chart",
    title: "Scatter Chart",
    description: "Random data distribution",
    category: "2d",
    group: "scatter",
    option: {
      tooltip: { trigger: "item" },
      xAxis: { type: "value" },
      yAxis: { type: "value" },
      series: [
        {
          name: "Data",
          type: "scatter",
          data: [
            [10.0, 8.04],
            [8.07, 6.95],
            [13.0, 7.58],
            [9.05, 8.81],
            [11.0, 8.33],
            [14.0, 9.96],
            [6.0, 7.24],
            [4.0, 4.26],
            [12.0, 10.84],
            [7.0, 4.82],
            [5.0, 5.68],
          ],
        },
      ],
    },
  },
  {
    name: "bubble-chart",
    title: "Bubble Chart",
    description: "Size-encoded scatter plot",
    category: "2d",
    group: "scatter",
    option: {
      tooltip: {
        trigger: "item",
        formatter: (p: any) => {
          const d = p.data as number[];
          return `${p.seriesName}<br/>X: ${d[0]}, Y: ${d[1]}<br/>Size: ${d[2]}`;
        },
      },
      xAxis: { type: "value", name: "GDP" },
      yAxis: { type: "value", name: "Life Exp" },
      series: [
        {
          name: "2020",
          type: "scatter",
          symbolSize: (data: number[]) => Math.sqrt(data[2]) * 3,
          data: [
            [44056, 81.8, 24],
            [13334, 76.9, 138],
            [21291, 78.5, 11],
            [38923, 80.8, 6],
            [37599, 81.9, 64],
            [44053, 81.1, 81],
            [36162, 83.5, 127],
            [1390, 71.4, 25],
            [34644, 80.7, 50],
            [24787, 77.3, 39],
            [23038, 73.1, 143],
            [53354, 79.1, 322],
          ],
        },
      ],
    },
  },

  // ── RADAR & GAUGE ─────────────────────────────────────────────────

  {
    name: "radar-chart",
    title: "Radar Chart",
    description: "Multi-dimensional performance comparison",
    category: "2d",
    group: "radar-gauge",
    option: {
      tooltip: {},
      legend: { bottom: 0 },
      radar: {
        indicator: [
          { name: "Sales", max: 100 },
          { name: "Admin", max: 100 },
          { name: "IT", max: 100 },
          { name: "Support", max: 100 },
          { name: "Dev", max: 100 },
          { name: "Marketing", max: 100 },
        ],
      },
      series: [
        {
          name: "Budget vs Spending",
          type: "radar",
          data: [
            { value: [65, 19, 67, 92, 96, 72], name: "Budget" },
            { value: [77, 88, 93, 68, 81, 84], name: "Spending" },
          ],
        },
      ],
    },
  },
  {
    name: "filled-radar-chart",
    title: "Filled Radar Chart",
    description: "Radar with area fill for each series",
    category: "2d",
    group: "radar-gauge",
    option: {
      tooltip: {},
      legend: { bottom: 0 },
      radar: {
        indicator: [
          { name: "Speed", max: 100 },
          { name: "Reliability", max: 100 },
          { name: "Cost", max: 100 },
          { name: "Scalability", max: 100 },
          { name: "Security", max: 100 },
        ],
      },
      series: [
        {
          type: "radar",
          areaStyle: { opacity: 0.15 },
          data: [
            { value: [90, 70, 50, 80, 85], name: "Product A" },
            { value: [60, 90, 80, 70, 65], name: "Product B" },
          ],
        },
      ],
    },
  },
  {
    name: "gauge-chart",
    title: "Gauge Chart",
    description: "Progress gauge with score display",
    category: "2d",
    group: "radar-gauge",
    option: {
      tooltip: {},
      series: [
        {
          name: "Progress",
          type: "gauge",
          data: [{ value: 72, name: "Score" }],
        },
      ],
    },
  },
  {
    name: "multi-gauge-chart",
    title: "Multi-Ring Gauge",
    description: "Multiple progress indicators",
    category: "2d",
    group: "radar-gauge",
    option: {
      tooltip: {},
      series: [
        {
          name: "CPU",
          type: "gauge",
          radius: "60%",
          center: ["25%", "55%"],
          data: [{ value: 68, name: "CPU" }],
        },
        {
          name: "Memory",
          type: "gauge",
          radius: "60%",
          center: ["75%", "55%"],
          data: [{ value: 45, name: "Memory" }],
        },
      ],
    },
  },

  // ── STATISTICAL ───────────────────────────────────────────────────

  {
    name: "boxplot-chart",
    title: "Boxplot Chart",
    description: "Statistical distribution of data groups",
    category: "2d",
    group: "statistical",
    option: {
      tooltip: { trigger: "item" },
      xAxis: { type: "category", data: ["A", "B", "C", "D", "E"] },
      yAxis: { type: "value" },
      series: [
        {
          name: "Boxplot",
          type: "boxplot",
          data: [
            [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980],
            [960, 940, 960, 940, 880, 880, 800, 850, 840, 840, 830, 790],
            [880, 880, 880, 860, 720, 720, 620, 660, 660, 620, 600, 600],
            [720, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700, 700],
            [620, 620, 620, 620, 620, 620, 620, 620, 620, 620, 620, 620],
          ],
        },
      ],
    },
  },
  {
    name: "candlestick-chart",
    title: "Candlestick Chart",
    description: "Stock-style OHLC data",
    category: "2d",
    group: "statistical",
    option: {
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      },
      yAxis: { type: "value" },
      series: [
        {
          name: "Stock",
          type: "candlestick",
          data: [
            [20, 34, 10, 38],
            [40, 35, 30, 50],
            [31, 38, 33, 44],
            [38, 15, 5, 42],
            [30, 25, 20, 35],
          ],
        },
      ],
    },
  },
  {
    name: "heatmap-chart",
    title: "Heatmap Chart",
    description: "Activity by day and time period",
    category: "2d",
    group: "statistical",
    option: {
      tooltip: { position: "top" },
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        splitArea: { show: true },
      },
      yAxis: {
        type: "category",
        data: ["Morning", "Afternoon", "Evening"],
        splitArea: { show: true },
      },
      visualMap: {
        min: 0,
        max: 10,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "0",
      },
      series: [
        {
          name: "Activity",
          type: "heatmap",
          data: [
            [0, 0, 5],
            [0, 1, 7],
            [0, 2, 3],
            [1, 0, 1],
            [1, 1, 6],
            [1, 2, 8],
            [2, 0, 2],
            [2, 1, 4],
            [2, 2, 9],
            [3, 0, 3],
            [3, 1, 8],
            [3, 2, 5],
            [4, 0, 6],
            [4, 1, 9],
            [4, 2, 4],
            [5, 0, 10],
            [5, 1, 3],
            [5, 2, 2],
            [6, 0, 8],
            [6, 1, 2],
            [6, 2, 1],
          ],
          label: { show: true },
        },
      ],
    },
  },
  {
    name: "matrix-chart",
    title: "Matrix Chart",
    description: "Correlation matrix visualization",
    category: "2d",
    group: "statistical",
    option: {
      tooltip: { position: "top" },
      xAxis: {
        type: "category",
        data: ["A", "B", "C", "D"],
        splitArea: { show: true },
      },
      yAxis: {
        type: "category",
        data: ["1", "2", "3", "4"],
        splitArea: { show: true },
      },
      visualMap: {
        min: 0,
        max: 10,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "0",
      },
      series: [
        {
          name: "Matrix",
          type: "heatmap",
          data: [
            [0, 0, 10],
            [0, 1, 5],
            [0, 2, 3],
            [0, 3, 7],
            [1, 0, 5],
            [1, 1, 10],
            [1, 2, 8],
            [1, 3, 2],
            [2, 0, 3],
            [2, 1, 8],
            [2, 2, 10],
            [2, 3, 4],
            [3, 0, 7],
            [3, 1, 2],
            [3, 2, 4],
            [3, 3, 10],
          ],
          label: { show: true },
        },
      ],
    },
  },
  {
    name: "calendar-chart",
    title: "Calendar Chart",
    description: "Calendar heatmap of daily activity",
    category: "2d",
    group: "statistical",
    option: {
      tooltip: { position: "top" },
      visualMap: {
        min: 0,
        max: 1000,
        calculable: true,
        orient: "horizontal",
        left: "center",
        top: "top",
      },
      calendar: {
        top: "middle",
        left: "center",
        orient: "vertical",
        cellSize: 40,
        yearLabel: { show: false },
        dayLabel: { firstDay: 1, nameMap: "en" },
        monthLabel: { show: true },
        range: ["2017-02", "2017-03"],
      },
      series: [
        {
          type: "heatmap",
          coordinateSystem: "calendar",
          data: [
            ["2017-02-01", 260],
            ["2017-02-04", 200],
            ["2017-02-09", 279],
            ["2017-02-14", 450],
            ["2017-02-18", 180],
            ["2017-02-23", 258],
            ["2017-02-27", 320],
            ["2017-03-03", 150],
            ["2017-03-08", 265],
            ["2017-03-13", 400],
            ["2017-03-18", 190],
            ["2017-03-21", 347],
            ["2017-03-25", 210],
            ["2017-03-29", 280],
          ],
        },
      ],
    },
  },

  // ── HIERARCHICAL ──────────────────────────────────────────────────

  {
    name: "tree-chart",
    title: "Tree Chart",
    description: "Organizational hierarchy visualization",
    category: "2d",
    group: "hierarchical",
    option: {
      tooltip: { trigger: "item", triggerOn: "mousemove" },
      series: [
        {
          name: "Tree",
          type: "tree",
          data: [
            {
              name: "CEO",
              children: [
                {
                  name: "Engineering",
                  children: [
                    { name: "Frontend" },
                    { name: "Backend" },
                    { name: "DevOps" },
                  ],
                },
                {
                  name: "Product",
                  children: [{ name: "Design" }, { name: "Research" }],
                },
                {
                  name: "Sales",
                  children: [{ name: "Enterprise" }, { name: "SMB" }],
                },
              ],
            },
          ],
          top: "5%",
          left: "7%",
          bottom: "5%",
          right: "20%",
          symbolSize: 7,
          label: {
            position: "left",
            verticalAlign: "middle",
            align: "right",
          },
          leaves: {
            label: {
              position: "right",
              verticalAlign: "middle",
              align: "left",
            },
          },
          emphasis: { focus: "descendant" },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750,
        },
      ],
    },
  },
  {
    name: "treemap-chart",
    title: "Treemap Chart",
    description: "Proportional area hierarchy",
    category: "2d",
    group: "hierarchical",
    option: {
      tooltip: { trigger: "item" },
      series: [
        {
          name: "Treemap",
          type: "treemap",
          data: [
            {
              name: "Engineering",
              value: 40,
              children: [
                { name: "Frontend", value: 15 },
                { name: "Backend", value: 18 },
                { name: "DevOps", value: 7 },
              ],
            },
            {
              name: "Product",
              value: 25,
              children: [
                { name: "Design", value: 12 },
                { name: "Research", value: 8 },
                { name: "Analytics", value: 5 },
              ],
            },
            {
              name: "Sales",
              value: 20,
              children: [
                { name: "Enterprise", value: 12 },
                { name: "SMB", value: 8 },
              ],
            },
            { name: "Marketing", value: 15 },
          ],
        },
      ],
    },
  },
  {
    name: "sunburst-chart",
    title: "Sunburst Chart",
    description: "Radial hierarchy breakdown",
    category: "2d",
    group: "hierarchical",
    option: {
      tooltip: { trigger: "item" },
      series: [
        {
          name: "Sunburst",
          type: "sunburst",
          data: [
            {
              name: "Frontend",
              children: [
                {
                  name: "React",
                  value: 25,
                  children: [
                    { name: "Next.js", value: 12 },
                    { name: "Remix", value: 5 },
                    { name: "Vite", value: 8 },
                  ],
                },
                {
                  name: "Vue",
                  value: 15,
                  children: [
                    { name: "Nuxt", value: 8 },
                    { name: "Vite", value: 7 },
                  ],
                },
                { name: "Svelte", value: 8 },
              ],
            },
            {
              name: "Backend",
              children: [
                { name: "Node.js", value: 20 },
                { name: "Python", value: 15 },
                { name: "Go", value: 10 },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: "graph-chart",
    title: "Graph Chart",
    description: "Force-directed network graph",
    category: "2d",
    group: "hierarchical",
    option: {
      tooltip: {},
      series: [
        {
          name: "Graph",
          type: "graph",
          layout: "force",
          data: [
            { name: "React", symbolSize: 45 },
            { name: "Next.js", symbolSize: 35 },
            { name: "Vue", symbolSize: 35 },
            { name: "Svelte", symbolSize: 25 },
            { name: "ECharts", symbolSize: 30 },
            { name: "D3", symbolSize: 28 },
            { name: "Node.js", symbolSize: 32 },
          ],
          links: [
            { source: "React", target: "Next.js" },
            { source: "React", target: "ECharts" },
            { source: "Vue", target: "ECharts" },
            { source: "React", target: "D3" },
            { source: "Next.js", target: "Node.js" },
            { source: "Svelte", target: "D3" },
            { source: "Vue", target: "Node.js" },
          ],
          label: { show: true },
        },
      ],
    },
  },

  // ── FLOW ──────────────────────────────────────────────────────────

  {
    name: "sankey-chart",
    title: "Sankey Chart",
    description: "Conversion funnel flow diagram",
    category: "2d",
    group: "flow",
    option: {
      tooltip: { trigger: "item", triggerOn: "mousemove" },
      series: [
        {
          name: "Sankey",
          type: "sankey",
          data: [
            { name: "Visit" },
            { name: "Sign Up" },
            { name: "Trial" },
            { name: "Purchase" },
            { name: "Churn" },
            { name: "Renew" },
          ],
          links: [
            { source: "Visit", target: "Sign Up", value: 100 },
            { source: "Visit", target: "Churn", value: 40 },
            { source: "Sign Up", target: "Trial", value: 60 },
            { source: "Sign Up", target: "Churn", value: 20 },
            { source: "Trial", target: "Purchase", value: 35 },
            { source: "Trial", target: "Churn", value: 15 },
            { source: "Purchase", target: "Renew", value: 25 },
            { source: "Purchase", target: "Churn", value: 10 },
          ],
        },
      ],
    },
  },
  {
    name: "funnel-chart",
    title: "Funnel Chart",
    description: "Sales pipeline stages",
    category: "2d",
    group: "flow",
    option: {
      tooltip: { trigger: "item" },
      series: [
        {
          name: "Funnel",
          type: "funnel",
          data: [
            { value: 100, name: "Visits" },
            { value: 80, name: "Leads" },
            { value: 60, name: "Qualified" },
            { value: 40, name: "Proposals" },
            { value: 20, name: "Deals Won" },
          ],
        },
      ],
    },
  },
  {
    name: "parallel-chart",
    title: "Parallel Chart",
    description: "Multi-dimensional parallel coordinates",
    category: "2d",
    group: "flow",
    option: {
      tooltip: { trigger: "item" },
      parallelAxis: [
        { dim: 0, name: "Price" },
        { dim: 1, name: "Weight" },
        { dim: 2, name: "Quantity" },
        { dim: 3, name: "Score" },
      ],
      series: [
        {
          name: "Products",
          type: "parallel",
          data: [
            [12.99, 100, 82, 90],
            [9.99, 80, 77, 85],
            [20.99, 120, 60, 70],
            [15.49, 95, 90, 88],
            [7.99, 65, 45, 60],
          ],
        },
      ],
    },
  },
  {
    name: "theme-river-chart",
    title: "Theme River Chart",
    description: "Time-series flow comparison",
    category: "2d",
    group: "flow",
    option: {
      tooltip: { trigger: "axis" },
      singleAxis: { type: "time" },
      series: [
        {
          name: "Theme River",
          type: "themeRiver",
          data: [
            ["2015/11/08", 10, "React"],
            ["2015/11/09", 15, "React"],
            ["2015/11/10", 35, "React"],
            ["2015/11/11", 38, "React"],
            ["2015/11/12", 22, "React"],
            ["2015/11/13", 16, "React"],
            ["2015/11/14", 7, "React"],
            ["2015/11/08", 35, "Vue"],
            ["2015/11/09", 36, "Vue"],
            ["2015/11/10", 37, "Vue"],
            ["2015/11/11", 22, "Vue"],
            ["2015/11/12", 24, "Vue"],
            ["2015/11/13", 26, "Vue"],
            ["2015/11/14", 34, "Vue"],
            ["2015/11/08", 21, "Angular"],
            ["2015/11/09", 25, "Angular"],
            ["2015/11/10", 27, "Angular"],
            ["2015/11/11", 23, "Angular"],
            ["2015/11/12", 24, "Angular"],
            ["2015/11/13", 21, "Angular"],
            ["2015/11/14", 35, "Angular"],
            ["2015/11/08", 10, "Svelte"],
            ["2015/11/09", 15, "Svelte"],
            ["2015/11/10", 20, "Svelte"],
            ["2015/11/11", 25, "Svelte"],
            ["2015/11/12", 18, "Svelte"],
            ["2015/11/13", 12, "Svelte"],
            ["2015/11/14", 8, "Svelte"],
          ],
        },
      ],
    },
  },

  // ── CUSTOM ────────────────────────────────────────────────────────

  {
    name: "custom-chart",
    title: "Custom Chart",
    description: "Custom render item circles",
    category: "2d",
    group: "custom",
    option: {
      tooltip: {},
      xAxis: { type: "value" },
      yAxis: { type: "value" },
      series: [
        {
          name: "Custom",
          type: "custom",
          renderItem: (_params: unknown, api: CustomRenderItemApi) => {
            const coord = api.coord([api.value(0), api.value(1)]);
            return {
              type: "circle",
              shape: { cx: coord[0], cy: coord[1], r: 30 },
              style: api.style(),
            };
          },
          data: [
            [10, 20],
            [30, 40],
            [50, 60],
          ],
        },
      ],
    },
  },
];
