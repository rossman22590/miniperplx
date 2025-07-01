import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth-utils';

export default async function NewPage() {
  const user = await getUser();
  
  if (!user) {
    redirect('/sign-in?callbackUrl=/');
  }
  
  redirect('/');
}
