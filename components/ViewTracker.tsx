"use client";

import { useEffect } from "react";
import { clientApi } from "@/lib/client-api";

export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    clientApi.post(`/api/articles/${slug}`).catch(() => {});
  }, [slug]);

  return null;
}