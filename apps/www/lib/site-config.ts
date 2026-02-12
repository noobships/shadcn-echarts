export const PACKAGE_NAME = "@devstool/shadcn-echarts";
export const NAMESPACE = "@devstool";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://shadcn-echarts.vercel.app";

export function registryItemUrl(name: string): string {
  return `${SITE_URL}/r/${name}.json`;
}
