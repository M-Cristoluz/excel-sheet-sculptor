import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold tracking-tight ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-ios active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:-translate-y-0.5",
        outline: "border-2 border-primary/30 bg-background/80 backdrop-blur-md text-foreground hover:bg-primary/10 hover:border-primary/50 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:-translate-y-0.5",
        secondary: "bg-secondary/90 text-secondary-foreground hover:bg-secondary shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:-translate-y-0.5",
        ghost: "hover:bg-accent/80 hover:text-accent-foreground backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline font-medium",
        success: "bg-success text-primary-foreground hover:bg-success/90 shadow-[0_4px_16px_rgba(76,175,80,0.3)] hover:shadow-[0_8px_24px_rgba(76,175,80,0.4)] hover:-translate-y-0.5",
        warning: "bg-warning text-foreground hover:bg-warning/90 shadow-[0_4px_16px_rgba(255,193,7,0.3)] hover:shadow-[0_8px_24px_rgba(255,193,7,0.4)] hover:-translate-y-0.5",
        danger: "bg-danger text-primary-foreground hover:bg-danger/90 shadow-[0_4px_16px_rgba(244,67,54,0.3)] hover:shadow-[0_8px_24px_rgba(244,67,54,0.4)] hover:-translate-y-0.5",
        glass: "bg-card/60 backdrop-blur-xl border border-border/50 text-foreground hover:bg-card/80 shadow-[0_8px_32px_rgba(31,38,135,0.15)] hover:shadow-[0_12px_40px_rgba(31,38,135,0.2)] hover:-translate-y-0.5 dark:bg-card/40 dark:hover:bg-card/60",
        ios: "bg-gradient-to-b from-primary to-primary/90 text-primary-foreground shadow-[0_4px_16px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:-translate-y-0.5",
      },
      size: {
        default: "h-11 px-6 py-2 rounded-xl",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-14 rounded-2xl px-8 text-base",
        icon: "h-11 w-11 rounded-xl",
        xl: "h-16 rounded-2xl px-10 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
