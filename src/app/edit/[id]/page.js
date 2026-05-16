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
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-5">
        <p className="text-lg font-semibold mb-2">Tugas tidak ditemukan</p>
        <Link href="/" className="text-primary text-sm font-medium">
          Kembali ke beranda
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
      <header className="bg-primary px-5 sm:px-8 lg:px-12 pt-8 pb-5">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link
            href={`/task/${id}`}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg sm:text-xl font-bold text-white">Edit Tugas</h1>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 py-6">
        <form onSubmit={handleSubmit} className="max-w-lg">
          {/* Title */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Judul Tugas <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Masukkan judul tugas"
              className={`w-full bg-card border ${
                errors.title ? "border-danger" : "border-border"
              } rounded-xl px-4 py-3 text-sm placeholder:text-text-secondary`}
            />
            {errors.title && (
              <p className="text-xs text-danger mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Deskripsi
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Masukkan deskripsi tugas"
              rows={3}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm placeholder:text-text-secondary resize-none"
            />
          </div>

          {/* Deadline */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Deadline <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => handleChange("deadline", e.target.value)}
              className={`w-full bg-card border ${
                errors.deadline ? "border-danger" : "border-border"
              } rounded-xl px-4 py-3 text-sm`}
            />
            {errors.deadline && (
              <p className="text-xs text-danger mt-1">{errors.deadline}</p>
            )}
          </div>

          {/* Priority */}
          <div className="mb-8">
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Prioritas
            </label>
            <div className="flex gap-3">
              {[
                {
                  value: "high",
                  label: "High",
                  active: "bg-danger-light border-danger text-danger",
                },
                {
                  value: "medium",
                  label: "Medium",
                  active: "bg-warning-light border-warning text-warning",
                },
                {
                  value: "low",
                  label: "Low",
                  active: "bg-success-light border-success text-success",
                },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange("priority", opt.value)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 ${
                    form.priority === opt.value
                      ? opt.active
                      : "bg-card border-border text-text-secondary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full sm:w-auto sm:px-12 bg-primary hover:bg-primary-dark text-white rounded-2xl py-3.5 font-semibold text-sm shadow-lg"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}
