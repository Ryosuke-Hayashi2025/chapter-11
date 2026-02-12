// app/sign_in/page.tsx
"use client";

import { supabase } from "@/app/_libs/supabase";
import { useRouter } from "next/navigation";
import styles from "./_styles/Signin.module.css";
import { useForm,FieldErrors } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
};

export default function Page() {
  // 既定値を準備
  const defaultValues = {
    email: "",
    password: "",
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

  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      alert("ログインに失敗しました");
    } else {
      router.replace("/admin/posts");
      reset();
    }
  };
  const onError = (err: FieldErrors<FormData>) => console.log(err);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit, onError)} className={styles.form}>
        <div>
          <label htmlFor="email" className={styles.label}>
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            className={styles.input}
            placeholder="name@company.com"
            {...register("email", {
              required: "メールアドレスは必須入力です",
              maxLength: {
                value: 50,
                message: "メールアドレスは50文字以内にしてください",
              },
              pattern: {
                value: /^[\w\-.]+@[\w\-.]+\.[a-zA-Z]{2,}$/,
                message: "メールアドレスの形式が不正です",
              },
            })}
          />
          <div>{errors.email?.message}</div>
        </div>
        <div>
          <label htmlFor="password" className={styles.label}>
            パスワード
          </label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            className={styles.input}
            {...register("password", {
              required: "パスワードは必須入力です",
              maxLength: {
                value: 20,
                message: "パスワードは20文字以内にしてください",
              },
            })}
          />
          <div>{errors.password?.message}</div>
        </div>
        <div>
          <button type="submit" className={styles.button} disabled={isSubmitting}>
            ログイン
          </button>
        </div>
      </form>
    </div>
  );
}
