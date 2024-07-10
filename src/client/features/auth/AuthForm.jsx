import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useRegisterMutation } from "./authSlice";

/** This form allows users to register or log in. */
export default function AuthForm() {
  const navigate = useNavigate();

  // Handles swapping between login and register
  const [isLogin, setIsLogin] = useState(true);
  const authAction = isLogin ? "Login" : "Register";
  const altCopy = isLogin
    ? "Need an account? Register here."
    : "Already have an account? Login here.";

  // Controlled form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Form submission
  const [login, { isLoading: loginLoading, error: loginError }] =
    useLoginMutation();
  const [register, { isLoading: registerLoading, error: registerError }] =
    useRegisterMutation();

  /** Send the requested authentication action to the API */
  const attemptAuth = async (evt) => {
    evt.preventDefault();
    //
    const authMethod = isLogin ? login : register;
    const credentials = { username, password };

    // We don't want to navigate if there's an error.
    // `unwrap` will throw an error if there is one
    // so we can use a try/catch to handle it.
    try {
      await authMethod(credentials).unwrap();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page__height">
      <h1>{authAction}</h1>
      <form onSubmit={attemptAuth}>
        <fieldset>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </fieldset>
        <fieldset>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </fieldset>
        <fieldset className="justify-center">
          <button>{authAction}</button>
        </fieldset>
      </form>
      <a onClick={() => setIsLogin(!isLogin)}>{altCopy}</a>

      {(loginLoading || registerLoading) && <p>Please wait...</p>}
      {loginError && <p role="alert">{loginError}</p>}
      {registerError && <p role="alert">{registerError}</p>}
    </div>
  );
}
