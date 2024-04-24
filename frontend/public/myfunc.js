

function signin_sendit() {
  let form = document.getElementById("signin_Form");
  let email = form.email.value;
  let pwd = form.password.value;
  let pwd_chk = form.password_chk.value;
  let nickname = form.nickname.value;
  const h_email = document.getElementById("helper_email");
  const profile_img = document.getElementById("profile-upload-input").value;
  if (profile_img == "") {
    console.log("프로필업로드");
  }
  console.log(profile_img);
  const name_chk = checkNickName(nickname);
  console.log(name_chk);
  console.log(nickname);
  if (!checkEmail(email)) {
    alert("올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)");
    return false;
  } else if ("aa@example.com" === email) {
    //FIXME: 중복 이메일 검사 부분
    alert("중복된 이메일 입니다.");
    return false;
  } else if (!checkPwd(pwd)) {
    alert(
      "비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.",
    );
    return false;
  } else if (pwd !== pwd_chk) {
    alert("비밀번호가 다릅니다.");
    return false;
  } else if (name_chk < 6) {
    if (name_chk == 1) {
      alert("띄어쓰기 불가, 10글자 이내");
      return false;
    } else if (name_chk == 2) {
      alert("닉네임을 입력해주세요");
      return false;
    } else if (name_chk == 3) {
      alert("띄어쓰기를 없애주세요");
      return false;
    } else if (name_chk == 4) {
      alert("중복된 닉네임입니다.");
      return false;
    } else if (name_chk == 5) {
      alert("닉네임은 최대 10자 까지 작성 가능합니다.");
      return false;
    }
  } else if (profile_img == "") {
    alert("프로필 사진을 추가해주세요");
    return false;
  } else {
    fetch("/data/user.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("netwr");
        }
        return response.json();
      })
      .then((data) => {
        data.data.forEach((user) => {
          if (user.email === email) {
            h_email.textContent = "중복된 이메일입니다.";
          }
        });
        form.submit();
      })
      .catch((error) => {
        console.error("thre", error);
      });
    return false;
  }
}

function board_sendit() {
  let form = document.getElementById("bbs_Form");
  let subject = form.subject.value;
  let content = form.content.value;
  if (subject == "" || content == "") {
    alert("제목, 내용을 모두 작성해주세요.");
    return false;
  } else {
    document.getElementById("send-btn").style.backgroundColor = "#7F6AEE";
    setTimeout(function () {
      form.submit();
    }, 30000);
  }
}

function member_sendit() {
  let form = document.getElementById("member_Form");
  const heltext = document.getElementById("helper-nickname");
  let nickname = form.nickname.value;
  fetch("../data/user.json")
    .then((Response) => {
      if (!Response.ok) {
        throw new Error("net");
      }
      return Response.json();
    })
    .then((data) => {
      let check = "0";
      const nickname = document.getElementById("nickname").value;
      console.log(nickname);
      data.data.forEach((user) => {
        if (user.nickname === nickname) {
          check = "1";
        }
      });

      if (check === "1") {
        heltext.textContent = "중복된 닉네임 입니다.";
        return false;
      } else if (nickname.length > 10) {
        heltext.textContent = "닉네임은 최대 10자까지 작성 가능합니다.";
        return false;
      } else if (nickname == "") {
        heltext.textContent = "닉네임을 입력해주세요.";
        return false;
      } else {
        console.log("toast message");
        let toastmessage = document.getElementById("member-btn");
        toastmessage.classList.add("toast-active");
        setTimeout(function () {
          toastmessage.classList.remove("toast-active");
        }, 1000);
      }
    })
    .catch((error) => {
      console.error("error", error);
    });
  return false;
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
//NOTE: 프로필 사진 미리보기
function checkProfile() {
  const preview = document.getElementById("preview");
  const profile_img = document.getElementById("profile-upload-input").files[0];
  const noprofile = document.getElementById("noprofile_img");
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
function cutSubject() {
  const sub = document.getElementById("list-subject");
  const element = document.querySelectorAll("#list-subject");
  for (let i = 0; i < element.length; i++) {
    if (element[i].textContent.length > 26) {
      element[i].textContent = element[i].textContent.slice(0, 26) + "...";
    }
  }
}
function cutNum() {
  //const element = document.getElementById('cutNum');
  const element = document.querySelectorAll("#cutNum");
  for (let i = 0; i < element.length; i++) {
    console.log(element[i].textContent);
    const num = parseInt(element[i].textContent);
    if (num >= 1000) {
      let digit = num / 1000;
      element[i].textContent = digit + "k";
    }
  }
}
function checkTextarea() {
  const comment = document.getElementById("textarea-input").value;
  if (comment.trim() !== "") {
    document.getElementById("comment-btn").style.backgroundColor = "#7F6AEE";
  } else {
    document.getElementById("comment-btn").style.backgroundColor = "#aca0eb";
  }
}
document
  .getElementById("textarea-input")
  .addEventListener("input", checkTextarea);

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
