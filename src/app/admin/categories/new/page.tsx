// app/admin/categories/new/page.tsx
// 管理者_カテゴリーの新規作成ページ
"use client";

import { useRouter } from "next/navigation";
import { CategoryForm } from "../_components/CategoryForm";
import { CreateCategoryRequestBody } from "@/app/api/admin/categories/route";
import { useSupabaseSession } from "../../../_hooks/useSupabaseSession";
import { useForm, FieldErrors } from "react-hook-form";

export default function AdminCreateCategory() {
  const router = useRouter();
  const { token } = useSupabaseSession();
  // 既定値を準備
  const defaultValues = {
    name: "",
  };
  // フォームを初期化
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
  });
  // サブミット時の処理
  const onSubmit = async (data: CreateCategoryRequestBody) => {
    if (!token) return;

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(data),
      });

      const { id } = await res.json();
      router.push(`/admin/categories/${id}`);
      alert("カテゴリーを作成しました。");
    } catch (error) {
      console.error("カテゴリーの作成に失敗しました:", error);
      alert("カテゴリーの作成に失敗しました。");
    }
  };

  const onError = (err: FieldErrors<FormData>) => console.log(err);

  return (
    <div className="">
      <div>
        <h1>カテゴリー作成</h1>
      </div>
      <CategoryForm
        mode="new"
        onSubmit={handleSubmit(onSubmit, onError)}
        disabled={isSubmitting}
        register={register}
        errors={errors}
      />
    </div>
  );
}
