'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ImageMetadata {
    fileName: string;
    fileSize: number;
    fileSizeFormatted: string;
    format: string;
    dimensions: {
        width: number;
        height: number;
    };
    exif?: {
        dateTaken?: string;
        camera?: {
            make?: string;
            model?: string;
        };
        settings?: {
            iso?: number;
            aperture?: number;
            shutterSpeed?: string;
            focalLength?: number;
            flash?: boolean;
        };
        software?: string;
        orientation?: number;
    };
    location?: {
        latitude: number;
        longitude: number;
        altitude?: number;
        address?: string;
    };
}

const getOrientationText = (orientation: number): string => {
    const orientations: Record<number, string> = {
        1: 'Normal',
        2: 'Invertido Horizontalmente',
        3: 'Rotacionado 180°',
        4: 'Invertido Verticalmente',
        5: 'Espelhado e Rotacionado 270° CW',
        6: 'Rotacionado 90° CW',
        7: 'Espelhado e Rotacionado 90° CW',
        8: 'Rotacionado 270° CW'
    };
    return orientations[orientation] || `Valor ${orientation}`;
};

export default function ResultsPage() {
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState<string>('');
    const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedImage = localStorage.getItem('uploadedImage');
        const storedMetadata = localStorage.getItem('metadata');

        if (!storedImage || !storedMetadata) {
            router.push('/');
            return;
        }

        const parsedMetadata = JSON.parse(storedMetadata);

        setImageUrl(storedImage);
        setMetadata(parsedMetadata);
        setLoading(false);

    }, [router]);

    if (loading || !metadata) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white">Carregando...</div>
            </div>
        );
    }

    const hasExif = metadata.exif && Object.keys(metadata.exif).length > 0;
    const hasLocation = metadata.location && metadata.location.latitude !== undefined;

    return (
        <div className="min-h-screen text-white font-sans relative">
            {/* <div className="absolute top-10 left-10 text-white/90 pointer-events-none z-20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M12 2V22M2 12H22"/>
                </svg>
            </div>
            <div className='absolute top-0 h-full w-px left-[51.48px] pointer-events-none bg-neutral-800 z-10'></div>

            <div className="absolute top-10 right-10 text-white/90 pointer-events-none z-20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M12 2V22M2 12H22"/>
                </svg>
            </div>
            <div className='absolute top-0 h-full w-px right-[51.48px] pointer-events-none bg-neutral-800 z-10'></div> */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <header className="w-full pt-8 pb-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-white font-semibold text-xl tracking-wide">HuskyTrace</h2>
                        <button 
                            onClick={() => router.push('/')}
                            className="text-gray-400 cursor-pointer hover:bg-gray-800/20 p-3 rounded-full hover:text-white transition-colors text-sm flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Voltar
                        </button>
                    </div>
                </header>

                <div className="mb-12">
                    <span className="inline-block mb-4 rounded-full bg-teal-500/10 px-3 py-1 text-[10px] font-mono tracking-widest text-teal-400 border border-teal-500/20">
                        RELATÓRIO DE ANÁLISE
                    </span>
                    <h1 className="text-4xl font-semibold text-white mb-3">
                        Análise Completa da Imagem
                    </h1>
                    <p className="text-gray-400 text-base">
                        Todos os metadados e informações extraídas da imagem
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    <div className="space-y-6">
                        <div className="bg-[#0d1116]/90 border border-(--border-color) rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Imagem Original
                            </h3>
                            <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden">
                                <img 
                                    src={imageUrl} 
                                    alt="Uploaded" 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        <div className="bg-[#0d1116]/90 border border-(--border-color) rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Informações Básicas
                            </h3>
                            <div className="space-y-3">
                                <InfoRow label="Nome do arquivo" value={metadata.fileName} />
                                <InfoRow label="Tamanho" value={metadata.fileSizeFormatted} />
                                <InfoRow label="Formato" value={metadata.format} />
                                <InfoRow label="Dimensões" value={`${metadata.dimensions.width} x ${metadata.dimensions.height}`} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-[#0d1116]/90 border border-(--border-color) rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Metadados EXIF
                            </h3>
                            <div className="space-y-3">
                                {hasExif ? (
                                    <>
                                        {metadata.exif?.dateTaken && (
                                            <InfoRow label="Data da foto" value={metadata.exif.dateTaken} />
                                        )}
                                        {metadata.exif?.camera && (metadata.exif.camera.make || metadata.exif.camera.model) && (
                                            <InfoRow 
                                                label="Câmera" 
                                                value={`${metadata.exif.camera.make || ''} ${metadata.exif.camera.model || ''}`.trim()} 
                                            />
                                        )}
                                        {metadata.exif?.orientation !== undefined && (
                                            <InfoRow label="Orientação" value={getOrientationText(metadata.exif.orientation)} />
                                        )}
                                        {metadata.exif?.settings?.iso && (
                                            <InfoRow label="ISO" value={metadata.exif.settings.iso} />
                                        )}
                                        {metadata.exif?.settings?.aperture && (
                                            <InfoRow label="Abertura" value={`f/${metadata.exif.settings.aperture.toFixed(1)}`} />
                                        )}
                                        {metadata.exif?.settings?.shutterSpeed && (
                                            <InfoRow label="Velocidade do obturador" value={metadata.exif.settings.shutterSpeed} />
                                        )}
                                        {metadata.exif?.settings?.focalLength && (
                                            <InfoRow label="Distância focal" value={`${metadata.exif.settings.focalLength}mm`} />
                                        )}
                                        {metadata.exif?.settings?.flash !== undefined && (
                                            <InfoRow label="Flash" value={metadata.exif.settings.flash ? 'Disparou' : 'Não disparou'} />
                                        )}
                                        {metadata.exif?.software && (
                                            <InfoRow label="Software" value={metadata.exif.software} />
                                        )}
                                    </>
                                ) : (
                                    <div>
                                        <p className="text-gray-500 text-sm">Nenhum metadado EXIF disponível para esta imagem.</p>
                                        <p className='text-sm text-gray-500 pt-1'>Lembre-se: As redes sociais removem os metadados das fotos após o envio.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {hasLocation && metadata.location && (
                            <div className="bg-[#141414] border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Localização GPS
                                </h3>
                                
                                <div className="relative aspect-video bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg overflow-hidden mb-4">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <svg className="w-12 h-12 text-red-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            <p className="text-gray-400 text-sm">Mapa da localização</p>
                                            <p className="text-gray-500 text-xs mt-1">
                                                {metadata.location.latitude.toFixed(6)}, {metadata.location.longitude.toFixed(6)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <InfoRow 
                                        label="Coordenadas" 
                                        value={`${metadata.location.latitude.toFixed(6)}, ${metadata.location.longitude.toFixed(6)}`} 
                                    />
                                    {metadata.location.altitude !== undefined && (
                                        <InfoRow label="Altitude" value={`${metadata.location.altitude.toFixed(1)}m`} />
                                    )}
                                    {metadata.location.address && (
                                        <InfoRow label="Endereço" value={metadata.location.address} />
                                    )}
                                </div>

                                <a
                                    href={`https://www.google.com/maps?q=${metadata.location.latitude},${metadata.location.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors"
                                >
                                    Ver no Google Maps
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        )}

                        <div className="bg-gradient-to-br from-teal-500/10 to-blue-500/10 border border-teal-500/20 rounded-2xl p-6">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold mb-1">Análise Concluída</h4>
                                    <p className="text-gray-400 text-sm">
                                        {hasExif 
                                            ? 'Metadados detectados processados com sucesso.'
                                            : 'Esta imagem não contém metadados adicionais.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const InfoRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between items-start py-2 border-b border-white/5">
        <span className="text-gray-400 text-sm">{label}</span>
        <span className="text-white text-sm font-medium text-right max-w-[60%] break-words">{value}</span>
    </div>
);