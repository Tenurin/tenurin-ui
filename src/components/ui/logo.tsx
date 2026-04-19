import { cn } from '../../lib/utils';

type LogoProps = Readonly<{
  alt?: string;
  className?: string;
}>;

const BRAND_ASSET_BASE_PATH = '../../assets/brand/';

function getBrandAssetUrl(fileName: string) {
  return new URL(`${BRAND_ASSET_BASE_PATH}${fileName}`, import.meta.url).href;
}

function Logo({ alt = 'Tenurin logo', className }: LogoProps) {
  return (
    <>
      <img
        src={getBrandAssetUrl('tenurin-light-mode-icon.svg')}
        alt={alt}
        className={cn('h-8 w-8 shrink-0 dark:hidden', className)}
      />
      <img
        src={getBrandAssetUrl('tenurin-dark-mode-icon.svg')}
        alt={alt}
        className={cn('hidden h-8 w-8 shrink-0 dark:block', className)}
      />
    </>
  );
}

export { Logo };
