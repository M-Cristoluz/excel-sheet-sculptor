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
    <Card className={`glass-card hover-glow animate-scaleIn border-2 ${
      isDarkMode 
        ? 'border-primary/20 hover:border-primary/40' 
        : 'border-primary/10 hover:border-primary/30'
    } ${
      trend === 'up' && 'glow-green'
    }`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${
          isDarkMode 
            ? 'bg-primary/20' 
            : 'bg-primary/10'
        }`}>
          <Icon className={`h-6 w-6 text-${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground font-ios">{value}</div>
        {change !== undefined && (
          <Badge 
            variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'} 
            className={`mt-3 font-semibold ${getTrendColor()}`}
          >
            {getChangePrefix()}{change.toFixed(1)}%
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;