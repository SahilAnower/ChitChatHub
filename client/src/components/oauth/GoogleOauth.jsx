import React from "react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";

const GoogleOauth = () => {
  const successHandler = (response) => {
    console.log(response);
  };

  const errorHandler = (error) => {
    console.error(error);
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => console.log(codeResponse),
    onError: (error) => console.error("Login Failed:", error),
  });

  return (
    <div>
      <button onClick={login}>Signin with Google</button>
    </div>
  );
};

export default GoogleOauth;
