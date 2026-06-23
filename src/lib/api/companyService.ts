import type { Company } from "@/lib/types";
import { COMPANIES, COMPANY_BY_ID } from "@/lib/mock/companies";

/**
 * The data-access seam. The UI depends only on this interface, never on the
 * mock files directly. To go live in a later phase, implement CompanyService
 * against real APIs and swap the exported `companyService` instance — no UI
 * changes required.
 */
export interface CompanyService {
  listCompanies(): Promise<Company[]>;
  getCompany(id: string): Promise<Company | null>;
}

class MockCompanyService implements CompanyService {
  async listCompanies(): Promise<Company[]> {
    return COMPANIES;
  }
  async getCompany(id: string): Promise<Company | null> {
    return COMPANY_BY_ID[id] ?? null;
  }
}

// Phase 1 binding. Replace with e.g. `new ApiCompanyService(client)` later.
export const companyService: CompanyService = new MockCompanyService();
