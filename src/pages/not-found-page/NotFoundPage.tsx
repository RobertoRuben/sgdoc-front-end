import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Background } from "./components/Background";
import { ErrorContent } from "./components/ErrorContent";

export default function NotFoundPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleBackToHome = () => {
        if (isAuthenticated) {
            navigate("/inicio");
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8 overflow-hidden">
            <div className="relative w-full max-w-2xl mx-auto">
                <Background />
                <ErrorContent isVisible={isVisible} onBackClick={handleBackToHome} />
            </div>
        </div>
    );
}