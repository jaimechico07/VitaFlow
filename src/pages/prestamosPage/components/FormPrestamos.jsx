const FormPrestamos = ({ registrarPrestamo, form, handleChange }) => {
    return (
        <form onSubmit={registrarPrestamo}>
            <input name="persona" placeholder="Persona/Entidad" value={form.persona} onChange={handleChange} />
            <input name="monto" type="number" placeholder="Monto Prestado" value={form.monto} onChange={handleChange} />
            <input name="fechaPrestamo" type="date" value={form.fechaPrestamo} onChange={handleChange} />
            <input name="fechaLimite" type="date" value={form.fechaLimite} onChange={handleChange} />
            <button className="btn-primary" type="submit">Registrar</button>
        </form>
    );
};

export default FormPrestamos
