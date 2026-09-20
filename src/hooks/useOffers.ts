"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Offer } from "@/lib/offerUtils";
import { getActiveOffers } from "@/lib/offerUtils";

export function useOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);
  const initializedRef = useRef(false);

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAuthError(false);
    try {
      const res = await fetch("/api/offers");
      if (res.status === 401) {
        setAuthError(true);
        setError("Session expired. Please log in again.");
        return;
      }
      if (res.status === 403) {
        setAuthError(true);
        setError("You don't have permission to view offers.");
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to fetch offers");
      }
      const data = await res.json();
      setOffers(data.offers ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch offers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      fetchOffers();
    }
  }, [fetchOffers]);

  const activeCount = getActiveOffers(offers).length;
  const expiredCount = offers.filter(
    (o) => o.enabled && !getActiveOffers([o]).length,
  ).length;

  return {
    offers,
    loading,
    error,
    authError,
    refetch: fetchOffers,
    stats: {
      total: offers.length,
      active: activeCount,
      expired: expiredCount,
    },
  };
}
