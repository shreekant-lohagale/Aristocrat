export async function subscribeToNewsletter(email: string) { return fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) }); }
