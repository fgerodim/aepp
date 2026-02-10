var exercises = [];
var current = 0;
var order = []; // Νέο: τυχαία σειρά indices

var titleEl = document.getElementById("title");
var codeEl = document.getElementById("code");
var feedbackEl = document.getElementById("feedback");
var progressEl = document.getElementById("progress");
var checkBtn = document.getElementById("checkBtn");
var nextBtn = document.getElementById("nextBtn");

var solutionBox, scoreBox, navBox, homeBtn, restartBtn;

function createExtraUI() {
    scoreBox = document.createElement("div");
    scoreBox.id = "score";

    solutionBox = document.createElement("div");
    solutionBox.id = "solution-box";

    navBox = document.createElement("div");
    navBox.className = "buttons";
    navBox.style.display = "none";

    homeBtn = document.createElement("button");
    homeBtn.innerHTML = "🏠 Επιστροφή";
    homeBtn.className = "menu-secondary";
    homeBtn.onclick = function () {
        window.location.href = "../index.html";
    };

    restartBtn = document.createElement("button");
    restartBtn.innerHTML = "🔄 Επόμενη";
    restartBtn.onclick = function () {
        goNextExercise();
    };

    navBox.appendChild(homeBtn);
    navBox.appendChild(restartBtn);

    var app = document.querySelector(".app");
    app.appendChild(scoreBox);
    app.appendChild(solutionBox);
    app.appendChild(navBox);
}

function loadData() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "data.csv", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            parseCSV(xhr.responseText);

            // Δημιουργούμε τυχαία σειρά ασκήσεων
            order = [];
            for (let i = 0; i < exercises.length; i++) order.push(i);
            shuffle(order);

            current = 0;
            render();
        }
    };
    xhr.send();
}

// Shuffle array: Fisher-Yates
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function normalizeText(str) {
    return str
        .trim()
        .toUpperCase()
        .replace(/Α/g, "A")
        .replace(/Β/g, "B")
        .replace(/Ε/g, "E")
        .replace(/Ζ/g, "Z")
        .replace(/Η/g, "H")
        .replace(/Ι/g, "I")
        .replace(/Κ/g, "K")
        .replace(/Μ/g, "M")
        .replace(/Ν/g, "N")
        .replace(/Ο/g, "O")
        .replace(/Ρ/g, "P")
        .replace(/Τ/g, "T")
        .replace(/Υ/g, "Y")
        .replace(/Χ/g, "X");
}

function parseCSV(text) {
    var lines = text.split(/\r?\n/);
    lines.shift();

    for (var i = 0; i < lines.length; i++) {
        if (lines[i].indexOf("|") === -1) continue;

        var sep = lines[i].indexOf("|");
        var title = lines[i].substring(0, sep).trim();
        var code = lines[i].substring(sep + 1).trim().replace(/\\n/g, "\n");

        exercises.push({ title: title, code: code });
    }

    createExtraUI();
}

function render() {
    if (current >= order.length) {
        // Όλες οι ασκήσεις εμφανίστηκαν
        titleEl.innerHTML = "Τέλος ασκήσεων!";
        codeEl.innerHTML = "";
        feedbackEl.innerHTML = "";
        checkBtn.style.display = "none";
        navBox.style.display = "none";
        return;
    }

    var ex = exercises[order[current]]; // Χρησιμοποιούμε το τυχαίο index

    titleEl.innerHTML = ex.title;

    feedbackEl.innerHTML = "";
    feedbackEl.className = "";
    scoreBox.innerHTML = "";
    solutionBox.style.display = "none";
    navBox.style.display = "none";

    nextBtn.style.display = "none";
    checkBtn.style.display = "inline-block";

    var html = ex.code.replace(/%(.*?)%/g, function (_, ans) {
        var len = ans.trim().length + 2;
        return '<input class="gap" data-answer="' + ans.trim() + '" style="width:' + len + 'ch">';
    });

    codeEl.innerHTML = html;
}

function checkAnswers() {
    var inputs = document.getElementsByClassName("gap");
    var correct = 0;

    for (var i = 0; i < inputs.length; i++) {
        var inp = inputs[i];
        var ans = inp.getAttribute("data-answer");

        if (normalizeText(inp.value) === normalizeText(ans)) {
            inp.className = "gap correct locked";
            correct++;
        } else {
            inp.className = "gap wrong locked";
        }
    }

    var total = inputs.length;

    scoreBox.innerHTML = "Σκορ: " + correct + " / " + total;

    if (correct === total) {
        feedbackEl.innerHTML = "✅ Άριστα!";
        feedbackEl.className = "success";

        if (window.confetti) {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        }
    } else {
        feedbackEl.innerHTML = "❌ Υπάρχουν λάθη.";
        feedbackEl.className = "error";
    }

    showSolution();

    checkBtn.style.display = "none";
    navBox.style.display = "block";
}

function showSolution() {
    var ex = exercises[order[current]];

    var solution = ex.code.replace(/%(.*?)%/g, function (_, ans) {
        return ans;
    });

    solutionBox.innerHTML = "<strong>Σωστή λύση:</strong>\n\n" + solution;
    solutionBox.style.display = "block";
}

function goNextExercise() {
    current++;
    render();
}

checkBtn.onclick = checkAnswers;

window.onload = loadData;
