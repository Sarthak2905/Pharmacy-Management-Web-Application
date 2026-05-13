import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import AppRoutes from './routes/AppRoutes';
import { setTheme } from './features/settings/uiSlice';

function App() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme');
    if (storedTheme) {
      dispatch(setTheme(storedTheme));
    }
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
