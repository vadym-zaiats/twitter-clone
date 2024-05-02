/* eslint-disable @typescript-eslint/no-var-requires */
const FormData = require("form-data");
const fs = require("fs");

const photoData = fs.readFileSync("./nodejs0.png");

// Створюємо об'єкт FormData
var formData = new FormData();

// Додаємо дані до об'єкта FormData
formData.append("email", "tesdfftsf@yopmail.com");
formData.append("password", "q123456");
formData.append("confirmPassword", "q123456");
formData.append("userName", "User Name");
formData.append("displayName", "Display Name");
formData.append("photo", photoData);

// Відправляємо запит на сервер
fetch("http://localhost:8000/api/auth/register", {
  method: "POST",
  body: formData,
  headers: {
    "Content-Type": "multipart/form-data", // Додано заголовок Content-Type
  },
})
  .then((response) => response.text())
  .then((result) => console.log("USER CREATE RESULT: ", result))
  .catch((error) => console.error(error));
