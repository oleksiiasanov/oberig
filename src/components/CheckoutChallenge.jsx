import { useEffect, useRef } from "react";
import { createChallenge } from "../lib/turnstile.js";

// Public sitekey only. Every submission/retry executes a fresh challenge.
export function CheckoutChallenge({ sitekey, challengeRef }) {
  const container = useRef(null);
  useEffect(() => {
    const challenge = createChallenge(container.current, sitekey);
    challengeRef.current = () => challenge.execute();
    return () => { challengeRef.current = null; challenge.dispose(); };
  }, [sitekey, challengeRef]);
  return <div ref={container} className="checkout-verification" />;
}
