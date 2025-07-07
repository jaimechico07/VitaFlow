// src/App.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { ref, push, onValue, update } from "firebase/database";
import { toast } from 'sonner';
import Header from "../../components/Header";


import { useAuthStore } from "../../store/useAuthStore";
import ModalPrestamo from "./components/ModalPrestamo";
import ModalPagos from "./components/ModalPagos";
import FormPrestamos from "./components/FormPrestamos";
import Tables from "./components/Tables";
import "../../App.css";

function PrestamosPage() {
    const { user, loading } = useAuthStore();
    const [prestamos, setPrestamos] = useState([]);
    const [activeTab, setActiveTab] = useState("activos");
    const [modoModal, setModoModal] = useState("pago");
    const [form, setForm] = useState({
        persona: "",
        monto: "",
        fechaPrestamo: "",
        fechaLimite: ""
    });

    const [modalPrestamo, setModalPrestamo] = useState(null);
    const [modalVerPagos, setModalVerPagos] = useState(null);
    const [nuevoDetalle, setNuevoDetalle] = useState({ monto: "", descripcion: "" });

    useEffect(() => {
        if (user && !loading) {
            const prestamosRef = ref(db, "prestamos");
            const listener = onValue(prestamosRef, (snapshot) => {
                const data = snapshot.val();
                const lista = data
                    ? Object.entries(data)
                        .map(([id, item]) => ({ id, ...item }))
                        .filter(item => item.usuarioId === user.uid)
                    : [];
                setPrestamos(lista);
            });

            return () => listener();
        }
    }, [user, loading]);

    if (loading) {
        return <p>Cargando usuario...</p>;
    }

    if (!user) {
        return <p>No has iniciado sesión.</p>;
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validarFormularioPrestamo = (form) => {
        const monto = parseFloat(form.monto);
        const montoValido = !isNaN(monto) && monto > 0;

        const validaciones = {
            persona: form.persona.trim() ? null : "Por favor, ingresa la persona o entidad.",
            monto: montoValido ? null : "Ingresa un monto válido.",
            fechaPrestamo: form.fechaPrestamo ? null : "Selecciona la fecha del préstamo.",
            fechaLimite: form.fechaLimite ? null : "Selecciona la fecha límite."
        };

        return Object.values(validaciones).find(mensaje => mensaje) || null;
    };

    const registrarPrestamo = (e) => {
        e.preventDefault();

        const error = validarFormularioPrestamo(form);
        if (error) {
            toast.error(error);
            return;
        }
        const monto = parseFloat(form.monto);
        const nuevoPrestamo = {
            ...form,
            monto,
            saldo: monto,
            estado: "Pendiente",
            pagos: [],
            visible: true,
            usuarioId: user.uid
        };
        push(ref(db, "prestamos"), nuevoPrestamo);
        setForm({ persona: "", monto: "", fechaPrestamo: "", fechaLimite: "" });
    };

    const actualizarPrestamo = (prestamo, nuevosPagos) => {
        const totalPagado = nuevosPagos
            .filter(p => p.tipo === "Pago")
            .reduce((acc, p) => acc + p.monto, 0);
        const saldo = prestamo.monto - totalPagado;
        const estado = saldo === 0 ? "Cancelado" : totalPagado > 0 ? "En Proceso" : "Pendiente";

        update(ref(db, `prestamos/${prestamo.id}`), { pagos: nuevosPagos, saldo, estado });
    };

    const confirmarOperacion = () => {
        const prestamo = modalPrestamo;
        const monto = parseFloat(nuevoDetalle.monto);
        const descripcion = nuevoDetalle.descripcion;

        if (isNaN(monto) || monto <= 0) {
            toast.error("Ingresa un monto válido.");
            return;
        }

        if (!descripcion) {
            toast.error("Ingresa una descripción.");
            return;
        }

        if (modoModal === "monto") {
            toast("¿Estás seguro de agregar este monto al préstamo?", {
                action: {
                    label: "Sí, confirmar",
                    onClick: () => {
                        const nuevoPago = {
                            monto,
                            fecha: new Date().toISOString().split('T')[0],
                            descripcion,
                            tipo: "Monto"
                        };
                        const pagosActualizados = prestamo.pagos ? [...prestamo.pagos, nuevoPago] : [nuevoPago];
                        update(ref(db, `prestamos/${prestamo.id}`), {
                            monto: prestamo.monto + monto,
                            saldo: prestamo.saldo + monto,
                            pagos: pagosActualizados
                        });
                        setModalPrestamo(null);
                        setNuevoDetalle({ monto: "", descripcion: "" });
                        toast.success("Monto agregado correctamente");
                    }
                },
                cancel: { label: "Cancelar" }
            });
        } else {
            if (!descripcion) {
                toast.error("Ingresa una descripción.");
                return;
            }

            const saldoActual = prestamo.monto - (prestamo.pagos?.filter(p => p.tipo === "Pago").reduce((acc, p) => acc + p.monto, 0) || 0);
            if (monto > saldoActual) {
                toast.error(`El pago excede el saldo pendiente (${saldoActual}).`);
                return;
            }

            toast("¿Estás seguro de registrar este pago?", {
                action: {
                    label: "Sí, confirmar",
                    onClick: () => {
                        const nuevoPago = {
                            monto,
                            fecha: new Date().toISOString().split('T')[0],
                            descripcion,
                            tipo: "Pago"
                        };
                        const pagosActualizados = prestamo.pagos ? [...prestamo.pagos, nuevoPago] : [nuevoPago];
                        actualizarPrestamo(prestamo, pagosActualizados);
                        setModalPrestamo(null);
                        setNuevoDetalle({ monto: "", descripcion: "" });
                        toast.success("Pago registrado correctamente");
                    }
                },
                cancel: { label: "Cancelar" }
            });
        }
    };

    const prestamosActivos = prestamos.filter(p => p.visible && p.estado !== "Cancelado");
    const prestamosCancelados = prestamos.filter(p => p.estado === "Cancelado");

    return (
        <>
            <div className="container-prestamos">
                <Header title="Gestión de Préstamos" />
                <FormPrestamos registrarPrestamo={registrarPrestamo} form={form} handleChange={handleChange} />

                <Tables
                    prestamosActivos={prestamosActivos}
                    prestamosCancelados={prestamosCancelados}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    setModalPrestamo={setModalPrestamo}
                    setModoModal={setModoModal}
                    setNuevoDetalle={setNuevoDetalle}
                    setModalVerPagos={setModalVerPagos}
                />

                {/* Modal Operación */}
                <ModalPrestamo
                    modalPrestamo={modalPrestamo}
                    setModalPrestamo={setModalPrestamo}
                    modoModal={modoModal}
                    nuevoDetalle={nuevoDetalle}
                    setNuevoDetalle={setNuevoDetalle}
                    confirmarOperacion={confirmarOperacion}
                />

                {/* Modal Ver Pagos */}
                <ModalPagos modalVerPagos={modalVerPagos} setModalVerPagos={setModalVerPagos} />
            </div>
        </>
    );
}

export default PrestamosPage;
