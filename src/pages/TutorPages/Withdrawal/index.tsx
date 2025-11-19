import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, DollarSign, CreditCard, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { withdrawalApi } from './api';
import { WithdrawalFormData } from './types';
import { formatCurrency } from '../Payment/utils';
import { toast } from 'sonner';

export default function WithdrawalPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEarnings, setIsLoadingEarnings] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<WithdrawalFormData>({
    bank_name: '',
    account_number: '',
    account_holder_name: '',
    amount: 0,
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof WithdrawalFormData, string>>>({});

  useEffect(() => {
    fetchTotalEarnings();
  }, []);

  const fetchTotalEarnings = async () => {
    try {
      setIsLoadingEarnings(true);
      const earnings = await withdrawalApi.getTutorEarnings();
      setTotalEarnings(earnings);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingEarnings(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof WithdrawalFormData, string>> = {};

    if (!formData.bank_name.trim()) {
      errors.bank_name = 'Vui lòng nhập tên ngân hàng';
    }

    if (!formData.account_number.trim()) {
      errors.account_number = 'Vui lòng nhập số tài khoản';
    } else if (!/^\d+$/.test(formData.account_number)) {
      errors.account_number = 'Số tài khoản chỉ được chứa số';
    }

    if (!formData.account_holder_name.trim()) {
      errors.account_holder_name = 'Vui lòng nhập tên chủ tài khoản';
    }

    if (formData.amount <= 0) {
      errors.amount = 'Số tiền phải lớn hơn 0';
    } else if (formData.amount > totalEarnings) {
      errors.amount = `Số tiền không được vượt quá ${formatCurrency(totalEarnings)}`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof WithdrawalFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await withdrawalApi.createWithdrawal(formData);
      setSuccess(true);
      toast.success('Yêu cầu rút tiền đã được gửi thành công!');

      setTimeout(() => {
        navigate('/payments');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thành công!</h2>
              <p className="text-gray-600">
                Yêu cầu rút tiền của bạn đã được gửi. Chúng tôi sẽ xử lý trong thời gian sớm nhất.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/payments')}
          className="mb-6 hover:bg-white/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rút tiền</h1>
          <p className="text-gray-600">Gửi yêu cầu rút tiền từ thu nhập của bạn</p>
        </div>

        <div className="grid gap-6">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                Số dư khả dụng
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingEarnings ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang tải...</span>
                </div>
              ) : (
                <div className="text-4xl font-bold">{formatCurrency(totalEarnings)}</div>
              )}
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Thông tin rút tiền
              </CardTitle>
              <CardDescription>
                Vui lòng điền đầy đủ thông tin tài khoản ngân hàng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="bank_name">
                    Tên ngân hàng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="bank_name"
                    placeholder="VD: Vietcombank, Techcombank, MB Bank..."
                    value={formData.bank_name}
                    onChange={(e) => handleInputChange('bank_name', e.target.value)}
                    className={formErrors.bank_name ? 'border-red-500' : ''}
                  />
                  {formErrors.bank_name && (
                    <p className="text-sm text-red-500">{formErrors.bank_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account_number">
                    Số tài khoản <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="account_number"
                    placeholder="Nhập số tài khoản ngân hàng"
                    value={formData.account_number}
                    onChange={(e) => handleInputChange('account_number', e.target.value)}
                    className={formErrors.account_number ? 'border-red-500' : ''}
                  />
                  {formErrors.account_number && (
                    <p className="text-sm text-red-500">{formErrors.account_number}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account_holder_name">
                    Tên chủ tài khoản <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="account_holder_name"
                    placeholder="Nhập tên chủ tài khoản"
                    value={formData.account_holder_name}
                    onChange={(e) => handleInputChange('account_holder_name', e.target.value)}
                    className={formErrors.account_holder_name ? 'border-red-500' : ''}
                  />
                  {formErrors.account_holder_name && (
                    <p className="text-sm text-red-500">{formErrors.account_holder_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">
                    Số tiền muốn rút <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0"
                      value={formData.amount || ''}
                      onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                      className={formErrors.amount ? 'border-red-500' : ''}
                      min={0}
                      max={totalEarnings}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      ₫
                    </div>
                  </div>
                  {formErrors.amount && (
                    <p className="text-sm text-red-500">{formErrors.amount}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Số tiền tối đa: {formatCurrency(totalEarnings)}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Lưu ý:</h4>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Yêu cầu rút tiền sẽ được xử lý trong vòng 3-5 ngày làm việc</li>
                    <li>Vui lòng kiểm tra kỹ thông tin tài khoản trước khi gửi</li>
                    <li>Bạn có thể theo dõi trạng thái yêu cầu trong trang thanh toán</li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/payments')}
                    className="flex-1"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || isLoadingEarnings || totalEarnings <= 0}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <DollarSign className="w-4 h-4 mr-2" />
                        Gửi yêu cầu rút tiền
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
