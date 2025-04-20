import axios, { AxiosRequestConfig } from 'axios'
import { CurlParsed, curlToAxiosConfig } from './curlParser'

// export async function executeCurl(parsed: CurlParsed) {
//   const config: AxiosRequestConfig = {
//     url: parsed.url,
//     method: parsed.method,
//     headers: parsed.headers,
//     data: parsed.data
//   };

//   return axios(config).then(res => res.data);
// }

export async function executeCurl(curl: string, cb?: (x: CurlParsed) => void) {
  const config = curlToAxiosConfig(curl)
  if (cb) cb(config)
  return axios(config).then((res) => res.data)
}
