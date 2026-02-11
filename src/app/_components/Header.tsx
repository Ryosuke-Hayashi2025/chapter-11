// app/_component/Header.tsx

/**
 * Headerコンポーネント
 * ---------------------------------------------------------
 * ■ このコンポーネントの役割（UI担当）
 *
 * - useSupabaseSessionからログイン状態（session）を取得する
 * - ログイン状態に応じて表示するリンクを切り替える
 *      ・ログイン中：管理画面 / ログアウト
 *      ・未ログイン：お問い合わせ / ログイン
 * - ログアウトボタン押下時に Supabase のsignOut を実行し、
 *   その後トップページへリダイレクトする
 *
 * ※ ロジックは useSupabaseSession に任せ、
 *    Header は「見た目とボタンの動作」だけを担当する
 * ---------------------------------------------------------
 */

"use client";

import Link from "next/link";
import React from "react";
import styles from "./_styles/Header.module.css";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import { supabase } from "../_libs/supabase";
import { useRouter } from "next/navigation";

export const Header: React.FC = () => {
  const router = useRouter();

  // ログアウト処理（Supabase → ページ遷移）
  const handleLogout = async () => {
    await supabase.auth.signOut();
    await router.replace("/");
  };

  // ログイン状態とロード中フラグを取得
  const { session, isLoading } = useSupabaseSession();

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.Link}>
        Blog
      </Link>
      {/* ロード完了後にログイン状態を判定して表示を切り替える */}
      {!isLoading && (
        <div className={styles.Link}>
          {session ? (
            // ログイン中の表示
            <>
              <Link href="/admin/posts" className={styles.Link}>
                管理画面
              </Link>
              <button onClick={handleLogout}>ログアウト</button>
            </>
          ) : (
            // 未ログイン時の表示
            <>
              <Link href="/contact" className={styles.Link}>
                お問い合わせ
              </Link>
              <Link href="/sign_in" className={styles.Link}>
                ログイン
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
