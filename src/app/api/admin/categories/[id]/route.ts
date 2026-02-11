// src/app/api/admin/categories/[id]/route.ts
// 管理者_カテゴリー詳細取得API

import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/_libs/supabase";

// カテゴリー詳細APIのレスポンス型
export type CategoryShowResponse = {
  category: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;

  // GET関数の引数からrequestを受け取り、その中にAuthorizationヘッダーが含まれているので、それを取り出す
  const token = request.headers.get("Authorization") ?? "";

  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ message: error.message }, { status: 400 }); // tokenが正しい場合、以降が実行される

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: "カテゴリーが見つかりません。" },
        { status: 404 },
      );
    }

    return NextResponse.json<CategoryShowResponse>(
      { category },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

// src/app/api/admin/categories/[id]/route.ts
// 管理者_カテゴリー更新API

// カテゴリーの更新時に送られてくるリクエストのbodyの型
export type UpdateCategoryRequestBody = {
  name: string;
};

// PUTという命名にすることで、PUTリクエストの時にこの関数が呼ばれる
export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }, //ここでリクエストパラメータを受け取る
) => {
  // paramsの中にidが入っているので、それを取り出す
  const { id } = await params;

  // PUT関数の引数からrequestを受け取り、その中にAuthorizationヘッダーが含まれているので、それを取り出す
  const token = request.headers.get("Authorization") ?? "";

  // supabaseに対してtokenを送り、ユーザー情報をオブジェクトで返却
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ message: error.message }, { status: 400 }); // tokenが正しい場合、以降が実行される

  // リクエストのbodyを取得
  const { name }: UpdateCategoryRequestBody = await request.json();

  try {
    // idを指定して、Categoryを更新
    await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    });

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

// src/app/api/admin/categories/[id]/route.ts
// 管理者_カテゴリー削除API

// DELETEという命名にすることで、DELETEリクエストの時にこの関数が呼ばれる
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }, //ここでリクエストパラメータを受け取る
) => {
  // paramsの中にidが入っているので、それを取り出す
  const { id } = await params;

  // DELETE関数の引数からrequestを受け取り、その中にAuthorizationヘッダーが含まれているので、それを取り出す
  const token = request.headers.get("Authorization") ?? "";

  // supabaseに対してtokenを送り、ユーザー情報をオブジェクトで返却
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ message: error.message }, { status: 400 }); // tokenが正しい場合、以降が実行される

  try {
    await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });
    // レスポンスを返す
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
