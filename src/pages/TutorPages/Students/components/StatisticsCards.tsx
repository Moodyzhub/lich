import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardData {
  label: string;
  value: number | string;
  icon: LucideIcon;
  iconColor: string;
}

interface StatisticsCardsProps {
  stats: StatCardData[];
}

export const StatisticsCards = memo(({ stats }: StatisticsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1" id={`stat-label-${index}`}>
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold" aria-labelledby={`stat-label-${index}`}>
                    {stat.value}
                  </p>
                </div>
                <div 
                  className={`p-3 rounded-full bg-opacity-10 ${stat.iconColor.replace('text-', 'bg-')}`}
                  aria-hidden="true"
                >
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});

StatisticsCards.displayName = 'StatisticsCards';
