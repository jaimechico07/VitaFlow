
import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';

const IconPickerModal = ({ onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const iconEntries = Object.entries(FaIcons)
        .filter(([name]) => name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 h-auto">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] flex gap-2 flex-col">
                <h3 className="text-lg font-bold mb-4 text-[#121212] ">Seleccionar icono</h3>
                <input
                    type="text"
                    placeholder="Buscar icono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border rounded border-[#121212] text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:border-[#3498db]"
                />
                <div className="grid grid-cols-5 gap-3 overflow-y-auto flex-1 ">
                    {iconEntries.map(([name, Icon]) => (
                        <button
                            key={name}
                            onClick={() => onSelect(name)}
                            className="flex flex-col items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                            title={name}
                        >
                            <Icon className="text-xl text-[#121212]" />
                            <span className="text-xs mt-1 truncate w-full text-[#121212]">{name}</span>
                        </button>
                    ))}
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-[#616161] text-white rounded hover:bg-[#3498db] duration-300 ease-in-out"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default IconPickerModal;