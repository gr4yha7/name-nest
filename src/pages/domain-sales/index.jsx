import React, { useMemo, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { BuilderComponent, builder, useIsPreviewing } from '@builder.io/react';
import { useParams } from 'react-router-dom';
import { useDoma } from '../../hooks/useDoma';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import {
  buildTitle,
  buildDescription,
  buildKeywords,
  canonicalUrl,
  openGraph,
  twitterCard,
} from '../../utils/seo';

builder.init(import.meta.env.VITE_BUILDER_API_KEY || '');

const DomainSalesPage = ({ domainName: propDomainName, listing: propListing, ogImage: propOgImage }) => {
  const params = useParams();
  const { services } = useDoma({ autoInitialize: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [domainData, setDomainData] = useState(null);
  const [listing, setListing] = useState(propListing || null);
  const domainName = propDomainName || params?.name;
  const ogImage = propOgImage;
  const isPreviewing = useIsPreviewing();
  const highlights = useMemo(() => {
    const list = [];
    if (listing?.chain?.name) list.push(`${listing.chain.name} ready`);
    if (listing?.price && listing?.currency?.symbol) list.push(`${listing.price} ${listing.currency.symbol}`);
    if (listing?.category) list.push(listing.category);
    return list;
  }, [listing]);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!services?.subgraph?.isInitialized || !domainName) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch domain details; fall back to search if necessary
        let detail = null;
        if (services.subgraph.getDomainDetails) {
          detail = await services.subgraph.getDomainDetails(domainName);
        }
        if (!detail && services.subgraph.searchDomains) {
          const res = await services.subgraph.searchDomains({ name: domainName, take: 1 });
          detail = res?.items?.[0];
        }
        if (!active) return;
        setDomainData(detail || null);
        // Extract a primary listing if available
        const list = detail?.listings?.items?.[0] || detail?.listings?.[0] || null;
        setListing(list);
      } catch (e) {
        if (!active) return;
        setError(e);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [services?.subgraph?.isInitialized, services?.subgraph, domainName]);

  const title = buildTitle(domainName);
  const description = buildDescription({ domainName, highlights });
  const keywords = buildKeywords(domainName);
  const url = canonicalUrl(undefined, `/domain/${domainName || ''}`);
  const og = openGraph({ title, description, image: ogImage, url });
  const tw = twitterCard({ title, description, image: ogImage });

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={url} />
        {og.map((m, i) => (
          <meta key={`og-${i}`} property={m.property} content={m.content} />
        ))}
        {tw.map((m, i) => (
          <meta key={`tw-${i}`} name={m.name} content={m.content} />
        ))}
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 py-8">
        {loading && (
          <div className="max-w-6xl mx-auto mb-6 text-sm text-gray-500">Loading domain data…</div>
        )}
        {error && (
          <div className="max-w-6xl mx-auto mb-6 text-sm text-red-600">Failed to load domain info</div>
        )}
        {/* <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start"> */}
          {/* <section className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold mb-2">{domainName}</h1>
            <p className="text-gray-600 mb-4">{description}</p>
            {listing?.price && (
              <div className="text-2xl font-semibold mb-4">
                {listing.price} {listing.currency?.symbol}
              </div>
            )}
            <div className="flex gap-3">
              <Button>Make Offer</Button>
              <Button variant="outline">Contact Seller</Button>
            </div>
          </section> */}

          {/* <section className="bg-white rounded-lg shadow p-0 overflow-hidden"> */}
            {/* Builder visual content slot: model 'domain-sales-hero' targeted by domainName */}
            {/* <BuilderComponent
              model="domain-sales-hero"
              options={{ includeRefs: true }}
              data={{ domainName, listing, domainData }}
              content={undefined}
            /> */}
          {/* </section> */}
        {/* </div> */}

        <section className="mt-10">
          <BuilderComponent
            model="domain-sales-content"
            options={{ includeRefs: true }}
            data={{ domainName, listing, domainData }}
          />
        </section>

        <section className="mt-10 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Why {domainName}?</h2>
          <ul className="list-disc ml-5 text-gray-700 space-y-1">
            {highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default DomainSalesPage;

