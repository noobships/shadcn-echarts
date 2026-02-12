/**
 * Pre-aggregated datasets derived from customers-1000.csv for chart demos.
 * We parse the CSV at module load time (it's a static import).
 */
import csvRaw from "../../customers-1000.csv?raw";

interface CustomerRow {
  index: number;
  customerId: string;
  firstName: string;
  lastName: string;
  company: string;
  city: string;
  country: string;
  email: string;
  subscriptionDate: string;
  website: string;
}

function parseCSV(raw: string): CustomerRow[] {
  const lines = raw.trim().split(/\r?\n/);
  const rows: CustomerRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Handle quoted fields (some companies have commas)
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;

    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        fields.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    fields.push(current.trim());

    if (fields.length >= 11) {
      rows.push({
        index: Number(fields[0]),
        customerId: fields[1],
        firstName: fields[2],
        lastName: fields[3],
        company: fields[4],
        city: fields[5],
        country: fields[6],
        email: fields[9],
        subscriptionDate: fields[10],
        website: fields[11] ?? "",
      });
    }
  }

  return rows;
}

const customers = parseCSV(csvRaw);

// ── Country aggregations ────────────────────────────────────────────

function countBy<T>(arr: T[], key: (item: T) => string): Map<string, number> {
  const map = new Map<string, number>();
  for (const item of arr) {
    const k = key(item);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return map;
}

const countryMap = countBy(customers, (c) => c.country);
const countrySorted = [...countryMap.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

/** Top 10 countries by customer count */
export const customersByCountry = countrySorted.map(([name, value]) => ({
  name,
  value,
}));

// ── Monthly signups ─────────────────────────────────────────────────

const monthMap = countBy(customers, (c) => {
  const d = c.subscriptionDate;
  return d ? d.substring(0, 7) : "unknown"; // "2021-07"
});

const monthSorted = [...monthMap.entries()]
  .filter(([k]) => k !== "unknown")
  .sort((a, b) => a[0].localeCompare(b[0]));

/** Monthly signup counts, sorted chronologically */
export const signupsByMonth = monthSorted.map(([month, count]) => ({
  month,
  count,
}));

// ── Yearly signups ──────────────────────────────────────────────────

const yearMap = countBy(customers, (c) => {
  const d = c.subscriptionDate;
  return d ? d.substring(0, 4) : "unknown";
});

const yearSorted = [...yearMap.entries()]
  .filter(([k]) => k !== "unknown")
  .sort((a, b) => a[0].localeCompare(b[0]));

/** Yearly signup counts */
export const signupsByYear = yearSorted.map(([year, count]) => ({
  year,
  count,
}));

// ── Signups by quarter ──────────────────────────────────────────────

const quarterMap = countBy(customers, (c) => {
  const d = c.subscriptionDate;
  if (!d) return "unknown";
  const month = Number(d.substring(5, 7));
  const q = Math.ceil(month / 3);
  return `${d.substring(0, 4)} Q${q}`;
});

const quarterSorted = [...quarterMap.entries()]
  .filter(([k]) => k !== "unknown")
  .sort((a, b) => a[0].localeCompare(b[0]));

/** Quarterly signup counts */
export const signupsByQuarter = quarterSorted.map(([quarter, count]) => ({
  quarter,
  count,
}));

// ── Top companies ───────────────────────────────────────────────────

const companyMap = countBy(
  customers.filter((c) => c.company),
  (c) => c.company,
);
const companySorted = [...companyMap.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8);

/** Top 8 companies by customer count */
export const topCompanies = companySorted.map(([name, value]) => ({
  name,
  value,
}));
