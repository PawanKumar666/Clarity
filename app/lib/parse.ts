import { format, parse, parseISO } from "date-fns";

export type ParsedTransaction = {
  date: Date;
  amount: number;
  currency: string;
  method: string;
  merchantRaw: string;
  merchantClean: string;
  inferredCategory: string;
  referenceId?: string | null;
  rawText: string;
};

const MERCHANT_MAP: Record<string, string> = {
  AMZN: "Amazon",
  "AMAZON PAY": "Amazon",
  "AMZN PAY INDIA": "Amazon",
  SWIGGY: "Swiggy",
  ZOMATO: "Zomato",
  UBER: "Uber",
  UBR: "Uber",
  OLA: "Ola",
  NETFLIX: "Netflix",
  SPOTIFY: "Spotify"
};

const CATEGORY_MAP: Record<string, string> = {
  food: "Food",
  transport: "Transport",
  shopping: "Shopping",
  bills: "Bills",
  subscriptions: "Subscriptions"
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  food: ["swiggy", "zomato", "restaurant", "cafe"],
  transport: ["uber", "ola", "metro", "irctc"],
  shopping: ["amazon", "flipkart", "myntra"],
  bills: ["electricity", "gas", "recharge", "broadband"],
  subscriptions: ["netflix", "spotify", "prime", "hotstar", "apple", "google"]
};

export function parseAmount(value: string): number | null {
  const cleaned = value
    .replace(/,/g, "")
    .replace(/INR|Rs\.?|₹/gi, "")
    .trim();
  const match = cleaned.match(/-?\d+(\.\d+)?/);
  if (!match) return null;
  return Number.parseFloat(match[0]);
}

export function parseDateFromText(text: string, fallback: Date): Date {
  const isoMatch = text.match(/\b\d{4}-\d{2}-\d{2}\b/);
  if (isoMatch) {
    const parsed = parseISO(isoMatch[0]);
    if (!Number.isNaN(parsed.valueOf())) return parsed;
  }
  const slashMatch = text.match(/\b\d{2}\/\d{2}\/\d{4}\b/);
  if (slashMatch) {
    const parsed = parse(slashMatch[0], "dd/MM/yyyy", new Date());
    if (!Number.isNaN(parsed.valueOf())) return parsed;
  }
  return fallback;
}

export function inferMethod(text: string): string {
  if (/UPI/i.test(text)) return "UPI";
  if (/CARD|xx\d{4}/i.test(text)) return "CARD";
  if (/WALLET/i.test(text)) return "WALLET";
  return "UNKNOWN";
}

export function normalizeMerchant(raw: string): string {
  const upper = raw.toUpperCase();
  for (const [key, value] of Object.entries(MERCHANT_MAP)) {
    if (upper.includes(key)) return value;
  }
  const cleaned = raw
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "Unknown";
  return cleaned
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function inferCategory(merchantClean: string, rawText: string): string {
  const haystack = `${merchantClean} ${rawText}`.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => haystack.includes(keyword))) {
      return CATEGORY_MAP[category];
    }
  }
  return "Other";
}

export function parseReferenceId(text: string): string | null {
  const match = text.match(/(?:Ref|RRN|Txn|Ref\.?\s*no)[:\s]*([A-Za-z0-9-]+)/i);
  return match ? match[1] : null;
}

export function parseSmsLine(line: string, fallbackDate: Date): ParsedTransaction | null {
  const amountMatch = line.match(/(?:₹|Rs\.?|INR)\s?[-]?\d+[\d,]*(?:\.\d+)?/i);
  const amountValue = amountMatch ? parseAmount(amountMatch[0]) : null;
  if (amountValue === null) return null;

  const date = parseDateFromText(line, fallbackDate);
  const method = inferMethod(line);
  const referenceId = parseReferenceId(line);

  let merchantRaw = "";
  const toMatch = line.match(/to\s+([A-Za-z0-9 &._-]+)/i);
  const atMatch = line.match(/at\s+([A-Za-z0-9 &._-]+)/i);
  const fromMatch = line.match(/from\s+([A-Za-z0-9 &._-]+)/i);

  if (toMatch) merchantRaw = toMatch[1];
  else if (atMatch) merchantRaw = atMatch[1];
  else if (fromMatch) merchantRaw = fromMatch[1];
  else {
    merchantRaw = line
      .replace(amountMatch?.[0] ?? "", "")
      .replace(/UPI|CARD|WALLET|txn|ref|debited|credited/gi, " ")
      .trim();
  }

  const merchantClean = normalizeMerchant(merchantRaw);
  const inferredCategory = inferCategory(merchantClean, line);

  return {
    date,
    amount: amountValue,
    currency: "INR",
    method,
    merchantRaw: merchantRaw.trim() || "Unknown",
    merchantClean,
    inferredCategory,
    referenceId,
    rawText: line.trim()
  };
}

export function parseCsvText(text: string, fallbackDate: Date): ParsedTransaction[] {
  const rows = parseCsv(text);
  const header = rows[0]?.map((cell) => cell.toLowerCase().trim()) ?? [];
  const dataRows = rows.slice(1);

  const getIndex = (name: string) => header.findIndex((cell) => cell === name);
  const dateIndex = getIndex("date");
  const amountIndex = getIndex("amount");
  const descIndex = getIndex("description");
  const methodIndex = getIndex("method");

  return dataRows
    .map((row) => {
      const raw = row[descIndex] ?? "";
      const amountValue = parseAmount(row[amountIndex] ?? "");
      if (amountValue === null) return null;
      const dateCell = row[dateIndex] ?? "";
      const date = dateCell
        ? parseDateFromText(dateCell, fallbackDate)
        : fallbackDate;
      const method = row[methodIndex] ? row[methodIndex].toUpperCase() : inferMethod(raw);
      const merchantClean = normalizeMerchant(raw);
      const inferredCategory = inferCategory(merchantClean, raw);
      return {
        date,
        amount: amountValue,
        currency: "INR",
        method: method || "UNKNOWN",
        merchantRaw: raw || "Unknown",
        merchantClean,
        inferredCategory,
        referenceId: null,
        rawText: raw
      };
    })
    .filter((item): item is ParsedTransaction => item !== null);
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      currentRow.push(current);
      if (currentRow.some((cell) => cell.trim() !== "")) {
        rows.push(currentRow);
      }
      currentRow = [];
      current = "";
      continue;
    }

    current += char;
  }

  if (current.length || currentRow.length) {
    currentRow.push(current);
    if (currentRow.some((cell) => cell.trim() !== "")) {
      rows.push(currentRow);
    }
  }

  return rows;
}

export function formatDateLabel(date: Date): string {
  return format(date, "dd MMM yyyy");
}
