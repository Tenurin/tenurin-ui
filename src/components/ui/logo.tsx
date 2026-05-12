'use client';

import type { ReactNode, SyntheticEvent } from 'react';
import { createContext, useContext } from 'react';
import { cn } from '../../lib/utils';

/**
 * Absolute logo image URL (for example the website wordmark from a checked-in brand manifest).
 */
export type BrandLogoUrls = Readonly<{
  src: string;
}>;

const BrandLogoContext = createContext<BrandLogoUrls | null>(null);

export type BrandLogoProviderProps = Readonly<{
  value: BrandLogoUrls;
  children: ReactNode;
}>;

/**
 * When set, {@link Logo} and shared templates render this URL instead of bundled assets.
 */
export function BrandLogoProvider({
  value,
  children,
}: BrandLogoProviderProps) {
  return (
    <BrandLogoContext.Provider value={value}>
      {children}
    </BrandLogoContext.Provider>
  );
}

type LogoProps = Readonly<{
  alt?: string;
  className?: string;
}>;

const BRAND_ASSET_BASE_PATH = '../../assets/brand/';

function getBundledBrandAssetUrl(fileName: string) {
  return new URL(`${BRAND_ASSET_BASE_PATH}${fileName}`, import.meta.url).href;
}

const PUBLIC_BRAND_ICON_FALLBACK = '/favicon.svg';

function applyPublicBrandFallback(event: SyntheticEvent<HTMLImageElement>) {
  const img = event.currentTarget;
  if (img.dataset.tenurinBrandFallback === '1') {
    return;
  }
  img.dataset.tenurinBrandFallback = '1';
  img.src = PUBLIC_BRAND_ICON_FALLBACK;
}

/** Shared mark classes: one asset + invert in dark mode (matches website navbar logo). */
const logoImgClassName =
  'h-8 w-8 shrink-0 object-contain dark:invert';

function Logo({ alt = 'Tenurin logo', className }: LogoProps) {
  const brandFromContext = useContext(BrandLogoContext);

  if (brandFromContext) {
    return (
      <img
        src={brandFromContext.src}
        alt={alt}
        className={cn(logoImgClassName, className)}
        onError={applyPublicBrandFallback}
      />
    );
  }

  return (
    <img
      src={getBundledBrandAssetUrl('tenurin-light-mode-icon.svg')}
      alt={alt}
      className={cn(logoImgClassName, className)}
    />
  );
}

export { Logo };
