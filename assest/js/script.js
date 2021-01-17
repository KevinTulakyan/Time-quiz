// query selectors
var quizEl = document.querySelector("#quiz");
var complete = document.querySelector("#complete");
var startBtnEl = document.querySelector("#startBtn");
var questionsEl = document.querySelector('#question');
var answersEl = document.querySelector('#answers')
var timeSpanEl = document.querySelector("#timeSpan");
var introEl = document.querySelector("#introduction");
var resultsEl = document.querySelector("#results");
var highScores = document.querySelector("#highScores");
var initials = document.querySelector("#initials");
var clearHSbtn = document.querySelector("#clearHighscoresBtn");
var highScoresList = document.querySelector("#highScoresList");
var submit = document.querySelector("#submit");
var score = document.querySelector("#finalScore");


// declarations
var currentQuestion = 0;
var totalTime = 100;
var timeLeft = totalTime
var timePassed = 0;
var penalty = 0;
var correctAnswers = 0;
var registered = false;
var time = setInterval(timer, 1000);
var finalScore = 0;
var highScoreArray = [];

// questions
var questionObjArr = [{
    question: "Inside which HTML element do we put the JavaScript?",
    options: ["<script>", "<javascript>", "<js>", "<scripting>"],
    correct: 0
  },
  {
    question: 'What is the correct syntax for referring to an external script called "xxx.js"?',
    options: ['<script src="xxx.js">','<script name="xxx.js">','<script href="xxx.js">','<script value="xxx.js">'],
    correct: 0
  },
  {
    question: "Where is the correct place to insert a JavaScript?",
    options: ["The <footer> section is a correct place to put it", "The <body> section is a correct place to put it", "The <head> section is a correct place to put it", "Both A and B is a correct place to put it"],
    correct: 0
  },
  {
    question: 'How do you write "Hello" in an alert box?',
    options: ['alert("Hello")', 'msgBox("Hello")', 'alertBox("Hello")', 'alertBox=("Hello")'],
    correct: 0
  },
  {
    question: "How do you create a function?",
    options: ["var myFunction = function()", "var function() = myFunction()", "function myFunction","create myFunction"],
    correct: 0
  },
  {
    question: "How do you call a function",
    options: ["call myFunction()", "myFunction()", "call function myFunction", "call.myFunction()"],
    correct: 0
  },
  {
    question: "How do you write a conditional statement for executing some statements only if 'i' is equal to 5?",
    options: ["if(i===5)", "if i=5 then", "if(i=5)", "if i===5"],
    correct: 0
  },
  {
    question: "How do you write a condiditon statement for executing some statements only if 'i' is not equal to 5?",
    options: ["if(i!=5)","if not 5","if =! 5","if != 5"],
    correct: 0
  },
  {
    question: 'How does a "for" loop start?',
    options: ["for (i = 0; i <= 5; i++)", "for (i = 0; i <= 5)", "for (i = 0; i++)", "for (i++; i <= 5)"],
    correct: 0
  },
  {
    question: "How do you comment in JavaScript",
    options: ["//","<!---->",";","comments:"],
    correct: 0
  }];

// initialize code
function initialize() {
  timeSpanEl.textContent = timeLeft;
  quizEl.style.display = "none";
  complete.style.display = "none";
  introEl.style.display = "block";
  startBtnEl.style.display = "block";
  currentQuestion = 0;
  totalTime = 100;
  timeLeft = totalTime;
  timePassed = 0;
  penalty = 0;
  correctAnswers = 0;
  registered = false;
  timeSpanEl.textContent = timeLeft;
  if (localStorage.getItem("highscore")) {
      highScoreArray = localStorage.getItem("highscore").split(",");
  }
  clearInterval(time);
  complete.firstElementChild.setAttribute("class", "alert alert-info mt-0 mb-0");
  submit.setAttribute("class", "btn btn-info");
}

// display question
function showQuestion() {
  questionsEl.textContent = questionObjArr[currentQuestion].question;
  var indexArray = [];
  for (i = 0; i < questionObjArr[currentQuestion].options.length; i++) {
    var questionBtn = document.createElement("button");
    questionBtn.setAttribute("type", "button");
    questionBtn.setAttribute("class", "list-group-item list-group-item-action list-group-item-info mt-1 answerButton");
    questionBtn.setAttribute("data-index", i);
    if (i === 0) {
      questionBtn.setAttribute("correct", "yes");
    } else {
      questionBtn.setAttribute("correct", "no");
    }
      questionBtn.textContent = questionObjArr[currentQuestion].options[i];
      answersEl.append(questionBtn);
      indexArray.push(i);
  }
  answersEl.childNodes.forEach(function (child) {
  var rndIndex = Math.floor(Math.random() * indexArray.length);
  answersEl.append(answersEl.children[rndIndex]);
  indexArray.splice(rndIndex, 1);
  });
}

// selected answers
function answersClicked(event) {
  if (event.target.matches("button")) {
    var index = parseInt(event.target.getAttribute("data-index"));
    var timeInterval = 1000;
    disableQuestions();
    if (event.target.getAttribute("correct") === "yes") {
      displayResult(true);
      correctAnswers++;
    } 
    else {
      penalty += 5;
      clearInterval(time);
      time = setInterval(timer, 1000);
      displayResult(false);
    }
    currentQuestion++;
  
    if (currentQuestion === questionObjArr.length) {
      timeInterval = 5000;
      gameOver("questions_done");
    } 
    else {
      setTimeout(removeQuestionsButtons, 1000);
      setTimeout(showQuestion, 1001);
    }
    setTimeout(function () {
      resultsEl.style.display = "none";
    }, timeInterval);
  }
}

// ending results
function displayResult(correct) {
  if (correct) {
    resultsEl.setAttribute("class","alert alert-success mt-0 mb-0 pt-0 pb-0 text-center");
    resultsEl.innerHTML = "<strong>Correct</strong> Keep going!";
    resultsEl.style.display = "block";
  } 
  else {
    resultsEl.setAttribute("class","alert alert-danger mt-0 mb-0 pt-0 pb-0 text-center");
    resultsEl.innerHTML ="<strong>Incorrect. </strong> Keep trying!!";
    resultsEl.style.display = "block";
    timeSpanEl.style.color = "red";
    setTimeout(function () {
      timeSpanEl.style.color = "black";
    }, 1000);
  }
}

// change answer
function removeQuestionsButtons() {
  questionsEl.textContent = "";
  var child = answersEl.lastElementChild;
  while (child) {
    answersEl.removeChild(child);
    child = answersEl.lastElementChild;
  }
}

// stop question
function disableQuestions() {
  let questionsButton = document.querySelectorAll(".answerButton");
  questionsButton.forEach((element) => {
  element.setAttribute("class","list-group-item list-group-item-action list-group-item-danger mt-1 answerButton disabled");
    if (parseInt(element.getAttribute("data-index")) === questionObjArr[currentQuestion].correct) {
        element.setAttribute("class", "list-group-item list-group-item-action list-group-item-success mt-1 answerButton disabled");
    }
  });
}

// count down clock
function timer() {
  timeLeft = totalTime - timePassed - 1 - penalty;
  timeSpanEl.textContent = timeLeft;
  timePassed++;
  if (timeLeft <= 0) {
    clearInterval(time);
    disableQuestions();
    gameOver("time_out");
  }
}

// starts quiz
function startQuiz() {
  introEl.style.display = "none";
  startBtnEl.style.display = "none";
  quiz.style.display = "block";
  time = setInterval(timer, 1000);  
  showQuestion();
}

// end of test 
function gameOver(cause) {
  if (cause === "questions_done") {
    console.log("QUESTIONS DONE");
    setTimeout(() => {
      resultsEl.setAttribute("class","alert alert-dark mt-0 mb-0 pt-0 pb-0 text-center");
      resultsEl.innerHTML = "<strong>Quiz finished</strong> Good luck!";
    }, 1500);
    clearInterval(time);
  } 
  else if (cause === "time_out") {
    console.log("TIME OUT");
    disableQuestions();
    setTimeout(() => {
    }, 4000);
    resultsEl.setAttribute("class","alert alert-info mt-0 mb-0 pt-0 pb-0 text-center");
    resultsEl.innerHTML = "<strong>Time finished</strong> Good luck!";
  } 
  else {
    return false;
  }
  resultsEl.style.display = "block";
  setTimeout(function () {
    var addedScore = correctAnswers + timeLeft;
    score.textContent = addedScore;
    finalScore = addedScore;
    quiz.style.display = "none";
    complete.style.display = "block";
    resultsEl.style.display = "none";
    removeQuestionsButtons();
  }, 4000);
}

// add highscores
function inputHighscores() {
  var highScoreEl = document.createElement("li");
  var highscoreStr = initials.value + " - " + finalScore;
  highScoreArray.push(highscoreStr);
  highScoreEl.textContent = highscoreStr;
  highScoresList.append(highScoreEl);
  localStorage.setItem("highscore", highScoreArray);
  registered = true;
  initials.value = "";
  // modal display
  $("#staticBackdrop").modal("show");
}

// load all scores
function loadHighScores() {
  var tempHighscoresArray = [];
  var tempHighscoresObject = {};
  var tempHighscoresObjectsArray = [];
  var tempLocalSCoreArray = [];
  while (highScoresList.hasChildNodes()) {
    highScoresList.removeChild(highScoresList.childNodes[0]);
  }
  var lastPos;
  var lastChar = "";
  var localScore = 0;
  var localStrScore = "";
  var tempHighscore = "";
  for (i = 0; i < highScoreArray.length; i++) {
    for (j = highScoreArray[i].length - 1; j >= 0; j--) {
      lastPos = highScoreArray[i].length - 1;
      lastChar = highScoreArray[i][lastPos - j];
      if (lastChar && lastChar >= 0 && lastChar <= 9) {
        localScore += lastChar;
      }
      if (j > 1) {
        if (j === 2 && lastChar === "1") {
        }
        localStrScore += lastChar;
      }
      localScore = parseInt(localScore);
    }

    tempHighscore = localScore + localStrScore;
    tempHighscoresArray.push(tempHighscore);
    tempHighscoresObject.score = localScore;
    tempHighscoresObject.scoreStr = localStrScore;

    tempHighscoresObjectsArray.push(tempHighscoresObject);
    tempLocalSCoreArray.push(localScore);
    localScore = 0;
    localStrScore = "";
    tempHighscoresObject = {};
  }
  tempLocalSCoreArray.sort(function (a, b) {
    return b - a;
  });
  var sortedScoresCompleteArray = [];
  var flagged = [];
  tempLocalSCoreArray.forEach(function (element) {
    tempHighscoresObjectsArray.forEach(function (object, index) {
      if (element === object.score && !flagged.includes(index)) {
        flagged.push(index);

        var tempScoreString = object.scoreStr + " " + object.score;
        sortedScoresCompleteArray.push(tempScoreString);
      }
    });
  });
  for (i = 0; i < sortedScoresCompleteArray.length; i++) {
      var highScoreElement = document.createElement("li");
      highScoreElement.textContent = sortedScoresCompleteArray[i];
      for (j = sortedScoresCompleteArray[i].length - 1; j >= 0; j--) {
        lastPos = sortedScoresCompleteArray[i].length - 1;
        lastChar = sortedScoresCompleteArray[i][lastPos - j];
        if (lastChar && lastChar >= 0 && lastChar <= 9) {
          localScore += lastChar;
        }
        if (j > 1) {
          localStrScore += lastChar;
        }
  
        localScore = parseInt(localScore);
      }
  
      tempHighscore = localScore + localStrScore;
  
      if (localScore > 80 && localScore <= 100) {
        highScoreElement.setAttribute("class","list-group-item list-group-item-success");
      } 
      else if (localScore > 70 && localScore <= 80) {
        highScoreElement.setAttribute("class","list-group-item list-group-item-info");
      } 
      else if (localScore > 60 && localScore <= 70) {
        highScoreElement.setAttribute("class","list-group-item list-group-item-primary");
      } 
      else if (localScore > 50 && localScore <= 60) {
        highScoreElement.setAttribute("class","list-group-item list-group-item-warning");
      } 
      else if (localScore <= 50) {
        highScoreElement.setAttribute("class","list-group-item list-group-item-danger");
      }
  
      highScoresList.append(highScoreElement);
      tempHighscoresArray.push(tempHighscore);
      tempHighscoresObject.score = localScore;
      tempHighscoresObject.scoreStr = localStrScore;
      tempHighscoresObjectsArray.push(tempHighscoresObject);
      tempLocalSCoreArray.push(localScore);
      localScore = 0;
      localStrScore = "";
      tempHighscoresObject = {};
    }
  }
  // delete it all
  function clearHighscores() {
    highScoreArray = [];
    localStorage.setItem("highscore", highScoreArray);
    loadHighScores();
  }


//event listeners
startBtnEl.addEventListener("click", startQuiz);
answersEl.addEventListener("click", answersClicked);
submit.addEventListener("click", inputHighscores);
clearHSbtn.addEventListener("click", clearHighscores);
$("#staticBackdrop").on("shown.bs.modal", function (e) {
  loadHighScores();
});
$("#staticBackdrop").on("hidden.bs.modal", function (e) {
    if (registered) {
      initialize();
    }
  });

initialize();