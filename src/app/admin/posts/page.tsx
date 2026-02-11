// app/admin/posts/page.tsx
// 管理者用_記事一覧画面
"use client";

import Link from "next/link";
import styles from "./_styles/AdminHome.module.css";
import { useState, useEffect } from "react";
import { PostsIndexResponse } from "./_types/PostsIndexResponse";
import { useSupabaseSession } from "../../_hooks/useSupabaseSession";

export default function AdminPostsHome() {
  const [posts, setPosts] = useState<PostsIndexResponse["posts"]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { token } = useSupabaseSession();

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      const res = await fetch("/api/admin/posts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const { posts } = await res.json();
      setPosts(posts);
      setIsLoading(false);
    };

    fetcher();
  }, [token]);

  if (isLoading) {
    return <p>読み込み中...</p>;
  }

  return (
    <div className="">
      <div className={styles.Wrapper}>
        <p className={styles.Title}>記事一覧</p>
        <Link href="/admin/posts/new" className={styles.NewButton}>
          新規作成
        </Link>
      </div>
      {posts.map((post) => (
        <div key={post.id} className={styles.Block}>
          <Link href={`/admin/posts/${post.id}`} className={styles.Link}>
            <div className="">
              <div className={styles.PostTitle}>{post.title}</div>
              <div className="">
                {new Date(post.createdAt).toLocaleDateString("ja-JP")}
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
