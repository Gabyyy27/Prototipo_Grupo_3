import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function getNavigationType() {
  const navigationEntry = performance.getEntriesByType?.('navigation')?.[0];
  return navigationEntry?.type || 'navigate';
}

export function ReloadToSplash() {
  const location = useLocation();
  const navigate = useNavigate();
  const handledReload = useRef(false);

  useEffect(() => {
    if (handledReload.current) return;
    handledReload.current = true;

    if (getNavigationType() === 'reload' && location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
}
