'use client';
import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignupPage() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [msg, setMsg] = useState('');
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/auth/callback` } });
    setMsg(error ? error.message : 'Check your email to confirm.');
  }
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-lg border p-6">
        <h1 className="text-2xl font-bold">Create account</h1>
        <div><Label>Email</Label><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
        <div><Label>Password</Label><Input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <Button type="submit" className="w-full">Sign up</Button>
      </form>
    </div>
  );
}
