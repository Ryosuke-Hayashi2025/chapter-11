// // app/admin/layout.tsx

/**
 * AdminLayout
 * ---------------------------------------------------------
 * ■ このレイアウトの役割（管理画面の共通 UI）
 *
 * - useRouteGuard を使って「未ログインなら /sign_in にリダイレクト」
 *   というアクセス制御を行う
 *
 * - 管理画面（/admin 配下）のページに共通のレイアウトを提供する
 *      ・左側に固定サイドバー
 *      ・右側にページごとのコンテンツ（children）
 *
 * - usePathname を使って現在のパスを取得し、
 *   サイドバーのリンクに「選択中のハイライト」を付ける
 *
 * ---------------------------------------------------------
 * children:
 *   /admin/posts や /admin/categories など、
 *   管理画面の各ページがここに描画される
 * ---------------------------------------------------------
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouteGuard } from "./_hooks/useRouteGuard";
import { Header } from "../_components/Header";
import styles from "./_styles/AdminLayout.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 管理画面のアクセス制御（未ログインならリダイレクト）
  useRouteGuard();

  // 現在のパスを取得して、サイドバーの選択状態に使う
  const pathname = usePathname();

  // 現在のパスに href が含まれていれば「選択中」と判定
  const isSelected = (href: string) => {
    return pathname.includes(href);
  };

  return (
    <>
      <Header />

      <div className={styles.wrapper}>
        {/* サイドバー（左側に固定） */}
        <aside className={styles.aside}>
          <Link
            href="/admin/posts"
            className={`${styles.navLink} ${isSelected("/admin/posts") ? styles.selected : ""}`}
          >
            記事一覧
          </Link>

          <Link
            href="/admin/categories"
            className={`${styles.navLink} ${isSelected("/admin/categories") ? styles.selected : ""}`}
          >
            カテゴリー一覧
          </Link>
        </aside>

        {/* メインエリア（サイドバーの右側） */}
        <div className={styles.main}>{children}</div>
      </div>
    </>
  );
}
