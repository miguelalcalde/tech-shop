import { createClient } from "contentful";

// Initialize Contentful client for published content
export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "",
  environment: process.env.CONTENTFUL_ENVIRONMENT || "master",
});

// Type for Contentful product
export interface ContentfulProduct {
  sys: {
    id: string;
  };
  fields: {
    id: string;
    name: string;
    description: any; // Rich text content
    price: number;
    category: string;
    stock: number;
    image?: {
      sys: {
        id: string;
      };
      fields?: {
        file?: {
          url?: string;
        };
      };
    };
  };
}

// Function to map Contentful product to our app's Product type
export function mapContentfulProduct(contentfulProduct: ContentfulProduct) {
  const imageUrl = contentfulProduct.fields.image?.fields?.file?.url
    ? `https:${contentfulProduct.fields.image.fields.file.url}`
    : "/products/placeholder.jpg";

  return {
    id: contentfulProduct.fields.id, // Keep the ID as a string for route parameters
    name: contentfulProduct.fields.name,
    description:
      contentfulProduct.fields.description?.content?.[0]?.content?.[0]?.value ||
      "",
    price: contentfulProduct.fields.price,
    category: contentfulProduct.fields.category,
    stock: contentfulProduct.fields.stock,
    image: imageUrl,
  };
}

// Type for Contentful blog post
export interface ContentfulBlogPost {
  sys: {
    id: string;
  };
  fields: {
    slug: string;
    title: string;
    extract: string;
    author: string;
    publishedAt: string;
    body: string;
    image?: {
      sys: {
        id: string;
      };
      fields?: {
        file?: {
          url?: string;
        };
      };
    };
  };
}

// Function to map Contentful blog post to our app's BlogPost type
export function mapContentfulBlogPost(contentfulPost: ContentfulBlogPost) {
  const imageUrl = contentfulPost.fields.image?.fields?.file?.url
    ? `https:${contentfulPost.fields.image.fields.file.url}`
    : undefined;

  return {
    slug: contentfulPost.fields.slug,
    title: contentfulPost.fields.title,
    extract: contentfulPost.fields.extract,
    author: contentfulPost.fields.author,
    publishedAt: contentfulPost.fields.publishedAt,
    body: contentfulPost.fields.body,
    image: imageUrl,
  };
}
