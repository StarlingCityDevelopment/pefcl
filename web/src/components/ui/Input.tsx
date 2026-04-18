import * as React from "react"
import { cn } from "@utils/cn"

export interface InputProps
 extends React.InputHTMLAttributes<HTMLInputElement> {
 label?: string
 error?: boolean
 helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
 ({ className, type, label, error, helperText, ...props }, ref) => {
 return (
 <div className="flex flex-col gap-1.5 w-full">
 {label && (
 <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 ml-1">
 {label}
 </label>
 )}
 <div className={cn(
 "relative flex items-center min-h-[52px] px-5 rounded-2xl transition-all duration-300",
 "bg-white/[0.03] border border-white/5",
 "hover:bg-white/[0.05] hover:border-white/10",
 "focus-within:bg-white/[0.01] focus-within:border-white focus-within:ring-4 focus-within:ring-white/5",
 error && "border-rose-500/30 focus-within:border-rose-500 focus-within:ring-rose-500/10",
 className
 )}>
 <input
 type={type}
 className="flex-1 bg-transparent border-none p-0 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:ring-0 w-full"
 ref={ref}
 {...props}
 />
 </div>
 {helperText && (
 <span className={cn(
 "text-[11px] font-medium px-1",
 error ? "text-rose-400" : "text-slate-500"
 )}>
 {helperText}
 </span>
 )}
 </div>
 )
 }
)
Input.displayName = "Input"

export { Input }
