function login_sendit() {
    let form = document.getElementById("login_Form");
    let email = form.email.value;
    let password = form.password.value;
    const pwdHelper = document.getElementById("helper-text");
    const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
    if (!checkEmail(email)) {
      alert("올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)");
      return false;
    }
    if (password.length < 7 || password == null || !checkPwd(password)) {
      alert("입력하신 계정정보가 정확하지 않았습니다.");
      return false;
    } else {
      /*백엔드 중복 검사 */
      fetch('http://localhost:3065/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        if(response.status === 200) {
            window.location.href = '/posts';
        }
        return response.json();
      })
      .then(data => {
        // 응답 데이터를 처리합니다.
        console.log(data);
        // 여기서 받은 응답을 이용하여 다음 동작을 수행할 수 있습니다.
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        // 에러가 발생한 경우 처리합니다.
      });
    }
  }

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

const pattern =
/^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
document.getElementById("password").addEventListener("input", () => {
const pwdc = document.getElementById("password");
const pwdHelper = document.getElementById("helper-text");
console.log(pwdc.value);
if (pwdc.value == "") {
    pwdHelper.textContent = "*비밀번호를 입력해주세요.";
    document.getElementById("login-btn").style.backgroundColor =
    "#aca0eb";
} else if (!pattern.test(pwdc.value)) {
    console.log("aaa");
    pwdHelper.textContent =
    "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
    document.getElementById("login-btn").style.backgroundColor =
    "#aca0eb";
} else {
    document.getElementById("login-btn").style.backgroundColor =
    "#7F6AEE";
}
});