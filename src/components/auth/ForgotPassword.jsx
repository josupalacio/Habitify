import { useState } from "react";
import Swal from 'sweetalert2';
import { ManageAccount } from "../../config/firebaseConnect";

const ForgotPassword = ({ setShowFPasswordModal }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!email) {
            setError("Por favor ingresa tu correo electrónico");
            setLoading(false);
            return;
        }

        try {
            const account = new ManageAccount();
            const result = await account.resetPassword(email);

            if (result.success) {
                setSuccess(true);
                Swal.fire({
                    icon: 'success',
                    title: 'Correo Enviado',
                    text: 'Revisa tu correo para restablecer tu contraseña',
                    timer: 3000
                });
                setTimeout(() => setShowFPasswordModal(false), 3000);
            } else {
                setError(result.message || "Error al enviar el correo");
            }
        } catch (err) {
            setError(err.message || "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl w-full max-w-md border border-slate-700">
                <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl">
                    <h2 className="text-lg font-semibold text-white">Recuperar Contraseña</h2>
                    <button
                        type="button"
                        className="text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition"
                        onClick={() => setShowFPasswordModal(false)}
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleReset} className="p-6 space-y-4">
                    {!success ? (
                        <>
                            <p className="text-slate-300 text-sm">
                                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                            </p>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-200 mb-2">Correo Electrónico</label>
                                <input
                                    type="email"
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                                    placeholder="tu@correo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    onClick={() => setShowFPasswordModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? 'Enviando...' : 'Enviar Correo'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="text-4xl mb-4">✅</div>
                            <p className="text-slate-200 font-medium">¡Correo Enviado!</p>
                            <p className="text-slate-400 text-sm mt-2">
                                Revisa tu bandeja de entrada para restablecer tu contraseña
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
