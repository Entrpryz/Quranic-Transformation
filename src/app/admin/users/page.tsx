/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldAlert, Ban } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleUpdate = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "USER" ? "ADMIN" : "USER";
    if (!confirm(`Are you sure you want to change role to ${newRole}?`)) return;

    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();

      if (res.ok) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      } else {
        alert(data.error || "Failed to update role");
      }
    } catch (error) {
      console.error("Failed to update role", error);
      alert("Error updating role");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBan = async (email: string) => {
    const reason = prompt("Enter ban reason (optional):");
    if (reason === null) return; // Cancelled

    setActionLoading(email);
    try {
      const res = await fetch("/api/admin/users/ban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reason }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("User banned successfully");
        // Optionally refresh list or mark visually, keeping it simple
      } else {
        alert(data.error || "Failed to ban user");
      }
    } catch (error) {
      console.error("Failed to ban user", error);
      alert("Error banning user");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="text-white">Loading users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <span className="text-sm text-zinc-500">{users.length} Users</span>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-zinc-950 text-zinc-200 uppercase font-medium border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-zinc-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{user.name}</span>
                    <span className="text-xs">{user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {user.role === "ADMIN" ? (
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/20 hover:bg-purple-500/30">
                        Admin
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-zinc-800 text-zinc-400 border-zinc-700"
                      >
                        User
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleRoleUpdate(user.id, user.role)}
                      disabled={actionLoading === user.id}
                      className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                      title={
                        user.role === "ADMIN"
                          ? "Demote to User"
                          : "Promote to Admin"
                      }
                    >
                      {user.role === "ADMIN" ? (
                        <ShieldAlert size={16} />
                      ) : (
                        <Shield size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => handleBan(user.email)}
                      disabled={actionLoading === user.email}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
                      title="Ban User"
                    >
                      <Ban size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
