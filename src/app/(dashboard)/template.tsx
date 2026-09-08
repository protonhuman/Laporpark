export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="animate-page-enter relative w-full">
      {/* Subtle glowing indicator line on route transition */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-[2.5px] bg-gradient-to-r from-emerald-400 via-[#00ffcc] to-sky-400 animate-route-flash pointer-events-none shadow-[0_0_12px_rgba(0,255,204,0.7)]"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
