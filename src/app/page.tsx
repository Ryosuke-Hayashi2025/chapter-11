// app/page.tsx
"use client";

import React from "react";
import styles from "./_styles/Home.module.css";
import Link from "next/link";
import { PublicPost } from "./_types/PublicPost";
// import useSWR from "swr";
import { useFetch } from "./_hooks/useFetch";

// 引数に渡されたURLにfetchして、レスポンスをJSONとして返す
// const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Home = () => {
  // useSWRでデータ取得
  // const { data, error, isLoading } = useSWR<{ posts: PublicPost[] }>(
  //   "/api/posts",
    // fetcher,
  // );
  const { data, error, isLoading } = useFetch<{ posts: PublicPost[] }>("posts");

  if (error) return <div>エラーが発生しました</div>;
  if (isLoading) return <div>読み込み中...</div>;

  return (
    <div className={styles.container}>
      {data?.posts.map((elem) => (
        <div key={elem.id} className={styles.Block}>
          <Link href={`/posts/${elem.id}`} className={styles.Link}>
            <div>
              <div className={styles.Tag}>
                <div className={styles.Date}>
                  {new Date(elem.createdAt).toLocaleDateString("ja-JP")}
                </div>
                <ul className={styles.Categories}>
                  {elem.postCategories.map((postCategory) => {
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
              <p className={styles.Title}>{elem.title}</p>
              <div
                className={styles.Body}
                dangerouslySetInnerHTML={{ __html: elem.content }}
              ></div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Home;
