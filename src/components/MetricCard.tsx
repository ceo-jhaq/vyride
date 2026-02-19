import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  accentColor?: "primary" | "safe" | "warning" | "unsafe";
}

const accentClasses = {
  primary: "bg-primary/10 text-primary",
  safe: "bg-safe/10 text-safe",
  warning: "bg-warning/10 text-warning",
  unsafe: "bg-unsafe/10 text-unsafe",
};

export function MetricCard({ title, value, subtitle, icon: Icon, accentColor = "primary" }: MetricCardProps) {
  return (
    <Card className="glass-card animate-slide-up">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-display font-bold text-foreground">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentClasses[accentColor]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
