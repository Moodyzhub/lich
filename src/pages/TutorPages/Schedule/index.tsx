import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
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
        startTime: `${startH.toString().padStart(2, '0')}h:${startM.toString().padStart(2, '0')}`,
        endTime: `${endH.toString().padStart(2, '0')}h:${endMinute.toString().padStart(2, '0')}`,
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

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Lịch Làm Việc</h1>
        <p className="text-sm text-gray-600 mt-1">Tạo lịch làm việc bằng tuần của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Cấu hình lịch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-sm">Giờ bắt đầu</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={defaultStartTime}
                  onChange={(e) => setDefaultStartTime(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-sm">Giờ kết thúc</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={defaultEndTime}
                  onChange={(e) => setDefaultEndTime(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slotDuration" className="text-sm">Giờ làm việc mặc định</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="slotDuration"
                    type="number"
                    min="15"
                    step="15"
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(Number(e.target.value))}
                    className="h-9"
                  />
                  <span className="text-sm text-gray-600 min-w-[40px]">phút</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultPrice" className="text-sm">Giá tiền slot mặc định</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="defaultPrice"
                    type="number"
                    min="0"
                    step="10000"
                    value={defaultPrice}
                    onChange={(e) => setDefaultPrice(Number(e.target.value))}
                    className="h-9"
                  />
                  <span className="text-sm text-gray-600 min-w-[40px]">VNĐ</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Chọn ngày làm việc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {schedule.map((day) => (
                <div key={day.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`day-${day.id}`}
                    checked={day.isEnabled}
                    onCheckedChange={() => handleDayToggle(day.id)}
                  />
                  <Label htmlFor={`day-${day.id}`} className="text-sm cursor-pointer flex-1">
                    {day.name}
                  </Label>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-2">
                <Checkbox id="other" disabled />
                <Label htmlFor="other" className="text-sm text-gray-400">Chủ nhật</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tùy chỉnh giờ cho từng ngày</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {schedule.filter(day => day.isEnabled).map((day) => (
                <div key={day.id} className="space-y-2">
                  <Label className="text-sm font-medium">{day.name}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={parseInt(day.startTime.split(':')[0])}
                        onChange={(e) => {
                          const hour = e.target.value.padStart(2, '0');
                          const minute = day.startTime.split(':')[1];
                          handleDayTimeChange(day.id, 'startTime', `${hour}:${minute}`);
                        }}
                        className="h-8 text-sm"
                        placeholder="Giờ"
                      />
                      <span className="text-xs text-gray-600">giờ</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={parseInt(day.endTime.split(':')[0])}
                        onChange={(e) => {
                          const hour = e.target.value.padStart(2, '0');
                          const minute = day.endTime.split(':')[1];
                          handleDayTimeChange(day.id, 'endTime', `${hour}:${minute}`);
                        }}
                        className="h-8 text-sm"
                        placeholder="Giờ"
                      />
                      <span className="text-xs text-gray-600">giờ</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerateSchedule}
            className="w-full bg-black hover:bg-gray-800"
          >
            Tạo lịch
          </Button>
        </div>

        <div className="lg:col-span-2">
          {schedule.some((day) => day.slots.length > 0) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Lịch Làm Việc</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-[700px]">
                    <div className="grid gap-px bg-gray-300" style={{
                      gridTemplateColumns: `80px repeat(${schedule.filter(d => d.slots.length > 0).length}, 1fr)`
                    }}>
                      <div className="bg-black text-white font-semibold text-center py-2 text-sm">
                        Giờ
                      </div>
                      {schedule.filter(day => day.slots.length > 0).map((day) => (
                        <div
                          key={day.id}
                          className="bg-black text-white font-semibold text-center py-2 text-sm"
                        >
                          {day.name}
                        </div>
                      ))}

                      {schedule.find(d => d.slots.length > 0)?.slots.map((_, slotIndex) => (
                        <React.Fragment key={slotIndex}>
                          <div className="bg-gray-100 flex items-center justify-center py-2.5 text-xs font-medium">
                            {schedule.find(d => d.slots.length > 0)?.slots[slotIndex]?.startTime}-
                            {schedule.find(d => d.slots.length > 0)?.slots[slotIndex]?.endTime}
                          </div>
                          {schedule.filter(day => day.slots.length > 0).map((day) => {
                            const slot = day.slots[slotIndex];
                            if (!slot) {
                              return <div key={day.id} className="bg-white" />;
                            }

                            return (
                              <div
                                key={day.id}
                                className="bg-emerald-50 text-emerald-600 flex items-center justify-center py-2.5 text-xs font-medium"
                              >
                                {slot.startTime}-{slot.endTime}
                              </div>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!schedule.some((day) => day.slots.length > 0) && (
            <Card className="h-[500px] flex items-center justify-center">
              <CardContent>
                <p className="text-gray-400 text-center">
                  Chưa có lịch làm việc. Vui lòng cấu hình và nhấn "Tạo lịch"
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorSchedule;
