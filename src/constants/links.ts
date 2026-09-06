// SVT External and Internal Links Constants

// Official Google Form link for volunteer recruitment application (leave empty if not currently configured)
// When a live Google Form is configured by leadership, paste the valid URL here.
export const GOOGLE_FORM_URL = "";

// Helper to verify if an external Google Form URL is valid and configured (never displays broken links)
export const isValidGoogleFormUrl = (url?: string | null): boolean => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  // Guard against old/broken placeholder patterns
  if (
    trimmed.includes('_SVT_Volunteer_Application') ||
    trimmed.includes('example.com') ||
    trimmed.includes('placeholder')
  ) {
    return false;
  }
  return (
    trimmed.startsWith('https://docs.google.com/forms/') ||
    trimmed.startsWith('https://forms.gle/')
  );
};

// Official domain & social links
export const OFFICIAL_DOMAIN = "www.scholarsvolunteerteam.org";
export const OFFICIAL_DOMAIN_URL = "https://www.scholarsvolunteerteam.org";
export const OFFICIAL_TWITTER_URL = "https://x.com/svt_scholars";
export const FOUNDER_LINKEDIN_URL = "https://www.linkedin.com/in/salman-a-razak-hussein/";
export const FOUNDER_TWITTER_URL = "https://x.com/salman_a_razak";

