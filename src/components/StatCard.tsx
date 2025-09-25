import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
  isDarkMode?: boolean;
}

const StatCard = ({ title, value, change, icon: Icon, trend = 'neutral', color = 'primary', isDarkMode }: StatCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-danger';
      default: return 'text-muted-foreground';
    }
  };

  const getChangePrefix = () => {
    if (!change) return '';
    return change > 0 ? '+' : '';
  };

  return (
    <Card className={`hover:scale-105 transition-all duration-300 animate-scaleIn ${
      isDarkMode ? 'glass-effect' : 'hover:shadow-lg'
    }`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-5 w-5 text-${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change !== undefined && (
          <Badge variant="secondary" className={`mt-2 ${getTrendColor()}`}>
            {getChangePrefix()}{change}%
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;