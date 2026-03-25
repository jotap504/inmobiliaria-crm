'use client';

import * as React from "react"
import { cn } from "@/lib/utils"

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, href, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          "text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors",
          className
        )}
        {...props}
      >
        {children}
      </a>
    )
  }
)
Link.displayName = "Link"

export { Link }
