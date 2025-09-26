export function buildTitle(domainName, extra = '') {
  const base = domainName ? `${domainName} is for sale` : 'Premium domain for sale';
  return extra ? `${base} | ${extra}` : base;
}

export function buildDescription({ domainName, highlights = [] }) {
  const base = domainName
    ? `${domainName} is available to acquire. Secure this brandable, memorable name today.`
    : `Acquire a premium, brandable domain name. Increase trust, SEO, and conversions.`;
  if (!highlights?.length) return base;
  return `${base} Highlights: ${highlights.slice(0, 3).join(' • ')}.`;
}

export function buildKeywords(domainName) {
  const parts = [
    'domain for sale',
    'buy domain',
    'premium domain',
    'brandable domain',
    'startup domain',
  ];
  if (domainName) parts.unshift(domainName);
  return parts.join(', ');
}

export function canonicalUrl(origin, path) {
  try {
    const u = new URL(path, origin || window.location.origin);
    return u.toString();
  } catch {
    return path;
  }
}

export function openGraph({ title, description, image, url, siteName = 'NameNest' }) {
  return [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    url ? { property: 'og:url', content: url } : null,
    image ? { property: 'og:image', content: image } : null,
    { property: 'og:site_name', content: siteName },
  ].filter(Boolean);
}

export function twitterCard({ title, description, image }) {
  return [
    { name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    image ? { name: 'twitter:image', content: image } : null,
  ].filter(Boolean);
}

