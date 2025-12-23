/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  Edit2,
  Trash2,
  Plus,
  ArrowLeft,
  Loader2,
  Save,
  MoreVertical,
  FileText,
  Link as LinkIcon,
  Video,
} from "lucide-react";

// Shadcn UI Imports
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

// --- Types ---
interface Resource {
  id: string;
  lessonId: number;
  title: string;
  url: string;
  type: "PDF" | "LINK" | "VIDEO" | "TEXT";
}

interface Lesson {
  id?: number;
  title: string;
  part: string;
  description: string;
  detailedDescription?: string;
  audioUrl: string;
  minRole: "USER" | "ADMIN";
  resources?: Resource[];
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // -- Edit State --
  const [editingLesson, setEditingLesson] = useState<Lesson>({
    title: "",
    part: "",
    description: "",
    detailedDescription: "",
    audioUrl: "",
    minRole: "USER",
    resources: [],
  });

  // -- Resource Form State --
  const [newResource, setNewResource] = useState({
    title: "",
    url: "",
    type: "PDF",
  });
  const [isAddingResource, setIsAddingResource] = useState(false);

  // --- Fetching ---
  const fetchLessons = async () => {
    try {
      const res = await fetch("/api/admin/lessons");
      const data = await res.json();
      if (data.lessons) {
        setLessons(data.lessons);
      }
    } catch (error) {
      console.error("Failed to fetch lessons", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  // --- Handlers ---
  const handleCreate = () => {
    setEditingLesson({
      title: "",
      part: "",
      description: "",
      detailedDescription: "",
      audioUrl: "",
      minRole: "USER",
      resources: [],
    });
    setIsEditing(true);
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson({ ...lesson });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await fetch(`/api/admin/lessons/${id}`, { method: "DELETE" });
      setLessons((prev) => prev.filter((l) => l.id !== id));
    } catch {
      alert("Failed to delete lesson.");
    }
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
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
        setIsEditing(false);
        fetchLessons();
      } else {
        alert(data.error || "Save failed");
      }
    } catch {
      alert("Error saving lesson");
    }
  };

  // --- Resource Handlers ---
  const handleAddResource = async () => {
    if (!editingLesson.id) {
      alert("Please save the lesson first before adding resources.");
      return;
    }
    if (!newResource.title || !newResource.url) return;

    setIsAddingResource(true);
    try {
      const res = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: editingLesson.id,
          ...newResource,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setEditingLesson((prev) => ({
          ...prev,
          resources: [...(prev.resources || []), data.resource],
        }));
        setNewResource({ title: "", url: "", type: "PDF" });
      } else {
        alert(data.error);
      }
    } catch {
      alert("Failed to add resource");
    } finally {
      setIsAddingResource(false);
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm("Remove this resource?")) return;
    try {
      const res = await fetch(`/api/admin/resources/${resourceId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEditingLesson((prev) => ({
          ...prev,
          resources: prev.resources?.filter((r) => r.id !== resourceId),
        }));
      }
    } catch {
      alert("Failed to delete resource");
    }
  };

  // --- Helpers ---
  const getIconForType = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "VIDEO":
        return <Video className="h-4 w-4 text-blue-500" />;
      default:
        return <LinkIcon className="h-4 w-4 text-slate-500" />;
    }
  };

  // --- Views ---
  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // === Edit / Create View ===
  if (isEditing) {
    return (
      <div className="mx-auto max-w-4xl py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsEditing(false)}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {editingLesson.id ? "Edit Lesson Content" : "Create New Lesson"}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSaveLesson}>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Main Details Column */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Details</CardTitle>
                  <CardDescription>
                    Basic information and audio.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Lesson Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Introduction to Quran"
                      value={editingLesson.title}
                      onChange={(e) =>
                        setEditingLesson({
                          ...editingLesson,
                          title: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Short Summary</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief overview..."
                      value={editingLesson.description}
                      onChange={(e) =>
                        setEditingLesson({
                          ...editingLesson,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="detailed">Full Content (Text)</Label>
                    <Textarea
                      id="detailed"
                      placeholder="Detailed lesson notes, transcript, etc."
                      className="min-h-[150px]"
                      value={editingLesson.detailedDescription || ""}
                      onChange={(e) =>
                        setEditingLesson({
                          ...editingLesson,
                          detailedDescription: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audioUrl">Main Audio URL</Label>
                    <Input
                      id="audioUrl"
                      placeholder="https://..."
                      value={editingLesson.audioUrl}
                      onChange={(e) =>
                        setEditingLesson({
                          ...editingLesson,
                          audioUrl: e.target.value,
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Resources Section (Only show if lesson exists) */}
              {editingLesson.id ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Course Materials</CardTitle>
                    <CardDescription>
                      Manage PDFs, links, and extra videos for this lesson.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add Resource Form */}
                    <div className="flex flex-col gap-3 rounded-md border p-4 bg-muted/20">
                      <Label className="text-xs font-semibold uppercase text-muted-foreground">
                        Add New Resource
                      </Label>
                      <div className="flex flex-col gap-2 md:flex-row">
                        <Input
                          placeholder="Title (e.g. Worksheet PDF)"
                          className="flex-1"
                          value={newResource.title}
                          onChange={(e) =>
                            setNewResource({
                              ...newResource,
                              title: e.target.value,
                            })
                          }
                        />
                        <Select
                          value={newResource.type}
                          onValueChange={(val: any) =>
                            setNewResource({ ...newResource, type: val })
                          }
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PDF">PDF</SelectItem>
                            <SelectItem value="LINK">Link</SelectItem>
                            <SelectItem value="VIDEO">Video</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="URL (https://...)"
                          value={newResource.url}
                          onChange={(e) =>
                            setNewResource({
                              ...newResource,
                              url: e.target.value,
                            })
                          }
                        />
                        <Button
                          type="button"
                          onClick={handleAddResource}
                          disabled={
                            isAddingResource ||
                            !newResource.title ||
                            !newResource.url
                          }
                        >
                          {isAddingResource ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Resources List */}
                    <div className="space-y-2">
                      <Label>Attached Resources</Label>
                      {!editingLesson.resources ||
                      editingLesson.resources.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">
                          No resources added yet.
                        </p>
                      ) : (
                        <div className="grid gap-2">
                          {editingLesson.resources.map((res) => (
                            <div
                              key={res.id}
                              className="flex items-center justify-between rounded-md border p-3"
                            >
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="rounded-full bg-muted p-2">
                                  {getIconForType(res.type)}
                                </div>
                                <div className="grid gap-0.5">
                                  <span className="text-sm font-medium truncate">
                                    {res.title}
                                  </span>
                                  <a
                                    href={res.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-muted-foreground hover:underline truncate max-w-[200px]"
                                  >
                                    {res.url}
                                  </a>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteResource(res.id)}
                                className="text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-muted/50 border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Save the lesson basic details first to add resources.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="part">Category / Module</Label>
                    <Input
                      id="part"
                      placeholder="e.g. Module 1"
                      value={editingLesson.part}
                      onChange={(e) =>
                        setEditingLesson({
                          ...editingLesson,
                          part: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Access Control</Label>
                    <Select
                      value={editingLesson.minRole}
                      onValueChange={(val: "USER" | "ADMIN") =>
                        setEditingLesson({ ...editingLesson, minRole: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">All Users</SelectItem>
                        <SelectItem value="ADMIN">Admins Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-2">
                <Button type="submit" className="w-full gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // === List View (Table) ===
  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lessons</h1>
          <p className="text-muted-foreground">
            Manage your course content and attached materials.
          </p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto gap-2">
          <Plus className="h-4 w-4" />
          Add Lesson
        </Button>
      </div>

      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Resources</TableHead>
                <TableHead>Access</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessons.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No lessons found.
                  </TableCell>
                </TableRow>
              ) : (
                lessons.map((lesson) => (
                  <TableRow key={lesson.id} className="group">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{lesson.title}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1 md:hidden">
                          {lesson.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{lesson.part}</TableCell>
                    <TableCell>
                      {lesson.resources && lesson.resources.length > 0 ? (
                        <Badge variant="secondary">
                          {lesson.resources.length} item(s)
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          lesson.minRole === "ADMIN" ? "destructive" : "outline"
                        }
                        className="capitalize"
                      >
                        {lesson.minRole === "ADMIN" ? "Admin" : "Public"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {/* Desktop Actions */}
                      <div className="hidden sm:flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(lesson)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(lesson.id!)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Mobile Actions */}
                      <div className="sm:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(lesson)}
                            >
                              <Edit2 className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(lesson.id!)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
