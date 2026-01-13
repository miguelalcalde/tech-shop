export type ActionState<T> =
  | { isSuccess: true; message: string; data: T }
  | { isSuccess: false; message: string; data?: never };

export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  stock: number;
  bestSeller?: boolean;
  discounted?: boolean;
}

export interface ProductData {
  products: Product[];
}

export interface BlogPost {
  slug: string;
  title: string;
  extract: string;
  author: string;
  publishedAt: string;
  body: string;
  image?: string;
}

export interface BlogPostData {
  posts: BlogPost[];
}
