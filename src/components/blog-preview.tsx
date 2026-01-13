import { getBlogPostsAction } from "@/actions/blog-actions";
import BlogCard from "./blog-card";
import Link from "next/link";

export default async function BlogPreview() {
  const result = await getBlogPostsAction();

  if (!result.isSuccess || result.data.posts.length === 0) {
    return null;
  }

  const latestPosts = result.data.posts.slice(0, 3);

  return (
    <section className="bg-yellow-400 border-y-4 border-black py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-black text-4xl uppercase">Latest from the Blog</h2>
          <Link
            href="/blog"
            className="bg-black text-white border-4 border-black px-6 py-3 font-black uppercase 
                       hover:bg-white hover:text-black transition-colors duration-200"
          >
            View All Posts
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

