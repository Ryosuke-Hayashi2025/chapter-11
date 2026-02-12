// app/admin/posts/page.tsx
// 管理者用_記事一覧画面
"use client";

import Link from "next/link";
import styles from "./_styles/AdminHome.module.css";
import { PostsIndexResponse } from "./_types/PostsIndexResponse";
import { useSupabaseSession } from "../../_hooks/useSupabaseSession";
// import useSWR from "swr";
import { useAdminFetch } from "../../admin/_hooks/useAdminFetch";

// 引数に渡されたURLにfetchして、レスポンスをJSONとして返す
// const fetcher = (url: string, token: string) =>
//   fetch(url, {
//     headers: { "Content-Type": "application/json", Authorization: token },
//   }).then((res) => res.json());

export default function AdminPostsHome() {
  const { token } = useSupabaseSession();
  // const shouldFetch = !!token;
  // useSWRでデータ取得
  // const { data, error, isLoading } = useSWR<PostsIndexResponse>(
  //   // shouldFetchがfalseならnullが渡されて、SWRは何もしない
  //   shouldFetch ? ["/api/admin/posts", token] : null,
  //   ([url, token]: [string, string]) => fetcher(url, token),
  // );

  const { data, error, isLoading } = useAdminFetch<PostsIndexResponse>(
    "admin/posts",
    token ?? undefined,
  );

  if (error) return <div>エラーが発生しました</div>;
  if (isLoading) return <div>読み込み中...</div>;

  return (
    <div className="">
      <div className={styles.Wrapper}>
        <p className={styles.Title}>記事一覧</p>
        <Link href="/admin/posts/new" className={styles.NewButton}>
          新規作成
        </Link>
      </div>
      {data?.posts.map((post) => (
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
