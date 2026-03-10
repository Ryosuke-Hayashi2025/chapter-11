// app/admin/posts/_componets/CategoriesSelect.tsx
// 管理者_記事詳細のカテゴリー表示箇所（共通）

import { Category } from "@/app/api/admin/posts/[id]/route";
import React, { useEffect } from "react";
import styles from "./_styles/CategoriesSelect.module.css";
import { useSupabaseSession } from "../../../_hooks/useSupabaseSession";

// このコンポーネントは、親（PostForm）から次の３つを受け取る。
interface Props {
  // 現在選択されているカテゴリーの配列
  value: Category[];
  // 選択されたカテゴリーを更新する関数
  onChange: (categories: Category[]) => void;
  // 編集不可（読み取り専用）かどうか
  disabled: boolean;
}

export const CategoriesSelect: React.FC<Props> = ({
  value,
  onChange,
  disabled,
}) => {
  const { token } = useSupabaseSession();
  // 全カテゴリー一覧を保持するstate
  // categoriesはAPIから取得した「全カテゴリー一覧」、setCategoriesはそれを更新する関数
  const [categories, setCategories] = React.useState<Category[]>([]);
  // カテゴリーを選択/解除する関数
  const toggleCategory = (id: number) => {
    if (disabled) return;

    // そのカテゴリーが選択済みかどうか調べる
    // selectedCategoriesの中に、クリックされた id のカテゴリーがあるか？
    const exists = value.some((category) => category.id === id);

    // すでに選択されている場合 → 解除（配列から削除）
    if (exists) {
      onChange(value.filter((category) => category.id !== id));
      // 未選択なら → categories（全カテゴリー）から探して追加
    } else {
      const category = categories.find((c) => c.id === id);
      if (!category) return;
      onChange([...value, category]);
    }
  };

  // useEffect でカテゴリー一覧を API から取得
  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      const res = await fetch("/api/admin/categories", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const { categories } = await res.json();
      // 返ってきたcategoriesをstateに保存
      setCategories(categories);
    };
    fetcher();
  }, [token]);

  return (
    <div className={styles.Container}>
      <div className={styles.ButtonWrap}>
        {categories.map((category) => {
          // isSelected で「選択済みかどうか」を判定
          const isSelected = value.some(
            (selected) => selected.id === category.id,
          );
          return (
            <button
              key={category.id}
              type="button"
              // クリックされたら toggleCategory(category.id) を実行
              onClick={() => toggleCategory(category.id)}
              className={
                isSelected
                  ? `${styles.CategoryButton} ${styles.Selected}`
                  : `${styles.CategoryButton} ${styles.Unselected}`
              }
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
