"use client"

import { useState } from "react"
import { User, LogOut } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

export default function LoginDialog() {
  const { user, isAuthenticated, login, logout } = useAuthStore()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    const name = email.split("@")[0]
    login({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
    })
    setEmail("")
    setPassword("")
    setOpen(false)
  }

  const handleOAuthLogin = (provider: string) => {
    login({
      name: `${provider} User`,
      email: `user@${provider.toLowerCase()}.com`,
    })
    setOpen(false)
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2">
          <div
            className="w-8 h-8 bg-foreground text-background border-2 border-foreground flex items-center justify-center font-black text-sm uppercase"
            aria-label={`Logged in as ${user.name}`}
          >
            {user.name.charAt(0)}
          </div>
          <span className="font-bold text-sm uppercase hidden md:inline">
            {user.name}
          </span>
        </div>
        <button
          onClick={logout}
          className="p-2 hover:bg-yellow-400 transition-colors border-2 border-transparent hover:border-foreground cursor-pointer"
          aria-label="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="relative cursor-pointer p-2 hover:bg-yellow-400 transition-colors border-2 border-transparent hover:border-foreground"
          aria-label="Sign in"
        >
          <User className="w-6 h-6" />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription className="text-background/70 font-mono text-xs uppercase mt-1">
            Welcome back to ACME
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          {/* Email / Password Form */}
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="login-email"
                className="font-bold text-sm uppercase"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="border-4 border-foreground bg-background text-foreground px-4 py-3 font-mono text-sm focus:outline-none focus:ring-4 focus:ring-ring placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="login-password"
                className="font-bold text-sm uppercase"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border-4 border-foreground bg-background text-foreground px-4 py-3 font-mono text-sm focus:outline-none focus:ring-4 focus:ring-ring placeholder:text-muted-foreground"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-foreground text-background border-4 border-foreground px-4 py-3 font-black uppercase text-sm hover:bg-yellow-400 hover:text-foreground transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-1 bg-foreground" />
            <span className="font-black text-xs uppercase text-muted-foreground">
              Or
            </span>
            <div className="flex-1 h-1 bg-foreground" />
          </div>

          {/* OAuth Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleOAuthLogin("Google")}
              className="w-full flex items-center justify-center gap-3 bg-background text-foreground border-4 border-foreground px-4 py-3 font-bold uppercase text-sm hover:bg-secondary transition-colors cursor-pointer"
            >
              <GoogleIcon className="w-5 h-5" />
              Continue with Google
            </button>

            <button
              onClick={() => handleOAuthLogin("GitHub")}
              className="w-full flex items-center justify-center gap-3 bg-background text-foreground border-4 border-foreground px-4 py-3 font-bold uppercase text-sm hover:bg-secondary transition-colors cursor-pointer"
            >
              <GitHubIcon className="w-5 h-5" />
              Continue with GitHub
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
