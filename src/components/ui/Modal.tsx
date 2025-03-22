import React from 'react';

interface ModalWrapperProps {
    children: React.ReactNode;
    onClose: () => void;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-md max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end">
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <span className="sr-only">Close</span> ×
                </button>
            </div>
            {children}
        </div>
    </div>
);

export default ModalWrapper;
