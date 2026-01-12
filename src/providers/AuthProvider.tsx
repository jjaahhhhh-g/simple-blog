import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "../supabaseClient";
import { setUser } from "../features/authSlice";

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const dispatch = useDispatch();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            dispatch(setUser(session?.user ?? null));
        });

        const { data: {subscription} } = supabase.auth.onAuthStateChange((_event, session) => {
            dispatch(setUser(session?.user ?? null));
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [dispatch]);

    return <>{children}</>;
}

export default AuthProvider;