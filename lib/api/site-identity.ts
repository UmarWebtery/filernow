import { cache } from "react";
import { ISiteIdentity, ISiteIdentityRaw, mapSiteIdentity } from "../types/site-identity/site-identity";

const FASTAPI_URL = process.env.FASTAPI_INTERNAL_URL;

if (!FASTAPI_URL) {
  throw new Error(
    "[site-identity] FASTAPI_INTERNAL_URL is not set — check .env.local"
  );
}

// Hard fallback so the site never renders broken if the CMS is down —
// same defensive pattern as blogs.ts's mock fallback.
const FALLBACK_SITE_IDENTITY: ISiteIdentity = {
  siteName: "FilerNow",
  tagline: "Pakistan's Trusted Tax & Compliance Partner",
  contactFormNotificationEmail: "",
  adminEmail: "",
  timezone: "Asia/Karachi",
  language: "en",
  logoUrl: "/assets/headerLogo.svg",
  logoPublicId: "",
  faviconUrl: "/favicon.ico",
  faviconPublicId: "",
  socialMedia: {},
};

/**
 * react's `cache()` dedupes this within a single render pass — layout,
 * generateMetadata, Header, Footer all call this, but it only hits the
 * network once per request. Combined with `next.revalidate`, subsequent
 * requests serve from Next's data cache until it expires or is purged
 * via revalidateTag("site-identity").
 */
export const getSiteIdentity = cache(async (): Promise<ISiteIdentity> => {
  try {
    const res = await fetch(`${FASTAPI_URL}/api/admin/site-identity`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
      next: { revalidate: 0, tags: ["site-identity"] },
    });

    if (res.status === 401 || res.status === 403) {
      // Known open item: this route currently requires admin auth.
      // Public-facing header/footer can't authenticate as admin —
      // waiting on Umar for a public alias or an auth exemption on GET.
      console.warn("[site-identity] endpoint requires auth — using fallback until Backend dev exposes a public route");
      return FALLBACK_SITE_IDENTITY;
    }

    if (!res.ok) {
      throw new Error(`Site identity fetch failed: ${res.status}`);
    }

    const raw: ISiteIdentityRaw = await res.json();
    return mapSiteIdentity(raw);
  } catch (err) {
    console.error("[site-identity] falling back to defaults:", err);
    return FALLBACK_SITE_IDENTITY;
  }
});