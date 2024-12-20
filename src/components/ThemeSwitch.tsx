import { Button } from '@headlessui/react';
import { MoonIcon, SunIcon } from '@heroicons/react/16/solid';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useEffect } from 'react';

export default function ThemeSwitch() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');

  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  const isLight = theme === 'light';

  return (
    <Button
      data-testid="theme-toggle-btn"
      className="p-2 opacity-70 hover:opacity-100"
      onClick={() => {
        setTheme(isLight ? 'dark' : 'light');
      }}
    >
      {isLight ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
    </Button>
  );
}
