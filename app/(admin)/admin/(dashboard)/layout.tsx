import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container-wide flex min-h-[calc(100svh-3.5rem)] gap-10 py-10 lg:gap-14">
      <aside className="w-full shrink-0 lg:w-52">
        <AdminNav />
      </aside>
      <div className="min-w-0 flex-1 pb-16">{children}</div>
    </div>
  );
}
