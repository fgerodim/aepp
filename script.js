// Σταθερές για τη φόρτωση των στοιχείων HTML
const questionText = document.getElementById('question-text');
const trueBtn = document.getElementById('true-btn');
const falseBtn = document.getElementById('false-btn');
const feedbackText = document.getElementById('feedback-text');
const nextBtn = document.getElementById('next-btn');
const buttonsContainer = document.getElementById('buttons-container');
const scoreText = document.getElementById('score-text');

let questions = []; // Εδώ θα αποθηκευτούν οι τυχαίες ερωτήσεις
let currentQuestionIndex = 0;
let isAnswered = false;
let score = 0;
const NUMBER_OF_QUIZ_QUESTIONS = 4; // Ο αριθμός των ερωτήσεων που θέλουμε

// --- ΛΟΓΙΚΗ ΦΟΡΤΩΣΗΣ ΚΑΙ ΤΥΧΑΙΑΣ ΕΠΙΛΟΓΗΣ ---

// 1. Συνάρτηση για την ανάμειξη (shuffle) ενός πίνακα
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 🌟 ΝΕΟ: Συνάρτηση για τον υπολογισμό της κατάταξης με βάση το σκορ
function getRank(score, total) {
    // Βρίσκουμε το ποσοστό επιτυχίας
    const percentage = (score / total) * 100;
    
    // Εάν δεν υπάρχουν ερωτήσεις
    if (total === 0) return { title: 'Χωρίς Κατάταξη', emoji: '❓' };
    
    // Κατηγορίες Κατάταξης
    if (percentage === 100) {
        return { title: 'Φυτό! 🧠', emoji: '🏆' };
    } else if (percentage >= 80) {
        return { title: 'Εξαιρετικός Μαθητής!', emoji: '⭐' };
    } else if (percentage >= 60) {
        return { title: 'Καλός Μαθητής', emoji: '👍' };
    } else if (percentage >= 40) {
        return { title: 'Χρειάζεται Μελέτη', emoji: '📚' };
    } else {
        return { title: 'Κακός Μαθητής', emoji: '🤕' };
    }
}

// 2. Συνάρτηση για τη φόρτωση των ερωτήσεων από το CSV
async function fetchAndSetupQuiz() {
    // Επαναφορά όλων των μεταβλητών και εμφάνισης πριν ξεκινήσει το νέο κουίζ
    currentQuestionIndex = 0;
    score = 0;
    isAnswered = false;
    questions = [];
    
    // Επαναφορά εμφάνισης κουμπιών / κειμένων
    buttonsContainer.style.display = 'flex'; // Εμφάνιση του container απαντήσεων
    nextBtn.style.display = 'none';
    nextBtn.textContent = 'Επόμενη Ερώτηση '; // Επαναφορά του κειμένου του κουμπιού
    feedbackText.textContent = '';
    questionText.textContent = "Φόρτωση ερωτήσεων... παρακαλώ περιμένετε.";

    try {
        const response = await fetch('quiz_data.csv');
        if (!response.ok) {
            throw new Error('Δεν βρέθηκε το αρχείο quiz_data.csv. Βεβαιωθείτε ότι υπάρχει και το όνομα είναι σωστό.');
        }
        const csvText = await response.text();
        
        // Μετατροπή CSV σε πίνακα αντικειμένων
        const allQuestions = csvText.split('\n').slice(1).map(row => {
            const [question, answer] = row.split(';');
            
            return {
                question: question ? question.trim() : '',
                answer: (answer ? answer.trim().toLowerCase() === 'true' : false)
            };
        }).filter(q => q.question); // Φιλτράρισμα κενών γραμμών
        
        if (allQuestions.length < NUMBER_OF_QUIZ_QUESTIONS && allQuestions.length > 0) {
            console.warn(`Προσοχή: Βρέθηκαν μόνο ${allQuestions.length} ερωτήσεις.`);
        }
        
        // Ανάμειξη όλων των ερωτήσεων και επιλογή
        const shuffledQuestions = shuffleArray(allQuestions);
        questions = shuffledQuestions.slice(0, NUMBER_OF_QUIZ_QUESTIONS);
        
        // Ξεκίνημα του κουίζ
        if (questions.length > 0) {
            loadQuestion();
        } else {
            // Αν δεν βρεθούν ερωτήσεις
             questionText.textContent = "ΣΦΑΛΜΑ: Δεν βρέθηκαν ερωτήσεις στο quiz_data.csv. Παρακαλώ ελέγξτε το αρχείο.";
             buttonsContainer.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Σφάλμα κατά τη φόρτωση ή επεξεργασία των ερωτήσεων:', error);
        questionText.textContent = `ΣΦΑΛΜΑ: ${error.message}. Παρακαλώ ελέγξτε το αρχείο quiz_data.csv.`;
        buttonsContainer.style.display = 'none';
    }
}


// --- ΛΟΓΙΚΗ QUIZ ---

// Συνάρτηση για την ενημέρωση της εμφάνισης του σκορ
function updateScoreDisplay() {
    const totalQuestions = questions.length;
    
    if (totalQuestions === 0) {
        scoreText.textContent = `Σκορ: 0 / 0`;
        return;
    }
    
    scoreText.textContent = `Σκορ: ${score} / ${totalQuestions}`; 
}

// Συνάρτηση για την εμφάνιση της επόμενης ερώτησης
function loadQuestion() {
    isAnswered = false;
    feedbackText.textContent = '';
    nextBtn.style.display = 'none'; 
    buttonsContainer.style.pointerEvents = 'auto'; 
    feedbackText.classList.remove('correct', 'incorrect'); 
    
    // Επαναφορά κειμένου κουμπιού σε "Επόμενη Ερώτηση"
    nextBtn.textContent = 'Επόμενη Ερώτηση '; 
    
    if (currentQuestionIndex < questions.length) {
        questionText.textContent = questions[currentQuestionIndex].question;
        buttonsContainer.style.display = 'flex'; // Βεβαιωνόμαστε ότι εμφανίζονται

    } else {
        // 🏁 Τέλος του κουίζ
        
        // 🌟 Υπολογισμός Κατάταξης
        const rank = getRank(score, questions.length);
        
        // Εμφάνιση τελικού μηνύματος με την κατάταξη
        questionText.textContent = `✅ Το κουίζ ολοκληρώθηκε!\nΤελικό Σκορ: ${score} / ${questions.length}\nΚατάταξη: ${rank.emoji} ${rank.title}`; 
        buttonsContainer.style.display = 'none';
        
        // Εμφάνιση κουμπιού επανέναρξης και αλλαγή κειμένου
        nextBtn.style.display = 'block'; 
        nextBtn.textContent = 'Επανέναρξη 🔄'; 
    }
    
    updateScoreDisplay(); 
}

// Συνάρτηση για τον έλεγχο της απάντησης
function checkAnswer(userAnswer) {
    if (isAnswered) return; 

    isAnswered = true;
    const correctAnswer = questions[currentQuestionIndex].answer;
    
    buttonsContainer.style.pointerEvents = 'none'; 

    if (userAnswer === correctAnswer) {
        feedbackText.textContent = '✅ Μπράβο!';
        feedbackText.classList.add('correct');
        score++; 
    } else {
        feedbackText.textContent = '❌ Δοκίμασε την επόμενη!';
        feedbackText.classList.add('incorrect');
    }

    updateScoreDisplay(); 
    nextBtn.style.display = 'block'; 
}

// --- Χειριστές Γεγονότων (Event Listeners) ---

trueBtn.addEventListener('click', () => checkAnswer(true));
falseBtn.addEventListener('click', () => checkAnswer(false));

nextBtn.addEventListener('click', () => {
    // Έλεγχος αν το κουμπί λειτουργεί ως "Επόμενη" ή "Επανέναρξη"
    if (nextBtn.textContent.includes('Επανέναρξη')) {
        // Αν είναι το κουμπί επανέναρξης, καλούμε τη φόρτωση του κουίζ
        fetchAndSetupQuiz();
    } else {
        // Αλλιώς, προχωράμε στην επόμενη ερώτηση
        currentQuestionIndex++; 
        loadQuestion(); 
    }
});

// Εκκίνηση: Φόρτωση των ερωτήσεων
fetchAndSetupQuiz();