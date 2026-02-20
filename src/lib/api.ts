import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/airomarine/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = 'auth/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }
}

export const api = new ApiClient();

// API Endpoints
export const vesselApi = {
  getAll: () => api.get<Vessel[]>('/vessels'),
  getById: (id: string) => api.get<Vessel>(`/vessels/${id}`),
  getByMMSI: (mmsi: string) => api.get<Vessel>(`/vessels/mmsi/${mmsi}`),
  getTrack: (id: string, from: Date, to: Date) =>
    api.get<VesselTrack>(`/vessels/${id}/track`, {
      params: { from: from.toISOString(), to: to.toISOString() },
    }),
};

export const poiApi = {
  getAll: () => api.get<POI[]>('/poi'),
  getById: (id: string) => api.get<POI>(`/poi/${id}`),
  create: (data: Partial<POI>) => api.post<POI>('/poi', data),
  update: (id: string, data: Partial<POI>) => api.put<POI>(`/poi/${id}`, data),
  delete: (id: string) => api.delete(`/poi/${id}`),
  getCategories: () => api.get<POICategory[]>('/poi/categories'),
};

export const kmlApi = {
  getAll: () => api.get<KMLLayer[]>('/kml'),
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<KMLLayer>('/kml/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id: string) => api.delete(`/kml/${id}`),
};

export const authApi = {
  login: (username: string, password: string) =>
    api.post<{ status: boolean; message: string; data: { token: string; user: User } }>('/check-login', { username, password }),
  logout: () => api.post('/logout'),
  confirmThatsNotMe: () => api.post('/confirm-thats-not-me'),
  refreshToken: () => api.post<{ status: boolean; data: { token: string } }>('/auth/refresh'),
};

export const userApi = {
  getAll: async () => {
    const response = await api.get<{ status: boolean; message: string; data: User[] }>('/get-all-users');
    return response.data;
  },
  getById: (userId: string) => api.post<User>('/get-user', { user_id: userId }),
  create: (data: Partial<User>) => api.post<User>('/create-user', data),
  update: (userId: string, data: Partial<User>) => api.put<User>('/update-user', { user_id: userId, ...data }),
  delete: (userId: string) => api.delete('/delete-user', { data: { user_id: userId } }),
  changePassword: (userId: string, newPassword: string) => api.post('/change-user-password', { user_id: userId, new_password: newPassword }),
  getRoles: () => api.get('/get-user-roles'),
};

// Import types
import { Vessel, VesselTrack } from '@/types/vessel';
import { POI, POICategory, KMLLayer } from '@/types/poi';
import { User } from '@/types/user';