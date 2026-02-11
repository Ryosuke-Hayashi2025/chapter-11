// app/posts/[id]/page.tsx
"use client";

import React from "react";
import { useParams } from "next/navigation";
import styles from "./_styles/Detail.module.css";
import { PublicPost } from "../../_types/PublicPost";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/app/_libs/supabase";

const Detail = () => {
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<PublicPost | null>(null);

  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true);

      const res = await fetch(`/api/posts/${id}`);
      const { post } = await res.json();
      setPost(post);
      if (post && post.thumbnailImageKey) {
        const {
          data: { publicUrl },
        } = supabase.storage
          .from("post_thumbnail")
          .getPublicUrl(post.thumbnailImageKey);

        setThumbnailImageUrl(publicUrl);
      }
      setIsLoading(false);
    };

    fetcher();
  }, [id]);

  if (isLoading) {
    return <p>読み込み中...</p>;
  }

  if (!post) {
    return <p>記事が見つかりませんでした。</p>;
  }

  return (
    <div className={styles.container}>
      <div>
        <div>
          {thumbnailImageUrl && (
            <Image
              height={400}
              width={800}
              src={thumbnailImageUrl}
              alt="記事画像"
            />
          )}
          <div className={styles.Tag}>
            <div className={styles.Date}>
              {new Date(post.createdAt).toLocaleDateString("ja-JP")}
            </div>
            <ul className={styles.Categories}>
              {post.postCategories.map((postCategory) => {
                return (
                  <li
                    className={styles.Category}
                    key={postCategory.category.id}
                  >
                    {postCategory.category.name}
                  </li>
                );
              })}
            </ul>
          </div>
          <p className={styles.Title}>{post.title}</p>
          <div
            className={styles.Body}
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
