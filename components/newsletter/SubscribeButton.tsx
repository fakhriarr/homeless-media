"use client";

import { useNewsletter } from "@/components/newsletter/NewsletterProvider";
import type { ReactNode } from "react";

type SubscribeButtonProps = {
  variant?: "solid" | "outline" | "banner";
  className?: string;
  label?: string;
  icon?: ReactNode;
};

export default function SubscribeButton({
  variant = "solid",
  className = "",
  label = "Berlangganan",
  icon,
}: SubscribeButtonProps) {
  const { open } = useNewsletter();

  const styles =
    variant === "outline"
      ? "border border-brand-700 text-brand-700 hover:bg-brand-50"
      : variant === "banner"
        ? "bg-white text-brand-700 hover:bg-brand-50"
        : "bg-brand-700 text-white hover:bg-brand-800";

  return (
    <button
      onClick={open}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${styles} ${className}`}
    >
      {label}
      {icon}
    </button>
  );
}