'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useProfileSectionNav(sectionIds: readonly string[]) {
  const [activeSectionId, setActiveSectionId] = useState(sectionIds[0] ?? '');
  const isProgrammaticScrollRef = useRef(false);

  useEffect(() => {
    if (sectionIds.length === 0) {
      return;
    }

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      if (isProgrammaticScrollRef.current) {
        return;
      }

      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (left, right) =>
            left.boundingClientRect.top - right.boundingClientRect.top,
        );

      const topmostEntry = visibleEntries[0];
      if (topmostEntry?.target.id) {
        setActiveSectionId(topmostEntry.target.id);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '-20% 0px -55% 0px',
      threshold: 0,
    });

    for (const sectionId of sectionIds) {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, [sectionIds]);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) {
      return;
    }

    setActiveSectionId(sectionId);
    isProgrammaticScrollRef.current = true;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });

    globalThis.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 800);
  }, []);

  return { activeSectionId, scrollToSection };
}
