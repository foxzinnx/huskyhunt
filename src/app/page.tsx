'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadModal } from '@/components/ui/UploadButton';

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
            // Criar FormData para enviar arquivo
            const formData = new FormData();
            formData.append('file', file);

            // Chamar API
            const response = await fetch(`${API_URL}/api/v1/analyze`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Erro ao analisar imagem');
            }

            // Criar URL da imagem para preview
            const imageUrl = URL.createObjectURL(file);

            // Salvar dados no localStorage
            localStorage.setItem('uploadedImage', imageUrl);
            localStorage.setItem('metadata', JSON.stringify(result.data));

            // Fechar modal e navegar
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

    return (
        /* Adicionado overflow-hidden na div principal para evitar que as luzes gerem scroll horizontal */
        <div className="min-h-screen text-white font-sans relative pb-24 overflow-hidden">
            
            {/* ESTILOS DA ANIMAÇÃO DAS LUZES */}
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

            {/* ELEMENTOS DE LUZ DESFOCADA (FUNDO) */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {/* Luz Teal (Combinando com os botões) */}
                <div className="absolute top-[-10%] left-[-10%] h-[200px] w-[200px] md:w-[500px] md:h-[500px] bg-teal-500/20 rounded-full mix-blend-screen filter blur-[120px] opacity-60 animate-blob"></div>
                
                {/* Luz Índigo (Contraste) */}
                <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[120px] opacity-60 animate-blob animation-delay-2000"></div>
                
                {/* Luz Azul (Base) */}
                <div className="absolute bottom-[-20%] left-[20%] h-[300px] w-[300px] md:w-[600px] md:h-[600px] bg-blue-500/20 rounded-full mix-blend-screen filter blur-[120px] opacity-60 animate-blob animation-delay-4000"></div>
            </div>

            {/* CONTEÚDO PRINCIPAL (z-10 garante que fique na frente das luzes) */}
            <div className="max-w-7xl w-full mx-auto relative z-10 px-4 sm:px-6">
                
                {/* HEADER */}
                <header className="w-full pt-8 pb-16">
                    <h2 className="text-white font-semibold text-xl tracking-wide">HuskyTrace</h2>
                    {/* <span className='text-white text-sm tracking-wide cursor-pointer hover:text-teal-400 transition-colors'>
                        Política de Privacidade
                    </span> */}
                </header>
                
                {/* HERO SECTION */}
                <main className="flex flex-col items-center justify-center mb-32">
                    <section className="relative flex flex-col items-center w-full max-w-3xl text-center rounded-2xl overflow-hidden p-10 sm:p-16">
                        <div className="relative z-10 flex flex-col items-center">
                            <span className="mb-4 rounded-full bg-teal-500/10 px-3 py-1 text-[10px] font-mono tracking-widest text-teal-400 border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                                NOVO RECURSO
                            </span>
                            
                            <h1 className="font-semibold text-4xl sm:text-5xl text-white tracking-tight leading-tight mb-6">
                                Rastreie a origem de <br className="hidden sm:block"/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                    qualquer foto em segundos
                                </span>
                            </h1>
                            
                            <p className="text-gray-400 mb-10 max-w-lg text-sm sm:text-base">
                                Faça o upload da imagem para fazer uma varredura e encontrar a fonte original e os metadados.
                            </p>
                            
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                disabled={isUploading}
                                className="group relative flex items-center justify-center gap-2 rounded-full bg-[#0D1017] cursor-pointer border border-(--border-color) px-8 py-4 text-sm font-medium text-white transition-all duration-200 hover:bg-[#07090e] hover:border-white/15 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>Enviar imagem</span>
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>

                            {/* Error Message */}
                            {error && (
                                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}
                        </div>
                    </section>
                </main>
            </div>
            
            {/* Upload Modal */}
            <UploadModal 
                isOpen={isModalOpen}
                onClose={() => !isUploading && setIsModalOpen(false)}
                onUpload={handleUpload}
                isUploading={isUploading}
            />
        </div>
    );
}