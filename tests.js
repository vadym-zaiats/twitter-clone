/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
//create user

const photoData = fs.readFileSync("./nodejs.png");

// Використовуємо дані зображення для створення Blob
const photoBlob = new Blob([photoData], { type: "image/png" });

// Створюємо файл з Blob
const photoFile = new File([photoBlob], "photo.png");

console.log(photoFile);

fetch("http://localhost:8000/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "bodbrj@yopmail.com",
    password: "q123456",
    confirmPassword: "q123456",
    userName: "User Name",
    displayName: "Display Name",
    // photo: photoFile,
  }),
})
  .then((response) => response.text())
  .then((result) => console.log("created user", result))
  .catch((error) => console.error(error));
