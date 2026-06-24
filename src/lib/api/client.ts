import { City, Property, LeadPayload, EventPayload, ImpressionPayload } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://apna-kamra.up.railway.app/api";

async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 2, delay = 500): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      return res;
    } catch (e) {
      if (attempt === retries) throw e;
      await new Promise((r) => setTimeout(r, delay * attempt));
    }
  }
  throw new Error("Request failed");
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetchWithRetry(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `HTTP ${res.status} error`);
  }
  return res.json();
}

async function apiPost<T, B>(path: string, body: B): Promise<T> {
  const res = await fetchWithRetry(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `HTTP ${res.status} error`);
  }
  return res.json();
}

export const api = {
  getCities: () => apiGet<City[]>("/cities"),
  
  getProperties: (params: {
    city?: string;
    q?: string;
    sort?: string;
    amenities?: string;
    flag?: string;
  } = {}) => {
    const qs = new URLSearchParams();
    if (params.city) qs.set("city", params.city);
    if (params.q) qs.set("q", params.q);
    if (params.sort) qs.set("sort", params.sort);
    if (params.amenities) qs.set("amenities", params.amenities);
    if (params.flag) qs.set("flag", params.flag);
    const queryString = qs.toString();
    return apiGet<Property[]>(`/properties${queryString ? `?${queryString}` : ""}`);
  },

  getProperty: (slug: string) => apiGet<Property>(`/properties/${slug}`),

  submitLead: (data: LeadPayload) => apiPost<{ success: boolean }, LeadPayload>("/leads", data),

  trackEvent: (data: EventPayload) => apiPost<{ success: boolean }, EventPayload>("/events", data).catch(() => ({ success: false })),

  trackImpressions: (ids: number[]) => apiPost<{ success: boolean }, ImpressionPayload>("/impressions", { ids }).catch(() => ({ success: false })),

  // Owner endpoints
  getOwnerProperties: (mobile: string, password: string) => 
    apiGet<Property[]>(`/owner/properties?mobile=${encodeURIComponent(mobile)}&password=${encodeURIComponent(password)}`),
    
  getOwnerLeads: (mobile: string, password: string) => 
    apiGet<any[]>(`/owner/property-visitors?mobile=${encodeURIComponent(mobile)}&password=${encodeURIComponent(password)}`),
};
export type ApiClient = typeof api;
