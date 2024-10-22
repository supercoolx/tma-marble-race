import { useIntegration } from '@telegram-apps/react-router-integration';
import { bindMiniAppCSSVars, bindThemeParamsCSSVars, bindViewportCSSVars, initNavigator, useLaunchParams, useMiniApp, useThemeParams, useViewport } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { useEffect, useMemo } from 'react';
import { Navigate, Route, Router, Routes } from 'react-router-dom';
import AuthProvider from '@/providers/AuthProvider';
import { ToastContainer } from 'react-toastify';
import { routes } from '@/navigation/routes.jsx';
import Balance from '@/components/Balance';
import Footer from '@/components/Footer';

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

  const navigator = useMemo(() => initNavigator('app-navigation-state'), []);
  const [location, reactNavigator] = useIntegration(navigator);

  useEffect(() => {
    navigator.attach();
    return () => navigator.detach();
  }, [navigator]);

  return (
    <AppRoot appearance={miniApp.isDark ? 'dark' : 'light'} platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'} >
      <Router location={location} navigator={reactNavigator}>
        <AuthProvider>
          <div className='flex flex-col pb-[85px]'>
            <Balance/>
            <Routes>
              {routes.map((route) => <Route key={route.path} {...route} />)}
              <Route path='*' element={<Navigate to='/' />} />
            </Routes>
          </div>
          <Footer/>
        </AuthProvider>
      </Router>
      <ToastContainer position="top-center" autoClose={1000} theme={miniApp.isDark ? 'dark' : 'light'} />
    </AppRoot>
  );
}
