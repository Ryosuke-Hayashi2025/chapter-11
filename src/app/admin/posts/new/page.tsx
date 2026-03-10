// app/admin/posts/new/page.tsx
// 管理者_記事の新規作成ページ
"use client";

import { useRouter } from "next/navigation";
import { PostForm } from "../_components/PostForm";
import { Category } from "@/app/api/admin/posts/[id]/route";
import { CreatePostRequestBody } from "@/app/api/admin/posts/route";
import { useSupabaseSession } from "../../../_hooks/useSupabaseSession";
import { useForm, FieldErrors } from "react-hook-form";

export default function AdminCreatePost() {
  const router = useRouter();
  const { token } = useSupabaseSession();
  // 既定値を準備
  const defaultValues = {
    title: "",
    content: "",
    thumbnailImageKey: "",
    categories: [] as Category[],
  };
  // フォームを初期化
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm({
    defaultValues,
  });
  // サブミット時の処理
  const onSubmit = async (data: CreatePostRequestBody) => {
    if (!token) return;

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(data),
      });
      const { id } = await res.json();

      router.push(`/admin/posts/${id}`);

      alert("記事を作成しました。");
    } catch (error) {
      console.error("記事の作成に失敗しました:", error);
      alert("記事の作成に失敗しました。");
    }
  };
  const onError = (err: FieldErrors) => console.log(err);

  return (
    <div className="">
      <div>
        <h1>記事作成</h1>
      </div>
      <PostForm
        mode="new"
        onSubmit={handleSubmit(onSubmit, onError)}
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
