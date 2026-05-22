import { getAllPosts } from '@/lib/mdx';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Real Estate Investment Blog | AS Trusted',
  description: 'Expert insights, market analysis, and legal guides for investing in Telangana real estate.',
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold font-cinzel text-gold">
            Real Estate Insights & Investment Strategies
          </h1>
          <p className="text-lg text-white/70 max-w-3xl">
            Read expert guides on high-growth corridors, DTCP approvals, and legal registration processes to maximize your ROI in Telangana.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-navy/50 hover:bg-navy transition-all hover:border-gold/30 flex flex-col h-full">
              <div className="aspect-[16/9] relative w-full shrink-0">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-navy/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gold border border-gold/20">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-white/50 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(post.date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-sm text-white/60 mb-6 line-clamp-3 flex-1">
                  {post.description}
                </p>
                
                <div className="flex items-center text-gold font-semibold text-sm group-hover:translate-x-1 transition-transform mt-auto">
                  Read Article <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
