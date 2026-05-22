"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Primary navigation link with a restrained hover underline.
 * Active route is inferred from the pathname (hash links excluded).
 */
export function NavLink({ href, children, className, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isHash = href.startsWith("/#");
  const isActive =
    !isHash && (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center px-1 py-2 text-[13px] font-medium tracking-wide text-muted-foreground transition-colors duration-300 hover:text-foreground focus-ring rounded-sm",
        isActive && "text-foreground",
        className,
      )}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          "absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-foreground/80 transition-transform duration-300 ease-out-expo",
          "group-hover:scale-x-100",
          isActive && "scale-x-100",
        )}
      />
    </Link>
  );
}
