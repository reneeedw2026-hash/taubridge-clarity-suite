import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Premium TauBridge variants
        gold: "bg-[hsl(40_70%_50%)] text-[hsl(220_50%_18%)] shadow-[0_10px_30px_-10px_hsl(40_70%_50%/0.35)] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0",
        "gold-outline": "border-2 border-[hsl(40_70%_50%)] bg-transparent text-[hsl(40_70%_50%)] hover:bg-[hsl(40_70%_50%)] hover:text-[hsl(220_50%_18%)]",
        hero: "bg-[linear-gradient(135deg,hsl(40_70%_50%)_0%,hsl(40_75%_40%)_100%)] text-[hsl(220_50%_18%)] font-bold shadow-[0_10px_30px_-10px_hsl(40_70%_50%/0.35)] hover:shadow-xl hover:-translate-y-1 active:translate-y-0",
        "hero-outline": "border-2 border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:border-white/50",
        nav: "text-white/80 hover:text-white hover:bg-white/10",
        "nav-dark": "text-foreground/80 hover:text-foreground hover:bg-muted",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-4",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
