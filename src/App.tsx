import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { LoadingProvider } from '@/context/LoadingContext';
import RemitentesPage from '@/pages/remitentes-page/RemitentesPage';
import TrabajadoresPage from "@/pages/trabajadores-page/TrabajadoresPage";
import AreasPage from "@/pages/areas-page/AreasPage";
import LoginPage from '@/pages/login-page/LoginPage.tsx';
import RolesPage from "@/pages/rol-page/RolesPage";
import UsuariosPage from "@/pages/usuarios-page/UsuariosPage";
import IngresoDocumentosPage from '@/pages/documentos-page/IngresoDocumentosPage';
import ListaDocumentosPage from './pages/documentos-page/ListaDocumentosPage';
import AmbitoPage from './pages/ambito-page/AmbitoPage';
import CategoriaPage from './pages/categoria-page/CategoriaPage';
import CentroPobladoPage from './pages/centro-poblado-page/CentroPobladoPage';
import { Toaster } from './components/ui/toaster';  // Asegúrate de importar el componente Toaster

function App() {
    return (
        <Router>
            <LoadingProvider>
                {/* El Toaster debe estar aquí, fuera de Routes */}
                <Toaster />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    {/* Ruta raíz redirige a /inicio */}
                    <Route path="/" element={<Navigate to="/inicio" replace />} />

                    {/* Ruta que utiliza Layout */}
                    <Route path="/" element={<Layout />}>
                        <Route path="remitentes/lista" element={<RemitentesPage />} />
                        <Route path="trabajadores/lista" element={<TrabajadoresPage />} />
                        <Route path="usuarios/lista" element={<UsuariosPage />} />
                        <Route path="usuarios/roles/lista" element={<RolesPage />} />
                        <Route path="areas/lista" element={<AreasPage />} />
                        <Route path="mesa-partes/ingreso" element={<IngresoDocumentosPage />} />
                        <Route path="documentos/lista" element={<ListaDocumentosPage />} />
                        <Route path="documentos/ambitos/lista" element={<AmbitoPage />} />
                        <Route path="documentos/categorias/lista" element={<CategoriaPage />} />
                        <Route path="distrito/centros-poblados/lista" element={<CentroPobladoPage />} />

                        {/* Redirecciones */}

                        <Route path="areas" element={<Navigate to="/areas/lista" replace />} />
                        <Route path="remitentes" element={<Navigate to="/remitentes/lista" replace />} />
                        <Route path="trabajadores" element={<Navigate to="/trabajadores/lista" replace />} />
                        <Route path="documentos" element={<Navigate to="/documentos/lista" replace />} />
                        <Route path="mesa-partes" element={<Navigate to="/mesa-partes/ingreso" replace />} />
                        <Route path="usuarios/roles" element={<Navigate to="/usuarios/roles/lista" replace />} />
                        <Route path="documentos/ambitos" element={<Navigate to="/documentos/ambitos/lista" replace />} />
                        <Route path="documentos/categorias" element={<Navigate to="/documentos/categorias/lista" replace />} />
                        <Route path="distrito/centros-poblados" element={<Navigate to="/distrito/centros-poblados/lista" replace />} />

                        {/* Manejo de rutas no encontradas */}
                        <Route path="*" element={<div className="p-4">Página no encontrada</div>} />
                    </Route>
                </Routes>
            </LoadingProvider>
        </Router>
    );
}

export default App;