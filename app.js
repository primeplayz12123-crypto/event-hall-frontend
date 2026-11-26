const API = "https://event-manager-rx5n.onrender.com/api";

const registerForm = document.getElementById("register-form");
const registerError = document.getElementById("register-error");
const nameBox = document.getElementById("g-name");
const phoneBox = document.getElementById("g-phone");
const emailBox = document.getElementById("g-email");
const typeBox = document.getElementById("g-type");

const passEmpty = document.getElementById("pass-empty");
const passContent = document.getElementById("pass-content");
const passName = document.getElementById("pass-name");
const passType = document.getElementById("pass-type");
const passCode = document.getElementById("pass-code");

registerForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  registerError.textContent = "";

  const token = localStorage.getItem("token");
  if (!token) {
    registerError.textContent = "Please log in again.";
    return;
  }

  const guest = {
    fullName: nameBox.value,
    ticketTier: typeBox.value
  };
  if (phoneBox.value) {
    guest.phone = phoneBox.value;
  }
  if (emailBox.value) {
    guest.email = emailBox.value;
  }

  try {
    const response = await fetch(API + "/attendees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(guest)
    });

    const data = await response.json();

    if (response.ok) {
      passEmpty.classList.add("hidden");
      passContent.classList.remove("hidden");
      passName.textContent = data.attendee.fullName;
      passType.textContent = "Ticket: " + data.attendee.ticketTier;
      passCode.textContent = "Access code: " + data.attendee.accessCode;
      registerForm.reset();
    } else {
      registerError.textContent = data.message || "Could not register the guest";
    }
  } catch (error) {
    registerError.textContent = "Cannot reach the server. Try again.";
  }
});
