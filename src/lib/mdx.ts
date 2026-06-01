import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  coverImage: string;
  readTime: string;
  content: string;
}

const contentDirectory = path.join(process.cwd(), 'src/content/blog');

export function getPostBySlug(slug: string): BlogPost {
  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = path.join(contentDirectory, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  return {
    slug: realSlug,
    title: data.title,
    description: data.description,
    date: data.date,
    author: data.author,
    category: data.category,
    coverImage: data.coverImage,
    readTime: data.readTime,
    content,
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(contentDirectory)) return [];
  const slugs = fs.readdirSync(contentDirectory);
  const posts = slugs
    .filter((s) => s.endsWith('.mdx'))
    .map((slug) => getPostBySlug(slug))
    .sort((a, b) => (a.date > b.date ? -1 : 1));
  return posts;
}
