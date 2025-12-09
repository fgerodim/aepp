const questions = [
    {
        question: "Η Γη είναι επίπεδη.",
        answer: false
    },
    {
        question: "Το Παρίσι είναι η πρωτεύουσα της Γαλλίας.",
        answer: true
    },
    {
        question: "Ο Ήλιος είναι ένας πλανήτης.",
        answer: false
    },
    {
        question: "2 + 2 = 4.",
        answer: true
    }
    // Πρόσθεσε όσες ερωτήσεις θέλεις!
];

let currentQuestionIndex = 0;
let isAnswered = false; 
let score = 0; 

// Αντιστοίχιση στοιχείων HTML
const questionText = document.getElementById('question-text');
const trueBtn = document.getElementById('true-btn');
const falseBtn = document.getElementById('false-btn');
const feedbackText = document.getElementById('feedback-text');
const nextBtn = document.getElementById('next-btn');
const buttonsContainer = document.getElementById('buttons-container');
const scoreText = document.getElementById('score-text'); 

// Συνάρτηση για την ενημέρωση της εμφάνισης του σκορ
function updateScoreDisplay() {
    // Ο συνολικός αριθμός απαντημένων ερωτήσεων είναι ο δείκτης (index) της τρέχουσας ερώτησης.
    // Εάν δεν έχει απαντηθεί η τρέχουσα ερώτηση, ο παρονομαστής είναι ο τρέχων δείκτης.
    // Εάν έχει απαντηθεί, ο παρονομαστής είναι ο δείκτης + 1.
    
    // Αριθμός απαντημένων ερωτήσεων:
    const answeredCount = isAnswered ? currentQuestionIndex + 1 : currentQuestionIndex; 
    
    // Εμφάνιση του τρέχοντος σκορ / απαντημένος αριθμός ερωτήσεων
    // Χρησιμοποιούμε Math.max(1, answeredCount) για να αποφύγουμε εμφάνιση "Σκορ: 0 / 0" στην αρχή
    scoreText.textContent = `Σκορ: ${score} / ${Math.max(1, answeredCount)}`; 
    
    // ΔΙΟΡΘΩΣΗ: Για την πρώτη ερώτηση, δείχνουμε 0/0.
    if (currentQuestionIndex === 0 && !isAnswered) {
        scoreText.textContent = `Σκορ: 0 / 0`;
    }
}

// Συνάρτηση για την εμφάνιση της επόμενης ερώτησης
function loadQuestion() {
    isAnswered = false;
    feedbackText.textContent = '';
    nextBtn.style.display = 'none'; 
    buttonsContainer.style.pointerEvents = 'auto'; 
    feedbackText.classList.remove('correct', 'incorrect'); 

    if (currentQuestionIndex < questions.length) {
        questionText.textContent = questions[currentQuestionIndex].question;
    } else {
        // Τέλος του κουίζ - εμφάνιση τελικού σκορ
        questionText.textContent = `✅ Το κουίζ ολοκληρώθηκε! Το τελικό σου σκορ είναι: ${score} / ${questions.length}`; 
        buttonsContainer.style.display = 'none';
        nextBtn.style.display = 'none'; 
    }
    
    // Ενημερώνουμε το σκορ, αλλά ο παρονομαστής θα είναι ο τρέχων δείκτης (γιατί δεν έχουμε απαντήσει ακόμα).
    updateScoreDisplay(); 
}

// Συνάρτηση για τον έλεγχο της απάντησης
function checkAnswer(userAnswer) {
    if (isAnswered) return; 

    isAnswered = true;
    const correctAnswer = questions[currentQuestionIndex].answer;
    
    buttonsContainer.style.pointerEvents = 'none'; 

    if (userAnswer === correctAnswer) {
        feedbackText.textContent = '✅ Σωστό! Μπράβο.';
        feedbackText.classList.add('correct');
        score++; 
    } else {
        feedbackText.textContent = '❌ Λάθος. Δοκίμασε την επόμενη!';
        feedbackText.classList.add('incorrect');
    }

    // Τώρα που απαντήθηκε η ερώτηση, ενημερώνουμε το σκορ.
    updateScoreDisplay(); 
    nextBtn.style.display = 'block'; 
}

// Χειριστές Γεγονότων (Event Listeners)
trueBtn.addEventListener('click', () => checkAnswer(true));
falseBtn.addEventListener('click', () => checkAnswer(false));

nextBtn.addEventListener('click', () => {
    currentQuestionIndex++; 
    loadQuestion(); 
});

// Εκκίνηση του κουίζ
loadQuestion();