export const BASE_URL = "https://react-ts-bank-server.onrender.com";

// export const BASE_URL_LOCAL = "http://localhost:4000";
// export const BASE_URL_REMOTE = "https://react-ts-bank-server.onrender.com";

// export const fetchWithFallback = async (url: string, options?: RequestInit): Promise<Response> => {
//   try {
//     const res = await fetch(url, options);
//     if (!res.ok) {
//       throw new Error(`Request failed with status: ${res.status}`);
//     }
//     return res;
//   } catch (err) {
//     // Якщо локальний сервер недоступний, повернути віддалений URL
//     console.error(
//       `Local server request failed: ${
//         err instanceof Error ? err.message : String(err)
//       }. Falling back to remote server.`
//     );

//     console.log("Trying to fetch:", url);

//     const fallbackUrl = new URL(url, BASE_URL_REMOTE).toString(); // Оновлено
//     console.log("Fallback URL:", fallbackUrl);

//     return fetch(fallbackUrl, options);
//   }
// };
