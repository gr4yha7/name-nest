import cheerio from 'cheerio';
import { useState, useEffect } from 'react';

/**
 * SEO Auditor Class - Core functionality
 */
export class SEOAuditor {
  constructor(html) {
    this.$ = cheerio.load(html);
    this.issues = [];
    this.warnings = [];
    this.passed = [];
    this.score = 0;
    this.maxScore = 0;
  }

  addCheck(name, points, condition, message) {
    this.maxScore += points;
    if (condition) {
      this.score += points;
      this.passed.push({ name, points, message });
      return true;
    } else {
      this.issues.push({ name, points, message });
      return false;
    }
  }

  addWarning(name, message) {
    this.warnings.push({ name, message });
  }

  checkTitle() {
    const title = this.$('title').text();
    const length = title.length;

    this.addCheck(
      'Title Exists',
      10,
      title.length > 0,
      title ? `Title: "${title}"` : 'No title tag found'
    );

    if (title) {
      this.addCheck(
        'Title Length',
        10,
        length >= 30 && length <= 60,
        `Title length: ${length} chars (optimal: 30-60)`
      );

      if (length > 60) {
        this.addWarning('Title Too Long', 'Title may be truncated in search results');
      }
    }

    return title;
  }

  checkMetaDescription() {
    const metaDesc = this.$('meta[name="description"]').attr('content');
    const length = metaDesc ? metaDesc.length : 0;

    this.addCheck(
      'Meta Description Exists',
      10,
      !!metaDesc,
      metaDesc ? `Description: "${metaDesc.substring(0, 100)}..."` : 'No meta description found'
    );

    if (metaDesc) {
      this.addCheck(
        'Meta Description Length',
        10,
        length >= 120 && length <= 160,
        `Description length: ${length} chars (optimal: 120-160)`
      );

      if (length > 160) {
        this.addWarning('Description Too Long', 'Description may be truncated in search results');
      }
    }

    return metaDesc;
  }

  checkHeadings() {
    const h1s = this.$('h1');
    const h1Count = h1s.length;
    const h1Text = h1s.map((i, el) => this.$(el).text().trim()).get();

    this.addCheck(
      'H1 Tag Count',
      10,
      h1Count === 1,
      h1Count === 0 ? 'No H1 tag found' : 
      h1Count === 1 ? `H1: "${h1Text[0]}"` : 
      `Multiple H1 tags found (${h1Count})`
    );

    const headings = [];
    for (let i = 1; i <= 6; i++) {
      const count = this.$(`h${i}`).length;
      if (count > 0) headings.push({ level: i, count });
    }

    const hasProperHierarchy = headings.every((h, idx) => 
      idx === 0 || h.level === headings[idx - 1].level + 1 || h.level === headings[idx - 1].level
    );

    this.addCheck(
      'Heading Hierarchy',
      5,
      hasProperHierarchy,
      hasProperHierarchy ? 'Proper heading hierarchy' : 'Heading hierarchy has gaps'
    );

    return { h1Count, h1Text, headings };
  }

  checkImages() {
    const images = this.$('img');
    const totalImages = images.length;
    const imagesWithoutAlt = images.filter((i, el) => !this.$(el).attr('alt')).length;
    const imagesWithEmptyAlt = images.filter((i, el) => {
      const alt = this.$(el).attr('alt');
      return alt !== undefined && alt.trim() === '';
    }).length;

    this.addCheck(
      'Images Have Alt Text',
      15,
      imagesWithoutAlt === 0,
      imagesWithoutAlt === 0 ? 
        `All ${totalImages} images have alt attributes` : 
        `${imagesWithoutAlt} out of ${totalImages} images missing alt text`
    );

    if (imagesWithEmptyAlt > 0) {
      this.addWarning('Empty Alt Text', `${imagesWithEmptyAlt} images have empty alt attributes`);
    }

    return { totalImages, imagesWithoutAlt, imagesWithEmptyAlt };
  }

  checkCanonical() {
    const canonical = this.$('link[rel="canonical"]').attr('href');

    this.addCheck(
      'Canonical URL',
      5,
      !!canonical,
      canonical ? `Canonical: ${canonical}` : 'No canonical URL found'
    );

    return canonical;
  }

  checkOpenGraph() {
    const ogTags = this.$('meta[property^="og:"]');
    const ogCount = ogTags.length;
    
    const requiredOgTags = ['og:title', 'og:description', 'og:image', 'og:url'];
    const foundOgTags = {};
    
    requiredOgTags.forEach(tag => {
      foundOgTags[tag] = this.$(`meta[property="${tag}"]`).attr('content');
    });

    const hasAllRequired = requiredOgTags.every(tag => foundOgTags[tag]);

    this.addCheck(
      'Open Graph Tags',
      10,
      hasAllRequired,
      hasAllRequired ? 
        `All required OG tags present (${ogCount} total)` : 
        `Missing OG tags: ${requiredOgTags.filter(t => !foundOgTags[t]).join(', ')}`
    );

    return { count: ogCount, tags: foundOgTags };
  }

  checkTwitterCard() {
    const twitterTags = this.$('meta[name^="twitter:"]');
    const twitterCount = twitterTags.length;
    
    const requiredTwitterTags = ['twitter:card', 'twitter:title', 'twitter:description'];
    const foundTwitterTags = {};
    
    requiredTwitterTags.forEach(tag => {
      foundTwitterTags[tag] = this.$(`meta[name="${tag}"]`).attr('content');
    });

    const hasAllRequired = requiredTwitterTags.every(tag => foundTwitterTags[tag]);

    this.addCheck(
      'Twitter Card Tags',
      5,
      hasAllRequired,
      hasAllRequired ? 
        `All required Twitter tags present (${twitterCount} total)` : 
        `Missing Twitter tags: ${requiredTwitterTags.filter(t => !foundTwitterTags[t]).join(', ')}`
    );

    return { count: twitterCount, tags: foundTwitterTags };
  }

  checkStructuredData() {
    const jsonLdScripts = this.$('script[type="application/ld+json"]');
    const count = jsonLdScripts.length;
    
    const structuredData = [];
    let hasErrors = false;

    jsonLdScripts.each((i, el) => {
      try {
        const data = JSON.parse(this.$(el).html());
        structuredData.push(data);
      } catch (e) {
        hasErrors = true;
        this.addWarning('Invalid JSON-LD', `JSON-LD script ${i + 1} has syntax errors`);
      }
    });

    this.addCheck(
      'Structured Data',
      15,
      count > 0 && !hasErrors,
      count === 0 ? 'No structured data found' : 
      hasErrors ? `${count} JSON-LD scripts found but with errors` :
      `${count} valid JSON-LD script(s) found`
    );

    return { count, data: structuredData };
  }

  checkViewport() {
    const viewport = this.$('meta[name="viewport"]').attr('content');

    this.addCheck(
      'Viewport Meta Tag',
      5,
      !!viewport,
      viewport ? `Viewport: ${viewport}` : 'No viewport meta tag (mobile optimization issue)'
    );

    return viewport;
  }

  checkLinks() {
    const allLinks = this.$('a');
    const totalLinks = allLinks.length;
    const internalLinks = this.$('a[href^="/"], a[href^="./"], a[href^="../"], a[href^="#"]').length;
    const externalLinks = this.$('a[href^="http"]').length;
    const brokenLinks = allLinks.filter((i, el) => {
      const href = this.$(el).attr('href');
      return !href || href === '#' || href === '';
    }).length;

    this.addCheck(
      'Link Quality',
      5,
      brokenLinks === 0,
      brokenLinks === 0 ? 
        `All ${totalLinks} links are valid` : 
        `${brokenLinks} broken or empty links found`
    );

    return { totalLinks, internalLinks, externalLinks, brokenLinks };
  }

  checkLanguage() {
    const htmlLang = this.$('html').attr('lang');

    this.addCheck(
      'Language Declaration',
      5,
      !!htmlLang,
      htmlLang ? `Language: ${htmlLang}` : 'No language declaration in <html> tag'
    );

    return htmlLang;
  }

  checkRobots() {
    const robotsMeta = this.$('meta[name="robots"]').attr('content');
    
    if (robotsMeta) {
      const hasNoindex = robotsMeta.includes('noindex');
      const hasNofollow = robotsMeta.includes('nofollow');
      
      if (hasNoindex) {
        this.addWarning('Robots Noindex', 'Page is set to noindex - will not appear in search results');
      }
      if (hasNofollow) {
        this.addWarning('Robots Nofollow', 'Page is set to nofollow - links will not be followed');
      }
    }

    return robotsMeta;
  }

  runAllChecks() {
    this.checkTitle();
    this.checkMetaDescription();
    this.checkHeadings();
    this.checkImages();
    this.checkCanonical();
    this.checkOpenGraph();
    this.checkTwitterCard();
    this.checkStructuredData();
    this.checkViewport();
    this.checkLinks();
    this.checkLanguage();
    this.checkRobots();
  }

  getResults() {
    const percentage = Math.round((this.score / this.maxScore) * 100);
    const grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F';

    return {
      score: this.score,
      maxScore: this.maxScore,
      percentage,
      grade,
      passed: this.passed,
      issues: this.issues,
      warnings: this.warnings,
      summary: {
        passedCount: this.passed.length,
        issuesCount: this.issues.length,
        warningsCount: this.warnings.length
      }
    };
  }
}

/**
 * Standalone function to analyze HTML
 * @param {string} html - HTML string to analyze
 * @returns {object} SEO audit results
 */
export function analyzeSEO(html) {
  const auditor = new SEOAuditor(html);
  auditor.runAllChecks();
  return auditor.getResults();
}
