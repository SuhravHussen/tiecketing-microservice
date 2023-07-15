"use client";

import { ToastContainer } from "react-toastify";
import Signin from "./common/signin";
import { useGlobalContext } from "../../context/store";
import logout from "@/helpers/logout";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

function mainLayouts({ children }) {
  const { user, setUser } = useGlobalContext();

  const handleSignOut = () => {
    logout(setUser);
  };

  return (
    <div className="min-h-screen">
      {/* // notification signedIn */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="navbar bg-primary">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href={"/myorders"}>My Orders</Link>
              </li>

              <li>
                <a>Sell Tickets</a>
              </li>
            </ul>
          </div>
          <a href="/" className="btn btn-ghost normal-case text-xl">
            Ticketing
          </a>
        </div>
        {user.id && (
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link href={"/myorders"}>My Orders</Link>
              </li>

              <li>
                <a>Sell Tickets</a>
              </li>
            </ul>
          </div>
        )}
        <div className="navbar-end">
          {!user?.email && (
            <>
              {" "}
              <label htmlFor="my-modal-4" className="btn">
                <a className="btn">Sign In</a>
              </label>
              <Signin />
            </>
          )}
          {user?.email && (
            <a className="btn" onClick={handleSignOut}>
              Sign out
            </a>
          )}
        </div>
      </div>

      <div
        style={{
          minHeight: "calc(100vh - 100px)",
        }}
        className="m-5 text-black"
      >
        {children}
      </div>
    </div>
  );
}

export default mainLayouts;
