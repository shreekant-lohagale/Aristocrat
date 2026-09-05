import styles from './BrandLoader.module.css';

type BrandLoaderProps = {
  fullScreen?: boolean;
  label?: string;
};

export function BrandLoader({ fullScreen = true, label = 'Loading House of Aristocrat' }: BrandLoaderProps) {
  return (
    <div className={fullScreen ? styles.screen : styles.inline} role="status" aria-live="polite" aria-label={label}>
      <div className={styles.lockup}>
        <svg className={styles.mark} viewBox="0 0 440 92" aria-hidden="true">
          <path className={styles.frame} d="M18 46H126M314 46h108M140 17h160M140 75h160" />
          <path className={styles.accent} d="M220 8v18M211 17h18M190 46h60" />
        </svg>
        <span className={styles.wordmark}>HOUSE OF ARISTOCRAT</span>
        <small className={styles.caption}>Everyday Fashion</small>
      </div>
    </div>
  );
}
