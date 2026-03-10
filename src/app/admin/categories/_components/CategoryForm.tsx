// app/admin/categories/_componets/CategoryForm.tsx
// 管理者_カテゴリー一覧の更新・削除・新規作成ページ（共通）

import React from "react";
import styles from "./_styles/CategoryForm.module.css";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface Props {
  mode: "new" | "edit";
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
  disabled: boolean;
  register: UseFormRegister<{ name: string }>;
  errors: FieldErrors<{ name: string }>;
}

export const CategoryForm: React.FC<Props> = ({
  mode,
  onSubmit,
  onDelete,
  disabled,
  register,
  errors,
}) => {
  return (
    <form onSubmit={onSubmit} className={styles.Form}>
      <div>
        <label htmlFor="name" className={styles.Label}>
          カテゴリー名
        </label>
        <input
          type="text"
          id="name"
          className={styles.Input}
          disabled={disabled}
          {...register("name", {
            required: "必須入力です",
            maxLength: {
              value: 20,
              message: "カテゴリーは20文字以内にしてください",
            },
          })}
        />
        <div>{errors.name?.message}</div>
      </div>
      <div className={styles.ButtonRow}>
        <button
          type="submit"
          className={styles.ButtonUpdate}
          disabled={disabled}
        >
          {mode === "new" ? "作成" : "更新"}
        </button>
        {mode === "edit" && (
          <button
            type="button"
            onClick={onDelete}
            className={styles.ButtonDelete}
            disabled={disabled}
          >
            削除
          </button>
        )}
      </div>
    </form>
  );
};
