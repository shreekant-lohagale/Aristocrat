import { NextRequest, NextResponse } from 'next/server';
import {
  customerCookieNames,
  getCustomerAccountClientId,
  getCustomerOpenIdConfiguration,
} from '@/lib/shopify/customer-account';

type TokenResponse = {
  access_token: string;
  id_token?: string;
  expires_in: number;
};

const clearTransientCookies = (response: NextResponse) => {
  for (const name of [customerCookieNames.state, customerCookieNames.verifier]) {
    response.cookies.set(name, '', { httpOnly: true, path: '/account', maxAge: 0 });
  }
};

export async function GET(request: NextRequest) {
  const destination = new URL('/account', request.nextUrl.origin);
  const cookieState = request.cookies.get(customerCookieNames.state)?.value;
  const verifier = request.cookies.get(customerCookieNames.verifier)?.value;
  const state = request.nextUrl.searchParams.get('state');
  const code = request.nextUrl.searchParams.get('code');
  const oauthError = request.nextUrl.searchParams.get('error');

  if (oauthError || !code) {
    const response = NextResponse.redirect(destination);
    clearTransientCookies(response);
    response.cookies.set(customerCookieNames.checked, '1', { httpOnly: true, secure: request.nextUrl.protocol === 'https:', sameSite: 'lax', path: '/account', maxAge: 300 });
    return response;
  }

  if (!state || !cookieState || state !== cookieState || !verifier) {
    destination.searchParams.set('auth', 'error');
    const response = NextResponse.redirect(destination);
    clearTransientCookies(response);
    return response;
  }

  try {
    const clientId = getCustomerAccountClientId();
    const { token_endpoint: tokenEndpoint } = await getCustomerOpenIdConfiguration();
    if (!clientId) throw new Error('Customer Account client ID is unavailable');
    const redirectUri = new URL('/account/auth/callback', request.nextUrl.origin).toString();
    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: request.nextUrl.origin },
      body: new URLSearchParams({ grant_type: 'authorization_code', client_id: clientId, redirect_uri: redirectUri, code, code_verifier: verifier }),
      cache: 'no-store',
    });
    if (!tokenResponse.ok) throw new Error('Customer token exchange failed');
    const token = await tokenResponse.json() as TokenResponse;
    if (!token.access_token) throw new Error('Customer access token is missing');

    const response = NextResponse.redirect(destination);
    const cookieOptions = { httpOnly: true, secure: request.nextUrl.protocol === 'https:', sameSite: 'lax' as const, path: '/account' };
    response.cookies.set(customerCookieNames.accessToken, token.access_token, { ...cookieOptions, maxAge: Math.max(60, token.expires_in - 60) });
    if (token.id_token) response.cookies.set(customerCookieNames.idToken, token.id_token, { ...cookieOptions, maxAge: Math.max(60, token.expires_in - 60) });
    response.cookies.set(customerCookieNames.checked, '1', { ...cookieOptions, maxAge: 300 });
    clearTransientCookies(response);
    return response;
  } catch {
    destination.searchParams.set('auth', 'error');
    const response = NextResponse.redirect(destination);
    clearTransientCookies(response);
    return response;
  }
}
