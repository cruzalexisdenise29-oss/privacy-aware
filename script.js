
/* =========================================
   PRIVACY AWARE - JAVASCRIPT
   UPDATED AND FIXED VERSION
========================================= */

/* =========================================
   HELPER FUNCTIONS
========================================= */

function getElement(id) {
    return document.getElementById(id);
}

function scrollToSection(id) {
    const section = getElement(id);

    if (section) {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

function setDisplay(id, display) {
    const element = getElement(id);
    if (element) element.style.display = display;
}

/* =========================================
   LANDING PAGE AND PRIVACY ALERT
========================================= */

function showPrivacyAlert() {
    const alertBox = getElement("privacyAlert");

    if (!alertBox) {
        console.error("Privacy alert element not found.");
        return;
    }

    alertBox.style.display = "flex";
    alertBox.classList.add("show");
}

function closeAlert() {
    const alertBox = getElement("privacyAlert");

    if (!alertBox) return;

    alertBox.classList.remove("show");
    alertBox.style.display = "none";
}

function enterWebsite() {
    closeAlert();

    setDisplay("landingPage", "none");
    setDisplay("homePage", "block");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function logoutWebsite() {
    closeFeature();
    closeAlert();

    setDisplay("homePage", "none");
    setDisplay("landingPage", "flex");

    getElement("navLinks")?.classList.remove("show");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* Close alert when clicking outside the alert window */

document.addEventListener("click", function (event) {
    const alertBox = getElement("privacyAlert");

    if (
        alertBox &&
        event.target === alertBox &&
        alertBox.style.display !== "none"
    ) {
        closeAlert();
    }
});

/* =========================================
   NAVIGATION
========================================= */

function toggleMenu() {
    getElement("navLinks")?.classList.toggle("show");
}

document.querySelectorAll("#navLinks a").forEach(link => {
    link.addEventListener("click", function () {
        getElement("navLinks")?.classList.remove("show");
    });
});

/* =========================================
   LIGHT AND DARK MODE
========================================= */

function setTheme(theme) {
    if (theme !== "light" && theme !== "dark") {
        theme = "dark";
    }

    document.body.setAttribute("data-theme", theme);

    const button = getElement("themeToggle");

    if (button) {
        button.setAttribute(
            "aria-label",
            theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
        );

        const label =
            getElement("themeLabel") ||
            button.querySelector(".theme-label");

        if (label) {
            label.textContent =
                theme === "dark" ? "LIGHT MODE" : "DARK MODE";
        }
    }
}

function toggleTheme() {
    const currentTheme =
        document.body.getAttribute("data-theme") || "dark";

    const newTheme =
        currentTheme === "dark" ? "light" : "dark";

    setTheme(newTheme);

    try {
        localStorage.setItem("privacyAwareTheme", newTheme);
    } catch (error) {
        console.log("Theme preference could not be saved.");
    }
}

function initializeTheme() {
    let savedTheme = "dark";

    try {
        savedTheme =
            localStorage.getItem("privacyAwareTheme") || "dark";
    } catch (error) {
        savedTheme = "dark";
    }

    setTheme(savedTheme);
}

initializeTheme();

/* =========================================
   RED BINARY RAIN
========================================= */

function createBinaryRain(canvasId, options = {}) {
    const canvas = getElement(canvasId);

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let width = 0;
    let height = 0;
    let columns = [];
    let animationFrame = null;
    let isRunning = false;

    const fontSize = options.fontSize || 14;
    const speed = options.speed || 1;
    const color = options.color || "#ff2525";

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();

        width = rect.width;
        height = rect.height;

        if (width <= 0 || height <= 0) return;

        const pixelRatio = window.devicePixelRatio || 1;

        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);

        ctx.setTransform(
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
        );

        const columnCount = Math.ceil(width / fontSize);

        columns = [];

        for (let i = 0; i < columnCount; i++) {
            columns.push({
                y: Math.random() * -height,
                speed: (Math.random() * 1.5 + 1) * speed,
                length: Math.floor(Math.random() * 12) + 5
            });
        }
    }

    function draw() {
        if (!isRunning || width <= 0 || height <= 0) {
            animationFrame = null;
            return;
        }

        ctx.clearRect(0, 0, width, height);

        ctx.font = fontSize + "px monospace";
        ctx.textAlign = "center";

        columns.forEach((column, index) => {
            const x = index * fontSize;

            for (let i = 0; i < column.length; i++) {
                const y = column.y - i * fontSize;

                if (y < 0 || y > height) continue;

                const opacity = Math.max(
                    0.08,
                    1 - i / column.length
                );

                ctx.fillStyle =
                    `rgba(255, 35, 45, ${opacity})`;

                if (i === 0) {
                    ctx.shadowColor = color;
                    ctx.shadowBlur = 12;
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.fillText(
                    Math.random() > 0.5 ? "1" : "0",
                    x,
                    y
                );
            }

            ctx.shadowBlur = 0;

            column.y += column.speed;

            if (column.y - column.length * fontSize > height) {
                column.y = Math.random() * -150;
                column.speed =
                    (Math.random() * 1.5 + 1) * speed;
            }
        });

        animationFrame = requestAnimationFrame(draw);
    }

    function startRain() {
        if (isRunning || document.hidden) return;

        isRunning = true;

        if (width <= 0 || height <= 0) {
            resizeCanvas();
        }

        draw();
    }

    function stopRain() {
        isRunning = false;

        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
    }

    resizeCanvas();
    startRain();

    window.addEventListener("resize", function () {
        resizeCanvas();

        if (!isRunning) {
            startRain();
        }
    });

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            stopRain();
        } else {
            startRain();
        }
    });
}

createBinaryRain("binaryRain", {
    fontSize: 14,
    speed: 0.8,
    color: "#ff2020"
});

createBinaryRain("heroBinaryRain", {
    fontSize: 15,
    speed: 1.3,
    color: "#ff2525"
});

/* =========================================
   SVG ICONS
========================================= */

const icons = {
    shield: `<svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 4 40 10v12c0 10-7 17-16 22C15 39 8 32 8 22V10z"/>
        <path d="m16 24 5 5 11-12"/>
    </svg>`,

    document: `<svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M12 5h17l8 8v30H12z"/>
        <path d="M29 5v9h8M18 23h13M18 30h13M18 37h8"/>
    </svg>`,

    law: `<svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 5v36M10 12h28M15 12l-8 15h16zM33 12l-8 15h16z"/>
        <path d="M15 41h18"/>
    </svg>`,

    clipboard: `<svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="9" y="9" width="30" height="35" rx="3"/>
        <path d="M18 9V5h12v4M16 20h16M16 27h16M16 34h10"/>
    </svg>`,

    question: `<svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="19"/>
        <path d="M18 18a6 6 0 0 1 12 0c0 5-6 5-6 11M24 35v1"/>
    </svg>`,

    warning: `<svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 5 45 42H3z"/>
        <path d="M24 18v11M24 35v1"/>
    </svg>`,

    lock: `<svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="8" y="21" width="32" height="23" rx="3"/>
        <path d="M15 21v-8a9 9 0 0 1 18 0v8M24 30v6"/>
    </svg>`,

    mail: `<svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="4" y="9" width="40" height="30" rx="3"/>
        <path d="m5 12 19 15 19-15"/>
    </svg>`,

    user: `<svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="15" r="9"/>
        <path d="M7 43c1-10 7-15 17-15s16 5 17 15"/>
    </svg>`,

    phone: `<svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="11" y="3" width="26" height="42" rx="4"/>
        <path d="M20 8h8M21 39h6"/>
    </svg>`
};

/* =========================================
   FEATURE CONTENTS
========================================= */

const features = [
    {
        title: "Personal Data Protection Tips",
        icon: "shield",
        content: `
            <p>Personal data refers to information that identifies or can identify an individual. Protecting this information helps prevent identity theft, scams, and unauthorized access.</p>
            <h3>How to Protect Your Personal Data</h3>
            <ul>
                <li>Use strong and unique passwords.</li>
                <li>Never share your password or OTP.</li>
                <li>Avoid posting private information publicly.</li>
                <li>Enable two-factor authentication.</li>
                <li>Check website links before entering information.</li>
                <li>Log out when using shared devices.</li>
                <li>Keep your applications and devices updated.</li>
            </ul>
            <h3>Remember</h3>
            <p>Think before sharing. Once your personal information is exposed, it may be difficult to control how other people use it.</p>
        `
    },
    {
        title: "Privacy Policy Guide",
        icon: "document",
        content: `
            <p>A privacy policy explains how a website, application, or organization collects, uses, stores, and protects personal information.</p>
            <h3>What to Look For</h3>
            <ul>
                <li>What personal information is collected?</li>
                <li>Why is the information collected?</li>
                <li>How will the information be used?</li>
                <li>Who can access or receive the information?</li>
                <li>How long will the information be stored?</li>
                <li>How can users exercise their privacy rights?</li>
            </ul>
            <h3>Before Agreeing</h3>
            <p>Read the privacy policy before creating an account or using an online service. Do not automatically accept terms without understanding them.</p>
        `
    },
    {
        title: "Data Privacy Act of 2012 (RA 10173)",
        icon: "law",
        content: `
            <p>Republic Act No. 10173, also known as the Data Privacy Act of 2012, protects the fundamental right to privacy of communication while ensuring the free flow of information for innovation and growth.</p>
            <h3>Main Purpose</h3>
            <ul>
                <li>Protect personal information.</li>
                <li>Promote responsible data processing.</li>
                <li>Prevent unauthorized access and misuse.</li>
                <li>Encourage transparency and accountability.</li>
            </ul>
            <h3>Important Terms</h3>
            <p><b>Data Subject:</b> The individual whose personal information is collected or processed.</p>
            <p><b>Personal Information:</b> Information that identifies an individual or makes their identity apparent.</p>
            <p><b>Personal Information Controller:</b> A person or organization that controls the processing of personal information.</p>
            <h3>Learn More</h3>
            <p>Visit the National Privacy Commission for more information.</p>
            <a href="https://privacy.gov.ph/data-privacy-act/" target="_blank" rel="noopener">VISIT NATIONAL PRIVACY COMMISSION</a>
        `
    },
    {
        title: "Sample Privacy Notice",
        icon: "clipboard",
        content: `
            <p>A privacy notice informs individuals about how their personal information is collected, used, stored, and protected.</p>
            <h3>Sample Privacy Notice</h3>
            <div class="sample-notice">
                <h3>STUDENT INFORMATION FORM</h3>
                <p>This form collects personal information necessary for student registration and school-related transactions.</p>
                <b>Information Collected:</b>
                <ul>
                    <li>Full Name</li>
                    <li>School Email Address</li>
                    <li>Student Number</li>
                    <li>Contact Information</li>
                </ul>
                <b>Purpose:</b>
                <p>The information will be used for identification, communication, and processing of school-related requests.</p>
                <b>Data Protection:</b>
                <p>Personal information should only be accessed by authorized personnel and handled according to applicable data privacy requirements.</p>
            </div>
            <h3>Important Reminder</h3>
            <p>A privacy notice should be clear, understandable, and available before or at the time personal information is collected.</p>
        `
    },
    {
        title: "Interactive Privacy Awareness Quiz",
        icon: "question",
        content: `
            <p>Test what you have learned about data privacy through our interactive quiz.</p>
            <h3>Topics Covered</h3>
            <ul>
                <li>Personal information protection.</li>
                <li>Online privacy and security.</li>
                <li>Data Privacy Act of 2012.</li>
                <li>Phishing and suspicious links.</li>
                <li>Safe online practices.</li>
            </ul>
            <button onclick="closeFeature(); scrollToSection('quiz')">START THE QUIZ</button>
        `
    },
    {
        title: "Phishing and Scam Awareness",
        icon: "warning",
        content: `
            <p>Phishing is a type of cyberattack where attackers pretend to be trusted individuals or organizations to trick people into revealing sensitive information.</p>
            <h3>Common Signs of Phishing</h3>
            <ul>
                <li>Unknown or suspicious email addresses.</li>
                <li>Messages asking for passwords or OTPs.</li>
                <li>Unexpected links and attachments.</li>
                <li>Urgent messages threatening account suspension.</li>
                <li>Fake websites that look legitimate.</li>
                <li>Offers that seem too good to be true.</li>
            </ul>
            <h3>How to Avoid Scams</h3>
            <ul>
                <li>Verify the sender before responding.</li>
                <li>Do not click suspicious links.</li>
                <li>Never provide passwords through email.</li>
                <li>Check the official website address.</li>
                <li>Report suspicious messages.</li>
            </ul>
        `
    },
    {
        title: "Security Guides",
        icon: "lock",
        content: `
            <p>Security guides provide simple steps that help individuals protect their accounts, devices, and personal information.</p>
            <h3>Account Security</h3>
            <ul>
                <li>Create strong and unique passwords.</li>
                <li>Enable multi-factor authentication.</li>
                <li>Do not share account credentials.</li>
                <li>Check unfamiliar login activities.</li>
            </ul>
            <h3>Device Security</h3>
            <ul>
                <li>Install trusted applications only.</li>
                <li>Keep your operating system updated.</li>
                <li>Use a screen lock or password.</li>
                <li>Avoid unknown USB devices.</li>
            </ul>
            <h3>Internet Security</h3>
            <ul>
                <li>Avoid unsecured public Wi-Fi for sensitive transactions.</li>
                <li>Use secure websites.</li>
                <li>Do not download suspicious attachments.</li>
                <li>Log out after using public computers.</li>
            </ul>
        `
    }
];

/* =========================================
   FEATURE MODAL
========================================= */

function openFeature(index) {
    if (index < 0 || index >= features.length) return;

    if (index === 4) {
        scrollToSection("quiz");
        return;
    }

    const feature = features[index];

    const symbol = getElement("modalSymbol");
    const title = getElement("modalTitle");
    const content = getElement("modalContent");
    const modal = getElement("featureModal");

    if (symbol) symbol.innerHTML = icons[feature.icon] || "";
    if (title) title.textContent = feature.title;
    if (content) content.innerHTML = feature.content;
    if (modal) modal.style.display = "flex";
}

function closeFeature() {
    setDisplay("featureModal", "none");
}

getElement("featureModal")?.addEventListener("click", function (event) {
    if (event.target === this) closeFeature();
});

/* =========================================
   SEARCH FEATURES
========================================= */

function searchFeatures() {
    const input = getElement("searchInput");

    if (!input) return;

    const search = input.value.toLowerCase().trim();

    if (!search) {
        alert("Please enter a privacy topic to search.");
        return;
    }

    const index = features.findIndex(feature =>
        feature.title.toLowerCase().includes(search)
    );

    if (index !== -1) {
        openFeature(index);
    } else {
        scrollToSection("features");
        alert("No matching privacy topic found. Please try another keyword.");
    }
}

getElement("searchInput")?.addEventListener("keydown", function (event) {
    if (event.key === "Enter") searchFeatures();
});

/* =========================================
   QUIZ QUESTIONS
========================================= */

const quizQuestions = [
    {
        question: "What is the main purpose of the Data Privacy Act of 2012?",
        answers: [
            "To protect personal information",
            "To increase internet speed",
            "To create social media accounts",
            "To remove all online websites"
        ],
        correct: 0,
        explanation: "The Data Privacy Act protects personal information and regulates its processing."
    },
    {
        question: "What should you do if someone asks for your OTP?",
        answers: [
            "Send it immediately",
            "Post it online",
            "Never share it with anyone",
            "Send it to an unknown email"
        ],
        correct: 2,
        explanation: "Your OTP is private. Never share it with other people."
    },
    {
        question: "What is phishing?",
        answers: [
            "A computer cleaning process",
            "An attempt to steal personal information through deception",
            "A type of computer hardware",
            "A safe way to store files"
        ],
        correct: 1,
        explanation: "Phishing tricks users into revealing sensitive information through fake messages or websites."
    },
    {
        question: "What should you check before clicking an unfamiliar link?",
        answers: [
            "The color of the link",
            "The number of words",
            "The sender and website address",
            "The size of your screen"
        ],
        correct: 2,
        explanation: "Always verify the sender and destination of a link before opening it."
    },
    {
        question: "Which of the following is a good security practice?",
        answers: [
            "Using the same password everywhere",
            "Sharing your password with friends",
            "Ignoring software updates",
            "Enabling two-factor authentication"
        ],
        correct: 3,
        explanation: "Two-factor authentication adds another layer of protection to your accounts."
    }
];

let currentQuestion = 0;
let quizPoints = 0;
let quizAnswered = false;

function loadQuiz() {
    const questionElement = getElement("quizQuestion");
    const answersElement = getElement("quizAnswers");

    if (!questionElement || !answersElement) return;

    const question = quizQuestions[currentQuestion];

    if (!question) return;

    quizAnswered = false;
    questionElement.textContent = question.question;

    if (getElement("quizProgress")) {
        getElement("quizProgress").textContent =
            `QUESTION ${currentQuestion + 1} OF ${quizQuestions.length}`;
    }

    if (getElement("quizScore")) {
        getElement("quizScore").textContent = `SCORE: ${quizPoints}`;
    }

    if (getElement("quizProgressFill")) {
        getElement("quizProgressFill").style.width =
            `${(currentQuestion / quizQuestions.length) * 100}%`;
    }

    if (getElement("quizFeedback")) {
        getElement("quizFeedback").textContent = "";
    }

    if (getElement("nextQuestion")) {
        getElement("nextQuestion").disabled = true;
        getElement("nextQuestion").style.display = "inline-block";
        getElement("nextQuestion").textContent =
            currentQuestion === quizQuestions.length - 1
                ? "SEE RESULTS"
                : "NEXT QUESTION";
    }

    if (getElement("quizFinal")) {
        getElement("quizFinal").innerHTML = "";
    }

    answersElement.innerHTML = "";

    question.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.className = "quiz-answer";
        button.textContent =
            String.fromCharCode(65 + index) + ". " + answer;

        button.addEventListener("click", function () {
            checkQuizAnswer(index);
        });

        answersElement.appendChild(button);
    });
}

function checkQuizAnswer(selected) {
    if (quizAnswered) return;

    const question = quizQuestions[currentQuestion];
    if (!question) return;

    quizAnswered = true;

    const buttons = document.querySelectorAll(".quiz-answer");

    buttons.forEach((button, index) => {
        button.disabled = true;

        if (index === question.correct) {
            button.classList.add("correct");
        }

        if (index === selected && selected !== question.correct) {
            button.classList.add("wrong");
        }
    });

    const feedback = getElement("quizFeedback");

    if (selected === question.correct) {
        quizPoints++;

        if (feedback) {
            feedback.style.color = "#00bb66";
            feedback.textContent = "CORRECT! " + question.explanation;
        }
    } else if (feedback) {
        feedback.style.color = "#ff4444";
        feedback.textContent = "INCORRECT. " + question.explanation;
    }

    if (getElement("quizScore")) {
        getElement("quizScore").textContent = `SCORE: ${quizPoints}`;
    }

    if (getElement("nextQuestion")) {
        getElement("nextQuestion").disabled = false;
    }
}

function nextQuizQuestion() {
    if (!quizAnswered) return;

    currentQuestion++;

    if (currentQuestion < quizQuestions.length) {
        loadQuiz();
    } else {
        showQuizResult();
    }
}

function showQuizResult() {
    if (getElement("quizProgress")) {
        getElement("quizProgress").textContent = "QUIZ COMPLETED";
    }

    if (getElement("quizProgressFill")) {
        getElement("quizProgressFill").style.width = "100%";
    }

    if (getElement("quizQuestion")) {
        getElement("quizQuestion").textContent = "YOUR RESULTS ARE READY";
    }

    if (getElement("quizAnswers")) {
        getElement("quizAnswers").innerHTML = "";
    }

    if (getElement("quizFeedback")) {
        getElement("quizFeedback").textContent = "";
    }

    setDisplay("nextQuestion", "none");

    let message = "";

    if (quizPoints === 5) {
        message = "Excellent! You are highly aware of data privacy.";
    } else if (quizPoints >= 3) {
        message = "Good job! Keep learning how to protect your information.";
    } else {
        message = "Keep practicing! Review the privacy guides and try again.";
    }

    const final = getElement("quizFinal");

    if (final) {
        final.innerHTML = `
            <h2>${quizPoints} / 5</h2>
            <p>${message}</p>
            <button onclick="restartQuiz()" class="red-game-btn">
                RETAKE QUIZ
            </button>
        `;
    }
}

function restartQuiz() {
    currentQuestion = 0;
    quizPoints = 0;
    quizAnswered = false;
    loadQuiz();
}

loadQuiz();

/* =========================================
   MYSTERY GAME
========================================= */

const mysteryCases = [
    {
        label: "CLASSIFIED CASE FILE #001",
        title: "The Compromised Student Account",
        story: "A student receives an urgent email saying their school account will be deactivated. The email asks them to verify their username, password, and OTP through a link. Soon after, an unfamiliar login appears on the account.",
        mission: "Identify the attack and the safest response.",
        difficulty: "INTERMEDIATE",
        clues: [
            {
                title: "EVIDENCE 01 - SUSPICIOUS EMAIL",
                description: "<b>EMAIL SENDER:</b> support@ptc-secure-login.com<br><br><b>SUBJECT:</b> URGENT! Your School Account Will Be Deactivated!<br><br>The sender uses a domain that does not match the official school website.<br><br><b>CLUE:</b> The sender address is suspicious."
            },
            {
                title: "EVIDENCE 02 - FAKE VERIFICATION PAGE",
                description: "The email link opens a page that looks like a school login page. It asks for the student's username, password, and OTP.<br><br><b>CLUE:</b> A legitimate service should not ask a user to share an OTP through an unexpected email link."
            },
            {
                title: "EVIDENCE 03 - UNKNOWN LOGIN",
                description: "After entering the details, the student receives a login alert from an unfamiliar device and location.<br><br><b>CLUE:</b> The credentials may have been stolen through a fake website."
            }
        ],
        attackQuestion: "What method was used to steal the student's login details?",
        choices: [
            ["phishing", "A. PHISHING ATTACK"],
            ["malware", "B. MALWARE ATTACK"],
            ["brute", "C. BRUTE FORCE ATTACK"]
        ],
        correctAttack: "phishing",
        attackExplanation: "The attacker used a fake email and login page to trick the student into giving away sensitive credentials. This is phishing.",
        decisionQuestion: "What should the student do immediately?",
        decisions: [
            [false, "A. Click the link again to verify."],
            [true, "B. Report the email, change the password through the official site, and secure the account."]
        ],
        report: "The student should report the suspicious email, change the compromised password using the official school website, sign out of unknown sessions, and notify the appropriate school support office."
    },
    {
        label: "CLASSIFIED CASE FILE #002",
        title: "The Overshared Profile",
        story: "A student posts a public birthday photo with a visible school ID, full name, birthday, and location tag. A stranger uses these details to impersonate the student and sends messages to classmates asking for money.",
        mission: "Identify what information was exposed and how to reduce the risk.",
        difficulty: "BEGINNER",
        clues: [
            {
                title: "EVIDENCE 01 - PUBLIC PHOTO",
                description: "The student's photo is visible to everyone, not only friends. The school ID and full name can be clearly read.<br><br><b>CLUE:</b> The post contains identifying personal information."
            },
            {
                title: "EVIDENCE 02 - LOCATION AND BIRTHDAY",
                description: "The post includes a location tag and birthday. These details may help someone build a profile of the student.<br><br><b>CLUE:</b> Sharing several personal details publicly can increase privacy and identity risks."
            },
            {
                title: "EVIDENCE 03 - IMPERSONATION",
                description: "A fake account copies the student's profile photo and name. It contacts classmates and pretends to be the student to request money.<br><br><b>CLUE:</b> Someone is misusing publicly available information to impersonate another person."
            }
        ],
        attackQuestion: "What is the main privacy issue in this case?",
        choices: [
            ["oversharing", "A. OVERSHARING PERSONAL INFORMATION"],
            ["ransomware", "B. RANSOMWARE"],
            ["software", "C. SOFTWARE UPDATE"]
        ],
        correctAttack: "oversharing",
        attackExplanation: "The student shared too much identifying information publicly, making impersonation easier.",
        decisionQuestion: "What is the best response?",
        decisions: [
            [false, "A. Keep the post public and ignore the fake account."],
            [true, "B. Remove or hide exposed details, report the fake account, and inform affected friends."]
        ],
        report: "The student should limit the audience of personal posts, remove visible sensitive details, report the impersonating account, warn classmates, and review privacy settings."
    },
    {
        label: "CLASSIFIED CASE FILE #003",
        title: "The Lost Device",
        story: "A student leaves a phone in a public café. The phone has no screen lock, and several accounts remain signed in. Later, the student notices messages sent from their account and changes to personal files.",
        mission: "Determine how the accounts were exposed and choose the right protective steps.",
        difficulty: "INTERMEDIATE",
        clues: [
            {
                title: "EVIDENCE 01 - UNLOCKED PHONE",
                description: "The phone was left on a table without a PIN, password, fingerprint, or face lock.<br><br><b>CLUE:</b> Anyone who finds the phone can open it and view its contents."
            },
            {
                title: "EVIDENCE 02 - SIGNED-IN ACCOUNTS",
                description: "The student's email and social media accounts were still signed in. Notifications displayed private message previews.<br><br><b>CLUE:</b> Open sessions and visible notifications can expose personal information."
            },
            {
                title: "EVIDENCE 03 - UNUSUAL ACTIVITY",
                description: "Friends report receiving strange messages from the student's account. The student also sees that files were opened and account settings were changed.<br><br><b>CLUE:</b> An unauthorized person may have accessed the device and active accounts."
            }
        ],
        attackQuestion: "What security weakness allowed the stranger to access the phone easily?",
        choices: [
            ["weaklock", "A. LACK OF DEVICE SCREEN LOCK"],
            ["phishing", "B. PHISHING EMAIL"],
            ["update", "C. AUTOMATIC SOFTWARE UPDATE"]
        ],
        correctAttack: "weaklock",
        attackExplanation: "The phone had no screen lock, so anyone who found it could access the device and the accounts that were still signed in.",
        decisionQuestion: "What should the student do first?",
        decisions: [
            [false, "A. Wait and hope the phone is returned."],
            [true, "B. Use another trusted device to lock or erase the phone, sign out of sessions, and change passwords."]
        ],
        report: "The student should use the device-finding service to lock or erase the phone, sign out of active sessions, change important passwords, contact the mobile provider if needed, and enable a strong screen lock on future devices."
    }
];

let activeMysteryCase = 0;
let cluesFound = [];
let mysterySolved = false;

function selectMysteryCase(index) {
    if (index < 0 || index >= mysteryCases.length) return;

    activeMysteryCase = index;

    const currentCase = mysteryCases[index];

    setDisplay("caseSelectGrid", "none");
    setDisplay("mysteryPlayArea", "grid");

    if (getElement("activeCaseLabel")) {
        getElement("activeCaseLabel").textContent = currentCase.label;
    }

    if (getElement("activeCaseTitle")) {
        getElement("activeCaseTitle").textContent = currentCase.title;
    }

    if (getElement("activeCaseStory")) {
        getElement("activeCaseStory").textContent = currentCase.story;
    }

    if (getElement("activeCaseMissionText")) {
        getElement("activeCaseMissionText").textContent = currentCase.mission;
    }

    if (getElement("activeMission")) {
        getElement("activeMission").textContent = currentCase.mission;
    }

    if (getElement("activeDifficulty")) {
        getElement("activeDifficulty").textContent = currentCase.difficulty;
    }

    resetMysteryTerminal();
    scrollToSection("mysteryGame");
}

function backToCaseSelection() {
    setDisplay("mysteryPlayArea", "none");
    setDisplay("caseSelectGrid", "grid");
    scrollToSection("mysteryGame");
}

function backToHome() {
    closeFeature();
    getElement("navLinks")?.classList.remove("show");
    scrollToSection("home");
}

function resetMysteryTerminal() {
    cluesFound = [];
    mysterySolved = false;

    setDisplay("gameIntro", "block");
    setDisplay("gameContent", "none");

    if (getElement("caseStatus")) {
        getElement("caseStatus").textContent = "STATUS: LOCKED";
    }

    if (getElement("clueTitle")) {
        getElement("clueTitle").textContent = "INVESTIGATE THE CLUES";
    }

    if (getElement("clueDescription")) {
        getElement("clueDescription").textContent =
            "Click each evidence file to reveal the hidden information.";
    }

    if (getElement("clueResult")) {
        getElement("clueResult").innerHTML = "";
    }

    if (getElement("clueCounter")) {
        getElement("clueCounter").textContent = "0 / 3";
    }

    if (getElement("clueProgressFill")) {
        getElement("clueProgressFill").style.width = "0%";
    }

    setDisplay("suspectChoices", "none");
    setDisplay("finalDecision", "none");

    if (getElement("gameResult")) {
        getElement("gameResult").innerHTML = "";
    }
}

function startMystery() {
    resetMysteryTerminal();

    setDisplay("gameIntro", "none");
    setDisplay("gameContent", "block");

    if (getElement("caseStatus")) {
        getElement("caseStatus").textContent = "STATUS: ACTIVE";
    }

    const currentCase = mysteryCases[activeMysteryCase];

    currentCase.clues.forEach((clue, index) => {
        const button = getElement("clue" + index);

        if (!button) return;

        button.disabled = false;
        button.style.borderColor = "#ff2929";
        button.style.color = "white";

        button.innerHTML = `
            <span>0${index + 1}</span>
            ${clue.title.replace(/^EVIDENCE 0[1-3] - /, "")}
            <small>CLICK TO OPEN FILE</small>
        `;

        button.onclick = function () {
            revealClue(index);
        };
    });

    getElement("mysteryPlayArea")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function revealClue(index) {
    if (cluesFound.includes(index)) return;

    const currentCase = mysteryCases[activeMysteryCase];
    const clue = currentCase.clues[index];

    if (!clue) return;

    cluesFound.push(index);

    if (getElement("clueTitle")) {
        getElement("clueTitle").textContent = clue.title;
    }

    if (getElement("clueDescription")) {
        getElement("clueDescription").innerHTML = clue.description;
    }

    if (getElement("clueCounter")) {
        getElement("clueCounter").textContent = cluesFound.length + " / 3";
    }

    if (getElement("clueProgressFill")) {
        getElement("clueProgressFill").style.width =
            (cluesFound.length / 3 * 100) + "%";
    }

    const button = getElement("clue" + index);

    if (button) {
        button.disabled = true;
        button.style.borderColor = "#00bb66";
        button.style.color = "#00bb66";
    }

    const result = getElement("clueResult");

    if (result) {
        result.innerHTML = `
            <p class="game-success">EVIDENCE ${index + 1} DISCOVERED</p>
            <p>${cluesFound.length} / 3 clues collected.</p>
        `;
    }

    if (cluesFound.length === 3) {
        if (result) {
            result.innerHTML += `
                <p class="game-success">
                    ALL EVIDENCE COLLECTED. You can now solve the case.
                </p>
            `;
        }

        if (getElement("attackQuestion")) {
            getElement("attackQuestion").textContent =
                currentCase.attackQuestion;
        }

        const options = getElement("suspectOptions");

        if (options) {
            options.innerHTML = currentCase.choices.map(([value, label]) => `
                <button onclick="checkMysteryAnswer('${value}')">
                    ${label}
                </button>
            `).join("");
        }

        setDisplay("suspectChoices", "block");

        getElement("suspectChoices")?.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }
}

function checkMysteryAnswer(answer) {
    if (mysterySolved || cluesFound.length !== 3) return;

    const currentCase = mysteryCases[activeMysteryCase];

    if (answer === currentCase.correctAttack) {
        mysterySolved = true;

        const result = getElement("clueResult");

        if (result) {
            result.innerHTML = `
                <p class="game-success">CORRECT! YOU IDENTIFIED THE PRIVACY RISK.</p>
                <p>${currentCase.attackExplanation}</p>
            `;
        }

        setDisplay("suspectChoices", "none");

        if (getElement("decisionQuestion")) {
            getElement("decisionQuestion").textContent =
                currentCase.decisionQuestion;
        }

        const options = getElement("decisionOptions");

        if (options) {
            options.innerHTML = currentCase.decisions.map(([correct, label]) => `
                <button onclick="finishMystery(${correct})">
                    ${label}
                </button>
            `).join("");
        }

        setDisplay("finalDecision", "block");

        getElement("finalDecision")?.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    } else {
        const result = getElement("clueResult");

        if (result) {
            result.innerHTML = `
                <p class="game-error">NOT QUITE! REVIEW THE EVIDENCE.</p>
                <p>Look at all three clues and try another answer.</p>
            `;
        }
    }
}

function finishMystery(correct) {
    const currentCase = mysteryCases[activeMysteryCase];

    setDisplay("finalDecision", "none");

    const result = getElement("gameResult");
    const status = getElement("caseStatus");

    if (!result) return;

    if (correct) {
        if (status) status.textContent = "STATUS: SOLVED";

        result.innerHTML = `
            <h2 class="game-success">CASE SOLVED!</h2>
            <p>You identified the privacy risk and selected the safest response.</p>
            <h3>FINAL INVESTIGATION REPORT</h3>
            <p>${currentCase.report}</p>
            <p class="game-success">MISSION COMPLETED - PRIVACY PROTECTED.</p>
            <button class="red-game-btn" onclick="startMystery()">PLAY THIS CASE AGAIN</button>
            <button class="case-back-btn" onclick="backToCaseSelection()">CHOOSE ANOTHER CASE</button>
        `;
    } else {
        if (status) status.textContent = "STATUS: FAILED";

        result.innerHTML = `
            <h2 class="game-error">MISSION FAILED</h2>
            <p>That action may put personal information at greater risk. Review the case and try again.</p>
            <button class="red-game-btn" onclick="startMystery()">TRY AGAIN</button>
            <button class="case-back-btn" onclick="backToCaseSelection()">CHOOSE ANOTHER CASE</button>
        `;
    }
}

/* =========================================
   BACK TO TOP BUTTON
========================================= */

window.addEventListener("scroll", function () {
    const button = getElement("backToTop");

    if (!button) return;

    button.style.display =
        window.scrollY > 400 ? "block" : "none";
});

/* =========================================
   NAVIGATION ACTIVE STATE
========================================= */

const sections = document.querySelectorAll(
    "#home, #features, #dataAct, #quiz, #mysteryGame"
);

const navItems = document.querySelectorAll("#navLinks a");

window.addEventListener("scroll", function () {
    let currentSection = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute("id");
        }
    });

    navItems.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + currentSection) {
            link.classList.add("active");
        }
    });
});

/* =========================================
   INITIAL PAGE STATE
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    setDisplay("landingPage", "flex");
    setDisplay("homePage", "none");
    setDisplay("privacyAlert", "none");
});

/* =========================================
   END OF PRIVACY AWARE
========================================= */
