import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// import Home from "../pages/Home";

const LazyLoginPage = lazy(() => import('../pages/Index'));
const LazyHome = lazy(() => import('../pages/Home'));
const LazyPrestamos = lazy(() => import('../pages/prestamosPage/PrestamosPage'));
const LazyHabitos = lazy(() => import('../pages/habitosPage/HabitosPage'));

export const router = createBrowserRouter([
    {
        path: '/',
        element: <LazyLoginPage />,
    },
    {
        path: '/home',
        element: <LazyHome />,
    },
    {
        path: '/prestamos',
        element: <LazyPrestamos />,
    },
    {
        path: '/habitos',
        element: <LazyHabitos />,
    },
]);
