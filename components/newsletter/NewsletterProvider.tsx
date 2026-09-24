"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { clientApi } from "@/lib/client-api";
import { CloseIcon, MailIcon } from "@/components/icons";

const NewsletterContext = createContext<{ open: () => void }>({ open: () => {} });

export function useNewsletter() {
  return useContext(NewsletterContext);
}

export default function NewsletterProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setStatus("idle");
      setEmail("");
      setMessage("");
    }, 200);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await clientApi.post<{ success: boolean; message: string }>("/api/newsletter", { email });
      setStatus("success");
      setMessage(res.message);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Terjadi kesalahan.");
    }
  }

  return (
    <NewsletterContext.Provider value={{ open }}>
      {children}

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Berlangganan newsletter"
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-red-700 px-6 py-8 text-white">
              <button
                onClick={close}
                className="absolute right-4 top-4 rounded-full p-1.5 text-white/80 hover:bg-white/15"
                aria-label="Tutup"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
                <MailIcon className="h-6 w-6" />
              </div>
              <h2 className="font-serif text-2xl font-bold">Berlangganan Newsletter</h2>
              <p className="mt-1 text-sm text-red-100">
                Dapatkan kabar terbaru dan berita penting langsung di email Anda.
              </p>
            </div>

            <div className="px-6 py-6">
              {status === "success" ? (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-6 text-center">
                  <p className="text-lg font-semibold text-green-800">Terima kasih!</p>
                  <p className="mt-1 text-sm text-green-700">{message}</p>
                </div>
              ) : (
                <form onSubmit={subscribe} className="space-y-3">
                  <div>
                    <label htmlFor="nl-email" className="mb-1.5 block text-sm font-medium text-zinc-700">
                      Alamat email
                    </label>
                    <input
                      id="nl-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                  {status === "error" && message && (
                    <p className="text-sm text-red-600">{message}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full rounded-lg bg-red-700 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-60"
                  >
                    {status === "loading" ? "Mengirim…" : "Berlangganan"}
                  </button>
                  <p className="text-center text-xs text-zinc-400">
                    Simulasi — email hanya disimpan di database, tidak ada email yang dikirim.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </NewsletterContext.Provider>
  );
}