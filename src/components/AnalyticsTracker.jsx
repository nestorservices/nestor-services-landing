import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const LAST_PAGE_VIEW_KEY = "__nestorLastGaPageViewKey";

function trackPageView(url) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const key = `${url.pathname}${url.search}${url.hash}`;
  if (window[LAST_PAGE_VIEW_KEY] === key) return;
  window[LAST_PAGE_VIEW_KEY] = key;
  window.gtag("event", "page_view", {
    page_path: url.pathname + url.search,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location);
  }, [location]);

  return null;
}
