import { useEffect, useState } from "react";
import { LoginDialog } from "./LoginDialog.js";
import { useAuth } from "../../contexts/AuthContext.js";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Small delay to ensure localStorage is checked
    const timer = setTimeout(() => {
      setIsChecking(false);
      setShowDialog(!isAuthenticated);
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  // Close dialog when authenticated
  useEffect(() => {
    if (isAuthenticated && showDialog) {
      setShowDialog(false);
    }
  }, [isAuthenticated, showDialog]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurred background overlay */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div className="relative z-50">
            <LoginDialog
              open={showDialog}
              onOpenChange={(open) => {
                // Only allow closing if authenticated
                if (isAuthenticated) {
                  setShowDialog(open);
                }
              }}
              canClose={isAuthenticated}
            />
          </div>
        </div>
      )}
      {isAuthenticated && children}
    </>
  );
}

