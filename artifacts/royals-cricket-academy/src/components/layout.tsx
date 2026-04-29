import { Link, useLocation } from "wouter";
import { ReactNode } from "react";
import { Trophy, LayoutDashboard, UserPlus } from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-primary text-primary-foreground border-b border-primary-border shadow-sm no-print sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="bg-accent text-accent-foreground p-1.5 rounded-md shadow-sm">
              <Trophy size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl tracking-wide leading-tight">Royals Cricket Academy</h1>
              <p className="text-[0.65rem] font-medium tracking-widest uppercase text-primary-foreground/70 -mt-1">Where Champions Are Forged</p>
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 ${location === "/" ? "bg-primary-foreground/10 text-white" : "text-primary-foreground/80 hover:bg-primary-foreground/5 hover:text-white"}`}
            >
              <UserPlus size={16} />
              Registration
            </Link>
            <Link 
              href="/dashboard" 
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 ${location === "/dashboard" ? "bg-primary-foreground/10 text-white" : "text-primary-foreground/80 hover:bg-primary-foreground/5 hover:text-white"}`}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="bg-white border-t py-6 no-print">
        <div className="container mx-auto px-4 lg:px-8 text-center text-sm text-muted-foreground">
          <p className="font-serif font-medium text-foreground/80 text-lg mb-1">Royals Cricket Academy</p>
          <p>&copy; {new Date().getFullYear()} All rights reserved. Professional sports management system.</p>
        </div>
      </footer>
    </div>
  );
}
