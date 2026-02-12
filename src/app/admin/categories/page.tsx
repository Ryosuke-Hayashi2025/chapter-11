// app/admin/categories/page.tsx
// 管理者用_カテゴリー一覧画面
"use client";

import Link from "next/link";
import styles from "../posts/_styles/AdminHome.module.css";
import { CategoriesIndexResponse } from "./_types/CategoriesIndexResponse";
import { useSupabaseSession } from "../../_hooks/useSupabaseSession";
import { useAdminFetch } from "../../admin/_hooks/useAdminFetch";

export default function AdminCategoriesHome() {
  const { token } = useSupabaseSession();
 const { data, error, isLoading } = useAdminFetch<CategoriesIndexResponse>(
    "admin/categories",
    token ?? undefined,
  );

  if (error) return <div>エラーが発生しました</div>;
  if (isLoading) return <div>読み込み中...</div>;

  return (
    <div className="">
      <div className={styles.Wrapper}>
        <p className={styles.Title}>カテゴリー一覧</p>
        <Link href="/admin/categories/new" className={styles.NewButton}>
          新規作成
        </Link>
      </div>
      {data?.categories.map((category) => (
        <div key={category.id} className={styles.Block}>
          <Link
            href={`/admin/categories/${category.id}`}
            className={styles.Link}
          >
            <div className="">{category.name}</div>
          </Link>
        </div>
      ))}
    </div>
  );
}
