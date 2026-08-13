import { useEffect } from 'react';

/**
 * Custom hook to lock body scrolling when a modal or dialog is open.
 */
export function useLockBodyScroll(isOpen: boolean): void {
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || 'unset';
      };
    }
  }, [isOpen]);
}
