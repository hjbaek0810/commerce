import { NextResponse } from 'next/server';

import { notion } from '@api/config';

import type { NextRequest } from 'next/server';

// https://developers.notion.com/reference/retrieve-a-page-property

type Context = {
  params: { productId: string };
};

// get
async function getDetail(productId: string, propertyId: string) {
  try {
    const response = await notion.pages.properties.retrieve({
      page_id: productId,
      property_id: propertyId,
    });

    return response;
  } catch (error) {
    console.error(JSON.stringify(error));
  }
}

export async function GET(req: NextRequest, context: Context) {
  try {
    const { productId } = context.params;

    const { searchParams } = req.nextUrl;
    const propertyId = searchParams.get('propertyId');

    const response = await getDetail(productId, String(propertyId));

    return NextResponse.json(
      { detail: response, message: 'success' },
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
