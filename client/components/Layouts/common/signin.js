"use client";

import React from "react";
import { useGlobalContext } from "../../../context/store";

export default function Signin() {
  const [mode, setMode] = React.useState("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showA, setShowA] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const { user, setUser } = useGlobalContext();

  const signIn = async () => {
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        if (!email || !password) {
          setError("Please fill all fields");
          setLoading(false);
          return;
        }
        const res = await fetch("/api/users/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!data.error) {
          closeModal();
          setShowA(true);
          setTimeout(() => {
            setShowA(false);
          }, 3000);
          setUser(data.data);
          localStorage.setItem("user", JSON.stringify(data.data));
        } else {
          setError(data?.message || "Something went wrong");
        }
      }
      if (mode === "signup") {
        if (!email || !password || !confirmPassword) {
          setError("Please fill all fields");
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError("Password do not match");
          setLoading(false);
          return;
        }
        const res = await fetch("/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!data.error) {
          closeModal();
          setShowA(true);
          setTimeout(() => {
            setShowA(false);
          }, 3000);
          setUser(data.data);
          localStorage.setItem("user", JSON.stringify(data.data));
        } else {
          setError(data?.message || "Something went wrong");
        }
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Something went wrong");
    }
  };

  const changeMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError("");
    setLoading(false);
  };

  function closeModal() {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setLoading(false);
    const checkbox = document.getElementById("my-modal-4");
    checkbox.checked = false;
  }
  return (
    <>
      {/* show alert if success */}
      {showA && (
        <div className="toast toast-end">
          {" "}
          <div className="alert alert-success">
            <div>
              <span>logged in Successfully</span>
            </div>
          </div>
        </div>
      )}

      {/* sign in modal */}
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold text-center mb-4">
            Congratulations random Internet user!
          </h3>
          <div className="flex flex-col items-center">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
              placeholder="Type your email"
              className="input input-bordered input-info w-full max-w-xs mb-3"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Type your password"
              className="input input-bordered input-info w-full max-w-xs"
            />
            {mode === "signup" && (
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type="password"
                placeholder="confirm your password"
                className="input input-bordered input-info w-full max-w-xs mt-3"
              />
            )}
            <button
              onClick={signIn}
              className={`btn btn-wide btn-primary mt-4 ${
                loading ? "loading" : ""
              }`}
            >
              {mode === "login" ? "Login" : "Sign Up"}
            </button>
            <div className="divider">OR</div>
            <button
              type="button"
              onClick={changeMode}
              className="btn btn-wide btn-secondary mt-4"
            >
              {mode === "login" ? "Sign Up" : "Login"}
            </button>
            {/* error message */}
            <small className="text-red-500">{error}</small>
          </div>
        </label>
      </label>
    </>
  );
}
