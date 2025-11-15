import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, DollarSign, Plus, Trash2 } from 'lucide-react';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  price: number;
  isAvailable: boolean;
}

interface DaySchedule {
  id: number;
  name: string;
  isEnabled: boolean;
  startTime: string;
  endTime: string;
  slots: TimeSlot[];
}

const TutorSchedule: React.FC = () => {
  const [defaultStartTime, setDefaultStartTime] = useState('08:00');
  const [defaultEndTime, setDefaultEndTime] = useState('22:00');
  const [slotDuration, setSlotDuration] = useState(60);
  const [defaultPrice, setDefaultPrice] = useState(50000);

  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { id: 2, name: 'Thứ 2', isEnabled: true, startTime: '08:00', endTime: '22:00', slots: [] },
    { id: 3, name: 'Thứ 3', isEnabled: true, startTime: '08:00', endTime: '22:00', slots: [] },
    { id: 4, name: 'Thứ 4', isEnabled: true, startTime: '08:00', endTime: '22:00', slots: [] },
    { id: 5, name: 'Thứ 5', isEnabled: true, startTime: '08:00', endTime: '22:00', slots: [] },
    { id: 6, name: 'Thứ 6', isEnabled: true, startTime: '08:00', endTime: '22:00', slots: [] },
    { id: 7, name: 'Thứ 7', isEnabled: true, startTime: '08:00', endTime: '22:00', slots: [] },
    { id: 8, name: 'Chủ nhật', isEnabled: true, startTime: '08:00', endTime: '22:00', slots: [] },
  ]);

  const generateTimeSlots = (startTime: string, endTime: string, duration: number): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    let currentMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    while (currentMinutes + duration <= endMinutes) {
      const startH = Math.floor(currentMinutes / 60);
      const startM = currentMinutes % 60;
      const endM = currentMinutes + duration;
      const endH = Math.floor(endM / 60);
      const endMinute = endM % 60;

      slots.push({
        id: `${startH}:${startM.toString().padStart(2, '0')}-${endH}:${endMinute.toString().padStart(2, '0')}`,
        startTime: `${startH.toString().padStart(2, '0')}:${startM.toString().padStart(2, '0')}`,
        endTime: `${endH.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`,
        price: defaultPrice,
        isAvailable: true,
      });

      currentMinutes += duration;
    }

    return slots;
  };

  const handleGenerateSchedule = () => {
    const updatedSchedule = schedule.map((day) => ({
      ...day,
      slots: day.isEnabled ? generateTimeSlots(day.startTime, day.endTime, slotDuration) : [],
    }));
    setSchedule(updatedSchedule);
  };

  const handleApplyDefaultTime = () => {
    const updatedSchedule = schedule.map((day) => ({
      ...day,
      startTime: defaultStartTime,
      endTime: defaultEndTime,
    }));
    setSchedule(updatedSchedule);
  };

  const handleDayToggle = (dayId: number) => {
    setSchedule(
      schedule.map((day) =>
        day.id === dayId ? { ...day, isEnabled: !day.isEnabled } : day
      )
    );
  };

  const handleDayTimeChange = (dayId: number, field: 'startTime' | 'endTime', value: string) => {
    setSchedule(
      schedule.map((day) =>
        day.id === dayId ? { ...day, [field]: value } : day
      )
    );
  };

  const handleSlotToggle = (dayId: number, slotId: string) => {
    setSchedule(
      schedule.map((day) =>
        day.id === dayId
          ? {
              ...day,
              slots: day.slots.map((slot) =>
                slot.id === slotId ? { ...slot, isAvailable: !slot.isAvailable } : slot
              ),
            }
          : day
      )
    );
  };

  const handleSlotPriceChange = (dayId: number, slotId: string, price: number) => {
    setSchedule(
      schedule.map((day) =>
        day.id === dayId
          ? {
              ...day,
              slots: day.slots.map((slot) =>
                slot.id === slotId ? { ...slot, price } : slot
              ),
            }
          : day
      )
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý lịch làm việc</h1>
        <p className="text-gray-600 mt-2">Thiết lập lịch làm việc và các khung giờ dạy học</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Cài đặt mặc định
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultStartTime">Giờ bắt đầu mặc định</Label>
              <Input
                id="defaultStartTime"
                type="time"
                value={defaultStartTime}
                onChange={(e) => setDefaultStartTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultEndTime">Giờ kết thúc mặc định</Label>
              <Input
                id="defaultEndTime"
                type="time"
                value={defaultEndTime}
                onChange={(e) => setDefaultEndTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slotDuration">Thời gian slot (phút)</Label>
              <Input
                id="slotDuration"
                type="number"
                min="15"
                step="15"
                value={slotDuration}
                onChange={(e) => setSlotDuration(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultPrice">Giá mặc định (VNĐ)</Label>
              <Input
                id="defaultPrice"
                type="number"
                min="0"
                step="10000"
                value={defaultPrice}
                onChange={(e) => setDefaultPrice(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleApplyDefaultTime} variant="outline">
              Áp dụng giờ mặc định cho tất cả
            </Button>
            <Button onClick={handleGenerateSchedule} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Tạo lịch
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Chọn ngày làm việc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedule.map((day) => (
              <div key={day.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <Checkbox
                  id={`day-${day.id}`}
                  checked={day.isEnabled}
                  onCheckedChange={() => handleDayToggle(day.id)}
                />
                <Label
                  htmlFor={`day-${day.id}`}
                  className="font-medium min-w-[100px] cursor-pointer"
                >
                  {day.name} - ID:{day.id}
                </Label>

                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-600">Từ:</Label>
                    <Input
                      type="time"
                      value={day.startTime}
                      onChange={(e) => handleDayTimeChange(day.id, 'startTime', e.target.value)}
                      disabled={!day.isEnabled}
                      className="w-32"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-gray-600">Đến:</Label>
                    <Input
                      type="time"
                      value={day.endTime}
                      onChange={(e) => handleDayTimeChange(day.id, 'endTime', e.target.value)}
                      disabled={!day.isEnabled}
                      className="w-32"
                    />
                  </div>

                  <div className="text-sm text-gray-500">
                    {day.slots.length > 0 && `${day.slots.length} slots`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {schedule.some((day) => day.slots.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Lịch làm việc chi tiết
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-8 gap-2 mb-4">
                  <div className="font-semibold text-center p-2 bg-gray-100 rounded">Giờ</div>
                  {schedule.map((day) => (
                    <div
                      key={day.id}
                      className={`font-semibold text-center p-2 rounded ${
                        day.isEnabled && day.slots.length > 0
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {day.name.replace('Thứ ', 'T')}
                    </div>
                  ))}
                </div>

                {schedule[0].slots.length > 0 && (
                  <div className="space-y-2">
                    {schedule[0].slots.map((_, slotIndex) => (
                      <div key={slotIndex} className="grid grid-cols-8 gap-2">
                        <div className="flex items-center justify-center p-2 bg-gray-50 rounded text-sm font-medium">
                          {schedule[0].slots[slotIndex]?.startTime}-
                          {schedule[0].slots[slotIndex]?.endTime}
                        </div>
                        {schedule.map((day) => {
                          const slot = day.slots[slotIndex];
                          if (!slot) {
                            return <div key={day.id} className="bg-gray-50 rounded" />;
                          }

                          return (
                            <div
                              key={day.id}
                              className={`p-2 rounded cursor-pointer transition-colors ${
                                slot.isAvailable
                                  ? 'bg-emerald-100 hover:bg-emerald-200 border border-emerald-300'
                                  : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
                              }`}
                              onClick={() => handleSlotToggle(day.id, slot.id)}
                            >
                              <div className="text-xs font-medium text-center">
                                {slot.startTime}-{slot.endTime}
                              </div>
                              <Input
                                type="number"
                                value={slot.price}
                                onChange={(e) =>
                                  handleSlotPriceChange(day.id, slot.id, Number(e.target.value))
                                }
                                onClick={(e) => e.stopPropagation()}
                                className="h-6 text-xs mt-1"
                                disabled={!slot.isAvailable}
                              />
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Hướng dẫn:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Nhấp vào ô để bật/tắt slot (xanh lá = có sẵn, xám = không có sẵn)</li>
                <li>• Chỉnh sửa giá trực tiếp trong mỗi ô</li>
                <li>• Tùy chỉnh giờ làm việc cho từng ngày ở phần "Chọn ngày làm việc"</li>
                <li>• Nhấn "Tạo lịch" sau khi thay đổi cài đặt để cập nhật lịch</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TutorSchedule;
