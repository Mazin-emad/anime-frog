import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin, useSignup } from "@/ui/hooks";
import { LogIn, UserPlus } from "lucide-react";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canClose?: boolean;
}

export function LoginDialog({ open, onOpenChange, canClose = false }: LoginDialogProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { login, loading: loginLoading } = useLogin();
  const { signup, loading: signupLoading } = useSignup();

  const loading = loginLoading || signupLoading;

  useEffect(() => {
    if (open) {
      setName("");
      setPassword("");
      setError(null);
    }
  }, [open, isSignup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Username is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    if (password.length < 3) {
      setError("Password must be at least 3 characters");
      return;
    }

    try {
      if (isSignup) {
        await signup(name.trim(), password);
      } else {
        await login(name.trim(), password);
      }
      onOpenChange(false);
    } catch (err) {
      // Error is handled by the hooks with toast
      setError(
        err instanceof Error ? err.message : "An error occurred"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={canClose ? onOpenChange : undefined}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isSignup ? (
              <>
                <UserPlus className="h-5 w-5" />
                Create Account
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Login
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isSignup
              ? "Create a new account to get started"
              : "Enter your credentials to continue"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your username"
                disabled={loading}
                autoFocus
                aria-invalid={error ? "true" : "false"}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                aria-invalid={error ? "true" : "false"}
              />
            </div>

            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSignup(!isSignup)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {isSignup ? "Switch to Login" : "Switch to Sign Up"}
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading
                ? isSignup
                  ? "Creating..."
                  : "Logging in..."
                : isSignup
                  ? "Sign Up"
                  : "Login"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

