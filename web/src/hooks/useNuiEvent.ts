import { type MutableRefObject, useEffect, useRef } from 'react';
import { noop } from '../utils/misc';

interface NuiMessageData<T = unknown> {
  action: string;
  data: T;
}

type NuiHandlerSignature<T> = (data: T) => void;

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
  const savedHandler: MutableRefObject<NuiHandlerSignature<T>> = useRef(noop);

  // Make sure we handle for a reactive handler
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event: MessageEvent<any>) => {
      const { action: eventAction, method, type, data, payload } = event.data;

      const eventIdentifier = eventAction || method || type;
      const eventData = data !== undefined ? data : payload;

      if (savedHandler.current) {
        if (eventIdentifier === action) {
          savedHandler.current(eventData);
        }
      }
    };

    window.addEventListener('message', eventListener);
    // Remove Event Listener on component cleanup
    return () => window.removeEventListener('message', eventListener);
  }, [action]);
};
