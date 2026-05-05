import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
export default async function Dashboard() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return <main className="p-8"><h1 className="text-3xl font-bold">Welcome {user.email}</h1></main>;
}
