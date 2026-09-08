// types/site-identity/site-identity.ts

export interface ISocialMedia {
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  whatsapp?: string;
}

export interface ISiteIdentity {
  siteName: string;
  tagline: string;
  contactFormNotificationEmail: string;
  adminEmail: string;
  timezone: string;
  language: string;
  logoUrl: string;
  logoPublicId: string;
  faviconUrl: string;
  faviconPublicId: string;
  socialMedia: ISocialMedia;
}

// Raw shape exactly as FastAPI returns it (snake_case) — never used outside the mapper
export interface ISiteIdentityRaw {
  site_name: string;
  tagline: string;
  contact_form_notification_email: string;
  admin_email: string;
  timezone: string;
  language: string;
  logo_url: string;
  logo_public_id: string;
  favicon_url: string;
  favicon_public_id: string;
  social_media: ISocialMedia;
}

export function mapSiteIdentity(raw: ISiteIdentityRaw): ISiteIdentity {
  return {
    siteName: raw.site_name,
    tagline: raw.tagline,
    contactFormNotificationEmail: raw.contact_form_notification_email,
    adminEmail: raw.admin_email,
    timezone: raw.timezone,
    language: raw.language,
    logoUrl: raw.logo_url,
    logoPublicId: raw.logo_public_id,
    faviconUrl: raw.favicon_url,
    faviconPublicId: raw.favicon_public_id,
    socialMedia: raw.social_media ?? {},
  };
}