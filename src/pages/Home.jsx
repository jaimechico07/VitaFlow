import React from 'react';
import { Link } from 'react-router-dom';
import { Toaster } from 'sonner';
import Header from '../components/Header';

const Home = () => {
    return (
        <>
            <Header title="Bienvenido" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100">
                <div className="bg-white p-10 md:p-14 rounded-3xl shadow-xl w-full max-w-md text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-8">
                        Bienvenido a Vita Flow
                    </h1>
                    <div className="flex flex-col gap-4">
                        <Link
                            to="/prestamos"
                            className="inline-flex text-decoration-none gap-3 items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-4 rounded-full shadow-lg hover:scale-105 hover:brightness-110 transition-all duration-300 ease-in-out"
                        >
                            Ir a Gestión de Préstamos
                        </Link>
                        <Link
                            to="/habitos"
                            className="inline-flex text-decoration-none gap-3 items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-4 rounded-full shadow-lg hover:scale-105 hover:brightness-110 transition-all duration-300 ease-in-out"
                        >
                            Ir a Gestión de Hábitos
                        </Link>
                    </div>
                    <Toaster richColors position="bottom-right" expand={true} />
                </div>
            </div>
        </>
    );
};

export default Home;
