// src/app/api/admin/categories/route.ts
// 管理者_カテゴリー一覧取得API

import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/_libs/supabase";

export type CategoriesIndexResponse = {
  categories: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export const GET = async (request: NextRequest) => {
  // GET関数の引数からrequestを受け取り、その中にAuthorizationヘッダーが含まれているので、それを取り出す
  const token = request.headers.get("Authorization") ?? "";

  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ message: error.message }, { status: 400 }); // tokenが正しい場合、以降が実行される

  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json<CategoriesIndexResponse>(
      { categories },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

// src/app/api/admin/categories/route.ts
// 管理者_カテゴリー作成API

// カテゴリー作成時に送られてくるリクエストの型
export type CreateCategoryRequestBody = {
  name: string;
};

// カテゴリー作成APIのレスポンス型
export type CreateCategoryResponse = {
  id: number;
};

// POSTという命名にすることで、POSTリクエストの時にこの関数が呼ばれる
export const POST = async (request: Request) => {
  // POST関数の引数からrequestを受け取り、その中にAuthorizationヘッダーが含まれているので、それを取り出す
  const token = request.headers.get("Authorization") ?? "";

  // supabaseに対してtokenを送り、ユーザー情報をオブジェクトで返却
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ message: error.message }, { status: 400 }); // tokenが正しい場合、以降が実行される

  try {
    // リクエストのbodyを取得
    const body: CreateCategoryRequestBody = await request.json();

    // bodyの中からnameを取り出す
    const { name } = body;

    // カテゴリーをDBに生成
    const data = await prisma.category.create({
      data: {
        name,
      },
    });

    // レスポンスを返す
    return NextResponse.json<CreateCategoryResponse>({
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
};
