import axios from '@/config/axiosConfig';
import { WithdrawalHistoryItem } from './types';

export const withdrawalHistoryApi = {
  getMyWithdrawals: async (): Promise<WithdrawalHistoryItem[]> => {
    try {
      const response = await axios.get('/api/withdrawals/me');
      return Array.isArray(response?.data?.result)
        ? response.data.result
        : Array.isArray(response?.data)
        ? response.data
        : [];
    } catch (error: any) {
      if (error.response) {
        const message = error.response.data?.message;
        throw new Error(message || 'Không thể tải lịch sử rút tiền');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },
};
