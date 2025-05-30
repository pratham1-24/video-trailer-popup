const watchBtn = document.getElementById("watchBtn");
const closeIcon = document.getElementById("closeIcon");
const trailerContainer = document.getElementById("trailerContainer");
const video = document.getElementById("trailerVideo");
const toggleMode = document.getElementById("toggleMode");
const voiceBtn = document.getElementById("voiceBtn");

// Show trailer
watchBtn.addEventListener("click", () => {
  trailerContainer.classList.remove("active");
  gsap.fromTo(trailerContainer, { opacity: 0 }, { opacity: 1, duration: 0.5 });
});

// Close trailer
closeIcon.addEventListener("click", () => {
  gsap.to(trailerContainer, {
    opacity: 0,
    scale: 0.9,
    duration: 0.5,
    ease: "power1.inOut",
    onComplete: () => {
      trailerContainer.classList.add("active");
      video.pause();
      video.currentTime = 0;
      gsap.set(trailerContainer, { scale: 1 }); // reset for next open
    },
  });
});


// Toggle Light/Dark mode
toggleMode.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Voice Control
voiceBtn.addEventListener("click", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Sorry, your browser does not support voice recognition.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.onresult = function (event) {
    const command = event.results[0][0].transcript.toLowerCase();
    console.log("Voice command:", command);
    if (command.includes("play trailer")) {
      watchBtn.click();
    } else {
      alert("Say 'play trailer' to activate the popup.");
    }
  };
  recognition.start();
});
