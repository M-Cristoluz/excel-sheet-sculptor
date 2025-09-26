import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-ios",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:scale-105",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-xl",
        outline: "border-2 border-primary/20 bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary/10 hover:border-primary/40 shadow-sm hover:shadow-md",
        secondary: "bg-secondary/80 text-secondary-foreground hover:bg-secondary shadow-md hover:shadow-lg",
        ghost: "hover:bg-accent/80 hover:text-accent-foreground backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline font-medium",
        success: "bg-success text-white hover:bg-success/90 shadow-lg hover:shadow-xl",
        warning: "bg-warning text-foreground hover:bg-warning/90 shadow-lg hover:shadow-xl",
        danger: "bg-danger text-white hover:bg-danger/90 shadow-lg hover:shadow-xl",
        glass: "bg-background/20 backdrop-blur-md border border-white/20 text-foreground hover:bg-background/30 shadow-lg hover:shadow-xl",
      },
      size: {
        default: "h-11 px-6 py-2 rounded-xl",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-13 rounded-xl px-8 text-base",
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
