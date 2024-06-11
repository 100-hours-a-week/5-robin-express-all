const login_sendit = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const pwdHelper = document.getElementById("helper-text");
    const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
    if (!checkEmail(email)) {
    alert("올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)");
    return false;
    }
    if (password.length < 7 || password == null || !checkPwd(password)) {
    alert("입력하신 계정정보가 정확하지 않았습니다.");
    return false;
    }

    try {
        const response = await fetch("http://localhost:3065/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });
        if(!response.ok) {
            if (response.status === 401) {
                document.getElementById("helper-text").textContent = "비밀번호가 다릅니다.";
            }
            throw new Error("Network response was not ok");
        }
        if (response.status === 200) {
            window.location.href = "/posts";
        }
        const data = await response.json();
    } catch (e) {
        console.error("There has been a problem with your fetch operation:", e);
    }
};

function checkEmail(email) {
  const pattern = /^[A-Za-z\.\-]+@[A-Za-z\-]+\.[A-za-z\-]+/;
  if (email.length < 7 || email == null || !pattern.test(email)) {
    return false;
  } else {
    return true;
  }
}
function checkPwd(pwd) {
  const pattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
  if (!pattern.test(pwd)) {
    return false;
  } else {
    return true;
  }
}

const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
document.getElementById("password").addEventListener("input", () => {
  const pwdc = document.getElementById("password");
  const pwdHelper = document.getElementById("helper-text");
  console.log(pwdc.value);
  if (pwdc.value == "") {
    pwdHelper.textContent = "*비밀번호를 입력해주세요.";
    document.getElementById("login-btn").style.backgroundColor = "#aca0eb";
  } else if (!pattern.test(pwdc.value)) {
    console.log("aaa");
    pwdHelper.textContent =
      "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    document.getElementById("login-btn").style.backgroundColor = "#aca0eb";
  } else {
    document.getElementById("login-btn").style.backgroundColor = "#7F6AEE";
  }
});
