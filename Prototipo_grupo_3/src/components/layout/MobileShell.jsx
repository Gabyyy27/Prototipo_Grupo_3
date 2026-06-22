import { useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav.jsx';

const mainNavPaths = ['/dashboard', '/inventory', '/history', '/profile'];

export function MobileShell({ children }) {
  const { pathname } = useLocation();
  const showNavigation = mainNavPaths.includes(pathname);

  return (
    <div className="app-canvas">
      <div className="phone-shell">
        <div className={showNavigation ? 'screen with-bottom-nav' : 'screen'}>
          {children}
        </div>
        {showNavigation && <BottomNav />}
      </div>
    </div>
  );
}
