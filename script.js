// Создание частиц на фоне
function createParticles() {
  const particlesContainer = document.querySelector(".particles")
  const particleCount = window.innerWidth > 1024 ? 50 : 30

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div")
    particle.classList.add("particle")
    particle.style.left = Math.random() * 100 + "%"
    particle.style.top = Math.random() * 100 + "%"
    particle.style.animationDuration = Math.random() * 4 + 4 + "s"
    particle.style.animationDelay = Math.random() * 2 + "s"
    particlesContainer.appendChild(particle)
  }
}

// Плавный скролл
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Управление голосами
const votes = JSON.parse(localStorage.getItem("galleryVotes")) || {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
}

function initializeVotes() {
  document.querySelectorAll(".rating-item").forEach((item) => {
    const voteId = item.getAttribute("data-vote")
    const voteCount = item.querySelector(".vote-number")
    voteCount.textContent = votes[voteId]

    item.addEventListener("click", () => {
      votes[voteId]++
      voteCount.textContent = votes[voteId]
      item.classList.add("voted")
      localStorage.setItem("galleryVotes", JSON.stringify(votes))

      // Небольшая анимация при голосе
      item.style.animation = "none"
      setTimeout(() => {
        item.style.animation = "ratingVote 0.6s ease-out"
      }, 10)
    })
  })
}

// Анимация при голосе
const style = document.createElement("style")
style.textContent = `
  @keyframes ratingVote {
    0% {
      transform: scale(1.05);
    }
    50% {
      transform: scale(0.95);
    }
    100% {
      transform: scale(1.05);
    }
  }
`
document.head.appendChild(style)

// Intersection Observer для появления блоков при скролле
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.animation = "fadeIn 0.6s ease-out"
    }
  })
}, observerOptions)

// Наблюдение за элементами галереи и комплиментов
document.querySelectorAll(".photo-card, .compliment-card, .final-content, .rating-item").forEach((el) => {
  el.style.opacity = "0"
  observer.observe(el)
})

// Инициализация
window.addEventListener("DOMContentLoaded", () => {
  createParticles()
  initializeVotes()
})

// Адаптация при изменении размера окна
window.addEventListener("resize", () => {
  const particles = document.querySelectorAll(".particle")
  if (particles.length === 0) {
    createParticles()
  }
})
