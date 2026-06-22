import { notFound } from "next/navigation";
import { COMPANY_IDS, COMPANY_BY_ID } from "@/lib/mock/companies";
import { CompanyDashboard } from "@/components/dashboard/CompanyDashboard";

// Required for static export: pre-render a page per known company id.
export function generateStaticParams() {
  return COMPANY_IDS.map((id) => ({ id }));
}

export default function CompanyPage({ params }: { params: { id: string } }) {
  const company = COMPANY_BY_ID[params.id];
  if (!company) notFound();
  return <CompanyDashboard company={company} />;
}
