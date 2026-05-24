'use client';

import type { ReactNode, SyntheticEvent } from 'react';
import { createContext, useContext } from 'react';
import { cn } from '../../lib/utils';

/**
 * One resolved raster variant (CDN or static manifest entry).
 */
export type BrandLogoVariant = Readonly<{
  url: string;
  width: number;
  height: number;
}>;

/**
 * CDN wordmark configuration: PNG (or other) fallback URL plus optional AVIF/WebP variants.
 */
export type BrandLogoUrls = Readonly<{
  src: string;
  readonly variants?: Readonly<
    Partial<Record<'avif' | 'webp' | 'png' | 'jpg' | 'jpeg', BrandLogoVariant>>
  >;
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
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
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

/** Box sizing for the logo slot (used on `<picture>` or single `<img>`). */
const logoBoxClassName = 'h-8 w-8 shrink-0';

/** Painting on the actual raster (must stay on `<img>` so `filter` applies to decoded pixels). */
const logoRasterClassName = 'object-contain dark:invert';

function pickBrandLogoDims(brand: BrandLogoUrls): BrandLogoVariant | undefined {
  return (
    brand.variants?.png ??
    brand.variants?.webp ??
    brand.variants?.avif ??
    brand.variants?.jpg ??
    brand.variants?.jpeg
  );
}

/** Manifest dimensions for full-bleed masters are huge; HTML attrs blow up flex min-width. */
const MAX_LOGO_IMPLIED_PX = 256;

/**
 * Only forwards width/height when small enough for layout; large CDN master sizes break flex rows.
 */
function logoImgSizeAttrs(
  dims: BrandLogoVariant | undefined,
): Readonly<{ width?: number; height?: number }> {
  if (!dims?.width || !dims?.height) {
    return {};
  }
  if (dims.width > MAX_LOGO_IMPLIED_PX || dims.height > MAX_LOGO_IMPLIED_PX) {
    return {};
  }
  return { width: dims.width, height: dims.height };
}

function BrandLogoPicture({
  brand,
  alt,
  className,
  loading,
  fetchPriority,
}: Readonly<{
  brand: BrandLogoUrls;
  alt: string;
  className?: string;
  loading?: LogoProps['loading'];
  fetchPriority?: LogoProps['fetchPriority'];
}>) {
  const v = brand.variants;
  const dims = pickBrandLogoDims(brand);
  const sizeAttrs = logoImgSizeAttrs(dims);
  return (
    <picture className={cn('block', logoBoxClassName, className)}>
      {v?.avif ? (
        <source srcSet={v.avif.url} type="image/avif" />
      ) : null}
      {v?.webp ? (
        <source srcSet={v.webp.url} type="image/webp" />
      ) : null}
      <img
        src={brand.src}
        alt={alt}
        {...sizeAttrs}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        className={cn('h-full w-full', logoRasterClassName)}
        onError={applyPublicBrandFallback}
      />
    </picture>
  );
}

function Logo({ alt = 'Tenurin logo', className, loading, fetchPriority }: LogoProps) {
  const brandFromContext = useContext(BrandLogoContext);

  if (brandFromContext) {
    const modern =
      brandFromContext.variants?.avif ?? brandFromContext.variants?.webp;
    if (modern) {
      return (
        <BrandLogoPicture
          brand={brandFromContext}
          alt={alt}
          className={className}
          loading={loading ?? 'eager'}
          fetchPriority={fetchPriority ?? 'high'}
        />
      );
    }

    return (
      <img
        src={brandFromContext.src}
        alt={alt}
        {...logoImgSizeAttrs(pickBrandLogoDims(brandFromContext))}
        loading={loading ?? 'lazy'}
        fetchPriority={fetchPriority ?? 'auto'}
        decoding="async"
        className={cn(logoBoxClassName, logoRasterClassName, className)}
        onError={applyPublicBrandFallback}
      />
    );
  }

  return (
    <img
      src={getBundledBrandAssetUrl('tenurin-brand-icon.svg')}
      alt={alt}
      className={cn(logoBoxClassName, logoRasterClassName, className)}
    />
  );
}

export { Logo };
