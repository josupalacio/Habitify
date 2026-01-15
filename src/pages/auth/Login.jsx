import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { ManageAccount } from "../config/firebaseConnect";
import ModalSignup from "../components/auth/ModalSignup";
import ForgotPassword from "../components/auth/ForgotPassword";
import "./Auth.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showFPasswordModal, setShowFPasswordModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, ingresa correo y contraseña.',
            });
            return;
        }

        setLoading(true);
        const account = new ManageAccount();
        const result = await account.authenticate(email, password);

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Inicio de sesión exitoso.',
                timer: 1500
            }).then(() => {
                navigate('/dashboard');
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error de Inicio de Sesión',
                text: result.message,
            });
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <div className="auth-form-section">
                    <form className="auth-form" onSubmit={handleLogin}>
                        <div className="auth-header">
                            <h1 className="auth-title">🎯 Habitify</h1>
                            <h3 className="auth-subtitle">Inicia Sesión</h3>
                            <p className="auth-description">
                                Conecta con tu cuenta para gestionar tus hábitos
                            </p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Correo electrónico</label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="form-input"
                                placeholder="tu@correo.com"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <div className="password-wrapper">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="form-input"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <div className="form-controls">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span>Recordarme</span>
                            </label>
                            <button
                                type="button"
                                className="forgot-link"
                                onClick={() => setShowFPasswordModal(true)}
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>

                        <button 
                            type="submit" 
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Cargando...' : 'Iniciar Sesión'}
                        </button>

                        <div className="form-footer">
                            <p>¿No tienes cuenta?</p>
                            <button
                                type="button"
                                className="signup-link"
                                onClick={() => setShowSignupModal(true)}
                            >
                                Regístrate aquí
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showSignupModal && <ModalSignup setShowModal={setShowSignupModal} />}
            {showFPasswordModal && <ForgotPassword setShowFPasswordModal={setShowFPasswordModal} />}
        </div>
    );
};

export default Login;
