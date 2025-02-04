import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { LoadingProvider } from "@/context/LoadingContext";
import { AuthProvider } from "./provider/AuthProvider";
import { ProtectedRoute } from "@/auth/ProtectedRoute";

import LoginPage from "@/pages/login-page/LoginPage";
import NotAuthorizedPage from "@/pages/not-authorized-page/NotAuthorizedPage";
import NotFoundPage from "@/pages/not-found-page/NotFoundPage"; // <-- Importa tu NotFoundPage

import RemitentesPage from "@/pages/remitentes-page/RemitentesPage";
import TrabajadoresPage from "@/pages/trabajadores-page/TrabajadoresPage";
import UsuariosPage from "@/pages/usuarios-page/UsuariosPage";
import RolesPage from "@/pages/rol-page/RolesPage";
import AreasPage from "@/pages/areas-page/AreasPage";
import IngresoDocumentosPage from "@/pages/documentos-page/ingreso-documentos-page/IngresoDocumentosPage";
import ListaDocumentosPage from "@/pages/documentos-page/lista-documentos-page/ListaDocumentosPage";
import AmbitoPage from "@/pages/ambito-page/AmbitoPage";
import CategoriaPage from "@/pages/categoria-page/CategoriaPage";
import CentroPobladoPage from "@/pages/centro-poblado-page/CentroPobladoPage";
import CaseriosPage from "@/pages/caserios-page/CaseriosPage";
import DashboardMesaPartesPage from "@/pages/inicio-page/DashboardMesaPartesPage";
import ListaDocumentosRecibidosPage from "./pages/received-documents-page/ReceivedDocumentsPage";
import ListaDocumentosEnviadosPage from "./pages/documentos-page/documentos-enviados-page/DocumentosEnviadosPage";
import ListaDocumentosRechazadosPage from "./pages/documentos-page/documentos-rechazados-page/DocumentosRechazadosPage";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <Router>
      <AuthProvider>
        <LoadingProvider>
          <Toaster />

          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/not-authorized" element={<NotAuthorizedPage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="inicio" replace />} />
                <Route path="inicio" element={<DashboardMesaPartesPage />} />

                {/* Rutas con roles "Admin" */}
                <Route element={<ProtectedRoute requiredRoles={["Admin"]} />}>
                  <Route path="remitentes/lista" element={<RemitentesPage />} />
                  <Route path="trabajadores/lista" element={<TrabajadoresPage />}/>
                  <Route path="usuarios/lista" element={<UsuariosPage />} />
                  <Route path="usuarios/roles/lista" element={<RolesPage />} />
                </Route>

                {/* Ruta compartida para ambos roles */}
                <Route element={<ProtectedRoute requiredRoles={["Admin", "Mesa de Partes"]}/>}>
                  <Route path="mesa-partes/ingreso" element={<IngresoDocumentosPage />}/>
                </Route>

                {/* Rutas que solo requieren autenticación */}
                <Route path="usuarios/lista" element={<UsuariosPage />} />
                <Route path="areas/lista" element={<AreasPage />} />
                <Route
                  path="documentos/lista"
                  element={<ListaDocumentosPage />}
                />
                <Route
                  path="documentos/ambitos/lista"
                  element={<AmbitoPage />}
                />
                <Route
                  path="documentos/categorias/lista"
                  element={<CategoriaPage />}
                />
                <Route
                  path="distrito/centros-poblados/lista"
                  element={<CentroPobladoPage />}
                />
                <Route
                  path="distrito/caserios/lista"
                  element={<CaseriosPage />}
                />
                <Route
                  path="bandeja-entrada/recibidos"
                  element={<ListaDocumentosRecibidosPage />}
                />
                <Route
                  path="bandeja-entrada/enviados"
                  element={<ListaDocumentosEnviadosPage />}
                />
                <Route
                  path="bandeja-entrada/rechazados"
                  element={<ListaDocumentosRechazadosPage />}
                />

                {/* Redirecciones */}
                <Route
                  path="areas"
                  element={<Navigate to="/areas/lista" replace />}
                />
                <Route
                  path="remitentes"
                  element={<Navigate to="/remitentes/lista" replace />}
                />
                <Route
                  path="trabajadores"
                  element={<Navigate to="/trabajadores/lista" replace />}
                />
                <Route
                  path="documentos"
                  element={<Navigate to="/documentos/lista" replace />}
                />
                <Route
                  path="usuarios"
                  element={<Navigate to="/usuarios/lista" replace />}
                />
                <Route
                  path="mesa-partes"
                  element={<Navigate to="/mesa-partes/ingreso" replace />}
                />
                <Route
                  path="usuarios/roles"
                  element={<Navigate to="/usuarios/roles/lista" replace />}
                />
                <Route
                  path="documentos/ambitos"
                  element={<Navigate to="/documentos/ambitos/lista" replace />}
                />
                <Route
                  path="documentos/categorias"
                  element={
                    <Navigate to="/documentos/categorias/lista" replace />
                  }
                />
                <Route
                  path="distrito/centros-poblados"
                  element={
                    <Navigate to="/distrito/centros-poblados/lista" replace />
                  }
                />
                <Route
                  path="distrito/caserios"
                  element={<Navigate to="/distrito/caserios/lista" replace />}
                />
              </Route>
            </Route>

            {/* Cualquier otra ruta redirige a /not-found */}
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </Routes>
        </LoadingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
