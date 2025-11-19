export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export interface WithdrawalHistoryItem {
  id: string;
  tutor_id: number;
  bank_name: string;
  account_number: string;
  account_holder_name: string;
  amount: number;
  commission: number;
  total_amount: number;
  status: WithdrawalStatus;
  created_at: string;
  updated_at: string;
  processed_at: string | null;
  admin_note: string | null;
}
