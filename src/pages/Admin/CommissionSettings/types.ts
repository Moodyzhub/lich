export interface CommissionSettings {
  id: string;
  commission_course: number;
  commission_booking: number;
  created_at: string;
  updated_at: string;
}

export interface CommissionFormData {
  commission_course: number;
  commission_booking: number;
}
