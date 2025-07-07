import { DollarSign, Eye, PlusCircle } from 'lucide-react';
const Tables = ({ prestamosActivos, prestamosCancelados, activeTab, setActiveTab, setModalPrestamo, setModoModal, setNuevoDetalle, setModalVerPagos }) => {
    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                <button onClick={() => setActiveTab("activos")} className={activeTab === "activos" ? "tab-active" : "tab"}>
                    Préstamos Activos
                </button>
                <button onClick={() => setActiveTab("cancelados")} className={activeTab === "cancelados" ? "tab-active" : "tab"}>
                    Préstamos Cancelados
                </button>
            </div>

            {activeTab === "activos" ? (
                prestamosActivos.length === 0 ? (
                    <p>No hay préstamos registrados actualmente.</p>
                ) : (
                    <div className="tabla-scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th>Persona</th>
                                    <th>Monto</th>
                                    <th>Fecha Préstamo</th>
                                    <th>Fecha Límite</th>
                                    <th>Saldo</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prestamosActivos.map((p) => (
                                    <tr key={p.id}>
                                        <td>{p.persona}</td>
                                        <td>{p.monto.toFixed(2)}</td>
                                        <td>{p.fechaPrestamo}</td>
                                        <td>{p.fechaLimite}</td>
                                        <td>{p.saldo.toFixed(2)}</td>
                                        <td style={{ fontStyle: "italic", fontWeight: "bold", color: p.estado === "Cancelado" ? "red" : "green" }}>{p.estado}</td>
                                        <td>
                                            <div className="actions">
                                                <DollarSign className="icon" onClick={() => {
                                                    setModalPrestamo(p);
                                                    setModoModal("pago");
                                                    setNuevoDetalle({ monto: "", descripcion: "" });
                                                }} cursor="pointer" />
                                                <Eye className="icon" onClick={() => setModalVerPagos(p)} cursor="pointer" />
                                                <PlusCircle className="icon" onClick={() => {
                                                    setModalPrestamo(p);
                                                    setModoModal("monto");
                                                    setNuevoDetalle({ monto: "", descripcion: "" });
                                                }} cursor="pointer" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                prestamosCancelados.length === 0 ? (
                    <p>No hay préstamos cancelados.</p>
                ) : (
                    <div className="tabla-scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th>Persona</th>
                                    <th>Monto</th>
                                    <th>Fecha Préstamo</th>
                                    <th>Fecha Límite</th>
                                    <th>Saldo</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prestamosCancelados.map((p) => (
                                    <tr key={p.id}>
                                        <td>{p.persona}</td>
                                        <td>{p.monto.toFixed(2)}</td>
                                        <td>{p.fechaPrestamo}</td>
                                        <td>{p.fechaLimite}</td>
                                        <td>{p.saldo.toFixed(2)}</td>
                                        <td style={{ fontStyle: "italic", fontWeight: "bold", color: p.estado === "Cancelado" ? "red" : "green" }}>{p.estado}</td>
                                        <td>
                                            <Eye className="icon" onClick={() => setModalVerPagos(p)} cursor="pointer" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </>
    )
}

export default Tables

