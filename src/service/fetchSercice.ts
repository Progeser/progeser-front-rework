const baseUrl = `${import.meta.env.VITE_API_URL}`;

import axios from "axios";

const get = async <R>(url: string, options?: ApiRequestOptions): Promise<HandleError<R>> => {
  return axiosfetch(this._baseUrl + url, {
    headers: await this._getHeaders(options?.headers),
    method: 'GET',
    next: options?.next,
    cache: options?.cache
  })
    .then((response) => this.handleResponse<R>(response, 'GET '))
    .catch(this.handleFetchError<R>('GET', url));
}
