window.onload = async function () {
  const globalData = await getUserNameById();
  const headerList = document.getElementById("header");
  const header_div = document.createElement("div");
  header_div.classList.add("header");
  header_div.innerHTML = `
            <div class="header-left">
            <a href="javascript:history.back()">
            <p class="line-1"></p>
            <p class="line-2"></p>
            </a>
        </div>
        <p>아무 말 대잔치</p>
        <div class="header-right-overlay">
            <span class="mtp10"
            ><img
                src="http://localhost:3065/${globalData.data.profile_path}"
                class="header-right"
            /></span>
            <div class="header-right-board">
            <p><a href="/users/${globalData.data.id}">회원정보수정</a></p>
            <p><a href="/users/${globalData.data.id}/password">비밀번호수정</a></p>
            <p><a href="/">로그아웃</a></p>
            </div>
        </div>
    `;
  headerList.appendChild(header_div);
  const user_id = document.getElementById("user_id");
  user_id.value = globalData.data.id;
};

async function getUserNameById() {
  try {
    const response = await fetch("http://localhost:3065/header", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Get Users Network error");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("there", error);
    return null;
  }
}

const edit_send = async () => {
    const form = document.getElementById("edit_Form");
    const formDataString = `user_id=${form.user_id.value}&password=${form.password.value}`;
    try {
        const response = await fetch("http://localhost:3065/users/" + form.user_id.value + "/password", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formDataString,
        });
        if(!response.ok) {
            throw new Error("비밀번호 수정 오류");
        }
        if(response.status === 200) {
            alert("수정완료");
            window.location.href = "/";
        }
    } catch(e) {
        console.log(e);
    }
}


document.getElementById("password").addEventListener("input", () => {
  const evalue = document.getElementById("password");
  const pattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
  const h_pwd = document.getElementById("helper_pwd");
  if (evalue.value === "") {
    h_pwd.textContent = "비밀번호를 입력해주세요";
  } else if (!pattern.test(evalue.value)) {
    h_pwd.textContent =
      "비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
  } else {
    console.log("btn1");
    h_pwd.textContent = "사용가능한 비밀번호입니다.";
  }
});
document.getElementById("password_chk").addEventListener("input", () => {
  const evalue = document.getElementById("password_chk");
  const h_pwd = document.getElementById("helper_pwd_chk");
  const evalue_chk = document.getElementById("password");
  if (evalue.value === "") {
    h_pwd.textContent = "비밀번호를 입력해주세요";
    document.getElementById("member-btn").style.backgroundColor = "#aca0eb";
  } else if (evalue.value != evalue_chk.value) {
    h_pwd.textContent = "비밀번호가 다릅니다.";
    document.getElementById("member-btn").style.backgroundColor = "#aca0eb";
  } else {
    console.log("btn1");
    h_pwd.textContent = "사용가능한 비밀번호입니다.";
    document.getElementById("member-btn").style.backgroundColor = "#7F6AEE";
  }
});
