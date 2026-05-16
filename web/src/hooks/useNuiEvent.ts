// web/src/hooks/useNuiEvent.ts
import { onMount, onCleanup } from 'solid-js';

/**
 * A hook that manage events listeners for receiving data from the client scripts
 * @param action The specific `action` that should be listened for.
 * @param handler The callback function that will handle data relayed by this hook
 *
 * @example
 * useNuiEvent<{visibility: true, wasVisible: 'something'}>('setVisible', (data) => {
 * // whatever logic you want
 * })
 *
 **/

export const useNuiEvent = <T = unknown>(action: string, handler: (data: T) => void) => {
  const eventListener = (event: MessageEvent<any>) => {
    const { action: eventAction, method, type, data, payload } = event.data;

    const eventIdentifier = eventAction || method || type;
    const eventData = data !== undefined ? data : payload;

    if (eventIdentifier === action) {
      handler(eventData);
    }
  };

  onMount(() => {
    window.addEventListener('message', eventListener);
  });

  onCleanup(() => {
    window.removeEventListener('message', eventListener);
  });
};
