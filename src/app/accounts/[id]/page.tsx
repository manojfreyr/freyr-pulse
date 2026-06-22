import { notFound } from "next/navigation";
import { COMPANY_IDS, COMPANY_BY_ID } from "@/lib/mock/companies";
import { AccountDetail } from "@/components/accounts/AccountDetail";

// Saved accounts can only be one of the known mock companies, so the same ids
// drive static generation for account detail pages.
export function generateStaticParams() {
  return COMPANY_IDS.map((id) => ({ id }));
}

export default function AccountDetailPage({ params }: { params: { id: string } }) {
  const company = COMPANY_BY_ID[params.id];
  if (!company) notFound();
  return <AccountDetail company={company} />;
}
