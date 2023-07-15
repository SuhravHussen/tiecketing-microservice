const getCurrentUser = async () => {
  const res = await fetch("/api/users/currentuser", {
    cache: "no-store",
    credentials: "include",
  });

  return await res.json();
};


export {getCurrentUser}