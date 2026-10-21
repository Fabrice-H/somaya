import { SiteShell } from "@/shared/components/layout/SiteShell";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
