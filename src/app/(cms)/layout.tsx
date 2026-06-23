import CMSLayoutContent from "@/features/layout";

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  return <CMSLayoutContent>{children}</CMSLayoutContent>;
}
