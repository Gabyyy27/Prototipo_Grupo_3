import { AppRouter } from './router.jsx';
import { ReloadToSplash } from './ReloadToSplash.jsx';
import { MobileShell } from '../components/layout/MobileShell.jsx';

export default function App() {
  return (
    <MobileShell>
      <ReloadToSplash />
      <AppRouter />
    </MobileShell>
  );
}
