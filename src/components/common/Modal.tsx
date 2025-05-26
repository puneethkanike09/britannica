"use client"

import type React from "react"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    className?: string
}

export function Modal({ isOpen, title, children, className = "" }: ModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className={`bg-white rounded-lg shadow-lg w-full max-w-md py-12 px-16 relative ${className}`}>
                {title && (
                    <div className="text-left  mb-6">
                        <h2 className="text-3xl font-bold text-textColor">{title}</h2>
                    </div>
                )}
                {children}
            </div>
        </div>
    )
}