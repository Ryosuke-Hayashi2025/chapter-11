'use client'

import { supabase } from '@/app/_libs/supabase'
import { useState } from 'react'
import styles from './_styles/Signup.module.css'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsSubmitting(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `http://localhost:3000/login`,
      },
    })
    if (error) {
      alert('登録に失敗しました')
    } else {
      setEmail('')
      setPassword('')
      alert('確認メールを送信しました。')
    }
    setIsSubmitting(false)
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label
            htmlFor="email"
            className={styles.label}
          >
            メールアドレス
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className={styles.input}
            placeholder="name@company.com"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            パスワード
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className={styles.input}
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
          >
            登録
          </button>
        </div>
      </form>
    </div>
  )
}
