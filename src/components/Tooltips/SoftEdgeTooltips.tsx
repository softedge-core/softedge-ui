import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const SoftEdgeTooltip = ({ children, ...props }: TooltipPrimitive.TooltipProps) => (
  <TooltipPrimitive.Root {...props}>
    {children}
  </TooltipPrimitive.Root>
);
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground",
        className
      )}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow
      className="fill-primary transition-all duration-200 data-[state=delayed-open]:opacity-100 data-[state=closed]:opacity-0"
      width={12}
      height={6}
    />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { SoftEdgeTooltip, TooltipTrigger, TooltipContent, TooltipProvider }