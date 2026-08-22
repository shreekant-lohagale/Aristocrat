export function productImageSrc(image: string) { return /^https?:\/\//i.test(image) ? image : `/api/assets?file=${encodeURIComponent(image)}`; }
