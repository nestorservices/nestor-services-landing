# SEO/GEO Monitoring Checklist

## Purpose
Use this checklist to confirm Nestor pages are being crawled, indexed, measured, and understood by search engines and AI systems.

## Weekly cadence
- Review once per week.
- Use the same day and approximate time each week.
- Keep notes short and consistent so changes are easy to spot.

## Google Search Console checks
Check the main site first: `https://www.nestorservices.in`

For each property and page set, verify:
- Sitemap status
- Indexed pages count
- Not indexed reasons
- URL inspection for priority pages
- Search performance: impressions, clicks, queries, and pages

Priority pages to inspect:
- `https://www.nestorservices.in/`
- `https://www.nestorservices.in/nestor-hire`
- `https://www.nestorservices.in/nestor-core`
- `https://www.nestorservices.in/recruitment-services`
- `https://www.nestorservices.in/hr-operations-payroll`
- `https://www.nestorservices.in/blog`

For Hire, also check:
- Hire sitemap status
- Job sitemap discovery
- Priority job URLs
- Open job detail pages
- Closed job tombstone pages only where relevant

## Bing Webmaster checks
Verify:
- Sitemap status
- Discovered URL count
- URL inspection or Live URL checks
- SEO/GEO warnings
- Priority URLs are accessible and indexable

Use the same priority pages as Google, plus job pages on Hire.

## GA4 checks
Confirm GA4 is working and showing activity for:
- Realtime traffic
- Top pages
- Traffic acquisition
- Organic search visits
- Referral visits
- Product page visits
- Blog page visits
- Hire job page visits
- Core site visits
- Movement between the main site, Hire, and Core

## Technical spot checks
Run these checks directly in a browser or with `curl`.

### robots.txt
```bash
curl -s https://www.nestorservices.in/robots.txt
```

### main sitemap
```bash
curl -s https://www.nestorservices.in/sitemap.xml
```

### homepage raw HTML
```bash
curl -s https://www.nestorservices.in/
```

### blog index raw HTML
```bash
curl -s https://www.nestorservices.in/blog
```

### product page raw HTML
```bash
curl -s https://www.nestorservices.in/nestor-hire
curl -s https://www.nestorservices.in/nestor-core
curl -s https://www.nestorservices.in/recruitment-services
curl -s https://www.nestorservices.in/hr-operations-payroll
```

### Hire sitemap and jobs
```bash
curl -s https://hire.nestorservices.in/sitemap.xml
curl -s https://hire.nestorservices.in/jobs
```

### Hire job detail JobPosting check
```bash
curl -s https://hire.nestorservices.in/jobs/senior-associate-taxation-country-delight
```

### GA4 ID check
Confirm the production HTML includes:
- `G-EJH45Z77ZV`

## What good progress looks like
- More discovered URLs in Google and Bing
- Indexed homepage, product pages, and blog pages
- Indexed blog articles
- Job detail pages eligible for Google and Bing
- Impressions appearing for brand and role queries
- Organic traffic appearing in GA4
- No crawl, indexing, or schema errors
- Closed jobs stay out of the sitemap

## Red flags
- Sitemap fetch errors
- Wrong canonical URLs
- Pages returning shell-only HTML
- GA4 missing from production HTML
- JobPosting removed from active job pages
- Closed jobs still appearing in the sitemap
- Robots blocking important pages
- 404s for important URLs

## Weekly review notes template
```text
Date:
GSC summary:
Bing summary:
GA4 summary:
Top pages:
Issues found:
Actions needed:
Next review date:
```
