import { useIntegration } from '@telegram-apps/react-router-integration';
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
  initNavigator, useLaunchParams,
  useMiniApp,
  useThemeParams,
  useViewport,
} from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { useEffect, useMemo } from 'react';
import {
  Navigate,
  Route,
  Router,
  Routes,
} from 'react-router-dom';

import AuthProvider from '@/providers/AuthProvider';
import { ToastContainer } from 'react-toastify';

import { routes } from '@/navigation/routes.jsx';

/**
 * @return {JSX.Element}
 */
export function App() {
  const lp = useLaunchParams();
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();

  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    if (viewport) {
      viewport.expand();
      bindViewportCSSVars(viewport);
    }
  }, [viewport]);

  // Create a new application navigator and attach it to the browser history, so it could modify
  // it and listen to its changes.
  const navigator = useMemo(() => initNavigator('app-navigation-state'), []);
  const [location, reactNavigator] = useIntegration(navigator);

  // Don't forget to attach the navigator to allow it to control the BackButton state as well
  // as browser history.
  useEffect(() => {
    navigator.attach();
    return () => navigator.detach();
  }, [navigator]);

  return (
    <AppRoot
      appearance={miniApp.isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
    >
      <Router location={location} navigator={reactNavigator}>
        <AuthProvider>
        {/* <div className="h-[100vh] bg-gradient-to-tl from-[#000] to-[#2E2856] pb-[20px]">
          <div className='flex flex-row justify-center items-center gap-2 py-[11px]'>
                <img className='w-[17px] h-[17px]' src="/imgs/marble_ball.webp" alt=''/>
                <span className='text-[16.7px] font-normal text-[#fff]'>Marble Mania</span>
                <img className='w-[17px] h-[17px]' src="/imgs/marble_ball.webp" alt=''/>
          </div>
          <div className='flex flex-col bg-gradient-to-br from-[#1F1C35] to-[#0E0D14] mb-[7px] mx-[8px] rounded-[30px] border-[#0F0E15] border-solid border-2'> */}
            <Routes>
              {routes.map((route) => <Route key={route.path} {...route} />)}
              <Route path='*' element={<Navigate to='/' />} />
            </Routes>
          {/* </div>
        </div> */}
        </AuthProvider>
      </Router>
      <ToastContainer position="top-center" autoClose={3000} theme="dark" />
    </AppRoot>
  );
}
