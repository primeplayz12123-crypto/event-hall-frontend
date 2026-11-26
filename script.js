
const API = "https://event-manager-rx5n.onrender.com";


const loginForm = document.getElementById("login-form");
const emailBox = document.getElementById("l-user");
const passwordBox = document.getElementById("l-pass");
const loginError = document.getElementById("login-error");
const loginBtn = document.getElementById("login-btn");


loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();


  loginError.textContent = "";
  loginBtn.disabled = true;
  loginBtn.textContent = "Please wait...";

  try {
    
    const response = await fetch(API + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailBox.value,
        password: passwordBox.value
      })
    });

    
    const data = await response.json();

    if (response.ok) {
     
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "app.html";
    } else {
      loginError.textContent = data.message || "Login failed";
    }
  } catch (error) {
  
    loginError.textContent = "Cannot reach the server. Try again.";
  }

  
  loginBtn.disabled = false;
  loginBtn.textContent = "Log in";
});