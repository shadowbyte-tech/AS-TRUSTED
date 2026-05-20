'use client';

import { Suspense } from 'react';
import LoginForm from '@/components/login-form';
import { ASLogo } from '@/components/as-logo';
import { ShieldCheck, Sparkles, Users } from 'lucide-react';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
      </div>
    }>
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.12),transparent_34%),linear-gradient(135deg,#050505_0%,#111113_46%,#050505_100%)] text-white">
        <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-5 py-8 lg:grid-cols-[1fr_440px] lg:px-8">
          <section className="hidden lg:block">
            <div className="max-w-xl space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-amber-400/15 bg-white/[0.03] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-200">
                <ShieldCheck className="h-4 w-4" />
                Owner Command Access
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-black/40">
                    <ASLogo className="h-12 w-12" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-300">AS Trusted</p>
                    <h1 className="text-4xl font-bold tracking-tight">Executive Portal</h1>
                  </div>
                </div>

                <p className="max-w-lg text-base leading-7 text-zinc-300">
                  Secure owner access for property operations, client activity, and management workflows.
                </p>
              </div>

              <div className="grid max-w-lg grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <Sparkles className="mb-4 h-5 w-5 text-amber-300" />
                  <p className="text-sm font-semibold text-white">Premium Control</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-400">Fast access to high-value admin tools.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <Users className="mb-4 h-5 w-5 text-sky-300" />
                  <p className="text-sm font-semibold text-white">Client Ready</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-400">Manage users, inquiries, and listings cleanly.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto w-full max-w-[440px]">
            <LoginForm />
          </section>
        </div>
      </main>
    </Suspense>
  );
}
