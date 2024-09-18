const subjectList = document.querySelector('.subject-list');
const downArrow = document.querySelector('.down-arrow');
const loaderWrap = document.querySelector('.loader-wrap');
const accountBtn = document.querySelector('.account-btn');
const dashboardBtn = document.querySelector('.dashboard-btn');
const subjectCategoryHead = document.querySelector('.subject-category');
const chooseSubject = document.querySelector('.choose-subject');
const quizWrap = document.querySelector('.quiz-wrap');
const question = document.querySelector('.question');
const optionsAnswer = document.querySelectorAll('.optionsAnswer');
const optionLabel = document.querySelectorAll('.optionLabel');
const nextBtn = document.querySelector('.next-btn');
const questionNo = document.querySelector('.question-no');
const seconds = document.querySelector('.seconds');
const reportWrap = document.querySelector('.report-wrap');
const reportGraph = document.querySelector('.report-graph');
const reportBtn = document.querySelector('.report-btn');
const detailedReportShow = document.querySelector('.detailed-report-show');
const reportDetails = document.querySelector('.report-details');
const performance = document.querySelector('.performance');
const performanceImg = document.querySelector('.performance-img');


// result json data 
const result = []

// open dashboard btn on click of account btn 
accountBtn.onclick = () => {
    accountBtn.classList.toggle('active');
    dashboardBtn.classList.toggle('active');
}



// subject with there subject IDs 

const category = {
    gk: 9,
    anime: 31,
    sport: 21,
    computer: 18
}

loaderWrap.classList.add('active');


// generate category list on frontend

window.onload = (event) => {
    for (let subject in category) {
        const subjectName = document.createElement('li');
        subjectName.innerText = subject;
        subjectList.appendChild(subjectName);
    }
    getCategory()
    loaderWrap.classList.remove('active');
}


// create dynamic object of each subject 
let quizSubjectId = 1;

class subject {
    constructor(subjectName, quizId, questions) {
        this.subject = subjectName;
        this.quizId = quizId;
        this.questions = questions;
    }
}

// get the id of each subject category 

function getCategory() {
    const getSubjectCategory = subjectList.querySelectorAll('li');
    getSubjectCategory.forEach((item) => {
        item.onclick = () => {
            let subjectCategory = item.innerText.toLowerCase();
            let subjectId = category[subjectCategory];
            generateQuiz(subjectId, subjectCategory);
            result.push(new subject(subjectCategory, quizSubjectId, []));
            quizSubjectId++;
            console.log('results : - ',result);

        }
    })
}


// fetch trivia API 

function generateQuiz(subjectId, subjectCategory) {
    loaderWrap.classList.add('active');
    const quizApi = `https://opentdb.com/api.php?amount=20&category=${subjectId}&difficulty=easy&type=multiple`

    fetch(quizApi)
        .then(response => response.json())
        .then(data => {
            getSubjectData(data);
            loaderWrap.classList.remove('active');
            subjectCategoryHead.innerText = subjectCategory;

        })
        .catch(error => console.log('Error:- ', error)
        )
}


// get the data of perticular subject and active the question screen

function getSubjectData(data) {
    chooseSubject.classList.add('active');
    quizWrap.classList.add('active');
    let eachQuestionObj = data.results;
    nextQuestion(eachQuestionObj)
}

// next question on next or time end 
function nextQuestion(eachQuestionObj) {
    let questionsLength = eachQuestionObj.length;
    let count = 0;
    let setCount = 20;
    let condition = true;

    nextBtn.onclick = (e) => {
        count++;
        if (count < questionsLength) {
            eachSingleQuestion(count, eachQuestionObj)
            questionNo.innerText = (count + 1) + "."
            condition = false;
            // storeData()
            setTimer()
        }
        else {
            if (nextBtn.innerText == 'Submit') {
                quizWrap.classList.remove('active');
                reportWrap.classList.add('active');
                getDetailedReport(result)
                console.log('final result:- ',result);
                
            }
            return
        };
    }

    function setTimer() {
        if (!condition) {
            setCount = 20;
            seconds.innerText = setCount;
            condition = true;
            return
        }
        seconds.innerText = setCount;
        setCount--;
        if (setCount >= 0) {
            setTimeout(setTimer, 1000);
        }
        else {
            if (count < questionsLength) {
                setCount = 20;
                count++
                eachSingleQuestion(count, eachQuestionObj)
                questionNo.innerText = (count + 1) + "."
                // storeData()
                setTimer()
            }

        }
    }
    setTimer()

    eachSingleQuestion(count, eachQuestionObj)

}

function eachSingleQuestion(itemNumber, questionArr) {
    resetRadio()
    let questionObj = questionArr[itemNumber];
    let incorrectAns = questionObj.incorrect_answers;
    let correctAns = questionObj.correct_answer;
    let ansArr = [correctAns, ...incorrectAns];
    let allAns = shuffleArr(ansArr);
    question.innerHTML = questionObj.question;
    getResponse(questionObj, allAns);
    if (itemNumber == 19) {
        nextBtn.innerText = 'Submit'
    }
    setEachOption(allAns);
}


// shuffle array 
function shuffleArr(arr) {
    let array = arr;
    let currentIndex = array.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array
}


// set each option value from the data 
function setEachOption(allAns) {
    optionLabel.forEach(function (e, i) {
        e.innerHTML = allAns[i];
    })
    optionsAnswer.forEach(function (e, i) {
        e.setAttribute('data-value', allAns[i]);

    })
}

// reset all radioBtns on next questions 
function resetRadio() {
    optionsAnswer.forEach(function (e) {
        e.checked = false;
    })
}

// get users data or response 
class response {
    constructor(question, options, correctOption, userResponse) {
        this.question = question;
        this.options = options;
        this.correctOption = correctOption;
        this.userResponse = userResponse;
    }
}

function getResponse(questionObj, optionsArr) {
    let responseVar = new response(questionObj.question, optionsArr, questionObj.correct_answer);
    optionsAnswer.forEach(function (e) {
        e.onchange = () => {
            responseVar.userResponse = e.getAttribute('data-value');
        }
    })
    storeData(responseVar)

}

// collect user response from user 
function collectUserResponse(responseVar) {
    optionsAnswer.forEach(function (e) {
        e.onchange = () => {
            responseVar.userResponse = e.getAttribute('data-value');

        }
    })
}

// store this data into results arr 
function storeData(responseVar) {
    let currentElement = result[result.length - 1];
    currentElement.questions.push(responseVar);
    console.log('result second:-',result);

}

// get detailed report 
function getDetailedReport(result){
    reportBtn.onclick = ()=>{
        let currentQuiz = result[result.length-1];
        let quizSubject = currentQuiz.subject;
        let allQuestions = currentQuiz.questions;
        let totalQuestions = 0;
        let attempedQuestions = 0;
        let wrongAnswers = 0;
        let correctAnswers = 0;
        let unattempedQuestions = 0;
        let totalMarks = 0;
        let obtainedMarks = 0;
        allQuestions.forEach((item)=>{
            totalQuestions++;
            totalMarks += 2;
            if(item.userResponse){
                attempedQuestions++
                if(item.userResponse===item.correctOption){
                    obtainedMarks += 2;
                    correctAnswers++;
                }
                else{
                    wrongAnswers++
                }
            }
            else{
                unattempedQuestions++
            }
        })
        printDetails(quizSubject, totalQuestions, attempedQuestions, unattempedQuestions, totalMarks, obtainedMarks, wrongAnswers, correctAnswers)
        reportWrap.classList.remove('active');
        reportDetails.classList.add('active');
    }
}

// print detailed report of quiz 
function printDetails(quizSubject, totalQuestions, attempedQuestions, unattempedQuestions, totalMarks, obtainedMarks, wrongAnswers, correctAnswers){
    let percentageObtained = (obtainedMarks/totalMarks)* 100;
    const detailHtml = `<li><span class="report-key subject-key">Subject</span><span class="report-value subject-value">${quizSubject}</span></li>
                            <li><span class="report-key total-key">Total Questions</span><span class="report-value total-value">${totalQuestions}</span></li>
                            <li><span class="report-key attemped-key">Attemped Questions</span><span class="report-value attempted-value">${attempedQuestions}</span></li>
                            <li><span class="report-key unattemped-key">Unattemped Questions</span><span class="report-value unattemped-value">${unattempedQuestions}</span></li>
                            <li><span class="report-key Wrong-key">Wrong Answers</span><span class="report-value wrong-value">${wrongAnswers}</span></li>
                            <li><span class="report-key correct-key">Correct Answers</span><span class="report-value correct-value">${correctAnswers}</span></li>
                            <li><span class="report-key total-marks-key">Total Marks</span><span class="report-value total-marks-value">${totalMarks}</span></li>
                            <li><span class="report-key marks-obtained-key">Marks Obtained</span><span class="report-value marks-obtained-value">${obtainedMarks}</span></li>
                            <li><span class="report-key total-percent-key">Percentage</span><span class="report-value total-percent-value">${percentageObtained}%</span></li>`

    detailedReportShow.innerHTML = detailHtml;
    if(percentageObtained<=100 && percentageObtained>80){
        performance.innerText = "Good";
        performanceImg.src = '../assets/images/mood-happy.svg';
    }
    else if(percentageObtained<=80 && percentageObtained>50){
        performance.innerText = "Average"
        performanceImg.src = './assets/images/mood-avg.svg';
    }
    else{
        performance.innerText = "Bad"
        performanceImg.src = './assets/images/mood-bad.svg';
    }
    detailedChart(totalQuestions, unattempedQuestions,wrongAnswers,correctAnswers)
}


function detailedChart(totalQuestions, unattempedQuestions, wrongAnswers, correctAnswers){
    let correctAnswersPercentage = (correctAnswers/totalQuestions)*100;
    let wrongAnswersPercentage = (wrongAnswers/totalQuestions)*100;
    let unattempedQuestionsPercentage = (unattempedQuestions/totalQuestions)*100;
    new Chart(reportGraph, {
        type: 'pie',
        data: {
          labels: ['Correct', 'Wrong', 'Unatempted'],
          datasets: [{
            label: 'Percentage',
            data: [correctAnswersPercentage , wrongAnswersPercentage, unattempedQuestionsPercentage],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
}


