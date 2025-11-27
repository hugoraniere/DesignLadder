import { useEffect, useRef } from 'react';
import { trackEvent } from '../lib/supabase';

const getSessionId = () => {
  let sessionId = sessionStorage.getItem('design-ladder-session');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('design-ladder-session', sessionId);
  }
  return sessionId;
};

export const useAnalytics = () => {
  const sessionId = useRef(getSessionId());
  const scrollDepths = useRef(new Set<number>());

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

      [25, 50, 75, 100].forEach(depth => {
        if (scrollPercentage >= depth && !scrollDepths.current.has(depth)) {
          scrollDepths.current.add(depth);
          trackEvent('scroll_depth', { depth: `${depth}%` }, sessionId.current);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const track = (eventType: string, eventData?: any) => {
    trackEvent(eventType, eventData, sessionId.current);
  };

  return { track, sessionId: sessionId.current };
};
