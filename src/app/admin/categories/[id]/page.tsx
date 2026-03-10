// app/admin/categories/[id]/page.tsx
// 管理者_カテゴリーの編集ページ
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CategoryForm } from "../_components/CategoryForm";
import { UpdateCategoryRequestBody } from "@/app/api/admin/categories/[id]/route";
import { CategoryShowResponse } from "./_types/CategoryShowResponse";
import { useSupabaseSession } from "../../../_hooks/useSupabaseSession";
import { useForm, FieldErrors } from "react-hook-form";

export default function AdminEditCategory() {
  const { id } = useParams();
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
    reset,
  } = useForm({
    defaultValues,
  });
  // サブミット時の処理
  const onSubmit = async (data: UpdateCategoryRequestBody) => {
    if (!token) return;

    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(data),
      });

      alert("カテゴリーを更新しました。");

      router.push("/admin/categories");
    } catch (error) {
      console.error("カテゴリーの更新に失敗しました:", error);
      alert("カテゴリーの更新に失敗しました。");
    }
  };

  const onError = (err: FieldErrors<FormData>) => console.log(err);

  const onDelete = async () => {
    if (!confirm("カテゴリーを削除しますか？")) return;

    if (!token) return;

    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      alert("カテゴリーを削除しました");

      router.push("/admin/categories");
    } catch (error) {
      console.error("カテゴリーの削除に失敗しました。", error);
      alert("カテゴリーの削除に失敗しました。");
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      const res = await fetch(`/api/admin/categories/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const { category }: { category: CategoryShowResponse["category"] } =
        await res.json();

      reset({ name: category.name });
    };
    fetcher();
  }, [id, token, reset]);

  return (
    <div className="">
      <div>
        <h1>カテゴリー編集</h1>
      </div>
      <CategoryForm
        mode="edit"
        onSubmit={handleSubmit(onSubmit, onError)}
        onDelete={onDelete}
        disabled={isSubmitting}
        register={register}
        errors={errors}
      />
    </div>
  );
}
