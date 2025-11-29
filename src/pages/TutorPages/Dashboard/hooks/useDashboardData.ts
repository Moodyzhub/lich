import { useQuery } from '@tanstack/react-query';
import {
  fetchDashboardData,
  fetchDashboardStats,
  fetchRevenueChart,
  fetchRecentActivities,
  fetchUpcomingSessions,
  fetchTopCourses,
} from '../api';

export const useDashboardData = () => {
  return useQuery({
    queryKey: ['tutor-dashboard'],
    queryFn: fetchDashboardData,
    refetchInterval: 30000,
    staleTime: 20000,
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['tutor-dashboard-stats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 60000,
    staleTime: 30000,
  });
};

export const useRevenueChart = (year?: number) => {
  return useQuery({
    queryKey: ['tutor-revenue-chart', year],
    queryFn: () => fetchRevenueChart(year),
    refetchInterval: 120000,
    staleTime: 60000,
  });
};

export const useRecentActivities = (limit = 10) => {
  return useQuery({
    queryKey: ['tutor-recent-activities', limit],
    queryFn: () => fetchRecentActivities(limit),
    refetchInterval: 30000,
    staleTime: 20000,
  });
};

export const useUpcomingSessions = (limit = 10) => {
  return useQuery({
    queryKey: ['tutor-upcoming-sessions', limit],
    queryFn: () => fetchUpcomingSessions(limit),
    refetchInterval: 30000,
    staleTime: 20000,
  });
};

export const useTopCourses = (limit = 5) => {
  return useQuery({
    queryKey: ['tutor-top-courses', limit],
    queryFn: () => fetchTopCourses(limit),
    refetchInterval: 120000,
    staleTime: 60000,
  });
};
