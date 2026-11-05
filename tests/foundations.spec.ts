import { test, expect } from "@playwright/test";
import {
  getNavigationForRole,
  getMobileNavigation,
  isNavigationActive,
  navigation,
  workspaceHref,
  roleNavigation,
} from "../src/config/navigation";
import { formatUGX } from "../src/lib/currency";
import { features } from "../src/config/features";
import { cn } from "../src/lib/utils";

test("semantic typography survives text-colour class merging", () => {
  expect(cn("text-metadata font-medium", "text-white")).toContain(
    "text-metadata",
  );
  expect(cn("text-caption", "text-muted-foreground")).toContain("text-caption");
});

test("cashier navigation contains only scoped entry points", () => {
  expect(getNavigationForRole("cashier").map((item) => item.path)).toEqual([
    "home",
    "receipts/new",
    "receipts/history",
  ]);
  expect(getMobileNavigation("cashier").map((item) => item.id)).toEqual([
    "home",
    "create",
    "history",
  ]);
  for (const allowed of Object.values(roleNavigation))
    expect(allowed.length).toBe(new Set(allowed).size);
});
test("navigation resolves nested creation separately from receipts and secondary pages under More", () => {
  const receipts = navigation.find((item) => item.id === "receipts")!;
  const create = navigation.find((item) => item.id === "create")!;
  const more = navigation.find((item) => item.id === "more")!;
  expect(isNavigationActive("/w/demo/receipts/new", "demo", create, true)).toBe(
    true,
  );
  expect(
    isNavigationActive("/w/demo/receipts/new", "demo", receipts, true),
  ).toBe(false);
  expect(isNavigationActive("/w/demo/receipt-books", "demo", more, true)).toBe(
    true,
  );
  expect(isNavigationActive("/w/demo/expenses", "demo", more, true)).toBe(
    false,
  );
  expect(isNavigationActive("/w/sample/receipts", "demo", receipts)).toBe(
    false,
  );
  expect(workspaceHref("sample", "receipts/new")).toBe(
    "/w/sample/receipts/new",
  );
});
test("UGX formatting uses whole shillings and rejects non-finite values", () => {
  expect(formatUGX(125000).replace(/\s/g, " ")).toBe("UGX 125,000");
  expect(formatUGX(125000.6).replace(/\s/g, " ")).toBe("UGX 125,001");
  expect(formatUGX(0)).toContain("0");
  expect(() => formatUGX(Infinity)).toThrow(RangeError);
});
test("every owner navigation destination has an explicit page or planned feature", () => {
  for (const item of getNavigationForRole("business_owner")) {
    expect(
      ["home", "more"].includes(item.path) ||
        Object.hasOwn(features, item.path),
    ).toBe(true);
  }
});
