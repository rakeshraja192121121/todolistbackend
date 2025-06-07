async function signin(event) {
  event.preventDefault();
  let userEmail = document.querySelector(".email-signin").value;
  let password = document.querySelector(".pass-signin").value;

  // if (userEmail && password) {
  //   document.querySelector(".error").innerText = "both the fields are required";
  // }

  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ userName: userEmail, password: password }),
    });
    console.log(response.ok);

    if (response.ok) {
      window.location.href = "./loginpage.html";
    } else {
      document.querySelector(".error").innerText = "user name is alredy exist";
    }
  } catch {
    document.querySelector(".error").innerText = "server error";
  }

  document.querySelector(".email-signin").value = "";
  document.querySelector(".pass-signin").value = "";
}

async function login(event) {
  event.preventDefault();
  const Email = document.querySelector(".textbox").value;
  const password = document.querySelector(".passbox").value;

  try {
    const response = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName: Email, password: password }),
    });
    if (response.ok) {
      localStorage.setItem("username", Email);
      window.location.href = "./index.html";
    } else {
      window.location.href = "./signin.html";
    }
  } catch (error) {
    console.error(error);
  }
}
