"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getTasks,
  sortTasks,
  searchTasks,
  filterByPriority,
  formatDate,
  getDeadlineColor,
  getDeadlineColorName,
  getDaysUntilDeadline,
  deleteTask,
  updateTask,
} from "@/lib/tasks";

const PRIORITY_LABELS = { high: "High", medium: "Medium", low: "Low" };

function PriorityBadge({ priority }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold priority-${priority}`}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

function DeadlineInfo({ deadline }) {
  const days = getDaysUntilDeadline(deadline);
  const color = getDeadlineColorName(deadline);
  const colorMap = {
    red: "text-danger",
    yellow: "text-warning",
    green: "text-success",
  };

  let label;
  if (days < 0) label = `${Math.abs(days)} hari terlewat`;
  else if (days === 0) label = "Hari ini";
  else if (days === 1) label = "Besok";
  else label = `${days} hari lagi`;

  return (
    <span className={`text-xs font-medium ${colorMap[color]}`}>{label}</span>
  );
}

function TaskCard({ task, onDelete, onToggle }) {
  const deadlineClass = getDeadlineColor(task.deadline);

  return (
    <div
      className={`bg-card rounded-xl ${deadlineClass} pl-4 pr-3 py-3 shadow-sm card-hover`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
            task.completed
              ? "bg-primary border-primary"
              : "border-text-secondary hover:border-primary"
          }`}
          aria-label={task.completed ? "Tandai belum selesai" : "Tandai selesai"}
        >
          {task.completed && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <Link href={`/task/${task.id}`} className="flex-1 min-w-0">
          <h3
            className={`text-sm font-semibold leading-tight ${
              task.completed ? "line-through text-text-secondary" : "text-foreground"
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <svg className="w-3 h-3 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-text-secondary">{formatDate(task.deadline)}</span>
            <DeadlineInfo deadline={task.deadline} />
          </div>
        </Link>

        <div className="flex flex-col items-end gap-1.5">
          <PriorityBadge priority={task.priority} />
          <div className="flex gap-1">
            <Link href={`/edit/${task.id}`} className="p-1.5 rounded-lg hover:bg-primary-50" aria-label="Edit tugas">
              <svg className="w-3.5 h-3.5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button onClick={() => onDelete(task.id)} className="p-1.5 rounded-lg hover:bg-danger-light" aria-label="Hapus tugas">
              <svg className="w-3.5 h-3.5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTasks(getTasks());
    setLoaded(true);
  }, []);

  const filteredTasks = useMemo(() => {
    let result = tasks;
    result = searchTasks(result, search);
    result = filterByPriority(result, priorityFilter);
    return sortTasks(result);
  }, [tasks, search, priorityFilter]);

  const handleDelete = (id) => {
    if (confirm("Hapus tugas ini?")) {
      deleteTask(id);
      setTasks(getTasks());
    }
  };

  const handleToggle = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      updateTask(id, { completed: !task.completed });
      setTasks(getTasks());
    }
  };

  const taskCounts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    return { total, completed, active: total - completed };
  }, [tasks]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="header-gradient header-decor relative overflow-hidden px-5 sm:px-8 lg:px-12 pt-8 pb-8">
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Top bar: logo + add button */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-1.5">
                <Image
                  src="/logo-undira.png"
                  alt="Logo UNDIRA"
                  width={90}
                  height={28}
                  className="h-7 w-auto brightness-0 invert"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Smart Task Manager
                </h1>
                <p className="text-white/60 text-xs sm:text-sm">
                  Kelola tugas harianmu dengan cerdas
                </p>
              </div>
            </div>
            <Link
              href="/add"
              className="hidden sm:flex btn-gradient text-white rounded-xl px-5 py-2.5 items-center gap-2 text-sm font-semibold"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="M12 4v16m8-8H4" />
              </svg>
              Tambah Tugas
            </Link>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-3 max-w-md">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 text-center border border-white/10">
              <p className="text-2xl font-bold text-white">{taskCounts.total}</p>
              <p className="text-xs text-white/60 mt-0.5">Total Tugas</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 text-center border border-white/10">
              <p className="text-2xl font-bold text-white">{taskCounts.active}</p>
              <p className="text-xs text-white/60 mt-0.5">Aktif</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 text-center border border-white/10">
              <p className="text-2xl font-bold text-white">{taskCounts.completed}</p>
              <p className="text-xs text-white/60 mt-0.5">Selesai</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-5">
        {/* Search + Filter row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search */}
          <div className="flex-1 bg-card rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-sm border border-border">
            <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari tugas berdasarkan judul atau deskripsi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm placeholder:text-text-secondary focus:outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-text-secondary hover:text-danger">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Priority Filter */}
          <div className="flex gap-2 items-center flex-wrap">
            {[
              { key: "all", label: "Semua", icon: null },
              { key: "high", label: "High", color: "bg-danger" },
              { key: "medium", label: "Medium", color: "bg-warning" },
              { key: "low", label: "Low", color: "bg-success" },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => setPriorityFilter(p.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border ${
                  priorityFilter === p.key
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-card text-text-secondary border-border hover:border-primary/30"
                }`}
              >
                {p.color && (
                  <span className={`w-2 h-2 rounded-full ${p.color}`} />
                )}
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <p className="text-base font-semibold text-foreground">
              {search || priorityFilter !== "all"
                ? "Tidak ada tugas ditemukan"
                : "Belum ada tugas"}
            </p>
            <p className="text-sm text-text-secondary mt-1 max-w-xs">
              {search || priorityFilter !== "all"
                ? "Coba ubah filter atau kata kunci pencarian"
                : "Mulai produktif! Tambahkan tugas pertamamu dengan menekan tombol di bawah."}
            </p>
            {!search && priorityFilter === "all" && (
              <Link
                href="/add"
                className="mt-5 btn-gradient text-white rounded-xl px-6 py-2.5 text-sm font-semibold inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M12 4v16m8-8H4" />
                </svg>
                Tambah Tugas Pertama
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB - mobile only */}
      <Link
        href="/add"
        className="sm:hidden fixed bottom-5 right-5 left-5 btn-gradient text-white rounded-2xl py-3.5 flex items-center justify-center gap-2 font-semibold text-sm"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path d="M12 4v16m8-8H4" />
        </svg>
        Tambah Tugas
      </Link>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-6 mt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border pt-6">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-undira.png"
              alt="Logo UNDIRA"
              width={80}
              height={25}
              className="h-6 w-auto opacity-60"
            />
            <span className="text-xs text-text-secondary">|</span>
            <span className="text-xs text-text-secondary">
              UTS Pemrograman Fullstack 2025/2026
            </span>
          </div>
          <p className="text-xs text-text-secondary">
            Smart Task Manager v1.0
          </p>
        </div>
      </footer>
    </div>
  );
}
