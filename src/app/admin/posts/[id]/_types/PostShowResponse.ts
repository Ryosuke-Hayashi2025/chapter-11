// PostShowResponse.ts

export type PostShowResponse = {
  post: {
    id: number;
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
  };
};