import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { LoadingProvider } from '@/context/LoadingContext';
import RemitentesPage from '@/pages/remitentes-page/RemitentesPage';
import TrabajadoresPage from "@/pages/trabajadores-page/TrabajadoresPage";


function App() {
    return (
        <Router>
            <LoadingProvider>
                <Routes>
                    {/* Ruta raíz redirige a /inicio */}
                    <Route path="/" element={<Navigate to="/inicio" replace />} />

                    {/* Ruta que utiliza Layout */}
                    <Route path="/" element={<Layout />}>
                        <Route path="remitentes" element={<RemitentesPage />} /> {/* Agrega esta línea */}
                        <Route path="trabajadores" element={<TrabajadoresPage />} /> {/* Agrega esta línea */}

                        {/* Manejo de rutas no encontradas */}
                        <Route path="*" element={<div className="p-4">Página no encontrada</div>} />
                    </Route>
                </Routes>
            </LoadingProvider>
        </Router>
    );
}

export default App;
