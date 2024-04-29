//create user

fetch("http://localhost:8000/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "bobj@yopmail.com",
    password: "q123456",
    confirmPassword: "q123456",
  }),
})
  .then((response) => response.text())
  .then((result) => console.log("created user", result))
  .catch((error) => console.error(error));
