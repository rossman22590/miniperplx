// Force dynamic rendering to access headers
export const dynamic = 'force-dynamic';

import PricingTable from './_component/pricing-table';

export default function PricingPage() {
  return (
    <div className="w-full">
      <PricingTable />
    </div>
  );
}
