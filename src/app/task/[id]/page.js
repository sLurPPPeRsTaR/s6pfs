"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getTaskById,
  formatDate,
  getDeadlineColorName,
  getDaysUntilDeadline,
  deleteTask,
  updateTask,
} from "@/lib/tasks";

const PRIORITY_CONFIG = {
  high: { label: "High", bg: "bg-danger-light", text: "text-danger", border: "border-danger", dot: "bg-danger" },
  medium: { label: "Medium", bg: "bg-warning-light", text: "text-warning", border: "border-warning", dot: "bg-warning" },
  low: { label: "Low", bg: "bg-success-light", text: "text-success", border: "border-success", dot: "bg-success" },
};

const DEADLINE_CONFIG = {
  red: { bg: "bg-danger-light", text: "text-danger", label: "Mendesak", icon: "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  yellow: { bg: "bg-warning-light", text: "text-warning", label: "Segera", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  green: { bg: "bg-success-light", text: "text-success", label: "Aman", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
};

export default function TaskDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = getTaskById(id);
    setTask(t);
    setLoaded(true);
  }, [id]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-5">
        <div className="w-16 h-16 rounded-2xl bg-danger-light flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-lg font-semibold mb-1">Tugas tidak ditemukan</p>
        <p className="text-sm text-text-secondary mb-4">Mungkin sudah dihapus atau ID tidak valid</p>
        <Link href="/" className="btn-gradient text-white text-sm font-semibold px-5 py-2 rounded-xl">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const days = getDaysUntilDeadline(task.deadline);
  const deadlineColor = getDeadlineColorName(task.deadline);
  const dlConfig = DEADLINE_CONFIG[deadlineColor];
  const prConfig = PRIORITY_CONFIG[task.priority];

  const handleDelete = () => {
    if (confirm("Hapus tugas ini?")) {
      deleteTask(task.id);
      router.push("/");
    }
  };

  const handleToggle = () => {
    updateTask(task.id, { completed: !task.completed });
    setTask({ ...task, completed: !task.completed });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="header-gradient header-decor relative overflow-hidden px-5 sm:px-8 lg:px-12 pt-8 pb-6">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center backdrop-blur-sm"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-lg sm:text-xl font-bold text-white">Detail Tugas</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/edit/${task.id}`}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center backdrop-blur-sm"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Link>
              <button
                onClick={handleDelete}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-danger/30 flex items-center justify-center backdrop-blur-sm"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 py-6">
        <div className="max-w-lg">
          {/* Status badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${prConfig.bg} ${prConfig.text} border ${prConfig.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${prConfig.dot}`} />
              {prConfig.label} Priority
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${dlConfig.bg} ${dlConfig.text}`}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d={dlConfig.icon} />
              </svg>
              {dlConfig.label}
            </span>
            {task.completed && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Selesai
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${task.completed ? "line-through text-text-secondary" : ""}`}>
            {task.title}
          </h2>

          {/* Info cards */}
          <div className="space-y-3 mb-6">
            {/* Deadline Card */}
            <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl ${dlConfig.bg} flex items-center justify-center`}>
                  <svg className={`w-5 h-5 ${dlConfig.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-text-secondary font-medium">Deadline</p>
                  <p className="text-sm font-bold">{formatDate(task.deadline)}</p>
                  <p className={`text-xs font-semibold ${dlConfig.text}`}>
                    {days < 0
                      ? `${Math.abs(days)} hari terlewat!`
                      : days === 0
                      ? "Hari ini!"
                      : days === 1
                      ? "Besok"
                      : `${days} hari lagi`}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <p className="text-xs font-semibold text-text-secondary">Deskripsi</p>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            )}

            {/* Created date */}
            <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-text-secondary">
                  Dibuat pada <span className="font-semibold">{formatDate(task.createdAt)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleToggle}
              className={`w-full sm:w-auto sm:px-10 rounded-2xl py-3.5 font-semibold text-sm ${
                task.completed
                  ? "bg-card border-2 border-primary text-primary hover:bg-primary-50"
                  : "btn-gradient text-white"
              }`}
            >
              {task.completed ? "Tandai Belum Selesai" : "Tandai Selesai"}
            </button>
            <Link
              href={`/edit/${task.id}`}
              className="w-full sm:w-auto sm:px-10 bg-card border border-border text-text-secondary rounded-2xl py-3.5 font-semibold text-sm text-center hover:bg-background"
            >
              Edit Tugas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
