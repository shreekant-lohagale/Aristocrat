import { createHash, randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  customerCookieNames,
  getCustomerAccountClientId,
  getCustomerOpenIdConfiguration,
  hasCustomerAccountApiConfig,
} from '@/lib/shopify/customer-account';
import { getHostedCustomerAccountUrl } from '@/lib/shopify/customer-account-url';

const randomValue = () => randomBytes(32).toString('base64url');

export async function GET(request: NextRequest) {
  if (!hasCustomerAccountApiConfig()) {
    return NextResponse.redirect(getHostedCustomerAccountUrl() || new URL('/account?auth=unconfigured', request.url));
  }

  try {
    const clientId = getCustomerAccountClientId();
    const { authorization_endpoint: endpoint } = await getCustomerOpenIdConfiguration();
    if (!clientId) throw new Error('Customer Account client ID is unavailable');

    const state = randomValue();
    const verifier = randomValue();
    const challenge = createHash('sha256').update(verifier).digest('base64url');
    const callbackUrl = new URL('/account/auth/callback', request.nextUrl.origin).toString();
    const authorizationUrl = new URL(endpoint);
    authorizationUrl.searchParams.set('client_id', clientId);
    authorizationUrl.searchParams.set('response_type', 'code');
    authorizationUrl.searchParams.set('redirect_uri', callbackUrl);
    authorizationUrl.searchParams.set('scope', 'openid email customer-account-api:full');
    authorizationUrl.searchParams.set('state', state);
    authorizationUrl.searchParams.set('code_challenge', challenge);
    authorizationUrl.searchParams.set('code_challenge_method', 'S256');
    if (request.nextUrl.searchParams.get('prompt') === 'none') authorizationUrl.searchParams.set('prompt', 'none');

    const response = NextResponse.redirect(authorizationUrl);
    const secure = request.nextUrl.protocol === 'https:';
    const transient = { httpOnly: true, secure, sameSite: 'lax' as const, path: '/account', maxAge: 600 };
    response.cookies.set(customerCookieNames.state, state, transient);
    response.cookies.set(customerCookieNames.verifier, verifier, transient);
    response.cookies.delete(customerCookieNames.checked);
    return response;
  } catch {
    return NextResponse.redirect(new URL('/account?auth=error', request.url));
  }
}
