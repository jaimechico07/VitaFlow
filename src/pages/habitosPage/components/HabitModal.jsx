import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { toast } from 'sonner';
import IconMapper from '../mapper/IconMapper';
import { CircleMinus } from 'lucide-react';
import IconPickerModal from './IconPickerModal';
import { getRandomColor } from '../utils/Utils';

const HabitModal = ({ isOpen, onClose, onSave, db, user }) => {
    const [habitsList, setHabitsList] = useState([]);
    const [originalHabits, setOriginalHabits] = useState([]);
    const [newHabit, setNewHabit] = useState({ name: '', icon: 'FaCircle', note: '', completed: false });
    //const [selectedIcon, setSelectedIcon] = useState('FaCircle');
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [editingNoteIndex, setEditingNoteIndex] = useState(null);


    const confirmAction = (message) => {
        return new Promise((resolve) => {
            toast.warning(`${message}`, {
                duration: 3500,
                action: {
                    label: 'Confirmar',
                    onClick: () => resolve(true)
                },
                cancel: {
                    label: 'Cancelar',
                    onClick: () => resolve(false)
                }
            });
        });
    };

    const handleCancel = () => {
        // Restauramos los hábitos a su versión original
        setHabitsList([...originalHabits]);
        setNewHabit({ name: '', icon: 'FaCircle', note: '', completed: false });
        setEditingNoteIndex(null);
        onClose();
    };

    useEffect(() => {
        if (isOpen && user) {
            const toastId = toast.loading('Cargando tus hábitos...');
            const userHabitsRef = ref(db, `userHabits/${user.uid}`);

            const unsubscribe = onValue(userHabitsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    // 1. Creamos copia profunda de los hábitos con notas vacías si no existen
                    const loadedHabits = data.habits.map(habit => ({
                        ...habit,
                        note: habit.note || '',
                        completed: false // Resetear estado completado al cargar
                    }));

                    // 2. Actualizamos ambos estados (temporal y original)
                    setHabitsList([...loadedHabits]);
                    setOriginalHabits([...loadedHabits]);
                } else {
                    // 3. Hábitos por defecto si no existen
                    const defaultHabits = [
                        { name: 'Ducharse', icon: 'FaShower', note: '', completed: false },
                        { name: 'Leer', icon: 'FaBook', note: '', completed: false },
                        { name: 'Ejercicio', icon: 'FaRunning', note: '', completed: false },
                        { name: 'Meditación', icon: 'FaBrain', note: '', completed: false },
                    ];
                    setHabitsList([...defaultHabits]);
                    setOriginalHabits([...defaultHabits]);
                    update(userHabitsRef, { habits: defaultHabits })
                        .then(() => toast.success('Hábitos iniciales creados'));
                }
                toast.dismiss(toastId);
            }, (error) => {
                toast.dismiss(toastId);
                toast.error('Error cargando hábitos');
                console.error(error);
            });

            return () => {
                unsubscribe();
                // 4. Limpieza opcional al desmontar
                setEditingNoteIndex(null);
            };
        }
    }, [isOpen, user, db]); // Solo se ejecuta cuando el modal se abre o cambia el usuario

    const handleCheckChange = (index) => {
        const updatedHabits = [...habitsList];
        updatedHabits[index].completed = !updatedHabits[index].completed;
        setHabitsList(updatedHabits);
    };

    const addCustomHabit = () => {

        if (newHabit.name.trim() === '') {
            toast.warning('Por favor escribe un hábito');
            return;
        }

        const exists = habitsList.some(habit => habit.name.toLowerCase() === newHabit.name.toLowerCase());
        if (exists) return toast.error('¡Este hábito ya existe!');

        toast.promise(
            new Promise((resolve) => {
                const newHabitItem = {
                    ...newHabit,  // Usamos el objeto completo
                    name: newHabit.name.trim()
                };
                const updatedHabits = [...habitsList, newHabitItem];

                const userHabitsRef = ref(db, `userHabits/${user.uid}`);
                update(userHabitsRef, { habits: updatedHabits })
                    .then(() => {
                        setHabitsList(updatedHabits);
                        setNewHabit({ name: '', icon: 'FaCircle', note: '', completed: false });
                        resolve();
                    })
                    .catch(error => {
                        console.error("Error adding habit:", error);
                        throw error;
                    });
            }),
            {
                loading: 'Añadiendo hábito...',
                success: 'Hábito añadido correctamente',
                error: 'Error al añadir el hábito'
            }
        );
    };


    const removeHabit = async (index) => {
        try {
            const habitToRemove = habitsList[index].name;
            const isConfirmed = await confirmAction(`¿Estás seguro que quieres eliminar el hábito "${habitToRemove}"?`);

            if (!isConfirmed) {
                toast.info('Acción cancelada');
                return;
            }

            const toastId = toast.loading('Eliminando hábito...');

            const updatedHabits = habitsList.filter((_, i) => i !== index);
            const userHabitsRef = ref(db, `userHabits/${user.uid}`);

            await update(userHabitsRef, { habits: updatedHabits });
            setHabitsList(updatedHabits);

            toast.dismiss(toastId);
            toast.success('Hábito eliminado correctamente');
        } catch (error) {
            toast.error('Error al eliminar el hábito');
            console.error("Error removing habit:", error);
        }
    };

    const updateHabitNote = (index, note) => {
        const updatedHabits = [...habitsList];
        updatedHabits[index].note = note;
        setHabitsList(updatedHabits);

    };

    const handleSave = () => {
        const completedHabits = habitsList
            .filter(habit => habit.completed)
            .map(habit => ({ name: habit.name, icon: habit.icon, note: habit.note }));

        if (completedHabits.length === 0) {
            toast.warning('No has seleccionado ningún hábito');
            return;
        }

        toast.promise(
            new Promise((resolve) => {
                onSave(completedHabits);
                resolve();
            }),
            {
                loading: 'Guardando hábitos...',
                success: 'Hábitos guardados correctamente',
                error: 'Error al guardar los hábitos'
            }
        );
    };

    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl text-[#121212] font-bold mb-4">Registrar hábitos del día</h2>

                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {habitsList.map((habit, index) => (
                        <div key={index} className="group">
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center ">
                                    <input
                                        type="checkbox"
                                        id={`habit-${index}`}
                                        checked={habit.completed}
                                        onChange={() => handleCheckChange(index)}
                                        className="mr-3 cursor-pointer "
                                    />
                                    <IconMapper iconName={habit.icon} className={`${getRandomColor()}`} />
                                    <label className="cursor-pointer ml-1 text-[#121212]" htmlFor={`habit-${index}`}>{habit.name}</label>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => {
                                            setEditingNoteIndex(editingNoteIndex === index ? null : index);
                                        }}
                                        className="text-gray-500 hover:text-blue-500 mr-2 cursor-pointer"
                                        title={habit.note ? "Editar nota" : "Añadir nota"}
                                    >
                                        {habit.note ? "📝" : "✏️"}
                                    </button>
                                    <CircleMinus size={16} onClick={() => removeHabit(index)}
                                        className="text-[#616161] cursor-pointer  duration-300 ease-in-out  transition-opacity"
                                        title="Eliminar hábito" />
                                </div>
                            </div>
                            {editingNoteIndex === index && (
                                <div className="mt-2">
                                    <textarea
                                        value={habit.note}
                                        onChange={(e) => updateHabitNote(index, e.target.value)}
                                        placeholder="Añade una nota..."
                                        className="w-full p-2 text-sm border border-[#3498db] focus:border-[#3498db] focus:outline-none focus:ring-1 focus:ring-[#3498db]  text-[#121212] rounded box-border"
                                        rows="2"
                                    />
                                    <div className="flex justify-center mt-1">

                                        <CircleMinus onClick={() => setEditingNoteIndex(null)} size={12} className="inline cursor-pointer text-[#121212]" />


                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowIconPicker(true)}
                            className={`p-2 border rounded cursor-pointer duration-300 ease-in-out ${newHabit.icon === 'FaCircle' ? 'bg-[#616161]' : 'bg-[#616161]'
                                }`}
                            title="Seleccionar icono"
                        >
                            <IconMapper iconName={newHabit.icon} />
                        </button>
                    </div>
                    <input
                        type="text"
                        value={newHabit.name}
                        onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                        placeholder="Añadir hábito personalizado"
                        className="flex-1 p-2 border rounded border-[#121212] text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#616161] focus:border-[#616161]"
                        onKeyPress={(e) => e.key === 'Enter' && addCustomHabit()}
                    />
                    <button
                        onClick={addCustomHabit}
                        className="bg-gray-800 px-4 py-2 cursor-pointer rounded hover:bg-gray-700 duration-300 ease-in-out"
                        title="Añadir nuevo hábito"
                    >
                        +
                    </button>
                </div>
                {showIconPicker && (
                    <IconPickerModal
                        onClose={() => setShowIconPicker(false)}
                        onSelect={(iconName) => {
                            setNewHabit({ ...newHabit, icon: iconName });
                            setShowIconPicker(false);
                        }}
                    />
                )}

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => {
                            handleCancel();
                        }}
                        className="px-4 py-2 border border-[#616161] cursor-pointer text-[#616161] hover:text-white hover:bg-[#616161] rounded duration-300 ease-in-out"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-gray-800 text-white px-4 py-2 cursor-pointer rounded hover:bg-gray-700 duration-300 ease-in-out"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};



export default HabitModal;