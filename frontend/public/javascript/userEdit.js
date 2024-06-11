window.onload = async function () {
  const globalData = await getUserNameById();
  console.log(globalData);

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

  const userEmailElement = document.getElementById("userEmail");
  const userNickname = document.getElementById("nickname");
  const noprofile = document.getElementById("noprofile_img");
  const form = document.getElementById("member_Form");
  const user_id = document.getElementById("user_id");
  userEmailElement.textContent = globalData.data.email;
  userNickname.value = globalData.data.nickname;
  noprofile.src = "http://localhost:3065/" + globalData.data.profile_path;
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
    return data;
  } catch (error) {
    console.error("there", error);
    return null;
  }
}

function imgInput() {
  document.getElementById("profile-upload-input").click();
}

function modalView(id) {
  const openButton = document.getElementById(id);
  const modal = document.querySelector("#modal_" + id);
  const overlay = modal.querySelector(".modal_overlay");
  const closeBtn = modal.querySelector("button");
  const openModal = () => {
    modal.classList.remove("hidden");
  };
  const closeModal = () => {
    modal.classList.add("hidden");
  };
  overlay.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);
  openButton.addEventListener("click", openModal);
}

function checkProfile() {
  const preview = document.getElementById("preview");
  const profile_img = document.getElementById("profile-upload-input").files[0];
  const noprofile = document.getElementById("noprofile_img");
  document.getElementById("check_img").value = "1";
  if (profile_img) {
    const reader = new FileReader();
    noprofile.style.display = "none";
    preview.style.display = "block";
    reader.onload = function (e) {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(profile_img);
  }
}

document.getElementById("member_Form").addEventListener("submit", (event) => {
    event.preventDefault(); // form의 자동 제출을 막음
    member_sendit(); // fetch 요청 시작
  });

const member_sendit = async () => {
    let form = document.getElementById("member_Form");
    const user_id = form.user_id.value;
    const nickname = form.nickname.value;
    const file = document.getElementById("profile-upload-input").files[0];
    const formData = new FormData();
    const check_img = document.getElementById("check_img").value;
    formData.append("image", file);
    let profilePath;
    if(check_img == "1") {
        const imgResponse = await fetch("http://localhost:3065/users/upload/profile-image", {
            method: "POST",
            body: formData,
        });
        if(imgResponse.status === 201) {
            const data = await imgResponse.json();
            console.log(data);
            profilePath = data.message;
        }
    }
    const response = await fetch("http://localhost:3065/users/"+ user_id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, nickname, profilePath, check_img }),
    });
    if(response.status === 409) {
        document.getElementById('helper-nickname').textContent = '중복되는 닉네임입니다.';
    }
    if(!response.ok) {
        throw new Error("글쓰기 실패");
    }
    if(response.status === 200) {
        let tostMessage = document.getElementById("member-btn");
        tostMessage.classList.add("toast-active");
        setTimeout(function () {
        tostMessage.classList.remove("toast-active");
        }, 1000);
    }
}

function delUser() {
  const userId = document.getElementById("user_id").value;
  const formDataString = `user_id=${userId}`;
  fetch("http://localhost:3065/users/" + userId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formDataString,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (response.status === 200) {
        alert("삭제완료");
      }
      window.location.href = "/";
      return response.json();
    })
    .then((data) => {
      console.log(data);
    });
}

function checkNickName(nickname) {
  //NOTE: 1:유효성 2:입력x 3:띄어쓰기 4:중복 5:11자이상 6:통과
  const pattern = /\s/g;
  if (pattern.test(nickname) && nickname.length > 10) {
    return 1;
  } else if (nickname === "") {
    return 2;
  } else if (pattern.test(nickname)) {
    return 3;
  } else if ("admin" === nickname) {
    //FIXME: 중복 닉네임
    return 4;
  } else if (nickname.length > 10) {
    return 5;
  } else {
    return 6;
  }
}
