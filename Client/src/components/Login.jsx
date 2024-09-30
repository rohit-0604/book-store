import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import googleLogo from '../assets/google-logo.svg';

const Login = () => {
    const { login, loginWithGoogle } = useContext(AuthContext);
    const [error, setError] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    const from = location.state?.from?.pathname || "/";

    const handleLogin = (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        login(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                alert("Login successful!!");
                navigate(from, { replace: true });
            })
            .catch((error) => {
                let errorMessage;

                // Determine the error message based on the error code
                switch (error.code) {
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid email address.';
                        break;
                    case 'auth/wrong-password':
                        errorMessage = 'Incorrect password.';
                        break;
                    case 'auth/user-not-found':
                        errorMessage = 'No user found with this email.';
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = 'Network error, please try again.';
                        break;
                    default:
                        errorMessage = 'Email or password is incorrect.';
                        break;
                }

                setError(errorMessage);
            });
    };

    const handleRegister = () => {
        loginWithGoogle()
            .then((result) => {
                const user = result.user;
                alert("Sign up successful!");
                navigate(from, { replace: true });
            })
            .catch((error) => {
                console.error("Sign up error:", error.code, error.message);
                setError('Failed to log in with Google.');
            });
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div>
                            <h1 className="text-2xl font-semibold">Login Form</h1>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <form onSubmit={handleLogin} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <div className="relative">
                                    <input id="email" name="email" type="email" className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600" placeholder="Email address" required />
                                </div>
                                <div className="relative">
                                    <input id="password" name="password" type="password" className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600" placeholder="Password" required minLength="6" />
                                </div>
                                {error && <p className="text-red-600 text-base">{error}</p>}
                                <p>If you don't have an account, please <Link to="/sign-up" className="text-blue-600 underline">Sign up</Link> here</p>
                                <div className="relative">
                                    <button className="bg-blue-500 text-white rounded-md px-6 py-2">Login</button>
                                </div>
                            </form>
                        </div>

                        <hr />

                        <div className="flex w-full items-center flex-col mt-5 gap-3">
                            <button onClick={handleRegister} className="flex items-center">
                                <img src={googleLogo} alt="Google" className="w-12 h-12 inline-block" />
                                <span className="ml-2">Login with Google</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;


