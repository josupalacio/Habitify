import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { ManageAccount } from "../../config/firebaseConnect";
import supabase from "../../config/supabaseClient";

const ModalSignup = ({ setShowModal }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateNickname = (nickname) => {
        const nicknameRegex = /^(?!.*[.]{2})[a-zA-Z0-9](?:[a-zA-Z0-9._]{1,28}[a-zA-Z0-9])?$/;
        return nicknameRegex.test(nickname);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validaciones
        if (!email || !password || !nickname) {
            setError("Por favor completa todos los campos");
            setLoading(false);
            return;
        }

        if (password !== repeatPassword) {
            setError("Las contraseñas no coinciden");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            setLoading(false);
            return;
        }

        if (!validateEmail(email)) {
            setError("El correo no es válido");
            setLoading(false);
            return;
        }

        if (!validateNickname(nickname)) {
            setError("El nickname solo puede contener letras, números, puntos y guion bajo");
            setLoading(false);
            return;
        }

        try {
            // 1. Registrar en Firebase
            const account = new ManageAccount();
            const result = await account.register(email, password, nickname);
            
            if (!result.success) {
                setError(result.message || "Error al registrar");
                setLoading(false);
                return;
            }

            const userUid = result.user.uid;

            // 2. Guardar datos completos en Firestore (ya se hace en register)
            await account.saveData('users', userUid, {
                email,
                nickname,
                name: name || nickname,
                createdAt: new Date().toISOString()
            });

            Swal.fire({
                icon: 'success',
                title: '¡Registro Exitoso!',
                text: 'Tu cuenta ha sido creada. Redirigiendo...',
                timer: 2000
            }).then(() => {
                setShowModal(false);
                navigate('/dashboard');
            });

        } catch (err) {
            console.error("Error:", err);
            setError(err.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">
                <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl">
                    <h2 className="text-lg font-semibold text-white">Crear Nueva Cuenta</h2>
                    <button
                        type="button"
                        className="text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition"
                        onClick={() => setShowModal(false)}
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSignup} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Nombre</label>
                        <input
                            type="text"
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                            placeholder="Tu nombre (opcional)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Nickname</label>
                        <input
                            type="text"
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                            placeholder="Tu nickname único"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Correo</label>
                        <input
                            type="email"
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                            placeholder="tu@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Contraseña</label>
                        <input
                            type="password"
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                            placeholder="Mínimo 6 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-200 mb-2">Confirmar Contraseña</label>
                        <input
                            type="password"
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                            placeholder="Repite tu contraseña"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-2 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition font-medium"
                            onClick={() => setShowModal(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Registrando...' : 'Registrarse'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalSignup;
