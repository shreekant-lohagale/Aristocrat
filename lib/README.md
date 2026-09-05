# Shared domain logic

[Back to the project README](../README.md)

`lib/` contains commerce-domain code shared by pages, route handlers, and components. It is not a generic dumping ground: put Shopify transport/security in `shopify/`, storefront catalog behavior in `catalog/`, and shared motion definitions in `motion.ts`.

## Map

| Path | Responsibility | Runtime boundary |
| --- | --- | --- |
| `shopify/` | Storefront API, carts, Customer Account OAuth/API, wishlist metafield | Server-only unless a file contains only types |
| `catalog/` | Collection definitions, product retrieval/mapping orchestration, fallback and image helpers | Mixed; inspect imports before using in clients |
| `account/addresses.ts` | Local address type/storage key for dormant local editor | Shared, but not active Shopify account data |
| `motion.ts` | Reusable Framer Motion transitions/variants | Client-compatible shared module |

See [Shopify integration](shopify/README.md) and [catalog architecture](catalog/README.md).

## Dependency direction

```text
app server pages / route handlers
    -> lib/catalog
        -> lib/shopify
            -> Shopify APIs

client components
    -> internal Next.js APIs and shared types/helpers
```

`lib/catalog/products.ts` may call Node/filesystem-backed fallback code. Do not import it into a client component. Client components should use `/api/catalog` or receive server-fetched data.

## Extension rules

- Keep external responses behind typed mappers rather than spreading Shopify node shapes through UI code.
- Normalize collection handles using the single catalog helper.
- Add GraphQL fields to the query types, mapper, and shared commerce types together.
- Return user-safe API messages; detailed upstream failures belong in server logs without credentials/customer data.
- Preserve `no-store` on private customer/cart responses. A future catalog cache policy should be deliberate and documented.
- Use shared motion variants rather than duplicating easing/durations.

## Known debt

- `lib/account/addresses.ts` supports an unmounted local editor and is not a Shopify persistence layer.
- Catalog and Shopify files contain some compact one-line implementations that are harder to review.
- There is no test coverage around mapping, collection normalization, cart reconciliation, or wishlist conflicts.

