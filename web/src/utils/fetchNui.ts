import type { ServerPromiseResp } from "@typings/http";
import { getResourceName } from './misc';

const isDevelopment = process.env.NODE_ENV === 'development';

export const fetchNui = async <T = object, I = object>(eventName: string, data?: I): Promise<T | undefined> => {
  const resourceName = getResourceName();
  const url = isDevelopment
    ? `http://localhost:3005/${eventName.replace(':', '-')}`
    : `https://${resourceName}/${eventName}`;

  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(`NUI fetch failed with status ${res.status}: ${res.statusText}`);
  }

  let response: ServerPromiseResp<T>;
  try {
    response = await res.json();
  } catch (err) {
    throw new Error(`Failed to parse NUI response as JSON for event ${eventName}. The server may have returned an empty response.`);
  }

  if (response.status === 'error') {
    throw new Error(response.errorMsg);
  }

  return response.data;
};
