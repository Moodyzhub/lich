import axios from '@/config/axiosConfig';
import { WithdrawalRequest, WithdrawalFormData } from './types';

export const withdrawalApi = {
  createWithdrawal: async (data: WithdrawalFormData): Promise<WithdrawalRequest> => {
    try {
      const response = await axios.post('/api/withdrawal/create', data);
      return response.data.result;
    } catch (error: any) {
      if (error.response) {
        const message = error.response.data?.message;
        throw new Error(message || 'Không thể tạo yêu cầu rút tiền');
      }
      throw new Error('Không thể kết nối đến server');
    }
  },

  getTutorEarnings: async (): Promise<number> => {
    try {
      const response = await axios.get('/api/payments/me');
      const payments = Array.isArray(response?.data?.result)
        ? response.data.result
        : Array.isArray(response?.data)
        ? response.data
        : [];

      const totalEarnings = payments
        .filter((p: any) => p.status === 'PAID')
        .reduce((sum: number, p: any) => sum + p.amount, 0);

      return totalEarnings;
    } catch (error: any) {
      throw new Error('Không thể lấy thông tin thu nhập');
    }
  },
};
