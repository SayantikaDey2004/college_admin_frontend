import { useEffect, useState } from "react";
import authContext from "./auth.context";
import type { IFaculty } from "../../@types/interface/faculty.interface";
import api from "../../config/axios.config";
import socketInstance from "../../config/socket.config";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IFaculty | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    //api call kore user er data ta ante pari
    const fetchMe = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        console.log(response.data);
        if (response.status === 200) {
          setIsAuthenticated(true);
          setUser(response.data.result);
        }
      } catch (error) {
        console.log(error);
        // Clear invalid token
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem("token");

      if (token) {
        socketInstance.auth = { token };
        socketInstance.connect();

        socketInstance.on("connect", () => {
          console.log("Socket Connected:", socketInstance.id);
        });

        socketInstance.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
        });
      }
    } else {
      // Disconnect socket when not authenticated
      if (socketInstance.connected) {
        socketInstance.disconnect();
        console.log("Socket Disconnected");
      }
    }

    return () => {
      socketInstance.off("connect");
      socketInstance.off("connect_error");
    };
  }, [isAuthenticated, user]);

  const login = ({ token, user }: { token: string; user: IFaculty }) => {
    if (token) {
      localStorage.setItem("token", token);
      console.log("Token stored in localStorage:", token);
      setIsAuthenticated(true);
    }

    if (user) {
      setUser(user);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setIsLoading(false);
    localStorage.removeItem("token");

    if (socketInstance.connected) {
      socketInstance.disconnect();
      console.log("Socket Disconnected on logout");
    }
  };

  return (
    <authContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        onLogin: login,
        onLogout: logout,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
