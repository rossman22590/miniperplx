// Force dynamic rendering to access headers
export const dynamic = 'force-dynamic';

import { getCurrentUser } from '@/app/actions';
import PricingTable from './_component/pricing-table';

export default async function PricingPage() {
  const user = await getCurrentUser();

  const subscriptionDetails = user?.subscription
    ? {
        hasSubscription: true,
        subscription: {
          ...user.subscription,
        },
      }
    : { hasSubscription: false };

  return (
    <div className="w-full">
      <PricingTable subscriptionDetails={subscriptionDetails} user={user} />
    </div>
  );
}
