const ModalPrestamo = ({ modalPrestamo, setModalPrestamo, modoModal, nuevoDetalle, setNuevoDetalle, confirmarOperacion }) => {
    return (
        <div>
            {modalPrestamo && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{modoModal === "pago" ? "Agregar Pago" : "Agregar Monto"}</h2>
                        <div className="form-group-input">
                            <input
                                type="number"
                                placeholder="Monto"
                                value={nuevoDetalle.monto}
                                onChange={(e) => setNuevoDetalle({ ...nuevoDetalle, monto: e.target.value })}
                                min={0}
                            />
                            <input
                                type="text"
                                placeholder="Descripción"
                                value={nuevoDetalle.descripcion}
                                onChange={(e) => setNuevoDetalle({ ...nuevoDetalle, descripcion: e.target.value })}
                            />
                        </div>
                        <div className="modal-buttons">
                            <button className="btn-primary" onClick={confirmarOperacion}>Confirmar</button>
                            <button className="btn-primary" onClick={() => setModalPrestamo(null)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}

export default ModalPrestamo
