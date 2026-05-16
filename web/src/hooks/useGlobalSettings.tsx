// web/src/hooks/useGlobalSettings.tsx
import { createContext, useContext, onMount, onCleanup, createSignal, createEffect, type ParentProps } from 'solid-js';

type Theme = 'light' | 'dark';

interface GlobalSettings {
  isMobile: () => boolean;
  theme: () => Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const GlobalSettingsContext = createContext<GlobalSettings>({ 
  isMobile: () => false,
  theme: () => 'dark' as Theme,
  setTheme: () => {},
  toggleTheme: () => {}
});

export const useGlobalSettings = () => {
  const context = useContext(GlobalSettingsContext);
  if (!context) {
    throw new Error('useGlobalSettings must be used within a GlobalSettingsProvider');
  }
  return context;
};

export const GlobalSettingsProvider = (props: ParentProps) => {
  const [isMobile, setIsMobile] = createSignal(window.innerWidth < 768 || window.location.hash.includes('/mobile'));
  const [theme, setTheme] = createSignal<Theme>((localStorage.getItem('pefcl-theme') as Theme) || 'dark');

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768 || window.location.hash.includes('/mobile'));
  };

  const toggleTheme = () => {
    const newTheme = theme() === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  createEffect(() => {
    const currentTheme = theme();
    const root = document.documentElement;
    if (currentTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('pefcl-theme', currentTheme);
  });

  onMount(() => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('hashchange', handleResize);
  });

  onCleanup(() => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('hashchange', handleResize);
  });

  return (
    <GlobalSettingsContext.Provider value={{ isMobile, theme, setTheme, toggleTheme }}>
      {props.children}
    </GlobalSettingsContext.Provider>
  );
};
