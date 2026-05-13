import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleTheme } from '../../features/settings/uiSlice';

function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      className="rounded-full border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
    >
      {theme === 'light' ? 'Dark mode' : 'Light mode'}
    </button>
  );
}

export default ThemeToggle;
