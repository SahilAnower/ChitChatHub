import React, { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import useGoogleLoginHook from "../../hooks/useGoogleLogin";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { loading, login } = useLogin();
  const { loading: googleLoading, googleLoginFn } = useGoogleLoginHook();

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => handleGoogleLogin(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  const handleGoogleLogin = async (codeResponse) => {
    // setInputs({...inputs, googleAccessToken: codeResponse?.access_token})
    const googleAccessToken = codeResponse?.access_token;
    await googleLoginFn(googleAccessToken);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(username, password);
    await login(username, password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Login
          <span className="text-yellow-300">ChitChatHub</span>
        </h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="label p-2">
              <span className="text-base label-text text-yellow-400">
                Username
              </span>
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full input input-bordered h-10"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="label">
              <span className="text-base label-text text-yellow-400">
                Password
              </span>
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full input input-bordered h-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Link
            to={"/signup"}
            className="text-gray-300 font-bold text-sm hover:underline hover:text-yellow-600 mt-2 inline-block"
          >
            {"Don't"} have an account?
          </Link>
          <div>
            <button
              type="submit"
              className="btn btn-block btn-sm mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Log in"
              )}
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={googleLogin}
              className="btn btn-block btn-sm mt-2"
              disabled={googleLoading}
            >
              <FcGoogle />
              {googleLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Log in with Google"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
