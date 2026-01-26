I have a separate TypeScript project that's basically about doing advanced agentic data visualisations and data analysis.

For visualizations, I wanted something that gives a lot of charts out of the box, and at the same time looks very modern and minimalistic, similar to how shadcn/ui charts and evil charts look.

I couldn't find anything that provides me with a high number of charts and the look that I want.

Then I decided that Apache Echarts provides a lot of charts, but I will customise the theme and look heavily so that it resembles the design language of shadcn/ui charts. It will work great in dark and light mode, similar to how shadcn/ui components and charts work.

I decided that I am going to make a Typescript package and also shadcn/ui registry so that other developers can also use it however they want.

Use tsdown.
Use pnpm.

I have added the docs for shadcn/ui registry and tsdown in the docs folder so that you can read the docs and understand everything, so that you can develop things easily.

I have created this shadcn-echarts folder where we will be doing all of this.

I have found the following theme builder for Echarts:
https://github.com/apache/echarts-theme-builder