import * as React from "react"
import { cn } from "@utils/cn"

const Skeleton = ({
 className,
 ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
 return (
 <div
 className={cn("animate-pulse rounded-md bg-white/10", className)}
 {...props}
 />
 )
}

const Card = React.forwardRef<
 HTMLDivElement,
 React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
 <div
 ref={ref}
 className={cn(
 "rounded-3xl border border-white/5 bg-white/[0.02] text-white backdrop-blur-sm",
 className
 )}
 {...props}
 />
))
Card.displayName = "Card"

export { Skeleton, Card }
