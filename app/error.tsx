'use client';
export default function Error({ reset }: { reset: () => void }) { return <main className="error-screen"><h1>Something interrupted the moment.</h1><button onClick={reset}>Try again</button></main>; }
