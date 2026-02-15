'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadModal } from '@/components/ui/UploadButton';
import { motion, Variants } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleUpload = async (file: File) => {
        setIsUploading(true);
        setError(null);

        localStorage.removeItem('uploadedImage');
        localStorage.removeItem('metadata');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_URL}/api/v1/analyze`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Erro ao analisar imagem');
            }

            const imageUrl = URL.createObjectURL(file);

            localStorage.setItem('uploadedImage', imageUrl);
            localStorage.setItem('metadata', JSON.stringify(result.data));

            setIsModalOpen(false);
            router.push('/results');

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao processar imagem';
            setError(errorMessage);
            console.error('Upload error:', err);
        } finally {
            setIsUploading(false);
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1] as const
            }
        }
    };

    return (
        <div className="min-h-screen text-white font-sans relative pb-24 overflow-hidden">
            
            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>

            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
            >
                <div className="absolute top-[-10%] left-[-10%] h-[200px] w-[200px] md:w-[500px] md:h-[500px] bg-teal-500/20 rounded-full mix-blend-screen filter blur-[120px] opacity-60 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[120px] opacity-60 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] h-[300px] w-[300px] md:w-[600px] md:h-[600px] bg-blue-500/20 rounded-full mix-blend-screen filter blur-[120px] opacity-60 animate-blob animation-delay-4000"></div>
            </motion.div>

            <div className="max-w-7xl w-full mx-auto relative z-10 px-4 sm:px-6">
                <motion.header 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full pt-8 pb-16"
                >
                    <h2 className="text-white font-semibold text-xl tracking-wide">HuskyTrace</h2>
                </motion.header>

                <main className="flex flex-col items-center justify-center mb-32">
                    <section className="relative flex flex-col items-center w-full max-w-3xl text-center rounded-2xl overflow-hidden p-10 sm:p-16">
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="relative z-10 flex flex-col items-center"
                        >
                            <motion.span 
                                variants={itemVariants}
                                className="mb-4 rounded-full bg-teal-500/10 px-3 py-1 text-[10px] font-mono tracking-widest text-teal-400 border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                            >
                                NOVO RECURSO
                            </motion.span>
                            
                            <motion.h1 
                                variants={itemVariants}
                                className="font-semibold text-4xl sm:text-5xl text-white tracking-tight leading-tight mb-6"
                            >
                                Rastreie a origem de <br className="hidden sm:block"/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                    qualquer foto em segundos
                                </span>
                            </motion.h1>
                            
                            <motion.p 
                                variants={itemVariants}
                                className="text-gray-400 mb-10 max-w-lg text-sm sm:text-base"
                            >
                                Faça o upload da imagem para fazer uma varredura e encontrar a fonte original e os metadados.
                            </motion.p>
                            
                            <motion.button 
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsModalOpen(true)}
                                disabled={isUploading}
                                className="group relative flex items-center justify-center gap-2 rounded-full bg-[#0D1017] cursor-pointer border border-[#2b303b] px-8 py-4 text-sm font-medium text-white transition-all duration-200 hover:bg-[#07090e] hover:border-white/15 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>Enviar imagem</span>
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </motion.button>

                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                                >
                                    <p className="text-red-400 text-sm">{error}</p>
                                </motion.div>
                            )}
                        </motion.div>
                    </section>
                </main>
            </div>
            
            <UploadModal 
                isOpen={isModalOpen}
                onClose={() => !isUploading && setIsModalOpen(false)}
                onUpload={handleUpload}
                isUploading={isUploading}
            />
        </div>
    );
}