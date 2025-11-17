import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CalendarDays, CalendarRange } from "lucide-react";

export type PeriodType = 'week' | 'month' | 'year' | 'all';

interface PeriodFilterProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

export const PeriodFilter = ({ selectedPeriod, onPeriodChange }: PeriodFilterProps) => {
  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            Visualizar por:
          </span>
          <Tabs value={selectedPeriod} onValueChange={(value) => onPeriodChange(value as PeriodType)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="week" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Semana</span>
              </TabsTrigger>
              <TabsTrigger value="month" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span className="hidden sm:inline">Mês</span>
              </TabsTrigger>
              <TabsTrigger value="year" className="flex items-center gap-2">
                <CalendarRange className="h-4 w-4" />
                <span className="hidden sm:inline">Ano</span>
              </TabsTrigger>
              <TabsTrigger value="all">
                Tudo
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};
