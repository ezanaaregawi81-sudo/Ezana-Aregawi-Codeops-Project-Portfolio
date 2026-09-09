import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { isSignedIn, signIn } = useAuth();
  if (isSignedIn) return <Navigate to="/checkout" replace />;
  const destination = location.state?.from?.pathname || "/checkout";
  const submit = (event) => { event.preventDefault(); signIn(); navigate(destination, { replace: true }); };

  return <section className="page menu"><form className="order-form" onSubmit={submit}><h2>Sign in to continue</h2><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" /></label><label>Password<input type="password" required placeholder="Your password" /></label><button type="submit">Sign in</button></form></section>;
}