const videos = [
  {
    id: 1,
    title: "The Great Escape",
    category: "action",
    thumbnail: "https://img.youtube.com/vi/0pXY2N0Eq2Y/maxresdefault.jpg",
    trailer: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "2:34",
  },
  {
    id: 2,
    title: "Drama in the Rain",
    category: "drama",
    thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
    trailer: "https://www.w3schools.com/html/movie.mp4",
    duration: "3:12",
  },
  {
    id: 3,
    title: "Nature's Wonders",
    category: "nature",
    thumbnail: "https://img.youtube.com/vi/l482T0yNkeo/maxresdefault.jpg",
    trailer: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "1:48",
  },
  {
    id: 4,
    title: "Action Reloaded",
    category: "action",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    trailer: "https://www.w3schools.com/html/movie.mp4",
    duration: "2:15",
  },
  {
    id: 5,
    title: "Deep Emotions",
    category: "drama",
    thumbnail: "https://img.youtube.com/vi/oHg5SJYRHA0/maxresdefault.jpg",
    trailer: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "2:58",
  },
  {
    id: 6,
    title: "Wildlife Chronicles",
    category: "nature",
    thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg",
    trailer: "https://www.w3schools.com/html/movie.mp4",
    duration: "3:05",
  },
];

const videoContainer = document.getElementById("videoContainer");
const trailerContainer = document.getElementById("trailerContainer");
const trailerVideo = document.getElementById("trailerVideo");
const closeTrailer = document.getElementById("closeTrailer");
const durationBadge = document.getElementById("durationBadge");

// Render video cards
function renderVideos(filteredVideos) {
  videoContainer.innerHTML = "";
  filteredVideos.forEach((video) => {
    const card = document.createElement("div");
    card.className =
      "bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300 relative";
    card.setAttribute("data-category", video.category);
    card.setAttribute("data-title", video.title.toLowerCase());

    card.innerHTML = `
      <img src="${video.thumbnail}" alt="${video.title}" class="w-full h-48 object-cover" />
      <div class="p-4">
        <h3 class="text-lg font-semibold text-white">${video.title}</h3>
        <span class="inline-block mt-2 bg-red-600 px-2 py-1 rounded text-xs font-medium">${video.category}</span>
      </div>
      <span class="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">${video.duration}</span>
    `;

    card.addEventListener("click", () => {
      openTrailer(video.trailer, video.duration);
    });

    videoContainer.appendChild(card);
  });
}

// Open trailer popup
function openTrailer(src, duration) {
  trailerVideo.src = src;
  durationBadge.textContent = duration;
  trailerContainer.classList.remove("hidden");
  trailerContainer.classList.add("flex");
  trailerVideo.play();
}

// Close trailer popup
closeTrailer.addEventListener("click", () => {
  trailerVideo.pause();
  trailerVideo.src = "";
  trailerContainer.classList.add("hidden");
  trailerContainer.classList.remove("flex");
});

// Filter videos by category and search text
function filterVideos() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const selectedCategory =
    document.querySelector(".category-btn.selected")?.getAttribute("data-category") ||
    "all";

  let filtered = videos.filter((v) => {
    const matchesCategory = selectedCategory === "all" || v.category === selectedCategory;
    const matchesSearch = v.title.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  renderVideos(filtered);
}

// Initialize categories
const categoryButtons = document.querySelectorAll(".category-btn");
categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach((b) => b.classList.remove("selected", "bg-red-600"));
    btn.classList.add("selected", "bg-red-600");
    filterVideos();
  });
});

// Default select all
categoryButtons[0].classList.add("selected", "bg-red-600");

// Search input event
document.getElementById("searchInput").addEventListener("input", filterVideos);

// Initial render
renderVideos(videos);

// Dark mode toggle
const toggleDark = document.getElementById("toggleDark");
toggleDark.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    toggleDark.innerHTML = '<i class="ph ph-sun"></i>';
  } else {
    toggleDark.innerHTML = '<i class="ph ph-moon-stars"></i>';
  }
});

// Voice Control
const voiceToggle = document.getElementById("voiceToggle");
let recognition;
let isListening = false;

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = true;

  recognition.onresult = (event) => {
    const lastResultIndex = event.results.length - 1;
    const transcript = event.results[lastResultIndex][0].transcript.trim().toLowerCase();
    console.log("Voice command received:", transcript);

    // Handle voice commands
    if (transcript.includes("open") && transcript.includes("trailer")) {
      // Extract title after "open trailer"
      const title = transcript.replace("open trailer", "").trim();
      if (title) {
        const video = videos.find((v) => v.title.toLowerCase() === title);
        if (video) {
          openTrailer(video.trailer, video.duration);
        } else {
          alert(`No trailer found for "${title}"`);
        }
      }
    } else if (transcript.includes("close trailer")) {
      closeTrailer.click();
    } else if (transcript.includes("show action")) {
      setCategoryByName("action");
    } else if (transcript.includes("show drama")) {
      setCategoryByName("drama");
    } else if (transcript.includes("show nature")) {
      setCategoryByName("nature");
    } else if (transcript.includes("show all")) {
      setCategoryByName("all");
    } else if (transcript.startsWith("search")) {
      const searchQuery = transcript.replace("search", "").trim();
      document.getElementById("searchInput").value = searchQuery;
      filterVideos();
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  recognition.onend = () => {
    if (isListening) recognition.start();
  };
} else {
  voiceToggle.style.display = "none"; // Hide voice toggle if unsupported
}

voiceToggle.addEventListener("click", () => {
  if (!recognition) return;
  if (isListening) {
    recognition.stop();
    voiceToggle.innerHTML = '<i class="ph ph-microphone"></i>';
  } else {
    recognition.start();
    voiceToggle.innerHTML = '<i class="ph ph-microphone-slash"></i>';
  }
  isListening = !isListening;
});

function setCategoryByName(category) {
  categoryButtons.forEach((b) => {
    b.classList.remove("selected", "bg-red-600");
    if (b.getAttribute("data-category") === category) {
      b.classList.add("selected", "bg-red-600");
    }
  });
  filterVideos();
}
