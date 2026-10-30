import {
  Article,
  ApiResult,
  ReaderApiClient,
  FetchResponse,
  PopularFeedsResponse,
  DiscoveryQueryResponse,
  DiscoverySubmitResponse,
} from '../types/article';
import { calculateReadingTime } from '../utils/readingTime';

/**
 * LiveApiClient
 * Connects to the backend extraction service on Laptop 2 over local network.
 *
 * NOTE: Base URL is read strictly from environment configuration (VITE_API_BASE_URL).
 * If the contract endpoint is unconfirmed, this client calls the configured path
 * and returns clean structured errors without falling back to mock fixtures.
 */
export class LiveApiClient implements ReaderApiClient {
  private baseUrl: string;
  private endpointPath: string;

  constructor(
    baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    // Default to /api/read or /api/extract based on VITE_API_ENDPOINT or convention
    endpointPath = import.meta.env.VITE_API_ENDPOINT || '/api/read'
  ) {
    // Strip trailing slashes from baseUrl
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.endpointPath = endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`;
  }

  async extractArticle(url: string): Promise<ApiResult<Article>> {
    const targetUrl = `${this.baseUrl}${this.endpointPath}`;

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        let errorMessage = `Server responded with status ${response.status}`;
        let errorCode = 'API_ERROR';

        try {
          const errorData = await response.json();
          if (errorData?.error?.message) {
            errorMessage = errorData.error.message;
          } else if (errorData?.message) {
            errorMessage = errorData.message;
          }
          if (errorData?.error?.code) {
            errorCode = errorData.error.code;
          }
        } catch {
          // If non-JSON error, map common HTTP status codes safely
          if (response.status === 400) {
            errorMessage = 'Invalid URL or malformed request.';
            errorCode = 'BAD_REQUEST';
          } else if (response.status === 403 || response.status === 422) {
            errorMessage = 'The requested URL is blocked or restricted for security reasons.';
            errorCode = 'BLOCKED_TARGET';
          } else if (response.status === 404) {
            errorMessage = `Endpoint ${this.endpointPath} not found on backend. Confirm the API route with the backend developer.`;
            errorCode = 'ENDPOINT_NOT_FOUND';
          } else if (response.status === 502 || response.status === 504) {
            errorMessage = 'Backend could not reach the target article server (timeout or network error).';
            errorCode = 'FETCH_FAILED';
          }
        }

        return {
          success: false,
          error: {
            code: errorCode,
            message: errorMessage,
            status: response.status,
          },
        };
      }

      const raw = await response.json();

      // Normalize candidate backend response fields into domain Article model
      const content = raw.content || raw.html || raw.articleHtml || '';
      const { wordCount, readingTimeMinutes } = calculateReadingTime(content);

      const article: Article = {
        url: raw.url || url,
        title: raw.title || 'Untitled Document',
        byline: raw.byline || raw.author || null,
        publishedDate: raw.publishedDate || raw.date || raw.published_time || null,
        content,
        contentType: raw.contentType || 'html',
        excerpt: raw.excerpt || raw.summary || null,
        readingTimeMinutes: raw.readingTimeMinutes || readingTimeMinutes,
        wordCount: raw.wordCount || wordCount,
        leadImageUrl: raw.leadImageUrl || raw.lead_image_url || raw.image || null,
        siteName: raw.siteName || raw.site_name || null,
      };

      return {
        success: true,
        data: article,
      };
    } catch (err: any) {
      // Connection failure (e.g. Laptop 2 offline or network mismatch)
      return {
        success: false,
        error: {
          code: 'CONNECTION_REFUSED',
          message: `Cannot connect to backend service at ${this.baseUrl}. Check that the backend server is running and accessible on the local network.`,
        },
      };
    }
  }

  async checkHealth(): Promise<{ status: 'ok' | 'unreachable' }> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, { method: 'GET' });
      return res.ok ? { status: 'ok' } : { status: 'unreachable' };
    } catch {
      return { status: 'unreachable' };
    }
  }

  async fetchProxy(url: string): Promise<ApiResult<FetchResponse>> {
    const targetUrl = `${this.baseUrl}/api/fetch?url=${encodeURIComponent(url)}`;
    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        let errorMessage = `Server responded with status ${response.status}`;
        let errorCode = 'FETCH_ERROR';
        try {
          const errData = await response.json();
          if (errData?.error?.message) errorMessage = errData.error.message;
          if (errData?.error?.code) errorCode = errData.error.code;
        } catch {
          // fallback
        }
        return {
          success: false,
          error: { code: errorCode, message: errorMessage, status: response.status },
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch {
      return {
        success: false,
        error: {
          code: 'CONNECTION_REFUSED',
          message: `Cannot connect to backend service at ${this.baseUrl}.`,
        },
      };
    }
  }

  async getPopularFeeds(limit = 20, offset = 0): Promise<ApiResult<PopularFeedsResponse>> {
    const targetUrl = `${this.baseUrl}/api/discovery/popular?limit=${limit}&offset=${offset}`;
    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        let errorMessage = `Server responded with status ${response.status}`;
        let errorCode = 'API_ERROR';
        try {
          const errData = await response.json();
          if (errData?.error?.message) errorMessage = errData.error.message;
          if (errData?.error?.code) errorCode = errData.error.code;
        } catch {
          // fallback
        }
        return {
          success: false,
          error: { code: errorCode, message: errorMessage, status: response.status },
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch {
      return {
        success: false,
        error: {
          code: 'CONNECTION_REFUSED',
          message: `Cannot connect to backend service at ${this.baseUrl}.`,
        },
      };
    }
  }

  async queryRecommendations(feeds: string[], limit = 20): Promise<ApiResult<DiscoveryQueryResponse>> {
    const targetUrl = `${this.baseUrl}/api/discovery/query`;
    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ feeds, limit }),
      });

      if (!response.ok) {
        let errorMessage = `Server responded with status ${response.status}`;
        let errorCode = 'API_ERROR';
        try {
          const errData = await response.json();
          if (errData?.error?.message) errorMessage = errData.error.message;
          if (errData?.error?.code) errorCode = errData.error.code;
        } catch {
          // fallback
        }
        return {
          success: false,
          error: { code: errorCode, message: errorMessage, status: response.status },
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch {
      return {
        success: false,
        error: {
          code: 'CONNECTION_REFUSED',
          message: `Cannot connect to backend service at ${this.baseUrl}.`,
        },
      };
    }
  }

  async submitContribution(feeds: string[], consent: boolean): Promise<ApiResult<DiscoverySubmitResponse>> {
    const targetUrl = `${this.baseUrl}/api/discovery/submit`;
    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ feeds, consent }),
      });

      if (!response.ok) {
        let errorMessage = `Server responded with status ${response.status}`;
        let errorCode = 'API_ERROR';
        try {
          const errData = await response.json();
          if (errData?.error?.message) errorMessage = errData.error.message;
          if (errData?.error?.code) errorCode = errData.error.code;
        } catch {
          // fallback
        }
        return {
          success: false,
          error: { code: errorCode, message: errorMessage, status: response.status },
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch {
      return {
        success: false,
        error: {
          code: 'CONNECTION_REFUSED',
          message: `Cannot connect to backend service at ${this.baseUrl}.`,
        },
      };
    }
  }
}
