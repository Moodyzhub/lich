import axios from '@/config/axiosConfig';
import { WithdrawalRequest } from './types';

export const adminWithdrawalApi = {
  getAllWithdrawals: async (): Promise<WithdrawalRequest[]> => {
    try {
      const response = await axios.get('/api/admin/withdrawals');
      return Array.isArray(response?.data?.result)
        ? response.data.result
        : Array.isArray(response?.data)
        ? response.data
        : [];
    } catch (error: any) {
      if (error.response) {
        const message = error.response.data?.message;
        throw new Error(message || 'Không thể tải danh sách yêu cầu rút tiền');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  approveWithdrawal: async (withdrawalId: string): Promise<void> => {
    try {
      await axios.put(`/api/admin/withdrawals/${withdrawalId}/approve`);
    } catch (error: any) {
      if (error.response) {
        const message = error.response.data?.message;
        throw new Error(message || 'Không thể duyệt yêu cầu rút tiền');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  rejectWithdrawal: async (withdrawalId: string, reason?: string): Promise<void> => {
    try {
      await axios.put(`/api/admin/withdrawals/${withdrawalId}/reject`, {
        admin_note: reason,
      });
    } catch (error: any) {
      if (error.response) {
        const message = error.response.data?.message;
        throw new Error(message || 'Không thể từ chối yêu cầu rút tiền');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },
};
