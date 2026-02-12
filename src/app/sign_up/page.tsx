// app/sign_up/page.tsx
"use client";

import { supabase } from "@/app/_libs/supabase";
import styles from "./_styles/Signup.module.css";
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
  // サブミット時の処理
  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `http://localhost:3000/login`,
      },
    });
    if (error) {
      alert("登録に失敗しました");
    } else {
      alert("確認メールを送信しました。");
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
            className={styles.input}
            placeholder="••••••••"
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
          <button type="submit" disabled={isSubmitting}>
            登録
          </button>
        </div>
      </form>
    </div>
  );
}
