// app/admin/categories/new/page.tsx
// 管理者_カテゴリーの新規作成ページ
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryForm } from "../_components/CategoryForm";
import { CreateCategoryRequestBody } from "@/app/api/admin/categories/route";
import { useSupabaseSession } from "../../../_hooks/useSupabaseSession";

export default function AdminCreateCategory() {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { token } = useSupabaseSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;

    try {
      setIsSubmitting(true);

      const body: CreateCategoryRequestBody = {
        name,
      };

      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      });

      const { id } = await res.json();
      router.push(`/admin/categories/${id}`);
      alert("カテゴリーを作成しました。");
    } catch (error) {
      console.error("カテゴリーの作成に失敗しました:", error);
      alert("カテゴリーの作成に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <div>
        <h1>カテゴリー作成</h1>
      </div>
      <CategoryForm
        mode="new"
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
        disabled={isSubmitting}
      />
    </div>
  );
}
