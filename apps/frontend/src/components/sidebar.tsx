import { Lightbulb, CreditCard, BookOpen, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  href?: string;
}

const topNavigation = [
  {
    icon: <Lightbulb className="w-5 h-5 text-cf-primary-green" />,
    label: "Sources",
    href: "/sources",
  },
  {
    icon: <CreditCard className="w-5 h-5 text-cf-primary-green" />,
    label: "Posts",
    href: "/Posts",
  },
  {
    icon: <BookOpen className="w-5 h-5 text-cf-primary-green" />,
    label: "Ideas",
    href: "/ideas",
  },
];

const bottomNavigation = [
  {
    icon: <div className="w-5 h-5 bg-purple-500 rounded-full" />,
    label: "Content Calendar",
    href: "/content-calendar",
  },
  {
    icon: (
      <div className="w-5 h-5 bg-red-500 rounded-md flex items-center justify-center text-white text-xs font-bold">
        N
      </div>
    ),
    label: "Newstand",
    href: "/newstand",
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-yellow-500" />,
    label: "Golden Bar",
    href: "/golden-bar",
  },
];

function SidebarItem({ icon, label, active = false }: SidebarItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition-all duration-200",
        active
          ? "bg-cf-mint-medium"
          : "hover:bg-cf-mint-medium active:bg-cf-mint-light"
      )}
    >
      <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
      <span
        className={cn(
          "text-sm font-medium",
          active ? "text-cf-primary-green" : ""
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function Sidebar() {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  useEffect(() => {
    console.log("currentPath", currentPath);
  }, [router]);

  // Check if a navigation item's path is active
  const isActive = (path: string) => {
    return currentPath.toLocaleLowerCase() === path.toLocaleLowerCase();
  };

  return (
    <div className="w-[240px] h-fit rounded-3xl shadow-sm p-4 hidden sm:flex flex-col bg-cf-mint-light">
      <div className="px-4 py-2 text-xs font-semibold text-gray-500">APPS</div>

      <div className="mt-2 space-y-1">
        {topNavigation.map((item) => (
          <Link to={item.href} key={item.label}>
            <SidebarItem {...item} active={isActive(item.href)} />
          </Link>
        ))}

        <div className="border-t my-2 border-gray-100" />

        {bottomNavigation.map((item) => (
          <Link to={item.href} key={item.label}>
            <SidebarItem {...item} active={isActive(item.href)} />
          </Link>
        ))}
      </div>
    </div>
  );
}
