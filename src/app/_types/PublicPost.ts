// PublicPost.ts

export interface PublicPost {
  id: string;
  title: string;
  content: string;
  thumbnailImageKey: string;
  createdAt: string;
  updatedAt: string;
  postCategories: {
    category: {
      id: number;
      name: string;
    };
  }[];
}
