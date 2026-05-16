"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getTaskById, updateTask, formatDateForInput } from "@/lib/tasks";

export default function EditTaskPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const task = getTaskById(id);
    if (task) {
      setForm({
        title: task.title,
        description: task.description || "",
        deadline: formatDateForInput(task.deadline),
        priority: task.priority,
      });
    }
    setLoaded(true);
  }, [id]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!form) {
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

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Judul tugas wajib diisi";
    if (!form.deadline) errs.deadline = "Deadline wajib diisi";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    updateTask(id, form);
    router.push(`/task/${id}`);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="header-gradient header-decor relative overflow-hidden px-5 sm:px-8 lg:px-12 pt-8 pb-6">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Link
              href={`/task/${id}`}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center backdrop-blur-sm"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">Edit Tugas</h1>
              <p className="text-white/60 text-xs">Perbarui detail tugas yang sudah ada</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 py-6">
        <form onSubmit={handleSubmit} className="max-w-lg">
          {/* Form card */}
          <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-sm border border-border">
            {/* Title */}
            <div className="mb-5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Judul Tugas <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Masukkan judul tugas"
                className={`w-full bg-background border ${
                  errors.title ? "border-danger" : "border-border"
                } rounded-xl px-4 py-3 text-sm placeholder:text-text-secondary`}
              />
              {errors.title && (
                <p className="text-xs text-danger mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Deskripsi
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Jelaskan detail tugas..."
                rows={3}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm placeholder:text-text-secondary resize-none"
              />
            </div>

            {/* Deadline */}
            <div className="mb-5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Deadline <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => handleChange("deadline", e.target.value)}
                className={`w-full bg-background border ${
                  errors.deadline ? "border-danger" : "border-border"
                } rounded-xl px-4 py-3 text-sm`}
              />
              {errors.deadline && (
                <p className="text-xs text-danger mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.deadline}
                </p>
              )}
            </div>

            {/* Priority */}
            <div className="mb-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                Prioritas
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    value: "high",
                    label: "High",
                    active: "bg-danger-light border-danger text-danger",
                    dot: "bg-danger",
                  },
                  {
                    value: "medium",
                    label: "Medium",
                    active: "bg-warning-light border-warning text-warning",
                    dot: "bg-warning",
                  },
                  {
                    value: "low",
                    label: "Low",
                    active: "bg-success-light border-success text-success",
                    dot: "bg-success",
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleChange("priority", opt.value)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold border-2 ${
                      form.priority === opt.value
                        ? opt.active
                        : "bg-background border-border text-text-secondary"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="w-full sm:w-auto sm:px-10 btn-gradient text-white rounded-2xl py-3.5 font-semibold text-sm"
            >
              Simpan Perubahan
            </button>
            <Link
              href={`/task/${id}`}
              className="w-full sm:w-auto sm:px-10 bg-card border border-border text-text-secondary rounded-2xl py-3.5 font-semibold text-sm text-center hover:bg-background"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
