"use client";

import { useCallback, useEffect, useState } from "react";
import { getMembers, getProducts, getSales } from "@/firebase-actions";
import { useAuth } from "@/components/providers/AuthProvider";
import type { DateRange } from "./types";
import { errorMessage } from "./utils";

/** Runs an async loader, tracks its state, and lets the caller reload it. */
export function useAsyncData<T>(loader: () => Promise<T>, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    loader()
      .then((result) => {
        if (!active) return;
        setData(result);
        setError(null);
      })
      .catch((reason) => active && setError(errorMessage(reason)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [loader, version]);

  const reload = useCallback(() => setVersion((current) => current + 1), []);
  return { data, loading, error, reload };
}

export function useProducts() {
  const businessId = useAuth().profile?.businessId ?? "";
  const loader = useCallback(() => getProducts(businessId), [businessId]);
  return useAsyncData(loader, []);
}

export function useSales(range: DateRange) {
  const businessId = useAuth().profile?.businessId ?? "";
  const { from, to } = range;
  const loader = useCallback(() => getSales(businessId, { from, to }), [businessId, from, to]);
  return useAsyncData(loader, []);
}

export function useMembers() {
  const businessId = useAuth().profile?.businessId ?? "";
  const loader = useCallback(() => getMembers(businessId), [businessId]);
  return useAsyncData(loader, []);
}
