import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const featuredCollections = [
  {
    title: 'Kurtis',
    href: '/collections/kurtis',
    image: '02_blue_patchwork_kurta.png',
    className: 'featured-collection-tile--kurtis',
    sizes: '(max-width: 768px) 100vw, (max-width: 1100px) 62vw, 62vw',
  },
  {
    title: 'Dresses',
    href: '/collections/dresses',
    image: '01_black_sleeveless_maxi.png',
    className: 'featured-collection-tile--dresses',
    sizes: '(max-width: 768px) 100vw, (max-width: 1100px) 38vw, 38vw',
  },
  {
    title: 'Indo-Western',
    href: '/collections/indo-western',
    image: '04_red_green_stylish.png',
    className: 'featured-collection-tile--indo',
    sizes: '(max-width: 768px) 100vw, (max-width: 1100px) 38vw, 38vw',
  },
] as const;

export function Categories() {
  return (
    <section className="featured-collections" aria-labelledby="featured-collections-title">
      <div className="featured-collections__inner">
        <header className="featured-collections__header">
          <div>
            <p className="featured-collections__eyebrow">Explore the edit</p>
            <h2 id="featured-collections-title">Featured Collections</h2>
          </div>
          <Link className="featured-collections__all" href="/collections">
            View all <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </header>

        <div className="featured-collections__grid">
          {featuredCollections.map((collection) => (
            <Link
              className={`featured-collection-tile ${collection.className}`}
              href={collection.href}
              key={collection.title}
            >
              <Image
                src={`/api/assets?file=${encodeURIComponent(collection.image)}`}
                alt={`${collection.title} collection`}
                fill
                sizes={collection.sizes}
                className="featured-collection-tile__image"
              />
              <span className="featured-collection-tile__shade" aria-hidden="true" />
              <span className="featured-collection-tile__content">
                <span className="featured-collection-tile__line" aria-hidden="true" />
                <strong>{collection.title}</strong>
                <span className="featured-collection-tile__explore">
                  Explore collection <ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
