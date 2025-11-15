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
  shortName: string;
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
    { id: 2, name: 'Thứ 2', shortName: 'T2', isEnabled: false, startTime: '08:00', endTime: '22:00', slots: [] },
    { id: 3, name: 'Thứ 3', shortName: 'T3', isEnabled: true, startTime: '09:00', endTime: '22:00', slots: [] },
    { id: 4, name: 'Thứ 4', shortName: 'T4', isEnabled: true, startTime: '08:00', endTime: '22:00', slots: [] },
    { id: 5, name: 'Thứ 5', shortName: 'T5', isEnabled: true, startTime: '08:00', endTime: '22:00', slots: [] },
    { id: 6, name: 'Thứ 6', shortName: 'T6', isEnabled: true, startTime: '08:00', endTime: '22:00', slots: [] },
    { id: 7, name: 'Thứ 7', shortName: 'T7', isEnabled: false, startTime: '08:00', endTime: '22:00', slots: [] },
    { id: 8, name: 'Chủ nhật', shortName: 'CN', isEnabled: false, startTime: '08:00', endTime: '22:00', slots: [] },
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
        startTime: `${startH.toString().padStart(2, '0')}h`,
        endTime: `${endH.toString().padStart(2, '0')}h`,
      });

      currentMinutes += duration;
    }

    return slots;
  };

  const getAllTimeSlots = (): string[] => {
    const allSlots = new Set<string>();
    schedule.forEach(day => {
      if (day.isEnabled && day.slots.length > 0) {
        day.slots.forEach(slot => {
          allSlots.add(slot.id);
        });
      }
    });
    return Array.from(allSlots).sort();
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

  const getSlotForTime = (day: DaySchedule, timeId: string): TimeSlot | null => {
    return day.slots.find(slot => slot.id === timeId) || null;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Lịch Làm Việc</h1>
        <p className="text-sm text-gray-500 mt-1">Tạo lịch làm việc bằng tuần của bạn</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[400px,1fr] gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Cấu hình lịch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Giờ làm việc mặc định</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={defaultStartTime}
                    onChange={(e) => setDefaultStartTime(e.target.value)}
                    className="h-9 flex-1"
                  />
                  <span className="text-sm text-gray-500">đến</span>
                  <Input
                    type="time"
                    value={defaultEndTime}
                    onChange={(e) => setDefaultEndTime(e.target.value)}
                    className="h-9 flex-1"
                  />
                </div>
                <Button
                  onClick={handleApplyDefaultTime}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Áp dụng cho tất cả
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slotDuration" className="text-sm font-medium">Thời gian slot mặc định</Label>
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
                  <span className="text-sm text-gray-500 min-w-[50px]">phút</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultPrice" className="text-sm font-medium">Giá tiền slot mặc định</Label>
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
                  <span className="text-sm text-gray-500 min-w-[50px]">VNĐ</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Chọn ngày làm việc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tùy chỉnh giờ cho từng ngày</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {schedule.filter(day => day.isEnabled).map((day) => (
                <div key={day.id} className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-700">{day.name}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="23"
                      value={parseInt(day.startTime.split(':')[0])}
                      onChange={(e) => {
                        const hour = e.target.value.padStart(2, '0');
                        handleDayTimeChange(day.id, 'startTime', `${hour}:00`);
                      }}
                      className="h-8 text-sm"
                    />
                    <span className="text-xs text-gray-500">đến</span>
                    <Input
                      type="number"
                      min="0"
                      max="23"
                      value={parseInt(day.endTime.split(':')[0])}
                      onChange={(e) => {
                        const hour = e.target.value.padStart(2, '0');
                        handleDayTimeChange(day.id, 'endTime', `${hour}:00`);
                      }}
                      className="h-8 text-sm"
                    />
                    <span className="text-xs text-gray-500">giờ</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerateSchedule}
            className="w-full bg-black hover:bg-gray-800 h-10"
          >
            Tạo lịch
          </Button>
        </div>

        <div>
          {schedule.some((day) => day.slots.length > 0) ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Lịch Làm Việc</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full">
                    <div className="border-t">
                      <div className="grid" style={{
                        gridTemplateColumns: `100px repeat(${schedule.filter(d => d.isEnabled).length}, minmax(90px, 1fr))`
                      }}>
                        <div className="bg-gray-900 text-white font-semibold text-center py-2.5 text-sm border-r border-gray-700">
                          Giờ
                        </div>
                        {schedule.filter(day => day.isEnabled).map((day) => (
                          <div
                            key={day.id}
                            className="bg-gray-900 text-white font-semibold text-center py-2.5 text-sm border-r border-gray-700 last:border-r-0"
                          >
                            {day.shortName}
                          </div>
                        ))}

                        {getAllTimeSlots().map((timeId) => {
                          const [startTime] = timeId.split('-');
                          const [startH, startM] = startTime.split(':');
                          const endH = String(parseInt(startH) + 1).padStart(2, '0');

                          return (
                            <React.Fragment key={timeId}>
                              <div className="bg-gray-50 flex items-center justify-center py-2 text-xs font-medium border-r border-b border-gray-200 text-gray-700">
                                {startH}h-{endH}h
                              </div>
                              {schedule.filter(day => day.isEnabled).map((day) => {
                                const slot = getSlotForTime(day, timeId);

                                return (
                                  <div
                                    key={`${day.id}-${timeId}`}
                                    className={`flex items-center justify-center py-2 text-xs font-medium border-r border-b border-gray-200 last:border-r-0 ${
                                      slot
                                        ? 'bg-emerald-50 text-emerald-600'
                                        : 'bg-white'
                                    }`}
                                  >
                                    {slot && `${slot.startTime}-${slot.endTime}`}
                                  </div>
                                );
                              })}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full min-h-[600px] flex items-center justify-center">
              <CardContent>
                <div className="text-center text-gray-400">
                  <p className="text-sm">Chưa có lịch làm việc</p>
                  <p className="text-xs mt-1">Vui lòng cấu hình và nhấn "Tạo lịch"</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorSchedule;
