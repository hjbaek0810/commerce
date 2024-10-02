'use server';

import { NextResponse } from 'next/server';

import { notion } from '@api/config';
import { databaseId } from '@api/product/config';

import type { NextApiResponse } from 'next';

// https://developers.notion.com/reference/create-a-database
// https://developers.notion.com/reference/post-database-query

type Data = {
  items?: Array<any>;
  message: string;
};

// post
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

// get
async function getItems() {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'price',
          direction: 'ascending',
        },
      ],
    });

    return response;
  } catch (error) {
    console.error(JSON.stringify(error));
  }
}

export async function GET() {
  try {
    const response = await getItems();

    return NextResponse.json(
      { items: response?.results, message: 'success' },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'failed' },
      {
        status: 400,
      },
    );
  }
}
