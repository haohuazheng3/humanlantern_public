"use client";

import { useEffect } from "react";
import { ANALYTICS_LOADED_EVENT } from "./Consent";

/**
 * Tells FlowGlance who this visitor is: the owner in the admin area (so every device the owner
 * uses is excluded from the numbers) and a buyer on the success page (so a purchase joins its
 * journey). A no-op when analytics are off.
 */
export function Identify({ userRef, email }: { userRef: string; email: string }) {
  useEffect(() => {
    const send = () => {
      try {
        window.fw?.("identify", { userRef, email });
      } catch (e) {
        console.warn("[analytics] identify failed", e);
      }
    };
    if (window.fw) send();
    else window.addEventListener(ANALYTICS_LOADED_EVENT, send, { once: true });
    return () => window.removeEventListener(ANALYTICS_LOADED_EVENT, send);
  }, [userRef, email]);
  return null;
}
