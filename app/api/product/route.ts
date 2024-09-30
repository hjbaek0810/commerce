'use server';

import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';

import type { NextApiResponse } from 'next';

type Data = {
  message: string;
};

const notion = new Client({
  auth: 'secret_DRKVmbYNIXIkZPaVF81JoHGkTy49unjEJw63OS4wmRe',
});

const databaseId = '111b6df238e980cca653e2ae837a72ba';

async function addItem(name: string) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        title: [
          {
            text: {
              content: name,
            },
          },
        ],
      },
    });
    console.log(response);
  } catch (error) {
    console.error(JSON.stringify(error));
  }
}

export async function POST(req: Request, res: NextApiResponse<Data>) {
  const data = await req.json();

  const { name } = data ?? {};

  if (!name) {
    return NextResponse.json(
      { message: `no name` },
      {
        status: 400,
      },
    );
  }

  try {
    await addItem(String(name));

    return NextResponse.json(
      { message: `success ${name} added` },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `failed ${name} added` },
      {
        status: 400,
      },
    );
  }
}
