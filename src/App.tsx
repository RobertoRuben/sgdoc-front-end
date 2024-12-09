import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { LoadingProvider } from '@/context/LoadingContext';
import RemitentesPage from '@/pages/remitentes-page/RemitentesPage';
import TrabajadoresPage from "@/pages/trabajadores-page/TrabajadoresPage";
import AreasPage from "@/pages/areas-page/AreasPage";
import LoginPage from '@/components/auth/LoginPage';
import RolesPage from "@/pages/rol-page/RolesPage";
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
                        <Route path="usuarios/roles/lista" element={<RolesPage />} />
                        <Route path="areas/lista" element={<AreasPage />} />

                        <Route path="areas" element={<Navigate to="/areas/lista" replace />} />
                        <Route path="remitentes" element={<Navigate to="/remitentes/lista" replace />} />
                        <Route path="trabajadores" element={<Navigate to="/trabajadores/lista" replace />} />
                        <Route path="usuarios/roles" element={<Navigate to="/usuarios/roles/lista" replace />} />

                        {/* Manejo de rutas no encontradas */}
                        <Route path="*" element={<div className="p-4">Página no encontrada</div>} />
                    </Route>
                </Routes>
            </LoadingProvider>
        </Router>
    );
}

export default App;