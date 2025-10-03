import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface IOSButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

const IOSButton = forwardRef<HTMLButtonElement, IOSButtonProps>(
  ({ 
    className, 
    children, 
    variant = "primary", 
    size = "md", 
    isLoading = false,
    fullWidth = false,
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold tracking-tight rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-ios";
    
    const variants = {
      primary: "bg-gradient-to-b from-primary to-primary/90 text-primary-foreground shadow-[0_4px_16px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:-translate-y-1",
      secondary: "bg-gradient-to-b from-secondary to-secondary/90 text-secondary-foreground shadow-[0_4px_16px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:-translate-y-1",
      success: "bg-gradient-to-b from-success to-success/90 text-white shadow-[0_4px_16px_rgba(76,175,80,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_8px_24px_rgba(76,175,80,0.4)] hover:-translate-y-1",
      danger: "bg-gradient-to-b from-danger to-danger/90 text-white shadow-[0_4px_16px_rgba(244,67,54,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_8px_24px_rgba(244,67,54,0.4)] hover:-translate-y-1",
      ghost: "bg-transparent hover:bg-accent/10 text-foreground",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm rounded-lg",
      md: "h-11 px-6 text-base rounded-xl",
      lg: "h-14 px-8 text-lg rounded-2xl",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

IOSButton.displayName = "IOSButton";

export default IOSButton;
