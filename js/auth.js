// js/auth.js

// SIGN UP
window.signUp = function () {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (!username || !email || !password || !confirmPassword) {
    showToast("Please fill all fields", "info");
    return;
  }

  if (password !== confirmPassword) {
    showToast("Passwords do not match", "error");
    return;
  }

  fetch(USERS_URL)
    .then(res => res.json())
    .then(users => {
      const exists = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() ||
             u.username.toLowerCase() === username.toLowerCase()
      );

      if (exists) {
        showToast("User already exists", "error");
        return;
      }

      // Create new user
      fetch(USERS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, skills: [], bookmarks: [], userlikes: [] })
      })
      .then(res => res.json())
      .then(newUser => {
        localStorage.setItem("username", newUser.username);
        localStorage.setItem("userId", newUser.id);
        showToast("Account created successfully!", "success");
        setTimeout(() => window.location.href = "login.html", 900);
      });
    });
};


// LOGIN
window.logIn = function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  fetch(USERS_URL)
    .then(res => res.json())
    .then(users => {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem("username", user.username);
        localStorage.setItem("userId", user.id);
        showToast("Login successful!", "success");
        setTimeout(() => window.location.href = "main.html", 800);
      } else {
        showToast("Invalid email or password", "error");
      }
    });
};


// LOGOUT
window.logoutUser = function(event) {
  event.preventDefault();
  localStorage.clear();
  sessionStorage.clear();
  showToast("You have been logged out", "info");
  setTimeout(() => window.location.href = "login.html", 700);
}

function showToast(message, type = "info") {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    style: {
      background: type === "error" ? "red" : 
                  type === "success" ? "green" : 
                  "#444"
    }
  }).showToast();
}
