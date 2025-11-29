import api from '@/config/axiosConfig';
import {
  mockDashboardData,
  mockDashboardStats,
  mockRevenueChart,
  mockRecentActivities,
  mockUpcomingSessions,
  mockTopCourses,
} from './mockData';
import { DashboardData, DashboardStats, RevenueChart, StudentActivity, UpcomingSession, CourseStats } from './types';

const USE_MOCK_DATA = true;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchDashboardData = async (): Promise<DashboardData> => {
  if (USE_MOCK_DATA) {
    await delay(500);
    return mockDashboardData;
  }

  const response = await api.get('/tutor/dashboard');
  return response.data.result;
};

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  if (USE_MOCK_DATA) {
    await delay(300);
    return mockDashboardStats;
  }

  const response = await api.get('/tutor/dashboard/stats');
  return response.data.result;
};

export const fetchRevenueChart = async (year?: number): Promise<RevenueChart[]> => {
  if (USE_MOCK_DATA) {
    await delay(400);
    return mockRevenueChart;
  }

  const response = await api.get('/tutor/dashboard/revenue-chart', {
    params: { year: year || new Date().getFullYear() }
  });
  return response.data.result;
};

export const fetchRecentActivities = async (limit = 10): Promise<StudentActivity[]> => {
  if (USE_MOCK_DATA) {
    await delay(300);
    return mockRecentActivities.slice(0, limit);
  }

  const response = await api.get('/tutor/dashboard/activities', {
    params: { limit }
  });
  return response.data.result;
};

export const fetchUpcomingSessions = async (limit = 10): Promise<UpcomingSession[]> => {
  if (USE_MOCK_DATA) {
    await delay(300);
    return mockUpcomingSessions.slice(0, limit);
  }

  const response = await api.get('/tutor/dashboard/upcoming-sessions', {
    params: { limit }
  });
  return response.data.result;
};

export const fetchTopCourses = async (limit = 5): Promise<CourseStats[]> => {
  if (USE_MOCK_DATA) {
    await delay(350);
    return mockTopCourses.slice(0, limit);
  }

  const response = await api.get('/tutor/dashboard/top-courses', {
    params: { limit }
  });
  return response.data.result;
};
