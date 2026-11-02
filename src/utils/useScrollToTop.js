import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ensures browser never restores old scroll positions
 */
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  try {
    window.history.scrollRestoration = 'manual';
  } catch {
    // Ignore in unsupported environments
  }
}

/**
 * Resets all possible window, body, and element scroll containers instantly to top (0, 0).
 * Runs immediately, in requestAnimationFrame, and after 120ms to catch late DOM/height changes.
 */
export function resetScrollToTop() {
  if (typeof window === 'undefined') return;

  const docEl = document.documentElement;
  const body = document.body;

  const prevDocBehavior = docEl.style.scrollBehavior;
  const prevBodyBehavior = body.style.scrollBehavior;

  // Temporarily override smooth scrolling so the reset jumps instantly
  docEl.style.scrollBehavior = 'auto';
  body.style.scrollBehavior = 'auto';

  const performReset = () => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }

    docEl.scrollTop = 0;
    docEl.scrollLeft = 0;
    body.scrollTop = 0;
    body.scrollLeft = 0;

    const rootEl = document.getElementById('root');
    if (rootEl) {
      rootEl.scrollTop = 0;
      rootEl.scrollLeft = 0;
    }

    // Reset all potential scrolling content wrappers
    const scrollContainers = document.querySelectorAll(
      '.page-transition-wrapper, main, .home-container, .dashboard-page, .sessions-page, .matches-container, .explore-skills-container, .my-skills-container, .messages-container, .availability-container, .achievements-container, .profile-container, .ratings-page, .auth-page-container'
    );
    scrollContainers.forEach((el) => {
      if (el) {
        el.scrollTop = 0;
        el.scrollLeft = 0;
      }
    });
  };

  // 1. Immediate reset
  performReset();

  // 2. Next animation frame
  requestAnimationFrame(() => {
    performReset();
  });

  // 3. Late reset after 120ms (in case animations or images alter layout height)
  setTimeout(() => {
    performReset();
    docEl.style.scrollBehavior = prevDocBehavior;
    body.style.scrollBehavior = prevBodyBehavior;
  }, 120);
}

/**
 * Hook to automatically reset scroll to top on every route change, tab switch, or navigation.
 */
export function useScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    resetScrollToTop();
  }, [location.pathname, location.search, location.hash]);
}

/**
 * Helper to lock / unlock body scrolling for modal dialogs and ensure modal opens at top.
 */
export function lockBodyScroll(isLocked, modalContentRef = null) {
  if (typeof document === 'undefined') return;

  if (isLocked) {
    document.body.style.overflow = 'hidden';
    if (modalContentRef && modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  } else {
    document.body.style.overflow = '';
  }
}
