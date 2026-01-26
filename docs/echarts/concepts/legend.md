# Legend - Concepts - Handbook - Apache ECharts

# Legend

Legends are used to annotate the content in the chart using different colors, shapes and texts to indicate different categories. By clicking the legends, the user can show or hide the corresponding categories. Legend is one of the key to understand the chart.

## Layout

Legend is always placed at the upper right corner of the chart. All legends in the same page need to be consistent, align horizontally or vertically by considering the layout of the overall chart space. When the chart has little vertical space or the content area is crowded, it is also a good choice to put the legend on the bottom of the chart. Here are some layouts of legend:

option \= {
  legend: {
    // Try 'horizontal'
    orient: 'vertical',
    right: 10,
    top: 'center'
  },
  dataset: {
    source: \[
      \['product', '2015', '2016', '2017'\],
      \['Matcha Latte', 43.3, 85.8, 93.7\],
      \['Milk Tea', 83.1, 73.4, 55.1\],
      \['Cheese Cocoa', 86.4, 65.2, 82.5\],
      \['Walnut Brownie', 72.4, 53.9, 39.1\]
    \]
  },
  xAxis: { type: 'category' },
  yAxis: {},
  series: \[{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }\]
};  

live

Use scrollable control if there are many legends.

```
option = {
  legend: {
    type: 'scroll',
    orient: 'vertical',
    right: 10,
    top: 20,
    bottom: 20,
    data: ['Legend A', 'Legend B', 'Legend C' /* ... */, , 'Legend x']
    // ...
  }
  // ...
};
```

## Style

For dark color background, use a light color for the background layer and text while changing the background to translucent.

```
option = {
  legend: {
    data: ['Legend A', 'Legend B', 'Legend C'],
    backgroundColor: '#ccc',
    textStyle: {
      color: '#ccc'
      // ...
    }
    // ...
  }
  // ...
};
```

The color of legend has many ways to design. For different charts, the legend style can be different.

![](images/design/legend/charts_sign_img04.png)

```
option = {
  legend: {
    data: ['Legend A', 'Legend B', 'Legend C'],
    icon: 'rect'
    // ...
  }
  // ...
};
```

## Interactive

Depend on the environmental demand, the legend can support interactive operation. Click the legend to show or hide corresponding categories:

```
option = {
  legend: {
    data: ['Legend A', 'Legend B', 'Legend C'],
    selected: {
      'Legend A': true,
      'Legend B': true,
      'Legend C': false
    }
    // ...
  }
  // ...
};
```

## Tips

The legend should be used according to the situation. Some dual-axis charts include multiple chart types. Different kinds of legend stypes should be distinguished.

```
option = {
  legend: {
    data: [
      {
        name: 'Legend A',
        icon: 'rect'
      },
      {
        name: 'Legend B',
        icon: 'circle'
      },
      {
        name: 'Legend C',
        icon: 'pin'
      }
    ]
    //  ...
  },
  series: [
    {
      name: 'Legend A'
      //  ...
    },
    {
      name: 'Legend B'
      //  ...
    },
    {
      name: 'Legend C'
      //  ...
    }
  ]
  //  ...
};
```

While there is only one kind of data in the chart, use the chart title rather than the legend to explain it.