import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OverviewPage } from "@/routes/overview-page";
import { ExamplesPage } from "@/routes/examples-page";
import { ExampleDetailPage } from "@/routes/example-detail-page";
import { DiagnosticsPage } from "@/routes/diagnostics-page";

function AppHeader() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center gap-2 px-4">
        <SidebarTrigger />
        <div className="min-w-0">
          <h1 className="text-sm font-semibold truncate">@devstool/shadcn-echarts production parity demo</h1>
          <p className="text-xs text-muted-foreground truncate">{location.pathname}</p>
        </div>
      </div>
    </header>
  );
}

export function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <main className="flex-1 p-4 md:p-6">
              <Routes>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/examples" element={<ExamplesPage />} />
                <Route path="/unsupported" element={<ExamplesPage defaultStatus="unsupported" />} />
                <Route path="/diagnostics" element={<DiagnosticsPage />} />
                <Route path="/category/:category" element={<ExamplesPage />} />
                <Route path="/examples/:encodedId" element={<ExampleDetailPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
