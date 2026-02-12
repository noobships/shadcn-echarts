/// <reference types="vite/client" />

declare module "*.csv?raw" {
  const content: string;
  export default content;
}

declare module "d3-array";
declare module "d3-geo";
declare module "echarts-simple-transform";
