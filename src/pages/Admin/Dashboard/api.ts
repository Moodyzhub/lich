import api from '@/config/axiosConfig';
import { mockAdminDashboardData } from './mockData';
import { AdminDashboardData, AdminStats } from './types';

const USE_MOCK_DATA = true;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchAdminDashboardData = async (): Promise<AdminDashboardData> => {
  if (USE_MOCK_DATA) {
    await delay(500);
    return mockAdminDashboardData;
  }

  const response = await api.get('/admin/dashboard');
  return response.data.result;
};

export const fetchAdminStats = async (): Promise<AdminStats> => {
  if (USE_MOCK_DATA) {
    await delay(300);
    return mockAdminDashboardData.stats;
  }

  const response = await api.get('/admin/dashboard/stats');
  return response.data.result;
};
