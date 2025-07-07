import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { ref, push, onValue, update, remove } from 'firebase/database';
import { useAuthStore } from '../../store/useAuthStore';
import Header from '../../components/Header';
import HabitForm from './components/HabitForm';
import HabitCard from './components/HabitCard';
import HabitModal from './components/HabitModal';
import { toast } from 'sonner';

const HabitosPage = () => {
    const { user, loading } = useAuthStore();
    const [habits, setHabits] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (user && !loading) {
            const habitsRef = ref(db, 'habitRecords');
            const listener = onValue(habitsRef, (snapshot) => {
                const data = snapshot.val();
                const lista = data
                    ? Object.entries(data)
                        .map(([id, item]) => ({ id, ...item }))
                        .filter(item => item.usuarioId === user.uid)
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    : [];
                setHabits(lista);
            });

            return () => listener();
        }
    }, [user, loading]);

    const handleSaveHabits = (completedHabits) => {
        return new Promise((resolve, reject) => {
            if (user && completedHabits.length > 0) {
                const habitRef = ref(db, 'habitRecords');
                const newHabitRef = push(habitRef);
                const habitData = {
                    habits: completedHabits,
                    usuarioId: user.uid,
                    createdAt: new Date().toISOString()
                };

                update(newHabitRef, habitData)
                    .then(() => {
                        setIsModalOpen(false);
                        resolve();
                    })
                    .catch(error => {
                        console.error("Error saving habits:", error);
                        reject(error);
                    });
            } else {
                reject("No hay hábitos para guardar");
            }
        });
    };

    const deleteHabitCard = (habitId) => {
        toast.warning(`¿Eliminar habitos?`, {
            duration: Infinity, // Permanece hasta que el usuario interactúe
            action: {
                label: 'Confirmar',
                onClick: async () => {
                    const loadingToast = toast.loading('Eliminando...');
                    try {
                        await remove(ref(db, `habitRecords/${habitId}`));
                        toast.success(`Habitos eliminados`, { id: loadingToast });
                    } catch (error) {
                        console.error('Error:', error);
                        toast.error(`Error al eliminar`, { id: loadingToast });
                    }
                }
            },
            cancel: {
                label: 'Cancelar',
                onClick: () => toast.dismiss()
            }
        });
    };

    return (
        <>
            <div className="w-auto m-auto p-5 text-[#eee] bg-[#121212] font-poppins flex flex-col min-h-screen ">
                <Header title="Gestión de Hábitos" />
                <main className="py-[80px]">
                    <div className="flex justify-end">
                        <HabitForm
                            onOpenModal={() => setIsModalOpen(true)}
                        />
                    </div>

                    {habits.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No hay hábitos registrados aún</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="mt-4 bg-gray-800 text-white px-4 py-2 cursor-pointer rounded hover:bg-gray-700 duration-300 ease-in-out"
                            >
                                Registrar mis primeros hábitos
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {habits.map((habit) => (
                                <HabitCard key={habit.id} habit={habit} deleteHabitCard={() => deleteHabitCard(habit.id)} />
                            ))}
                        </div>
                    )}

                    {user && (
                        <HabitModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSave={handleSaveHabits}
                            db={db}
                            user={user}
                        />
                    )}
                </main>
            </div>
        </>
    );
};

export default HabitosPage;