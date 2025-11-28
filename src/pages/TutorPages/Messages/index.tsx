import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TutorMessages: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tin nhắn</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tin nhắn học viên</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Hệ thống tin nhắn sẽ được triển khai tại đây.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TutorMessages;
