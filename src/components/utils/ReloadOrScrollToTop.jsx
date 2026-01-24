import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ReloadOrScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }, 50);
    return () => clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return null;
}
