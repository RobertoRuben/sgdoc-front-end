import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { LoadingProvider } from '@/context/LoadingContext';
import RemitentesPage from '@/pages/remitentes-page/RemitentesPage';
import TrabajadoresPage from "@/pages/trabajadores-page/TrabajadoresPage";
import AreasPage from "@/pages/areas-page/AreasPage";


function App() {
    return (
        <Router>
            <LoadingProvider>
                <Routes>
                    {/* Ruta raíz redirige a /inicio */}
                    <Route path="/" element={<Navigate to="/inicio" replace />} />

                    {/* Ruta que utiliza Layout */}
                    <Route path="/" element={<Layout />}>
                        <Route path="remitentes/lista" element={<RemitentesPage />} /> {/* Agrega esta línea */}
                        <Route path="trabajadores/lista" element={<TrabajadoresPage />} /> {/* Agrega esta línea */}
                        <Route path="areas/lista" element={<AreasPage />} /> {/* Agrega esta línea */}

                        <Route path="areas" element={<Navigate to="/areas/lista" replace />} />
                        <Route path="remitentes" element={<Navigate to="/remitentes/lista" replace />} />
                        <Route path="trabajadores" element={<Navigate to="/trabajadores/lista" replace />} />

                        {/* Manejo de rutas no encontradas */}
                        <Route path="*" element={<div className="p-4">Página no encontrada</div>} />
                    </Route>
                </Routes>
            </LoadingProvider>
        </Router>
    );
}

export default App;
