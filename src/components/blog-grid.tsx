import { getBlogPostsAction } from "@/actions/blog-actions";
import BlogCard from "./blog-card";

// Draft mode is handled automatically by sanityFetch - no preview prop needed
export default async function BlogGrid() {
  const result = await getBlogPostsAction();

  if (!result.isSuccess) {
    return (
      <div className="text-center py-12">
        <p className="font-mono text-lg text-gray-600">
          Unable to load blog posts. Please try again later.
        </p>
      </div>
    );
  }

  const { posts } = result.data;

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-mono text-lg text-gray-600">
          No blog posts available yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}

