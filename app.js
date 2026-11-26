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

const guestsBody = document.getElementById("guests-body");
const printBtn = document.getElementById("print-btn");
const statRegistered = document.getElementById("stat-registered");
const statInside = document.getElementById("stat-inside");
const statWaiting = document.getElementById("stat-waiting");

function showMessage(text) {
  guestsBody.innerHTML = "";
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.colSpan = 5;
  cell.textContent = text;
  row.appendChild(cell);
  guestsBody.appendChild(row);
}

async function loadGuests() {
  const token = localStorage.getItem("token");
  if (!token) {
    showMessage("Please log in again.");
    return;
  }

  try {
    const response = await fetch(API + "/attendees", {
      headers: { "Authorization": "Bearer " + token }
    });
    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || "Could not load the guest list");
      return;
    }

    guestsBody.innerHTML = "";
    let inside = 0;

    for (const guest of data.attendees) {
      if (guest.isCheckedIn) {
        inside = inside + 1;
      }

      const row = document.createElement("tr");
      const cells = [
        guest.fullName,
        guest.phone || "-",
        guest.ticketTier,
        guest.accessCode,
        guest.isCheckedIn ? "Inside" : "Not yet arrived"
      ];

      for (const text of cells) {
        const cell = document.createElement("td");
        cell.textContent = text;
        row.appendChild(cell);
      }
      guestsBody.appendChild(row);
    }

    if (data.attendees.length === 0) {
      showMessage("No guests yet.");
    }

    statRegistered.textContent = data.count;
    statInside.textContent = inside;
    statWaiting.textContent = data.count - inside;
  } catch (error) {
    showMessage("Cannot reach the server. Try again.");
  }
}

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
      loadGuests();
    } else {
      registerError.textContent = data.message || "Could not register the guest";
    }
  } catch (error) {
    registerError.textContent = "Cannot reach the server. Try again.";
  }
});

printBtn.addEventListener("click", function () {
  window.print();
});

loadGuests();
