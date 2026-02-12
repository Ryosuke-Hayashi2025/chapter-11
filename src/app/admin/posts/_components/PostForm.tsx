// app/admin/posts/_componets/PostForm.tsx
// 管理者_記事の更新・削除・新規作成ページ（共通）

import React, { useEffect, useState, ChangeEvent } from "react";
import { CategoriesSelect } from "./CategoriesSelect";
import {
  UpdatePostRequestBody,
} from "@/app/api/admin/posts/[id]/route";
import styles from "./_styles/PostForm.module.css";
import { supabase } from "@/app/_libs/supabase";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
  Controller,
  Control,
} from "react-hook-form";

interface Props {
  mode: "new" | "edit";
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
  disabled: boolean;
  register: UseFormRegister<UpdatePostRequestBody>;
  errors: FieldErrors<UpdatePostRequestBody>;
  setValue: UseFormSetValue<UpdatePostRequestBody>;
  watch: UseFormWatch<UpdatePostRequestBody>;
  control: Control<UpdatePostRequestBody>;
}

export const PostForm: React.FC<Props> = ({
  mode,
  onSubmit,
  onDelete,
  disabled,
  register,
  errors,
  setValue,
  watch,
  control,
}) => {
  // Imageタグのsrcにセットする画像URLを持たせるstate
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null,
  );

  const thumbnailImageKey = watch("thumbnailImageKey");

  useEffect(() => {
    if (!thumbnailImageKey) return; // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [thumbnailImageKey]);

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      // 画像が選択されていないのでreturn
      return;
    }

    const file = event.target.files[0]; // 選択された画像を取得

    const filePath = `private/${uuidv4()}`; // ファイルパスを指定

    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from("post_thumbnail") // ここでバケット名を指定
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message);
      return;
    }

    // data.pathに、画像固有のkeyが入っているので、thumbnailImageKeyに格納する
    setValue("thumbnailImageKey", data.path);
  };

  return (
    <form onSubmit={onSubmit} className={styles.Form}>
      <div>
        <label htmlFor="title" className={styles.Label}>
          タイトル
        </label>
        <input
          type="text"
          id="title"
          className={styles.Input}
          disabled={disabled}
          {...register("title", {
            required: "必須入力です",
            maxLength: {
              value: 20,
              message: "タイトルは20文字以内にしてください",
            },
          })}
        />
        <div>{errors.title?.message}</div>
      </div>
      <div>
        <label htmlFor="content" className={styles.Label}>
          内容
        </label>
        <textarea
          id="content"
          className={styles.Input}
          disabled={disabled}
          {...register("content", {
            required: "必須入力です",
            maxLength: {
              value: 20,
              message: "内容は100文字以内にしてください",
            },
          })}
        />
        <div>{errors.content?.message}</div>
      </div>
      <div>
        <label htmlFor="thumbnailImageKey" className={styles.Label}>
          サムネイルURL
        </label>
        <input
          type="file"
          id="thumbnailImageKey"
          onChange={handleImageChange}
          accept="image/*"
        />
        {/* 　　　　 画像の表示 */}
        {thumbnailImageUrl && (
          <div className="mt-2">
            <Image
              src={thumbnailImageUrl}
              alt="thumbnail"
              width={400}
              height={400}
            />
          </div>
        )}
      </div>
      <div>
        <label htmlFor="categories" className={styles.Label}>
          カテゴリー
        </label>
        <Controller
          name="categories"
          control={control}
          render={({ field }) => (
            <CategoriesSelect
              value={field.value}
              onChange={field.onChange}
              disabled={disabled}
            />
          )}
        />
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
