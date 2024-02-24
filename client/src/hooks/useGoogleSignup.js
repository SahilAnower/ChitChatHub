import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useGoogleSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const googleSignup = async (accessToken) => {
    const isSuccess = handleInputErrors({ accessToken });
    if (!isSuccess) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/google/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken }),
      });
      const data = await res.json();
      // console.log(data);
      if (data.error) {
        throw new Error(data.error);
      }
      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return { googleSignup, loading };
};

function handleInputErrors({ accessToken }) {
  if (!accessToken) {
    toast.error("Cannot get access token for this google account!");
    return false;
  }
  return true;
}

export default useGoogleSignup;
