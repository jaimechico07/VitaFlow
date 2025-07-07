import React from 'react';
import IconMapper from '../mapper/IconMapper';
import { Tooltip } from 'react-tooltip';
import { CircleMinus } from 'lucide-react';
import { getRandomColor } from '../utils/Utils';

const HabitCard = ({ habit, deleteHabitCard }) => {
    const date = new Date(habit.createdAt);
    const formattedDate = date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="p-4 bg-gray-700 shadow rounded-lg hover:bg-gray-600 transition-colors">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{formattedDate}</h2>
                <CircleMinus onClick={() => deleteHabitCard(habit.id)} size={12} className={`inline cursor-pointer ${getRandomColor()}`} />
            </div>
            <ul className="list-none pl-5 space-y-2">
                {habit.habits.map((h, index) => (
                    <li
                        key={index}
                        className="flex items-center gap-2 group"
                        data-tooltip-id={`habit-note-${habit.id}-${index}`}
                        data-tooltip-content={h.note || "No hay notas registradas"}
                        data-tooltip-place="right"
                    >
                        <IconMapper
                            iconName={h.icon}
                            className={`${getRandomColor()} flex-shrink-0`}
                        />
                        <span className="truncate cursor-pointer">{h.name}</span>

                        {h.note && (
                            <>
                                <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    (ver nota)
                                </span>
                                <Tooltip
                                    id={`habit-note-${habit.id}-${index}`}
                                    className="max-w-xs z-50 !bg-gray-800 !text-white !opacity-100 !rounded-lg"
                                    delayShow={300}
                                />
                            </>
                        )}

                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HabitCard;