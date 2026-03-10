// app/contact/page.tsx
"use client";

import { ContactInput } from "./_types/contactInput";
import React from "react";
import styles from "./_styles/Contact.module.css";
import { useForm,FieldErrors } from "react-hook-form";

const Contact = () => {
  // 既定値を準備
  const defaultValues = {
    name: "",
    email: "",
    message: "",
  };
  // フォームを初期化
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactInput>({
    defaultValues,
  });
  // サブミット時の処理
  const onSubmit = async (data: ContactInput) => {
    try {
      const res = await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
      if (!res.ok) {
        throw new Error("送信に失敗しました");
      }
      alert("送信しました");
      console.log("送信データ:", data);
      onClear();
    } catch (error) {
      console.error("エラー内容:", error);
      alert("送信に失敗しました");
    }
  };
  const onError = (err: FieldErrors<ContactInput>) => console.log(err);

  const onClear = () => {
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
      <div className={styles.Container}>
        <h1 className={styles.title}>問合わせフォーム</h1>
        <div className={styles.formGroup}>
          <label htmlFor="name">お名前</label>
          <input
            type="text"
            id="name"
            {...register("name", {
              required: "名前は必須入力です",
              maxLength: {
                value: 30,
                message: "名前は30文字以内にしてください",
              },
            })}
          />
          <div>{errors.name?.message}</div>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">メールアドレス</label>
          <input
            type="text"
            id="email"
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
        <div className={styles.formGroup}>
          <label htmlFor="message">本文</label>
          <textarea
            className={styles.textarea}
            id="message"
            {...register("message", {
              required: "本文は必須入力です",
              maxLength: {
                value: 500,
                message: "本文は500文字以内にしてください",
              },
            })}
          />
          <div>{errors.message?.message}</div>
        </div>
        <div>
          <button type="submit" disabled={isSubmitting}>
            送信
          </button>
          <button type="button" onClick={onClear} disabled={isSubmitting}>
            クリア
          </button>
        </div>
      </div>
    </form>
  );
};

export default Contact;
