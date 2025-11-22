// DOM Elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");

// 原 quizQuestions 数组删除，改为后端拉取
let quizQuestions = [], currentQuestionIndex = 0, score = 0, answersDisabled = false;

// 页面加载完成即拉题
window.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:8080/api/questions',{
    headers:{'Authorization':'Bearer '+localStorage.getItem('jwt_token')}
  }).then(r=>r.json())
    .then(res=>{
      if(res.code!==1) return alert('获取题目失败');
      quizQuestions = res.data.map(q=>({
        question: q.questionText,
        answers: q.options.map((opt,idx)=>({text:opt, correct: idx===q.answerIndex}))
      }));
      totalQuestionsSpan.textContent = quizQuestions.length;
      maxScoreSpan.textContent = quizQuestions.length;
      // 原来逻辑继续
      startButton.addEventListener("click", startQuiz);
    });
});


totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

//从起始页切换到题目页
// event listeners
startButton.addEventListener("click", startQuiz);

function startQuiz() {
  // reset vars
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;

  startScreen.classList.remove("active");
  quizScreen.classList.add("active");

  showQuestion();
}

function showQuestion() {
  // reset state
  answersDisabled = false;
  const currentQuestion = quizQuestions[currentQuestionIndex];
  currentQuestionSpan.textContent = currentQuestionIndex + 1;
  
  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  progressBar.style.width = progressPercent + "%";
  questionText.textContent = currentQuestion.question;
  answersContainer.innerHTML = "";

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");  //
    button.textContent = answer.text;
    button.classList.add("answer-btn");

    // what is dataset? it's a property of the button element that allows you to store custom data
    button.dataset.correct = answer.correct;
    button.addEventListener("click", selectAnswer);
    answersContainer.appendChild(button);
  });
}

//上述代码对应的html代码：
//<div class="answers-container">
//  <button class="answer-btn" data-correct="true/false">Answer Text 1</button>
//  <button class="answer-btn" data-correct="true/false">Answer Text 2</button>
//  <button class="answer-btn" data-correct="true/false">Answer Text 3</button>
//  <button class="answer-btn" data-correct="true/false">Answer Text 4</button>
//</div>

function selectAnswer(event) {
  // optimization check
  if (answersDisabled) return;
  answersDisabled = true;

  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === "true";
  // Here Array.from() is used to convert the NodeList returned by answersContainer.children into an array, this is because the NodeList is not an array and we need to use the forEach method
  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else if (button === selectedButton) {
      button.classList.add("incorrect");
    }
  });

  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
  }

  setTimeout(() => {
    currentQuestionIndex++;
    // check if there are more questions or if the quiz is over
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 1000);
}

function showResults() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  finalScoreSpan.textContent = score;

  const percentage = (score / quizQuestions.length) * 100;

  if (percentage === 100) {
    resultMessage.textContent = "Perfect! You're a genius!";
  } else if (percentage >= 80) {
    resultMessage.textContent = "Great job! You know your stuff!";
  } else if (percentage >= 60) {
    resultMessage.textContent = "Good effort! Keep learning!";
  } else if (percentage >= 40) {
    resultMessage.textContent = "Not bad! Try again to improve!";
  } else {
    resultMessage.textContent = "Keep studying! You'll get better!";
  }
}

//从题目页到结果页
restartButton.addEventListener("click", restartQuiz);

function restartQuiz() {
  resultScreen.classList.remove("active");
  startQuiz();
}

/* ---------- 退出登录 ---------- */
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('jwt_token');
  location.href = 'auth.html';   // 跳回登录页
});
