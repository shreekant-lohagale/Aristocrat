'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { editorialCategories } from '@/lib/catalog/categories';
import { ExploreButton } from '@/components/ui/ExploreButton';
import { fadeUp, staggerContainer, staggerItem, viewportOnce } from '@/lib/motion';

const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;

export function EditorialCategories() {
  const reducedMotion = useReducedMotion();
  return <motion.section className="editorial-categories" aria-labelledby="editorial-categories-title" initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={viewportOnce}>
    <motion.header variants={fadeUp} className="editorial-categories__heading"><p>02 / Shop by category</p><div><h2 id="editorial-categories-title">The House <em>Categories</em></h2><span aria-hidden="true" /></div></motion.header>
    <motion.div variants={staggerContainer} className="editorial-categories__grid">
      {editorialCategories.map((category) => <motion.article variants={staggerItem} className={`editorial-category editorial-category--${category.handle}${category.featured ? ' editorial-category--featured' : ''}`} key={category.id}>
        <Image src={asset(category.image)} alt={`${category.title} collection`} fill sizes={category.featured ? '(max-width: 768px) 100vw, 48vw' : '(max-width: 768px) 50vw, 32vw'} style={{ objectPosition: category.imagePosition }} />
        <div className="editorial-category__veil" />
        <div className="editorial-category__content"><p>{category.eyebrow}</p><h3>{category.title}</h3><span>{category.description}</span><ExploreButton href={category.href} ariaLabel={`Explore ${category.title}`}>Explore</ExploreButton></div>
      </motion.article>)}
    </motion.div>
  </motion.section>;
}
