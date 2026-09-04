import { NextRequest, NextResponse } from 'next/server';
import { customerCookieNames, getCustomerOpenIdConfiguration } from '@/lib/shopify/customer-account';

const clearSessionCookies = (response: NextResponse) => {
  for (const name of Object.values(customerCookieNames)) {
    response.cookies.set(name, '', { httpOnly: true, path: '/account', maxAge: 0 });
  }
};

export async function GET(request: NextRequest) {
  const accountUrl = new URL('/account', request.nextUrl.origin);
  const idToken = request.cookies.get(customerCookieNames.idToken)?.value;

  try {
    if (idToken) {
      const { end_session_endpoint: logoutEndpoint } = await getCustomerOpenIdConfiguration();
      const logoutUrl = new URL(logoutEndpoint);
      logoutUrl.searchParams.set('id_token_hint', idToken);
      logoutUrl.searchParams.set('post_logout_redirect_uri', accountUrl.toString());
      const response = NextResponse.redirect(logoutUrl);
      clearSessionCookies(response);
      return response;
    }
  } catch {
    // Clearing the local session remains safe if Shopify discovery is unavailable.
  }

  const response = NextResponse.redirect(accountUrl);
  clearSessionCookies(response);
  return response;
}
