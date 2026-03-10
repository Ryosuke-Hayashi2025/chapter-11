// /app/admin/_hooks/useRouteGuard.ts

/**
 * useRouteGuard
 * ---------------------------------------------------------
 * ■ このフックの役割（認可ロジック担当）
 *
 * - 管理画面（/admin 配下）にアクセスしたユーザーが
 *   「ログインしているかどうか」をチェックする
 *
 * - useSupabaseSession から取得した session を監視し、
 *   未ログイン（session === null）の場合は
 *   自動的に /sign_in へリダイレクトする
 *
 * - isLoading（セッション取得中）は何もしないことで、
 *   不必要なリダイレクトや画面チラつきを防ぐ
 *
 * - UI は持たず、純粋に「アクセス制御」だけを担当する
 * ---------------------------------------------------------
 */

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRouteGuard = () => {
  const router = useRouter();
  const { session, isLoading } = useSupabaseSession();

  useEffect(() => {
    if (isLoading) return; //sessionの取得中は何もしない

    const fetcher = async () => {
      // 未ログインならログインページへリダイレクト
      if (session === null) {
        router.replace("/sign_in");
      }
    };

    fetcher();
    // 「router・isLoading・sessionのどれかが変わったら、useEffectの中身を再実行する」※依存配列
  }, [router, isLoading, session]);
};
