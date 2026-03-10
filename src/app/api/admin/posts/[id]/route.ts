// src/app/api/admin/posts/[id]/route.ts
// 管理者_記事詳細取得API

import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/_libs/supabase";

export type Category = {
  id: number;
  name: string;
};

// 記事詳細APIのレスポンスの型
export type PostShowResponse = {
  post: {
    id: number;
    title: string;
    content: string;
    thumbnailImageKey: string;
    createdAt: Date;
    updatedAt: Date;
    postCategories: {
      category: Category;
    }[];
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
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { message: "記事が見つかりません。" },
        { status: 404 },
      );
    }

    return NextResponse.json<PostShowResponse>({ post }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

// src/app/api/admin/posts/[id]/route.ts
// 管理者_記事更新API

// 記事の更新時に送られてくるリクエストのbodyの型
export type UpdatePostRequestBody = {
  title: string;
  content: string;
  categories: Category[];
  thumbnailImageKey: string;
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
  const { title, content, categories, thumbnailImageKey }: UpdatePostRequestBody =
    await request.json();

  try {
    // idを指定して、Postを更新
    const post = await prisma.post.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        content,
        thumbnailImageKey,
      },
    });

    // 一旦、記事とカテゴリーの中間テーブルのレコードを全て削除
    await prisma.postCategory.deleteMany({
      where: {
        postId: parseInt(id),
      },
    });

    // 記事とカテゴリーの中間テーブルのレコードをDBに生成
    // 本来複数同時生成には、createManyというメソッドがあるが、sqliteではcreateManyが使えないので、for文1つずつ実施
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          postId: post.id,
          categoryId: category.id,
        },
      });
    }

    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

// src/app/api/admin/posts/[id]/route.ts
// 管理者_記事削除API

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
    // idを指定して、Postを削除
    await prisma.post.delete({
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
