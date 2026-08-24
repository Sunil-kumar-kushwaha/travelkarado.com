

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export const getCookie = (name: string): string | undefined => {
    if (typeof document === 'undefined') return undefined; // SSR guard
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : undefined;
};

export const setCookie = (name: string, value: string, days?: number): void => {
    if (typeof document === 'undefined') return;
    const expires = days ? `; expires=${new Date(Date.now() + days * 864e5).toUTCString()}` : '';
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
};
export const clearCookie = (name: string): void => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

export class ApiError extends Error {
    status: number;
    data: unknown;

    constructor(message: string, status: number, data: unknown) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

interface SendOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    params?: Record<string, string | number | boolean>;
    data?: unknown;
    headers?: Record<string, string>;
    timeout?: number;
    isFormData?: boolean;
    cacheMaxAge?: number;
    signal?: AbortSignal;
    onSessionExpired?: () => void;
    skipSessionCheck?: boolean;
}

function buildHeaders({
    headers = {},
    isFormData = false,
    cacheMaxAge,
}: Pick<SendOptions, 'headers' | 'isFormData' | 'cacheMaxAge'>): Record<string, string> {
    const result: Record<string, string> = { ...headers };

    const deviceId = getCookie('device-id');
    const authToken = getCookie('authToken');
    const language = getCookie('language_selected');

    if (deviceId && deviceId !== '""') result['device-id'] = deviceId;
    if (language) result['language'] = language;
    if (authToken && authToken !== '""') result['tkd-user-token'] = authToken;

    if (typeof window !== 'undefined') {
        const pageOpts = (window as any).pageOpts;
        if (pageOpts?.accessToken) result['tkd-Access-Token'] = pageOpts.accessToken;
        result['Host-Url'] = window.location.hostname;
    }

    result['Cache-Control'] = cacheMaxAge ? 'public' : 'no-cache';
    if (cacheMaxAge) {
        result['Expires'] = new Date(Date.now() + cacheMaxAge).toUTCString();
    }
    if (!isFormData) {
        result['Content-Type'] = 'application/json; charset=utf-8';
    }

    return result;
}

function checkSessionValidity(onSessionExpired?: () => void): boolean {
    const userId = parseInt(getCookie('userId') || '', 10);
    const loggedIn = !isNaN(userId) && userId > -1;

    if (!loggedIn) {
        if (typeof onSessionExpired === 'function') {
            onSessionExpired();
        }
        
    }
    return loggedIn;
}

async function send<T = any>(url: string, opts: SendOptions = {}): Promise<T> {
    const {
        method = 'GET',
        params = {},
        data,
        headers: customHeaders,
        timeout,
        isFormData = false,
        cacheMaxAge,
        signal,
        onSessionExpired,
        skipSessionCheck = false,
    } = opts;

    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
    const query =
        method === 'GET' && params && Object.keys(params).length
            ? '?' + new URLSearchParams(params as Record<string, string>).toString()
            : '';

    const headers = buildHeaders({ headers: customHeaders, isFormData, cacheMaxAge });

    const controller = timeout ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), timeout) : null;

    const fetchOpts: RequestInit = {
        method,
        headers,
        signal: signal || controller?.signal,
    };

    if (method !== 'GET' && (data !== undefined || Object.keys(params).length)) {
        fetchOpts.body = isFormData ? (data as BodyInit) : JSON.stringify(data ?? params);
    }

    try {
        const response = await fetch(fullUrl + query, fetchOpts);
        if (timeoutId) clearTimeout(timeoutId);

        if (!skipSessionCheck) checkSessionValidity(onSessionExpired);

        const contentType = response.headers.get('content-type') || '';
        const payload = contentType.includes('application/json')
            ? await response.json().catch(() => null)
            : await response.text();

        if (!response.ok) {
            throw new ApiError(response.statusText || 'Request failed', response.status, payload);
        }

        return payload as T;
    } catch (err: any) {
        if (timeoutId) clearTimeout(timeoutId);
        if (!skipSessionCheck) checkSessionValidity(onSessionExpired);
        if (err instanceof ApiError) throw err;
        throw new ApiError(err.message || 'Network error', err.status || 0, null);
    }
}

const apiClient = {
    get: <T = any>(url: string, params?: SendOptions['params'], opts: SendOptions = {}) =>
        send < T > (url, { ...opts, method: 'GET', params }),
    post: <T = any>(url: string, data?: unknown, opts: SendOptions = {}) =>
        send < T > (url, { ...opts, method: 'POST', data }),
    put: <T = any>(url: string, data?: unknown, opts: SendOptions = {}) =>
        send < T > (url, { ...opts, method: 'PUT', data }),
    patch: <T = any>(url: string, data?: unknown, opts: SendOptions = {}) =>
        send < T > (url, { ...opts, method: 'PATCH', data }),
    delete: <T = any>(url: string, data?: unknown, opts: SendOptions = {}) =>
        send < T > (url, { ...opts, method: 'DELETE', data }),

    isLoggedIn: (): boolean => {
        const userId = parseInt(getCookie('userId') || '', 10);
        return !isNaN(userId) && userId > -1;
    },
    logout: async (): Promise<void> => {
        try {
            await send('/api/auth/logout', { method: 'POST', skipSessionCheck: true });
        } catch {
            // already logged out / token invalid / network issue — proceed anyway
        } finally {
            clearCookie('userId');
            clearCookie('authToken');
        }
    },

    getCookie,
    setCookie,
    ApiError,
};

export default apiClient;