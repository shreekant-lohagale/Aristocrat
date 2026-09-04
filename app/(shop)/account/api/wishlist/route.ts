import { NextRequest, NextResponse } from 'next/server';
import { customerCookieNames } from '@/lib/shopify/customer-account';
import {
  CustomerWishlistError,
  normalizeWishlist,
  readCustomerWishlist,
  writeCustomerWishlist,
} from '@/lib/shopify/customer-wishlist';

export const dynamic = 'force-dynamic';

const responseHeaders = { 'Cache-Control': 'private, no-store, max-age=0' };

function errorResponse(error: unknown) {
  if (error instanceof CustomerWishlistError) {
    return NextResponse.json({ error: error.code }, { status: error.status, headers: responseHeaders });
  }
  return NextResponse.json({ error: 'wishlist-unavailable' }, { status: 500, headers: responseHeaders });
}

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(customerCookieNames.accessToken)?.value;
  if (!accessToken) return NextResponse.json({ authenticated: false, wishlist: [] }, { status: 401, headers: responseHeaders });
  try {
    const record = await readCustomerWishlist(accessToken);
    return NextResponse.json({ authenticated: true, wishlist: record.wishlist }, { headers: responseHeaders });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  const accessToken = request.cookies.get(customerCookieNames.accessToken)?.value;
  if (!accessToken) return NextResponse.json({ authenticated: false, wishlist: [] }, { status: 401, headers: responseHeaders });
  try {
    const body = await request.json() as { wishlist?: unknown };
    if (!Array.isArray(body.wishlist)) {
      return NextResponse.json({ error: 'invalid-wishlist' }, { status: 400, headers: responseHeaders });
    }
    const wishlist = await writeCustomerWishlist(accessToken, normalizeWishlist(body.wishlist));
    return NextResponse.json({ authenticated: true, wishlist }, { headers: responseHeaders });
  } catch (error) {
    return errorResponse(error);
  }
}
