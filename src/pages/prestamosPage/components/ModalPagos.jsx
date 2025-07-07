const ModalPagos = ({ modalVerPagos, setModalVerPagos }) => {
    return (
        <div>
            {modalVerPagos && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Pagos y Montos Agregados</h2>
                        <div className="pagos-list">
                            {modalVerPagos.pagos?.length > 0 ? (
                                <div className="tabla-scroll">
                                    <table className="tabla-pagos">
                                        <thead>
                                            <tr>
                                                <th>Fecha</th>
                                                <th>Monto</th>
                                                <th>Descripción</th>
                                                <th>Tipo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {modalVerPagos.pagos.map((pago, idx) => (
                                                <tr key={idx}>
                                                    <td>{pago.fecha}</td>
                                                    <td>S/.{pago.monto.toFixed(2)}</td>
                                                    <td className="descripcion-celda" title={pago.descripcion}>
                                                        {pago.descripcion}
                                                    </td>
                                                    <td>{pago.tipo}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>No hay pagos registrados.</p>
                            )}
                        </div>
                        <div className="modal-buttons">
                            <button className="btn-primary" onClick={() => setModalVerPagos(null)}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ModalPagos
