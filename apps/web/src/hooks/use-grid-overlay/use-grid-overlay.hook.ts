import { useEffect, useState } from "react";

interface UseGridOverlayReturn {
  visible: boolean;
  toggle: () => void;
}

export const useGridOverlay = (): UseGridOverlayReturn => {
  const [visible, setVisible] = useState(false);

  const toggle = (): void => setVisible((v) => !v);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g") {
        e.preventDefault();
        setVisible((v) => !v);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return { visible, toggle };
};
