import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

// This is the "Helper" component
export const NavLink = forwardRef<HTMLAnchorElement, any>(
  ({ className, activeClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive }) => cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  }
);