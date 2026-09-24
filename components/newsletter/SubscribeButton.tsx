"use client";

import { useNewsletter } from "@/components/newsletter/NewsletterProvider";

type SubscribeButtonProps = {
  variant?: "solid" | "outline" | "banner";
  className?: string;
  label?: string;
};

export default function SubscribeButton({
  variant = "solid",
  className = "",
  label = "Berlangganan",
}: SubscribeButtonProps) {
  const { open } = useNewsletter();

  const styles =
    variant === "outline"
      ? "border border-red-700 text-red-700 hover:bg-red-50"
      : variant === "banner"
        ? "bg-white text-red-700 hover:bg-red-50"
        : "bg-red-700 text-white hover:bg-red-800";

  return (
    <button
      onClick={open}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${styles} ${className}`}
    >
      {label}
    </button>
  );
}