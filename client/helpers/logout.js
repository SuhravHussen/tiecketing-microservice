"use client";

const logout = (callback) => {
  localStorage.removeItem("user");
  callback(null);
  fetch("/api/users/signout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).catch((err) => console.log(err));
};

export default logout;
