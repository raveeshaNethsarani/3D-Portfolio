import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import * as THREE from "three";
import type { PointerState } from "./types";

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

// Starts true so the first frame always renders, then follows visibility.
export function useOnScreen(ref: RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return visible;
}

export function useElementHeight(ref: RefObject<HTMLElement | null>) {
  const [h, setH] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setH(e.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return h;
}

// Stored in a ref so moving the mouse never re-renders React.
export function usePointer(targetRef: RefObject<HTMLElement | null>, enabled: boolean) {
  const pointer = useRef<PointerState>({ x: 0, y: 0, active: false });
  useEffect(() => {
    const p = pointer.current;
    if (!enabled) {
      p.active = false;
      return;
    }
    const onMove = (e: PointerEvent) => {
      const el = targetRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      p.x = THREE.MathUtils.clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
      p.y = THREE.MathUtils.clamp(1 - ((e.clientY - r.top) / r.height) * 2, -1, 1);
      p.active = e.clientY >= r.top && e.clientY <= r.bottom;
    };
    const onLeave = () => {
      p.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [targetRef, enabled]);
  return pointer;
}

// undefined = still loading, null = not available, Texture = ready.
export function useOptionalTexture(url: string | null): THREE.Texture | null | undefined {
  const [result, setResult] = useState<{ url: string; tex: THREE.Texture | null }>();
  useEffect(() => {
    if (!url) return;
    let alive = true;
    let loaded: THREE.Texture | undefined;
    new THREE.TextureLoader().load(
      url,
      (t) => {
        if (!alive) return t.dispose();
        t.colorSpace = THREE.NoColorSpace;
        t.generateMipmaps = false;
        t.minFilter = THREE.LinearFilter;
        loaded = t;
        setResult({ url, tex: t });
      },
      undefined,
      () => {
        if (alive) setResult({ url, tex: null });
      },
    );
    return () => {
      alive = false;
      loaded?.dispose();
    };
  }, [url]);
  if (!url) return null;
  return result?.url === url ? result.tex : undefined;
}
