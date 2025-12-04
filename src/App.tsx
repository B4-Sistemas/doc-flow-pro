import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Contracts from "./pages/Contracts";
import ContractForm from "./pages/ContractForm";
import Organizations from "./pages/Organizations";
import Billing from "./pages/Billing";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/contracts" element={<AppLayout><Contracts /></AppLayout>} />
          <Route path="/contracts/new" element={<AppLayout><ContractForm /></AppLayout>} />
          <Route path="/organizations" element={<AppLayout><Organizations /></AppLayout>} />
          <Route path="/billing" element={<AppLayout><Billing /></AppLayout>} />
          <Route path="/users" element={<AppLayout><Users /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
