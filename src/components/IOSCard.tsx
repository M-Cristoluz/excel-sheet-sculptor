import { HTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface IOSCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "elevated";
  hoverable?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
}

const IOSCard = forwardRef<HTMLDivElement, IOSCardProps>(
  ({ 
    className, 
    children,
    variant = "default",
    hoverable = false,
    header,
    footer,
    ...props 
  }, ref) => {
    const baseStyles = "rounded-2xl transition-all duration-300";
    
    const variants = {
      default: "bg-card border border-border shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)]",
      glass: "bg-card/80 backdrop-blur-xl border border-border/50 shadow-[0_8px_32px_rgba(31,38,135,0.15)] dark:bg-card/60 dark:border-border/30",
      elevated: "bg-card shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)] border-none",
    };

    const hoverStyles = hoverable 
      ? "hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)] cursor-pointer" 
      : "";

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          hoverStyles,
          className
        )}
        {...props}
      >
        {header && (
          <div className="px-6 py-4 border-b border-border">
            {header}
          </div>
        )}
        
        <div className="p-6">
          {children}
        </div>

        {footer && (
          <div className="px-6 py-4 border-t border-border bg-muted/30 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

IOSCard.displayName = "IOSCard";

export default IOSCard;
