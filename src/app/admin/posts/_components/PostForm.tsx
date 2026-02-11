// app/admin/posts/_componets/PostForm.tsx
// 管理者_記事の更新・削除・新規作成ページ（共通）

// import React from "react";
import React, { useEffect, useState, ChangeEvent } from "react";
import { CategoriesSelect } from "./CategoriesSelect";
import { Category } from "@/app/api/admin/posts/[id]/route";
import styles from "./_styles/PostForm.module.css";
import { supabase } from "@/app/_libs/supabase";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

interface Props {
  mode: "new" | "edit";
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  thumbnailImageKey: string;
  setThumbnailImageKey: (key: string) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
  disabled: boolean;
}

export const PostForm: React.FC<Props> = ({
  mode,
  title,
  setTitle,
  content,
  setContent,
  thumbnailImageKey,
  setThumbnailImageKey,
  categories,
  setCategories,
  onSubmit,
  onDelete,
  disabled,
}) => {
  // Imageタグのsrcにセットする画像URLを持たせるstate
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null,
  );

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
    setThumbnailImageKey(data.path);
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.Input}
          disabled={disabled}
        />
      </div>
      <div>
        <label htmlFor="content" className={styles.Label}>
          内容
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.Input}
          disabled={disabled}
        />
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
        <CategoriesSelect
          selectedCategories={categories}
          setSelectedCategories={setCategories}
          disabled={disabled}
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
