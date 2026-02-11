// /app/_hooks/useSupabaseSession.ts
/**
 * useSupabaseSession
 * ---------------------------------------------------------
 * ■ このフックの役割（ロジック担当）
 *
 * - Supabase に「今ログインしているか？」を問い合わせる
 * - 結果（session）を React の state に保存する
 * - ロード中かどうか（isLoading）も判定する
 * - ページ遷移ごとにセッション状態を再取得する
 * - UI は一切持たず、純粋にデータだけを返す
 *
 * 返り値：
 *   session    → undefined: ロード中 / null: 未ログイン / Session: ログイン中
 *   isLoading  → session が undefined の間だけ true
 *   token      → セッションの access_token（必要な場合に使用）
 * ---------------------------------------------------------
 */

import { supabase } from "@/app/_libs/supabase";
import { Session } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";


export const useSupabaseSession = () => {
  // undefined: ログイン状態ロード中
  // null: ログインしていない
  // Session: ログインしている
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  // ページ遷移のたびにセッションを再取得するために使用
  const pathname = usePathname();

  useEffect(() => {
    const fetcher = async () => {
      // Supabase に現在のセッションを問い合わせる
      const {
        data: { session },
      } = await supabase.auth.getSession();
      // 結果を state に保存
      setSession(session);
      setToken(session?.access_token || null);
    };

    fetcher();
  }, [pathname]);

  return { session, isLoading: session === undefined, token };
};
