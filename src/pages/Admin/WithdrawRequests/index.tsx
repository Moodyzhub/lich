import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  DollarSign,
  Clock,
  Filter,
} from 'lucide-react';
import { adminWithdrawalApi } from './api';
import { WithdrawalRequest, WithdrawalStatus } from './types';
import { toast } from 'sonner';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusBadge = (status: WithdrawalStatus) => {
  const variants: Record<WithdrawalStatus, { color: string; label: string }> = {
    PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Chờ duyệt' },
    APPROVED: { color: 'bg-green-100 text-green-800', label: 'Đã duyệt' },
    REJECTED: { color: 'bg-red-100 text-red-800', label: 'Từ chối' },
    COMPLETED: { color: 'bg-blue-100 text-blue-800', label: 'Hoàn thành' },
  };

  const variant = variants[status];
  return (
    <Badge className={`${variant.color} border-0`}>{variant.label}</Badge>
  );
};

export default function AdminWithdrawRequestsPage() {
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminWithdrawalApi.getAllWithdrawals();
      setWithdrawals(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (withdrawal: WithdrawalRequest) => {
    if (!confirm(`Xác nhận duyệt yêu cầu rút ${formatCurrency(withdrawal.amount)}?`)) {
      return;
    }

    try {
      setIsProcessing(true);
      await adminWithdrawalApi.approveWithdrawal(withdrawal.id);
      toast.success('Đã duyệt yêu cầu rút tiền thành công');
      fetchWithdrawals();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = (withdrawal: WithdrawalRequest) => {
    setSelectedWithdrawal(withdrawal);
    setRejectReason('');
    setShowRejectDialog(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedWithdrawal) return;

    try {
      setIsProcessing(true);
      await adminWithdrawalApi.rejectWithdrawal(selectedWithdrawal.id, rejectReason);
      toast.success('Đã từ chối yêu cầu rút tiền');
      setShowRejectDialog(false);
      fetchWithdrawals();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredWithdrawals = withdrawals.filter((w) => {
    if (filterStatus === 'all') return true;
    return w.status === filterStatus;
  });

  const stats = {
    total: withdrawals.length,
    pending: withdrawals.filter((w) => w.status === 'PENDING').length,
    approved: withdrawals.filter((w) => w.status === 'APPROVED').length,
    rejected: withdrawals.filter((w) => w.status === 'REJECTED').length,
    totalAmount: withdrawals
      .filter((w) => w.status === 'APPROVED' || w.status === 'COMPLETED')
      .reduce((sum, w) => sum + w.amount, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700">
          <div className="max-w-[1600px] mx-auto px-6 py-5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/admin/payments')}
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Yêu cầu rút tiền</h1>
                  <p className="text-green-100 text-sm">Quản lý yêu cầu rút tiền từ giảng viên</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-white/90">Tổng yêu cầu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-white/90">Chờ duyệt</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-300">{stats.pending}</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-white/90">Đã duyệt</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-300">{stats.approved}</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-white/90">Từ chối</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-300">{stats.rejected}</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-white/90">Tổng đã rút</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">{formatCurrency(stats.totalAmount)}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-gray-100">
          <div className="max-w-[1600px] mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="PENDING">Chờ duyệt</option>
                <option value="APPROVED">Đã duyệt</option>
                <option value="REJECTED">Từ chối</option>
                <option value="COMPLETED">Hoàn thành</option>
              </select>
              <div className="text-sm text-gray-600">
                Hiển thị {filteredWithdrawals.length} / {withdrawals.length} yêu cầu
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-10 h-10 animate-spin text-green-600 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">Đang tải danh sách...</p>
            </div>
          </div>
        ) : filteredWithdrawals.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có yêu cầu</h3>
            <p className="text-gray-500 text-sm">Chưa có yêu cầu rút tiền nào</p>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tutor ID</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Ngân hàng</TableHead>
                      <TableHead>Số tài khoản</TableHead>
                      <TableHead>Chủ tài khoản</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWithdrawals.map((withdrawal) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell className="font-mono text-xs">{withdrawal.id.slice(0, 8)}...</TableCell>
                        <TableCell>{withdrawal.tutor_id}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(withdrawal.amount)}</TableCell>
                        <TableCell>{withdrawal.bank_name}</TableCell>
                        <TableCell className="font-mono">{withdrawal.account_number}</TableCell>
                        <TableCell>{withdrawal.account_holder_name}</TableCell>
                        <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                        <TableCell className="text-sm text-gray-600">{formatDate(withdrawal.created_at)}</TableCell>
                        <TableCell className="text-right">
                          {withdrawal.status === 'PENDING' && (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(withdrawal)}
                                disabled={isProcessing}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Duyệt
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectClick(withdrawal)}
                                disabled={isProcessing}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Từ chối
                              </Button>
                            </div>
                          )}
                          {withdrawal.status !== 'PENDING' && (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối yêu cầu rút tiền</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do từ chối (không bắt buộc)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Lý do từ chối</Label>
              <Input
                id="reason"
                placeholder="VD: Thông tin tài khoản không hợp lệ..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Xác nhận từ chối'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
