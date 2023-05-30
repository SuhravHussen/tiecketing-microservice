"use client";

const logout = (callback) => {
  fetch("/api/users/signout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then(() => {
    callback({
      id: null,
      email: null,
    });
    window.location.replace("/");
  });
};

export default logout;
