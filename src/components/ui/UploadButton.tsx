'use client';

import React, { useState, useRef } from 'react';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => void;
    isUploading?: boolean;
}

export const UploadModal: React.FC<UploadModalProps> = ({ 
    isOpen, 
    onClose, 
    onUpload,
    isUploading = false 
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileSelect = (file: File) => {
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        const maxSize = 25 * 1024 * 1024; // 25MB

        if (!validTypes.includes(file.type)) {
            alert('Formato não suportado. Use PNG, JPG ou JPEG.');
            return;
        }

        if (file.size > maxSize) {
            alert('Arquivo muito grande. Tamanho máximo: 25MB');
            return;
        }

        setSelectedFile(file);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUpload = () => {
        if (selectedFile && !isUploading) {
            onUpload(selectedFile);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-md mx-4">
                <div className="bg-(--bg-color) rounded-2xl shadow-2xl border border-(--border-color)">
                    <div className="px-8 pt-8 pb-4">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h2 className="text-2xl font-semibold text-white mb-1">
                                    {isUploading ? 'Analisando imagem...' : 'Enviar foto'}
                                </h2>
                                <p className="text-sm text-gray-400">
                                    {isUploading 
                                        ? 'Aguarde enquanto extraímos os metadados' 
                                        : 'Apenas imagens são aceitas.'
                                    }
                                </p>
                            </div>
                            {!isUploading && (
                                <button
                                    onClick={onClose}
                                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="px-8 pb-6">
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-xl p-12 transition-all ${
                                isDragging 
                                    ? 'border-teal-500 bg-teal-500/5' 
                                    : 'border-gray-600 bg-(--bg-color)'
                            } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            {isUploading ? (
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="mb-4">
                                        <div className="w-16 h-16 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
                                    </div>
                                    <p className="text-gray-300 text-base mb-1">
                                        Processando imagem...
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        Extraindo metadados EXIF
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="mb-4">
                                        <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>

                                    <p className="text-gray-300 text-base truncate w-[75%] mb-1">
                                        {selectedFile ? selectedFile.name : 'Solte a foto aqui'}
                                    </p>
                                    <p className="text-gray-500 text-sm mb-4">ou buscar imagem</p>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg"
                                        onChange={handleFileInputChange}
                                        className="hidden"
                                        id="file-upload"
                                        disabled={isUploading}
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg cursor-pointer transition-colors"
                                    >
                                        Escolher foto
                                    </label>
                                </div>
                            )}
                        </div>

                        {!isUploading && (
                            <div className="mt-6 space-y-2">
                                <p className="text-sm text-gray-400">
                                    Formatos suportados: <span className="text-teal-400">PNG, JPG, JPEG</span>
                                </p>
                                <p className="text-sm text-gray-400">
                                    Tamanho máximo: <span className="text-teal-400">25MB</span>
                                </p>
                            </div>
                        )}

                        {!isUploading && (
                            <div className="flex items-center justify-between mt-8">
                                <button
                                    onClick={handleReset}
                                    className="flex cursor-pointer items-center gap-2 px-6 py-2.5 text-white text-sm hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Resetar
                                </button>

                                <button
                                    onClick={handleUpload}
                                    disabled={!selectedFile || isUploading}
                                    className={`flex items-center gap-2 px-8 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                        selectedFile && !isUploading
                                            ? 'bg-teal-600 hover:bg-teal-700 text-white cursor-pointer'
                                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    Enviar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};