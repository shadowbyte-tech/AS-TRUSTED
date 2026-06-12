import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/mdx';

const siteUrl = 'https://astrustedconsultancy.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '/',
    '/about',
    '/services',
    '/faq',
    '/privacy',
    '/terms',
    '/cookies',
    '/trust-center',
    '/properties',
    '/normal-properties',
    '/premium-properties',
    '/plots',
    '/land',
    '/houses',
    '/investment-reports',
    '/nri-investment',
    '/market-intelligence',
    '/smart-investment',
    '/secure-future',
    '/legacy-wealth',
    '/exponential-growth',
    '/capital-today-tomorrow',
    '/premium-club',
    '/book-site-visit',
    '/financial-services',
    '/blog',
  ];

  const blogPages = getAllPosts().map((post) => `/blog/${post.slug}`);

  return [...staticPages, ...blogPages].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path.startsWith('/blog/') ? 'monthly' : 'weekly',
    priority: path === '/' ? 1 : path.startsWith('/blog/') ? 0.8 : 0.7,
  }));
}
