import type { Company } from "@/lib/types";
import { pfizer } from "./pfizer";
import { moderna } from "./moderna";
import { amgen } from "./amgen";
import { medtronic } from "./medtronic";
import { gilead } from "./gilead";

/** The Phase 1 mock universe. Replace this module with live data in later phases. */
export const COMPANIES: Company[] = [pfizer, moderna, amgen, medtronic, gilead];

export const COMPANY_BY_ID: Record<string, Company> = Object.fromEntries(
  COMPANIES.map((c) => [c.id, c]),
);

/** Stable list of company ids — used by generateStaticParams for static export. */
export const COMPANY_IDS: string[] = COMPANIES.map((c) => c.id);
