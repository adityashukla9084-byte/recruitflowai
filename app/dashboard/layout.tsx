import Sidebar from "./components/sidebar";
import Header from "./components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-theme-bg text-theme-text relative overflow-hidden">
      {/* Subtle Noise Texture */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-multiply"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
      />
      {/* Premium Light Ambient Glows */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-theme-accent/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-theme-card/60 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] right-[10%] w-[500px] h-[500px] rounded-full bg-theme-accent/5 blur-[120px] pointer-events-none z-0" />
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative z-10">
        <Header />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}