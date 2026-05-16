// web/src/hooks/useExitListener.ts
import { GeneralEvents } from "@typings/Events";
import { isEnvBrowser } from "@utils/misc";
import { onMount, onCleanup, createEffect } from 'solid-js';
import { fetchNui } from "@utils/fetchNui";

const LISTENED_KEYS = ['Escape'];

export const useExitListener = (enabled: () => boolean) => {
  const keyHandler = (e: KeyboardEvent) => {
    if (LISTENED_KEYS.includes(e.code) && !isEnvBrowser() && enabled()) {
      fetchNui(GeneralEvents.CloseUI);
    }
  };

  onMount(() => {
    window.addEventListener('keydown', keyHandler);
  });

  onCleanup(() => {
    window.removeEventListener('keydown', keyHandler);
  });
};
