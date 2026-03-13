import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { SidebarLayout } from '@/components/sidebar-layout';
import { AdminPanel } from './admin-panel';
import { auth } from '@/lib/auth';
import { getAdminUsers } from '@/lib/admin';

export const metadata = {
  title: 'Admin',
};

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    redirect('/sign-in');
  }

  if (session.user.email.toLowerCase() !== 'rcohen@mytsi.org') {
    notFound();
  }

  const users = await getAdminUsers();

  return (
    <SidebarLayout>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
        <AdminPanel users={users} adminEmail={session.user.email} />
      </div>
    </SidebarLayout>
  );
}
