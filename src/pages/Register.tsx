import { useState } from "react";
import { useDispatch} from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { setUser } from "../features/authSlice";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const { data, error} = await supabase.auth.signUp({ email, password });
            if (error) {
                console.log("Error registering:", error);
                return;
            }
            dispatch(setUser(data.user));
            navigate("/");
        } catch (error) {
            console.error("Registration error:", error);
            setEmail("");
            setPassword("");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-slate-500 p-8 rounded-lg shadow-lg">
                <h2 className="text-center text-slate-900 text-3xl font-bold mb-6">Register</h2>
                <input 
                    className="w-full bg-slate-300 text-black border border-black rounded p-3 mb-4 focus:outline-none focus:border-yellow-500"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input 
                    className="w-full bg-slate-300 text-black border border-black rounded p-3 mb-6 focus:outline-none focus:border-yellow-500"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button 
                    className="w-full bg-yellow-500 hover:bg-yellow-300 text-black font-semibold mb-3 py-3 rounded cursor-pointer"
                    onClick={handleRegister}
                >
                    Register
                </button>
                <div className="block w-full text-center mb-3">
                    Have an existing account?
                    <Link 
                        to="/login"
                        className="text-yellow-300 underline hover:text-yellow-500 font-semibold ms-2 cursor-pointer"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;