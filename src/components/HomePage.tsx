import React from 'react';

export const HomePage = () => {
    return(
        <div className="min-h-screen text-white font-sans relative pb-24">
            
            {/* Elementos decorativos (Miras nos cantos, igual à imagem) */}
            <div className="absolute top-10 left-10 text-white/90 pointer-events-none z-20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2V22M2 12H22"/></svg>
            </div>
            <div className='absolute top-0 h-full w-px left-[51.48px] pointer-events-none bg-neutral-800 z-10'></div>

            <div className="absolute top-10 right-10 text-white/90 pointer-events-none z-20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2V22M2 12H22"/></svg>
            </div>

            <div className='absolute top-0 h-full w-px right-[51.48px] pointer-events-none bg-neutral-800 z-10'></div>

            <div className="max-w-7xl w-full mx-auto relative px-4 sm:px-6">
                
                {/* HEADER */}
                <header className="w-full pt-8 pb-16">
                    <h2 className="text-white font-semibold text-xl tracking-wide">HuskyTrace</h2>
                </header>
                
                {/* HERO SECTION - Sua interface original com a estética da imagem */}
                <main className="flex flex-col items-center justify-center mb-32">
                    <section className="relative flex flex-col items-center w-full max-w-3xl text-center rounded-2xl overflow-hidden p-10 sm:p-16">
                        {/* Efeito de brilho azul no fundo do card principal */}                        
                        <div className="relative z-10 flex flex-col items-center">
                            <span className="mb-6 rounded-full bg-teal-500/10 px-3 py-1 text-[10px] font-mono tracking-widest text-teal-400 border border-teal-500/20">
                                NOVO RECURSO
                            </span>
                            
                            <h1 className="font-semibold text-4xl sm:text-5xl text-white tracking-tight leading-tight mb-6">
                                Rastreie a origem de <br className="hidden sm:block"/>
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">
                                    qualquer foto em segundos
                                </span>
                            </h1>
                            
                            <p className="text-gray-400 mb-10 max-w-lg text-sm sm:text-base">
                                Faça o upload da imagem para fazer uma varredura e encontrar a fonte original e os metadados.
                            </p>
                            
                            <button className="group relative flex items-center justify-center gap-2 rounded-xl cursor-pointer border border-white/10 px-8 py-4 text-sm font-medium text-white transition-all duration-200 hover:bg-[#07090e] hover:border-white/15 overflow-hidden shadow-lg">
                                <span>Enviar imagem</span>
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </section>
                </main>

                {/* PRICING SECTION - Replicada exatamente da imagem de referência */}
                
            </div>
            {/* <div className="fixed bottom-0 left-0 w-full h-20 blur-3xl bg-gradient-to-t from-[#E3EFFB] via-[#4175af] via-[#3571B7]/30 to-transparent pointer-events-none z-0"></div> */}
        </div>
    );
}