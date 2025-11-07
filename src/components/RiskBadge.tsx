import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  tier: "Low" | "Medium" | "High";
  className?: string;
}

export function RiskBadge({ tier, className }: RiskBadgeProps) {
  const variants = {
    Low: "bg-risk-low-bg text-risk-low border-risk-low",
    Medium: "bg-risk-medium-bg text-risk-medium border-risk-medium",
    High: "bg-risk-high-bg text-risk-high border-risk-high",
  };

  return (
    <Badge 
      variant="outline" 
      className={cn("font-medium", variants[tier], className)}
    >
      {tier}
    </Badge>
  );
}
