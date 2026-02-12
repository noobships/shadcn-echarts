import { test, expect } from "@playwright/test";
import { EXAMPLE_MANIFEST } from "../src/generated/examples-manifest";
import { EXAMPLE_METRICS } from "../src/generated/examples-metrics";

type CategoryStats = {
  total: number;
  supported: number;
  unsupported: number;
};

const CATEGORY_ENTRIES = Object.entries(
  EXAMPLE_METRICS.byCategory as Record<string, CategoryStats>,
).sort((a, b) =>
  a[0].localeCompare(b[0]),
);

const REPRESENTATIVE_SUPPORTED = CATEGORY_ENTRIES.map(([category]) => {
  const candidate = EXAMPLE_MANIFEST.find(
    (entry) => entry.category === category && entry.status === "supported",
  );
  return {
    category,
    id: candidate?.id ?? null,
  };
}).filter((item) => item.id !== null) as { category: string; id: string }[];

async function setTheme(page: import("@playwright/test").Page, mode: "light" | "dark") {
  const html = page.locator("html");
  const isDark = (await html.getAttribute("class"))?.includes("dark") ?? false;

  if ((mode === "dark" && !isDark) || (mode === "light" && isDark)) {
    await page.getByRole("button", { name: "Toggle theme" }).first().click();
  }

  if (mode === "dark") {
    await expect(html).toHaveClass(/dark/);
  } else {
    await expect(html).not.toHaveClass(/dark/);
  }
}

async function getRuntimeSetOptionCount(panel: import("@playwright/test").Locator): Promise<number> {
  const raw = await panel.getAttribute("data-runtime-setoption-count");
  const count = Number(raw ?? "0");
  return Number.isFinite(count) ? count : 0;
}

test.describe("demo parity and visuals", () => {
  test("category pages match generated metrics", async ({ page }) => {
    for (const [category, stats] of CATEGORY_ENTRIES) {
      await page.goto(`/category/${category}`);
      await expect(
        page.getByText(new RegExp(`Showing ${stats.total} example`), { exact: false }),
      ).toBeVisible();

      if (stats.total > 0) {
        await expect(page.getByRole("link", { name: "Open example" }).first()).toBeVisible();
      }
    }
  });

  test("representative chart panels in light + dark", async ({ page }) => {
    for (const mode of ["light", "dark"] as const) {
      await page.goto("/");
      await setTheme(page, mode);

      for (const item of REPRESENTATIVE_SUPPORTED) {
        const encodedId = encodeURIComponent(item.id);
        await page.goto(`/examples/${encodedId}`);
        const panel = page.locator(`[data-example-chart-panel="${item.id}"]`);
        await expect(panel).toBeVisible();

        // Wait for either success or graceful unsupported/runtime message state.
        await page.waitForTimeout(700);

        await expect(panel).toHaveScreenshot(
          `category-${item.category}-${mode}.png`,
        );
      }
    }
  });

  test("interactive runtime examples apply runtime updates", async ({ page }) => {
    const clickToAddPointsId = "line/click-to-add-points";
    const fisheyeId = "line/fisheye-lens-on-line-chart";
    const transitionId = "treemap/transition-between-treemap-and-sunburst";

    // click-to-add-points: user click triggers additional setOption update.
    await page.goto(`/examples/${encodeURIComponent(clickToAddPointsId)}`);
    const clickPanel = page.locator(`[data-example-chart-panel="${clickToAddPointsId}"]`);
    await expect(clickPanel).toHaveAttribute("data-execution-mode", "imperative-runtime");
    await expect.poll(() => getRuntimeSetOptionCount(clickPanel), { timeout: 15000 }).toBeGreaterThan(0);
    const clickBefore = await getRuntimeSetOptionCount(clickPanel);
    const clickSvg = clickPanel.locator("svg").first();
    await expect(clickSvg).toBeVisible();
    const clickBox = await clickSvg.boundingBox();
    if (!clickBox) {
      throw new Error("click-to-add-points chart SVG bounding box is unavailable.");
    }
    await page.mouse.click(
      clickBox.x + clickBox.width * 0.62,
      clickBox.y + clickBox.height * 0.56,
    );
    await expect.poll(() => getRuntimeSetOptionCount(clickPanel), { timeout: 8000 }).toBeGreaterThan(clickBefore);

    // fisheye-lens-on-line-chart: brush drag triggers axis-break update.
    await page.goto(`/examples/${encodeURIComponent(fisheyeId)}`);
    const fisheyePanel = page.locator(`[data-example-chart-panel="${fisheyeId}"]`);
    await expect(fisheyePanel).toHaveAttribute("data-execution-mode", "imperative-runtime");
    await expect.poll(() => getRuntimeSetOptionCount(fisheyePanel), { timeout: 15000 }).toBeGreaterThan(0);
    const fisheyeBefore = await getRuntimeSetOptionCount(fisheyePanel);
    const fisheyeSvg = fisheyePanel.locator("svg").first();
    await expect(fisheyeSvg).toBeVisible();
    const fisheyeBox = await fisheyeSvg.boundingBox();
    if (!fisheyeBox) {
      throw new Error("fisheye chart SVG bounding box is unavailable.");
    }
    const startX = fisheyeBox.x + fisheyeBox.width * 0.35;
    const startY = fisheyeBox.y + fisheyeBox.height * 0.35;
    const endX = fisheyeBox.x + fisheyeBox.width * 0.68;
    const endY = fisheyeBox.y + fisheyeBox.height * 0.62;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY);
    await page.mouse.up();
    await expect.poll(() => getRuntimeSetOptionCount(fisheyePanel), { timeout: 8000 }).toBeGreaterThan(fisheyeBefore);

    // transition-between-treemap-and-sunburst: timer should trigger periodic setOption updates.
    await page.goto(`/examples/${encodeURIComponent(transitionId)}`);
    const transitionPanel = page.locator(`[data-example-chart-panel="${transitionId}"]`);
    await expect(transitionPanel).toHaveAttribute("data-execution-mode", "imperative-runtime");
    await expect.poll(() => getRuntimeSetOptionCount(transitionPanel), { timeout: 15000 }).toBeGreaterThan(0);
    const transitionBefore = await getRuntimeSetOptionCount(transitionPanel);
    await expect.poll(() => getRuntimeSetOptionCount(transitionPanel), { timeout: 9000 }).toBeGreaterThan(transitionBefore);
  });
});
