// 切换盒子
function toggleBox() {
  document.getElementById('login-box').classList.toggle('active');
  document.getElementById('reg-box').classList.toggle('active');
}
document.getElementById('toReg').onclick = e => { e.preventDefault(); toggleBox(); };
document.getElementById('toLogin').onclick = e => { e.preventDefault(); toggleBox(); };

// 登录
document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const body = {
    username: document.getElementById('loginUser').value.trim(),
    password: document.getElementById('loginPwd').value.trim()
  };
  const res = await fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  }).then(r => r.json());
  if (res.code === 1) {
    localStorage.setItem('jwt_token', res.data);
    location.href = 'index.html';   // 跳回原题目页
  } else {
    alert('登录失败：'+res.msg);
  }
});

// 注册
document.getElementById('regForm').addEventListener('submit', async e => {
  e.preventDefault();
  const body = {
    username: document.getElementById('regUser').value.trim(),
    password: document.getElementById('regPwd').value.trim(),
    checkpassword: document.getElementById('regPwd2').value.trim()
  };
  if (body.password !== body.checkpassword) return alert('两次密码不一致');
  const res = await fetch('http://localhost:8080/register', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  }).then(r => r.json());
  if (res.code === 1) {
    alert('注册成功！请登录');
    toggleBox();
  } else {
    alert('注册失败：'+res.msg);
  }
});