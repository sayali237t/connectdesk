"use client";
import { X, Loader2 } from "lucide-react";

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center py-10 text-slate-400"><Loader2 className="animate-spin" /></div>
  );
}

export function Empty({ children }) {
  return <div className="py-10 text-center text-sm text-slate-500">{children}</div>;
}

export function ErrorBox({ message }) {
  return message ? <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{message}</div> : null;
}

export function confirmDelete(what) {
  return window.confirm(`Delete this ${what}? This cannot be undone.`);
}
