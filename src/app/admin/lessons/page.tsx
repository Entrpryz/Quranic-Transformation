"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Plus, ArrowLeft } from "lucide-react";

export default function LessonsPage() {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const fetchLessons = async () => {
    try {
      const res = await fetch("/api/admin/lessons");
      const data = await res.json();
      if (data.lessons) {
        setLessons(data.lessons);
      }
    } catch {
      console.error("Failed to fetch lessons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleCreate = () => {
    setEditingLesson({ minRole: "USER" }); // Default
    setIsEditing(true);
  };

  const handleEdit = (lesson: any) => {
    setEditingLesson(lesson);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this lesson?")) return;
    try {
      await fetch(`/api/admin/lessons/${id}`, { method: "DELETE" });
      setLessons(lessons.filter((l) => l.id !== id));
    } catch {
      alert("Failed to delete");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingLesson.id;
    const url = isNew
      ? "/api/admin/lessons"
      : `/api/admin/lessons/${editingLesson.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingLesson),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Saved successfully");
        setIsEditing(false);
        setEditingLesson(null);
        fetchLessons(); // Refresh
      } else {
        alert(data.error || "Save failed");
      }
    } catch {
      alert("Error saving lesson");
    }
  };

  if (loading) return <div className="text-white">Loading lessons...</div>;

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setIsEditing(false)}
            className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-white">
            {editingLesson.id ? "Edit Lesson" : "New Lesson"}
          </h2>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Title</label>
              <input
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white text-sm"
                value={editingLesson.title || ""}
                onChange={(e) =>
                  setEditingLesson({ ...editingLesson, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Part / Category
              </label>
              <input
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white text-sm"
                value={editingLesson.part || ""}
                onChange={(e) =>
                  setEditingLesson({ ...editingLesson, part: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Description
            </label>
            <textarea
              className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white text-sm h-24"
              value={editingLesson.description || ""}
              onChange={(e) =>
                setEditingLesson({
                  ...editingLesson,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Audio URL
            </label>
            <input
              className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white text-sm"
              value={editingLesson.audioUrl || ""}
              onChange={(e) =>
                setEditingLesson({ ...editingLesson, audioUrl: e.target.value })
              }
            />
          </div>

          <div className="p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-xl">
            <label className="block text-sm font-bold text-emerald-400 mb-2">
              Access Control
            </label>
            <select
              className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white text-sm"
              value={editingLesson.minRole || "USER"}
              onChange={(e) =>
                setEditingLesson({ ...editingLesson, minRole: e.target.value })
              }
            >
              <option value="USER">All Users (Default)</option>
              <option value="ADMIN">Admins Only</option>
            </select>
            <p className="text-xs text-zinc-500 mt-2">
              "Admins Only" will hide this lesson from regular students.
            </p>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium"
            >
              Save Lesson
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Lesson Management</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-sm"
        >
          <Plus size={16} />
          New Lesson
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-zinc-950 text-zinc-200 uppercase font-medium border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Part</th>
              <th className="px-6 py-4">Access</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {lessons.map((lesson) => (
              <tr
                key={lesson.id}
                className="hover:bg-zinc-800/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-white">
                  {lesson.title}
                </td>
                <td className="px-6 py-4">{lesson.part}</td>
                <td className="px-6 py-4">
                  <Badge
                    variant={
                      lesson.minRole === "ADMIN" ? "destructive" : "secondary"
                    }
                  >
                    {lesson.minRole === "ADMIN" ? "Admins Only" : "All Users"}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(lesson)}
                      className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {lessons.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                  No lessons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
