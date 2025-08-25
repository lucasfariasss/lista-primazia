import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import ListaEsperaCirurgica from "./pages/ListaEsperaCirurgica";
import ConsultaPublica from "./pages/ConsultaPublica";
import Login from "./pages/Login";
import Especialidades from "./pages/catalogo/Especialidades";
import Pacientes from "./pages/catalogo/Pacientes";
import Procedimentos from "./pages/catalogo/Procedimentos";
import Medicos from "./pages/catalogo/Medicos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Mock user para demonstração
const mockUser = {
  id: "1",
  name: "Dr. João Silva",
  email: "joao.silva@hulw.ufpb.br",
  role: "medico" as const,
  especialidades: ["e1", "e2"]
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas sem layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/consulta" element={<ConsultaPublica />} />
          
          {/* Rotas com layout principal */}
          <Route path="/*" element={
            <MainLayout user={mockUser}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/lista-espera" element={<ListaEsperaCirurgica />} />
                <Route path="/catalogo/especialidades" element={<Especialidades />} />
                <Route path="/catalogo/pacientes" element={<Pacientes />} />
                <Route path="/catalogo/procedimentos" element={<Procedimentos />} />
                <Route path="/catalogo/medicos" element={<Medicos />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
