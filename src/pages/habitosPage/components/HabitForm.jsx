import React from 'react';

const HabitForm = ({ onOpenModal }) => {
    return (
        <button
            onClick={onOpenModal}
            className="bg-gray-800 text-white px-4 py-2 cursor-pointer mb-2 rounded hover:bg-gray-700 transition"
        >
            Añadir hábitos del día
        </button>
    );
};

export default HabitForm;
