"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MenuItemRow } from "@/lib/menuMapping";

export function useMenu() {
  const [menuItems, setMenuItems] = useState<MenuItemRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);
  const initializedRef = useRef(false);

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAuthError(false);
    try {
      const res = await fetch("/api/menu");
      if (res.status === 401) {
        setAuthError(true);
        setError("Session expired. Please log in again.");
        return;
      }
      if (res.status === 403) {
        setAuthError(true);
        setError("You don't have permission to view menu items.");
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to fetch menu items");
      }
      const data = await res.json();
      setMenuItems(data.menuItems ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch menu items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      fetchMenu();
    }
  }, [fetchMenu]);

  const featuredCount = menuItems.filter((item) => item.featured).length;
  const enabledCount = menuItems.filter((item) => item.enabled).length;

  return {
    menuItems,
    loading,
    error,
    authError,
    refetch: fetchMenu,
    stats: {
      total: menuItems.length,
      enabled: enabledCount,
      featured: featuredCount,
    },
  };
}
