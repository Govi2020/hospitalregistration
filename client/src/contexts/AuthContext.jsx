import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const changeUser = async (user) => {
        setUser(user);
    };

    const logout = async () => {
        setUser(null)
        await axios.post(import.meta.env.VITE_BACKEND_URL + "auth/logout",{},{withCredentials: true})
    }

    return (
        <AuthContext.Provider value={{ user, changeUser,logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
