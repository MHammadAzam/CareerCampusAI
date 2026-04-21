import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  path?: string;
}

export default function SEO({ 
  title = "CareerCompass AI - Architect Your Dream Career", 
  description = "Level up your career with AI-powered strategy, roadmap generation, and precision market insights. Built for the next generation of professionals.",
  keywords = "AI career advisor, career roadmap, professional growth, career strategy, skill acceleration, career pathing",
  path = ""
}: SEOProps) {
  const fullTitle = title.includes("CareerCompass AI") ? title : `${title} | CareerCompass AI`;
  const url = `https://careercompass.ai${path}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="https://picsum.photos/seed/careercompass-og/1200/630" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content="https://picsum.photos/seed/careercompass-og/1200/630" />
    </Helmet>
  );
}
