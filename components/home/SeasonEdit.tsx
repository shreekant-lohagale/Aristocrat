import Link from 'next/link';
const asset = (file: string) => `/api/assets?file=${encodeURIComponent(file)}`;
const looks = [{ title: 'Daylight Edit', image: '09_black_maxi_high_res.png', href: '/collections/kurtis' }, { title: 'Evening Form', image: 'Product.png', href: '/collections/dresses' }, { title: 'Celebration Edit', image: 'Product..png', href: '/collections/indo-western' }];
export function SeasonEdit() { return <section className="season-edit shell"><header className="editorial-heading"><p className="eyebrow">A considered wardrobe</p><h2>The New Season</h2><p>Elevated silhouettes for every occasion.</p></header><div>{looks.map((look) => <Link href={look.href} key={look.title}><img src={asset(look.image)} alt="" /><span>{look.title}</span></Link>)}</div></section>; }
