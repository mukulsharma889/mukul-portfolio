const texts = [
    "Software Engineer",
    "full-stack developer"
];
const speed = 80; // Typing speed
const delayBetweenTexts = 1500; // Delay before next text starts
let textIndex = 0;
let charIndex = 0;
const typewriterElement = document.getElementById("typewriter");

function typeWriter() {
    if (charIndex < texts[textIndex].length) {
        typewriterElement.textContent += texts[textIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, speed);
    } else {
        setTimeout(eraseText, delayBetweenTexts); // Wait before erasing
    }
}

function eraseText() {
    if (charIndex > 0) {
        typewriterElement.textContent = texts[textIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(eraseText, speed / 2);
    } else {
        textIndex = (textIndex + 1) % texts.length; // Move to next text
        setTimeout(typeWriter, speed);
    }
}


typeWriter();

const popup = document.getElementById("popupForm");

  document.querySelector(".contact-text button").addEventListener("click", () => {
    popup.style.display = "flex";
  });

  function closeForm() {
    popup.style.display = "none";
  }