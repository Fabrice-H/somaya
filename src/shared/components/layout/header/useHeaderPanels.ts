import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { HeaderPanel } from "./types";

const HOVER_CLOSE_DELAY_MS = 150;

export function useHeaderPanels() {
  const pathname = usePathname();
  const [state, setState] = useState<{ panel: HeaderPanel; path: string }>({ panel: null, path: "" });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panel = state.path === pathname ? state.panel : null;

  const show = (next: HeaderPanel) => setState({ panel: next, path: pathname });
  const close = () => setState({ panel: null, path: pathname });
  const toggle = (next: Exclude<HeaderPanel, null>) => (panel === next ? close() : show(next));

  const hoverShop = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    show("shop");
  };
  const leaveShop = () => {
    closeTimer.current = setTimeout(() => {
      setState((current) => (current.panel === "shop" ? { panel: null, path: "" } : current));
    }, HOVER_CLOSE_DELAY_MS);
  };

  useEffect(() => {
    if (!panel) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setState({ panel: null, path: "" });
    };
    const previousOverflow = document.body.style.overflow;
    if (panel === "mobile") document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [panel]);

  return { panel, pathname, show, close, toggle, hoverShop, leaveShop };
}
