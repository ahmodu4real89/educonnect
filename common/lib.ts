import { User } from "@prisma/client";
import { PAGINATION, SERVER_MESSAGES } from "./constants";
import { TAntdFileType, TRequestQuery, TRole } from "./types";
import { handleDBError } from "@/server/helpers/db.utils";

const randomImages = [
  "https://picsum.photos/300/200?random=1",
  "https://picsum.photos/300/200?random=2",
  "https://picsum.photos/300/200?random=3",
  "https://picsum.photos/300/200?random=4",
];

export function getRandomImage(): string {
  return randomImages[Math.floor(Math.random() * randomImages.length)];
}

export async function safe<T, E extends Error | undefined = Error>(promise: Promise<T>, meta?: unknown) {
  try {
    const data = await promise;
    return {error: null, data, meta};
  } catch (e) {
    return {error: handleDBError(e), data: undefined, meta};
  }
}
// export async function tryCatch<R, E=unknown>(promise: Promise<R, E>) {
//   try {
//     const data = await promise as R;
//     return [undefined, data];
//   } catch (e) {
//     return [e as E, undefined];
//   }
// }

export const storage = {
  set(key: string, value: unknown) {
    if (typeof window === "undefined" || !window?.localStorage) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // ignore write errors (quota, privacy settings)
    }
  },
  get<T = unknown>(key: string): T | null {
    if (typeof window === "undefined" || !window?.localStorage) return null;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return null;
      try {
        return JSON.parse(raw) as T;
      } catch (e) {
        // not JSON, return raw value
        return raw as unknown as T;
      }
    } catch (error) {
      return null;
    }
  }
}






export const getBase64 = (file: TAntdFileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });