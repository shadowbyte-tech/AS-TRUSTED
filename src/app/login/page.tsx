import { Header } from '@/components/header';
import LoginForm from '@/components/login-form';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background relative overflow-hidden dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
      {/* Premium background decoration */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000')] bg-cover bg-center opacity-5 dark:opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-primary/5 dark:from-purple-900/30 dark:via-transparent dark:to-amber-900/20"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-background via-transparent to-background dark:from-slate-900 dark:via-transparent dark:to-slate-900"></div>
      
      {/* Premium floating elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl animate-pulse dark:from-purple-500/20 dark:to-pink-500/20"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000 dark:from-amber-500/20 dark:to-yellow-500/20"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-2xl animate-pulse delay-500 dark:from-emerald-500/20 dark:to-cyan-500/20"></div>
      
      {/* Premium grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDYwIEwgNjAgMCBNIC02IDAgTCAwIDYwIEwgNjYgNjBNIDAgNiBMIDYwIDYiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIGZpbGw9Im5vbmUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-5 dark:opacity-30"></div>
      
      <Header />
      <div className="relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4 py-12 z-10">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-br from-background to-muted backdrop-blur-xl rounded-3xl border border-border shadow-2xl p-8 relative overflow-hidden dark:from-white/10 dark:to-white/5 dark:border-white/20">
            {/* Premium glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none dark:from-purple-500/10 dark:via-transparent dark:to-amber-500/10"></div>
            <div className="absolute inset-0 rounded-3xl border border-gradient-to-r from-primary/10 via-transparent to-accent/10 dark:from-purple-500/30 dark:via-transparent dark:to-amber-500/30"></div>
            
            <div className="relative z-10">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
