import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768; // Tailwind's 'md' breakpoint

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Create a media query list
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Set initial value
    setIsMobile(mql.matches);

    // Define the callback for when the media query status changes
    const onChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Add listener (modern browsers)
    mql.addEventListener('change', onChange);

    // Cleanup
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
