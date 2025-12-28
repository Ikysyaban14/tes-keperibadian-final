const quizContainer = document.getElementById('quiz-container');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const resultContainer = document.getElementById('result');
const enterNameBtn = document.getElementById('enter-name-btn');
const nameInput = document.getElementById('name-input');
const notification = document.getElementById('notification');
const themeSwitch = document.getElementById('theme-switch');
const toggleIcon = document.querySelector('.toggle-icon');
const toggleText = document.querySelector('.toggle-text');
const progressContainer = document.getElementById('progress-container');
const progressFill = document.getElementById('progress-fill');

let userName = '';

const questions = [
  // E vs I
  {
    question: "Ketika menghadiri pesta, kamu:",
    answers: [
      { text: "Lebih suka berinteraksi dengan banyak orang (E)", value: "E" },
      { text: "Lebih suka berbincang dengan beberapa teman dekat (I)", value: "I" }
    ]
  },
  {
    question: "Setelah aktivitas sosial yang padat, kamu:",
    answers: [
      { text: "Merasa energik dan bersemangat (E)", value: "E" },
      { text: "Perlu waktu sendiri untuk mengisi ulang energi (I)", value: "I" }
    ]
  },
  // S vs N
  {
    question: "Saat belajar sesuatu yang baru, kamu lebih suka:",
    answers: [
      { text: "Mengikuti fakta dan detail konkret (S)", value: "S" },
      { text: "Mencari makna dan kemungkinan yang lebih luas (N)", value: "N" }
    ]
  },
  {
    question: "Dalam membuat keputusan, kamu cenderung:",
    answers: [
      { text: "Mengandalkan pengalaman dan data yang ada (S)", value: "S" },
      { text: "Menggunakan imajinasi dan inspirasi (N)", value: "N" }
    ]
  },
  // T vs F
  {
    question: "Dalam menyelesaikan masalah, kamu lebih memprioritaskan:",
    answers: [
      { text: "Logika dan analisa objektif (T)", value: "T" },
      { text: "Nilai-nilai pribadi dan perasaan orang lain (F)", value: "F" }
    ]
  },
  {
    question: "Ketika memberi kritik, kamu:",
    answers: [
      { text: "Bersikap tegas dan langsung (T)", value: "T" },
      { text: "Mengutamakan menjaga perasaan orang lain (F)", value: "F" }
    ]
  },
  // J vs P
  {
    question: "Kamu lebih suka bekerja:",
    answers: [
      { text: "Dengan rencana yang jelas dan terstruktur (J)", value: "J" },
      { text: "Dengan fleksibilitas dan spontanitas (P)", value: "P" }
    ]
  },
  {
    question: "Ketika menghadapi deadline, kamu:",
    answers: [
      { text: "Menyelesaikan tugas jauh sebelum waktu (J)", value: "J" },
      { text: "Kadang menunda-nunda dan bekerja mepet deadline (P)", value: "P" }
    ]
  }
];

let currentQuestion = 0;
let answersCount = {
  E: 0,
  I: 0,
  S: 0,
  N: 0,
  T: 0,
  F: 0,
  J: 0,
  P: 0
};
let currentOptionIndex = 0;
let currentHoveredIndex = -1;
let selectedAnswers = new Array(questions.length).fill(null); // Store selected answers for each question

function hoverOption(label, index) {
  currentHoveredIndex = index;
  label.classList.add('hovered');
}

function unhoverOption(label) {
  currentHoveredIndex = -1;
  label.classList.remove('hovered');
}

enterNameBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (!name) {
    alert('Masukkan nama Anda dulu!');
    return;
  }
  userName = name;
  document.getElementById('name-entry').style.display = 'none';
  quizContainer.style.display = 'block';
  startBtn.style.display = 'inline-block';
});

nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    enterNameBtn.click();
  }
});

startBtn.addEventListener('click', () => {
  startBtn.style.display = 'none';
  prevBtn.style.display = 'inline-block';
  nextBtn.style.display = 'inline-block';
  progressContainer.style.display = 'block';
  showQuestion();
});

document.addEventListener('keydown', (e) => {
  if (quizContainer.style.display === 'block' && nextBtn.style.display === 'inline-block') {
    if (e.key === ' ') {
      e.preventDefault();
      if (currentHoveredIndex !== -1) {
        currentOptionIndex = currentHoveredIndex;
        updateSelection();
        // Auto proceed to next question after selection
        setTimeout(() => {
          nextBtn.click();
        }, 500); // Delay to show selection briefly
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      nextBtn.click();
    } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
      e.preventDefault();
      prevBtn.click();
    }
  }
});

prevBtn.addEventListener('click', () => {
  if (currentQuestion > 0) {
    // Save current answer before going back
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (selectedOption) {
      selectedAnswers[currentQuestion] = selectedOption.value;
    }
    currentQuestion--;
    showQuestion();
  }
});

nextBtn.addEventListener('click', () => {
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  if (!selectedOption) {
    notification.textContent = 'Pilih salah satu jawaban dulu ya!';
    notification.style.display = 'block';
    return;
  }

  notification.style.display = 'none';
  const val = selectedOption.value;
  selectedAnswers[currentQuestion] = val; // Store the answer
  answersCount[val]++;

  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function showQuestion() {
  const q = questions[currentQuestion];
  quizContainer.innerHTML = `
    <h2>${q.question}</h2>
    ${q.answers.map(
      (a, i) => `
      <label onmouseenter="hoverOption(this, ${i})" onmouseleave="unhoverOption(this)">
        <input type="radio" name="answer" value="${a.value}" id="option-${i}" ${selectedAnswers[currentQuestion] === a.value ? 'checked' : ''} />
        ${a.text}
      </label>
    `
    ).join('')}
  `;
  resultContainer.innerHTML = '';
  notification.style.display = 'none';
  currentOptionIndex = -1;
  currentHoveredIndex = -1;
  updateSelection();
  // Show/hide prev button
  if (currentQuestion === 0) {
    prevBtn.style.display = 'none';
  } else {
    prevBtn.style.display = 'inline-block';
  }
  // Update progress bar
  const progress = (currentQuestion / (questions.length - 1)) * 100;
  progressFill.style.width = progress + '%';
}

function updateSelection() {
  const options = document.querySelectorAll('input[name="answer"]');
  const labels = document.querySelectorAll('label');
  options.forEach((opt, i) => {
    opt.checked = (i === currentOptionIndex);
    if (i === currentOptionIndex) {
      labels[i].classList.add('hovered');
    } else {
      labels[i].classList.remove('hovered');
    }
  });
}

function resetQuiz() {
  currentQuestion = 0;
  answersCount = { E:0, I:0, S:0, N:0, T:0, F:0, J:0, P:0 };
  selectedAnswers = new Array(questions.length).fill(null);
  document.getElementById('name-entry').style.display = 'block';
  quizContainer.style.display = 'none';
  startBtn.style.display = 'none';
  prevBtn.style.display = 'none';
  nextBtn.style.display = 'none';
  resultContainer.style.display = 'none';
  resultContainer.innerHTML = '';
  quizContainer.innerHTML = '';
  nameInput.value = '';
  userName = '';
}
function showResult() {
  quizContainer.style.display = 'none';
  prevBtn.style.display = 'none';
  nextBtn.style.display = 'none';
  resultContainer.style.display = 'block';

  const type =
    (answersCount.E >= answersCount.I ? 'E' : 'I') +
    (answersCount.S >= answersCount.N ? 'S' : 'N') +
    (answersCount.T >= answersCount.F ? 'T' : 'F') +
    (answersCount.J >= answersCount.P ? 'J' : 'P');
  // Save to history
  let history = JSON.parse(localStorage.getItem('historyMBTI')) || [];
  const record = {
    name: userName,
    type: type,
    timestamp: new Date().toLocaleString()
  };
  history.push(record);
  localStorage.setItem('historyMBTI', JSON.stringify(history));
  const mbtiData = {
    ISTJ: {
      desc: "ISTJ - The Logistician: Praktis, bertanggung jawab, dan sangat terorganisir.",
      img: "ISTJ.jpeg",
      link: "https://www.16personalities.com/id/tipe-kepribadian-istj"
    },
    ISFJ: {
      desc: "ISFJ - The Defender: Peduli, bertanggung jawab, dan suka membantu orang lain.",
      img: "ISFJ.jpeg",
      link: "https://www.16personalities.com/id/tipe-kepribadian-isfj"
    },
    INFJ: {
      desc: "INFJ - The Advocate: Inspiratif, idealis, dan visioner.",
      img: "INFJ.jpeg",
      link: "https://www.16personalities.com/id/tipe-kepribadian-infj"
    },
    INTJ: {
      desc: "INTJ - The Architect: Analitis, mandiri, dan pemikir strategis.",
      img: "intj.jpeg",
      link: "https://www.16personalities.com/id/tipe-kepribadian-intj"
    },
    ISTP: {
      desc: "ISTP - The Virtuoso: Praktis, fleksibel, dan suka eksplorasi.",
      img: "ISTP.jpeg",
      link: "https://www.16personalities.com/id/tipe-kepribadian-istp"
    },
    ISFP: {
      desc: "ISFP - The Adventurer: Kreatif, santai, dan penuh rasa estetika.",
      img: "ISFP.jpeg",
      link: "https://www.16personalities.com/id/tipe-kepribadian-isfp"
    },
    INFP: {
      desc: "INFP - The Mediator: Empatik, idealis, dan penuh imajinasi.",
      img: "INFP.jpeg",
      link: "https://www.16personalities.com/id/tipe-kepribadian-infp"
    },
    INTP: {
      desc: "INTP - The Logician: Analitis, ingin tahu, dan inovatif.",
      img: "INTP.jpeg",
      link: "https://www.16personalities.com/id/tipe-kepribadian-intp"
    },
    ESTP: {
      desc: "ESTP - The Entrepreneur: Enerjik, spontan, dan suka tantangan.",
      img: "ESTP.jpeg",
      link: "https://www.16personalities.com/id/tipe-kepribadian-estp"
    },
    ESFP: {
      desc: "ESFP - The Entertainer: Ceria, sosial, dan suka berinteraksi.",
      img: "ESFP.jpeg",
      link: "https://www.16personalities.com/id/tipe-kepribadian-esfp"
    },
    ENFP: {
      desc: "ENFP - The Campaigner: Antusias, kreatif, dan penuh semangat.",
      img: "ENFP.jpeg",
      link: "https://www.16personalities.com/id/tipe-kepribadian-enfp"
    },
    ENTP: {
      desc: "ENTP - The Debater: Cerdas, penuh ide, dan suka berdebat.",
      img: "ENTP.jpeg",
      link: "https://www.16personalities.com/id/tipe-kepribadian-entp"
    },
    ESTJ: {
      desc: "ESTJ - The Executive: Tegas, terorganisir, dan praktis.",
      img: "ESTJ.jpeg",
      link: "https://www.16personalities.com/id/tipe-kepribadian-estj"
    },
    ESFJ: {
      desc: "ESFJ - The Consul: Peduli, sosial, dan penyayang.",
      img: "ESFJ.jpeg",
      link: "https://www.16personalities.com/id/tipe-kepribadian-esfj"
    },
    ENFJ: {
      desc: "ENFJ - The Protagonist: Karismatik, berwawasan, dan pemimpin alami.",
      img: "ENFJ.jpeg",
      link: "https://www.16personalities.com/id/tipe-kepribadian-enfj"
    },
    ENTJ: {
      desc: "ENTJ - The Commander: Pemimpin, tegas, dan visioner.",
      img: "ENTJ.jpeg",
      link: "https://www.16personalities.com/id/tipe-kepribadian-entj"
    }
  };

  const data = mbtiData[type] || {
    desc: "Tipe MBTI tidak terdeteksi dengan jelas.",
    img: "",
    link: "#"
  };
  resultContainer.innerHTML = `
    <h2>Hasil Tes ${userName}: ${type}</h2>
    <p>${data.desc}</p>
    ${data.img ? `<img src="${data.img}" alt="${type}" style="max-width:200px; margin-top:15px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);" />` : ''}
    <br/>
    <button id="download-btn" class="more-btn">Unduh Hasil</button>
    <br/><br/>
    <button id="restart-btn">Ulangi Tes</button>
    <br/><br/>
    <button id="history-btn">Lihat Riwayat</button>
  `;

  const downloadBtn = document.getElementById('download-btn');
  downloadBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Hasil Tes Kepribadian MBTI', 20, 30);
    doc.setFontSize(12);
    doc.text(`Nama: ${userName}`, 20, 50);
    doc.text(`Tipe MBTI: ${type}`, 20, 60);
    doc.text(`Deskripsi: ${data.desc}`, 20, 70);
    doc.text(`Link: ${data.link}`, 20, 90);
    doc.save(`hasil_mbti_${userName}.pdf`);
  });

  const restartBtn = document.getElementById('restart-btn');
  restartBtn.addEventListener('click', () => {
    resetQuiz();
  });
  const clearBtn = document.getElementById('clear-history-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem('historyMBTI');
      const historyContainer = document.querySelector('.history-container');
      if (historyContainer) {
        historyContainer.innerHTML = '<p>Riwayat telah dihapus.</p>';
      }
    });
  }

  const historyBtn = document.getElementById('history-btn');
  historyBtn.addEventListener('click', () => {
    window.location.href = 'history.html';
  });
}

// Theme toggle functionality
themeSwitch.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  toggleIcon.textContent = isDark ? '☀️' : '🌙';
  toggleText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  toggleIcon.textContent = '☀️';
  toggleText.textContent = 'Light Mode';
}

