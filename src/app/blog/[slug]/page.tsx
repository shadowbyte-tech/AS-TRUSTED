import { getPostBySlug, getPostSlugs } from '@/lib/mdx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Metadata } from 'next';
import Image from 'next/image';
import { Calendar, Clock, User, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

// Needed for static generation
type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx$/, ''),
  }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  return {
    title: `${post.title} | AS Trusted Blog`,
    description: post.description,
    openGraph: {
      images: [post.coverImage],
    },
  };
}

// Custom components for MDX to match the premium theme
const components = {
  h2: (props: any) => <h2 className="text-3xl font-cinzel font-bold text-gold mt-12 mb-6" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-bold text-white mt-8 mb-4" {...props} />,
  p: (props: any) => <p className="text-lg text-white/80 leading-relaxed mb-6" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-6 space-y-2 mb-6 text-white/80 text-lg" {...props} />,
  li: (props: any) => <li className="pl-2" {...props} />,
  strong: (props: any) => <strong className="font-bold text-white" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-gold pl-4 py-1 italic bg-gold/5 rounded-r-lg my-6 text-xl text-white/90" {...props} />,
};

export default async function BlogPostPage({ params }: { params: Params }) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  // Generate JSON-LD schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: `https://astrustedconsultancy.com${post.coverImage}`,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-white/50 mb-8 overflow-x-auto whitespace-nowrap pb-2">
            <Link href="/" className="hover:text-gold flex items-center gap-1"><Home size={14}/> Home</Link>
            <ChevronRight size={14} />
            <Link href="/blog" className="hover:text-gold">Blog</Link>
            <ChevronRight size={14} />
            <span className="text-gold truncate">{post.title}</span>
          </div>

          {/* Header */}
          <div className="space-y-6 mb-12">
            <div className="inline-block bg-gold/20 text-gold px-3 py-1 rounded-full text-sm font-bold border border-gold/30">
              {post.category}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-cinzel text-white leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm border-t border-b border-white/10 py-4">
              <div className="flex items-center gap-2">
                <User size={16} className="text-gold" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gold" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gold" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 shadow-2xl border border-white/10">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <article className="prose prose-invert max-w-none prose-lg">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
              {post.content}
            </ReactMarkdown>
          </article>
          
          {/* AdSense Native Ad Injection Placeholder (Bottom of article) */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="bg-navy/50 border border-white/5 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[250px]">
              <span className="text-white/30 text-sm mb-2 uppercase tracking-widest font-bold">Advertisement</span>
              <p className="text-white/40 italic">Google AdSense Native Recommendation block will auto-populate here.</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
