// app/admin/posts/[id]/page.tsx
// 管理者_記事の編集ページ
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PostForm } from "../_components/PostForm";
import { UpdatePostRequestBody } from "@/app/api/admin/posts/[id]/route";
import { PostShowResponse } from "./_types/PostShowResponse";
import { useSupabaseSession } from "../../../_hooks/useSupabaseSession";
import { useForm, FieldErrors } from "react-hook-form";

export default function AdminEditPost() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useSupabaseSession();
  // 既定値を準備
  const defaultValues: UpdatePostRequestBody = {
    title: "",
    content: "",
    thumbnailImageKey: "",
    categories: [],
  };
  // フォームを初期化
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<UpdatePostRequestBody>({
    defaultValues,
  });
  // サブミット時の処理
  const onSubmit = async (data: UpdatePostRequestBody) => {
    if (!token) return;

    try {
      await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(data),
      });

      alert("記事を更新しました。");

      router.push("/admin/posts");
    } catch (error) {
      console.error("記事の更新に失敗しました:", error);
      alert("記事の更新に失敗しました。");
    }
  };

  const onError = (err: FieldErrors<UpdatePostRequestBody>) => console.log(err);

  const onDelete = async () => {
    if (!confirm("記事を削除しますか？")) return;

    if (!token) return;

    try {
      await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      alert("記事を削除しました");

      router.push("/admin/posts");
    } catch (error) {
      console.error("記事の削除に失敗しました。", error);
      alert("記事の削除に失敗しました。");
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      const res = await fetch(`/api/admin/posts/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const { post }: { post: PostShowResponse["post"] } = await res.json();
      reset({
        title: post.title,
        content: post.content,
        thumbnailImageKey: post.thumbnailImageKey,
        categories: post.postCategories.map((pc) => ({
          id: pc.category.id,
          name: pc.category.name,
        })),
      });
    };
    fetcher();
  }, [id, token, reset]);

  return (
    <div className="">
      <div>
        <h1>記事編集</h1>
      </div>
      <PostForm
        mode="edit"
        onSubmit={handleSubmit(onSubmit, onError)}
        onDelete={onDelete}
        disabled={isSubmitting}
        register={register}
        errors={errors}
        setValue={setValue}
        watch={watch}
        control={control}
      />
    </div>
  );
}
