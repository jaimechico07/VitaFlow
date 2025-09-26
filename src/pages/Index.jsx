// src/pages/Index.jsx (antes era LoginPage.jsx)
import React from 'react';
import { auth, provider } from "../firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import { Toaster, toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import "../App.css";

const LoginPage = () => {
    const navigate = useNavigate();

    const login = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                toast.success(`Bienvenido ${result.user.displayName}`);
                navigate('/home');  // Redirige al home o a /prestamos si prefieres
            })
            .catch(() => {
                toast.error("Error al iniciar sesión");
            });
    };

    return (
        <div className="login-container ">
            <h2>Bienvenido</h2>
            <p>Por favor, inicia sesión para continuar</p>
            <button onClick={login} className="btn-google">
                <span>Iniciar sesión con</span>
                <img src="/google.png" alt="Google" />
            </button>
            <Toaster richColors />
        </div>
    );
};

export default LoginPage;
