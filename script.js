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
let isAnswered = false; // Εάν έχει απαντηθεί η τρέχουσα ερώτηση
const questionText = document.getElementById('question-text');
const trueBtn = document.getElementById('true-btn');
const falseBtn = document.getElementById('false-btn');
const feedbackText = document.getElementById('feedback-text');
const nextBtn = document.getElementById('next-btn');
const buttonsContainer = document.getElementById('buttons-container');

// Συνάρτηση για την εμφάνιση της επόμενης ερώτησης
function loadQuestion() {
    isAnswered = false;
    feedbackText.textContent = '';
    nextBtn.style.display = 'none'; // Κρύψε το κουμπί "Επόμενη"
    buttonsContainer.style.pointerEvents = 'auto'; // Ενεργοποίησε τα κουμπιά
    feedbackText.classList.remove('correct', 'incorrect'); // Καθάρισε τα στυλ

    if (currentQuestionIndex < questions.length) {
        questionText.textContent = questions[currentQuestionIndex].question;
    } else {
        // Τέλος του κουίζ
        questionText.textContent = "✅ Το κουίζ ολοκληρώθηκε! Μπράβο!";
        buttonsContainer.style.display = 'none';
    }
}

// Συνάρτηση για τον έλεγχο της απάντησης
function checkAnswer(userAnswer) {
    if (isAnswered) return; // Μην επιτρέπεις δεύτερη απάντηση

    isAnswered = true;
    const correctAnswer = questions[currentQuestionIndex].answer;
    
    // Απενεργοποίησε τα κουμπιά απάντησης
    buttonsContainer.style.pointerEvents = 'none'; 

    if (userAnswer === correctAnswer) {
        feedbackText.textContent = '✅ Σωστό! Μπράβο.';
        feedbackText.classList.add('correct');
    } else {
        feedbackText.textContent = '❌ Λάθος. Δοκίμασε την επόμενη!';
        feedbackText.classList.add('incorrect');
    }

    nextBtn.style.display = 'block'; // Εμφάνισε το κουμπί "Επόμενη"
}

// Χειριστές Γεγονότων (Event Listeners)
trueBtn.addEventListener('click', () => checkAnswer(true));
falseBtn.addEventListener('click', () => checkAnswer(false));

nextBtn.addEventListener('click', () => {
    currentQuestionIndex++; // Πήγαινε στην επόμενη ερώτηση
    loadQuestion(); // Φόρτωσε τη νέα ερώτηση
});

// Εκκίνηση του κουίζ
loadQuestion();