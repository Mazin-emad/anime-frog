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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/ui/contexts/AuthContext";
import {
  useUpdateUserAccount,
  useDeleteUserAccount,
  useAllUsers,
} from "@/ui/hooks";
import { toast } from "sonner";
import { Trash2, Pencil, Save, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { user, setUser, logout } = useAuth();
  const { updateUser, loading: updating } = useUpdateUserAccount();
  const { deleteUser, loading: deleting } = useDeleteUserAccount();
  const { data: allUsers, loading: usersLoading, refetch } = useAllUsers();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingPassword, setEditingPassword] = useState("");

  const isAdmin = user?.name.toLowerCase() === "admin";

  useEffect(() => {
    if (open && user) {
      setName(user.name);
      setPassword("");
      setError(null);
      setEditingUserId(null);
      if (isAdmin) {
        refetch();
      }
    }
  }, [open, user, isAdmin, refetch]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
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
      if (!user) return;
      await updateUser(user.id, name.trim(), password.trim());
      // Update the user in context
      setUser({ ...user, name: name.trim(), password: password.trim() });
      onOpenChange(false);
    } catch (err: unknown) {
      toast.error((err as Error).message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteUser(user.id);
      await logout();
      onOpenChange(false);
    } catch (err: unknown) {
      toast.error((err as Error).message);
    }
  };

  const handleEditUser = (userId: number, currentName: string) => {
    setEditingUserId(userId);
    setEditingName(currentName);
    setEditingPassword("");
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditingName("");
    setEditingPassword("");
  };

  const handleSaveUser = async (userId: number) => {
    if (!editingName.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!editingPassword.trim()) {
      toast.error("Password is required");
      return;
    }

    try {
      await updateUser(userId, editingName.trim(), editingPassword.trim());
      setEditingUserId(null);
      refetch();
      toast.success("User updated", {
        description: "User has been updated successfully",
      });
    } catch (err: unknown) {
      toast.error((err as Error).message);
      // Error handled by hook
    }
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (userId === user?.id) {
      toast.error("Cannot delete yourself", {
        description: "Please use the delete account button below",
      });
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteUser(userId);
      refetch();
      toast.success("User deleted", {
        description: `User "${userName}" has been deleted`,
      });
    } catch (err: unknown) {
      toast.error((err as Error).message);
      // Error handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription>
            {isAdmin
              ? "Manage your account and all users in the system"
              : "Update or delete your account"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User's Own Profile */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Account</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your username"
                  disabled={updating}
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
                  placeholder="Enter new password"
                  disabled={updating}
                />
              </div>

              {error && <div className="text-sm text-destructive">{error}</div>}

              <div className="flex gap-2">
                <Button type="submit" disabled={updating}>
                  {updating ? "Updating..." : "Update Account"}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {deleting ? "Deleting..." : "Delete Account"}
                </Button>
              </div>
            </form>
          </div>

          {/* Admin Users Table */}
          {isAdmin && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">All Users</h3>
              {usersLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : allUsers && allUsers.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Password</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.id}</TableCell>
                          <TableCell>
                            {editingUserId === u.id ? (
                              <Input
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="h-8"
                              />
                            ) : (
                              u.name
                            )}
                          </TableCell>
                          <TableCell>
                            {editingUserId === u.id ? (
                              <Input
                                type="password"
                                value={editingPassword}
                                onChange={(e) =>
                                  setEditingPassword(e.target.value)
                                }
                                placeholder="New password"
                                className="h-8"
                              />
                            ) : (
                              <span className="text-muted-foreground">
                                ••••••••
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {editingUserId === u.id ? (
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleSaveUser(u.id)}
                                  disabled={updating}
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleCancelEdit}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditUser(u.id, u.name)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteUser(u.id, u.name)}
                                  disabled={deleting}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No users found</p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
