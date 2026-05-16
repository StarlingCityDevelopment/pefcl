// web/src/hooks/useKeyPress.ts
import { onMount, onCleanup } from 'solid-js';

export const useKeyDown = (keys: string[], callback: () => void) => {
  const keyHandler = (e: KeyboardEvent) => {
    if (keys.includes(e.code) || keys.includes(e.key)) {
      callback();
    }
  };

  onMount(() => {
    window.addEventListener('keydown', keyHandler);
  });

  onCleanup(() => {
    window.removeEventListener('keydown', keyHandler);
  });
};
