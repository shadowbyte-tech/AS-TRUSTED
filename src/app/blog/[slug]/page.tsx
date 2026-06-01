import { getPostBySlug, getAllPosts } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, ArrowLeft, Tag } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  try {
    const post = getPostBySlug(params.slug);
    return {
      title: `${post.title} | AS Trusted Blog`,
      description: post.description,
      openGraph: {
        title: post.title,
        description: post.description,
        images: [{ url: post.coverImage }],
      },
    };
  } catch {
    return { title: 'Article Not Found | AS Trusted' };
  }
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: { params: Params }) {
  let post;
  try {
    post = getPostBySlug(params.slug);
  } catch {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background pt-24 pb-16">
        <div className="container px-4 max-w-4xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-gold transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/20 bg-gold/5 text-xs font-bold text-gold mb-4">
              <Tag size={12} /> {post.category}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
              <span className="flex items-center gap-1.5"><User size={14} /> {post.author}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime}</span>
            </div>
          </div>

          <div className="relative aspect-[16/7] rounded-2xl overflow-hidden mb-10">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
          </div>

          <article className="prose prose-invert prose-lg max-w-none prose-headings:text-gold prose-headings:font-bold prose-a:text-gold prose-strong:text-white prose-li:text-white/80 prose-p:text-white/80 prose-p:leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </article>

          <div className="mt-12 pt-8 border-t border-white/10">
            <Link href="/blog" className="inline-flex items-center gap-2 text-gold font-semibold hover:underline">
              <ArrowLeft size={16} /> View All Articles
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
