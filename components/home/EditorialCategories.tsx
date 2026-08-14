import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { editorialCategories } from '@/lib/catalog/categories';

const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;

export function EditorialCategories() {
  return (
    <section className="editorial-categories" aria-labelledby="editorial-categories-title">
      <header className="editorial-categories__heading">
        <p>02 / Shop by category</p>
        <div>
          <h2 id="editorial-categories-title">The House <em>Categories</em></h2>
          <span aria-hidden="true" />
        </div>
      </header>
      <div className="editorial-categories__grid">
        {editorialCategories.map((category) => (
          <article className={`editorial-category editorial-category--${category.handle}${category.featured ? ' editorial-category--featured' : ''}`} key={category.id}>
            <Image src={asset(category.image)} alt={`${category.title} collection`} fill sizes={category.featured ? '(max-width: 768px) 100vw, 48vw' : '(max-width: 768px) 50vw, 32vw'} style={{ objectPosition: category.imagePosition }} />
            <div className="editorial-category__veil" />
            <div className="editorial-category__content">
              <p>{category.eyebrow}</p>
              <h3>{category.title}</h3>
              <span>{category.description}</span>
              <Link href={category.href} aria-label={`Explore ${category.title}`}>Explore <ArrowUpRight size={16} aria-hidden="true" /></Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
