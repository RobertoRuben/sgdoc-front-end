'use client'
import { motion } from 'framer-motion'
import { Background } from './components/Background'
import { LogoHeader } from './components/LogoHeader'
import { LoginFormContent } from './components/LoginForm'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <Background />
            
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="w-full max-w-md z-20"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.0 }}
                    className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden"
                >
                    <div className="p-8">
                        <LogoHeader />
                        <LoginFormContent />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}