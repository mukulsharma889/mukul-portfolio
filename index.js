const texts = ["Software Engineer", "full-stack developer"];
const speed = 80; // Typing speed
const delayBetweenTexts = 1500; // Delay before next text starts
let textIndex = 0;
let charIndex = 0;
const typewriterElement = document.getElementById("typewriter");

function typeWriter() {
  if (!typewriterElement) return;
  if (charIndex < texts[textIndex].length) {
    typewriterElement.textContent += texts[textIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeWriter, speed);
  } else {
    setTimeout(eraseText, delayBetweenTexts); // Wait before erasing
  }
}

function eraseText() {
  if (!typewriterElement) return;
  if (charIndex > 0) {
    typewriterElement.textContent = texts[textIndex].substring(
      0,
      charIndex - 1,
    );
    charIndex--;
    setTimeout(eraseText, speed / 2);
  } else {
    textIndex = (textIndex + 1) % texts.length; // Move to next text
    setTimeout(typeWriter, speed);
  }
}

if (typewriterElement) {
  typeWriter();
}

const popup = document.getElementById("popupForm");
const scrollProgress = document.getElementById("scrollProgress");
const mobileHireBtn = document.getElementById("mobileHireMe");
const formStatus = document.getElementById("formStatus");

function trackEvent(action, label, details = {}) {
  const payload = {
    event: "portfolio_event",
    action,
    label,
    ...details,
  };

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(payload);
  }

  window.dispatchEvent(
    new CustomEvent("portfolio:track", {
      detail: payload,
    }),
  );
}

document.querySelectorAll("[data-track-action]").forEach(element => {
  element.addEventListener("click", () => {
    trackEvent(
      element.dataset.trackAction || "click",
      element.dataset.trackLabel || "unlabeled",
      {
        href: element.getAttribute("href") || "",
      },
    );
  });
});

const emailConfig = window.EMAILJS_CONFIG || {};
const hasEmailConfig =
  Boolean(emailConfig.publicKey) &&
  Boolean(emailConfig.serviceId) &&
  Boolean(emailConfig.templateId);

if (window.emailjs && hasEmailConfig) {
  emailjs.init(emailConfig.publicKey);
}

// open popup (already wired in HTML for contact-btn button)
const contactButtons = document.querySelectorAll(
  ".contact-btn, .contact-text button",
);
contactButtons.forEach(btn =>
  btn.addEventListener("click", () => {
    if (popup) {
      popup.style.display = "flex";
    }
  }),
);

function closeForm() {
  if (popup) {
    popup.style.display = "none";
  }
}

function setFormStatus(message, type) {
  if (!formStatus) return;
  formStatus.className = "form-status";
  if (!message) {
    formStatus.textContent = "";
    return;
  }
  formStatus.classList.add(type);
  formStatus.textContent = message;
}

function validateField(field) {
  const fieldName = field.name;
  const value = field.value.trim();
  let errorMessage = "";

  if (fieldName === "user_name") {
    if (!value) {
      errorMessage = "Please enter your name.";
    } else if (value.length < 2) {
      errorMessage = "Name should be at least 2 characters.";
    }
  }

  if (fieldName === "user_email") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!value) {
      errorMessage = "Please enter your email address.";
    } else if (!emailPattern.test(value)) {
      errorMessage = "Enter a valid email address.";
    }
  }

  if (fieldName === "message") {
    if (!value) {
      errorMessage = "Please share your requirement.";
    } else if (value.length < 15) {
      errorMessage = "Message should be at least 15 characters.";
    }
  }

  const errorSlot = document.getElementById(`error-${fieldName}`);
  if (errorSlot) {
    errorSlot.textContent = errorMessage;
  }

  field.classList.remove("is-invalid", "is-valid");
  if (errorMessage) {
    field.classList.add("is-invalid");
    return false;
  }

  field.classList.add("is-valid");
  return true;
}

function validateForm(form) {
  const fields = form.querySelectorAll("input[name], textarea[name]");
  return [...fields].every(validateField);
}

// EmailJS form submission
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const fields = contactForm.querySelectorAll("input[name], textarea[name]");
  fields.forEach(field => {
    field.addEventListener("input", () => {
      validateField(field);
      if (formStatus && formStatus.classList.contains("error")) {
        setFormStatus("", "");
      }
    });
  });

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formIsValid = validateForm(this);
    if (!formIsValid) {
      setFormStatus(
        "Please correct highlighted fields and try again.",
        "error",
      );
      return;
    }

    if (!window.emailjs || !hasEmailConfig) {
      setFormStatus(
        "Email sending is not configured yet. Update window.EMAILJS_CONFIG with your EmailJS keys.",
        "info",
      );
      return;
    }

    // disable submit button to prevent double send
    const submitBtn = this.querySelector(".popup-submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    setFormStatus("Sending your message...", "info");

    // send using EmailJS from the runtime config
    emailjs
      .sendForm(emailConfig.serviceId, emailConfig.templateId, this)
      .then(
        function () {
          setFormStatus(
            "Thanks for reaching out. Your message has been sent successfully.",
            "success",
          );
          trackEvent("form_submit", "contact_form_success");
          contactForm.reset();
          fields.forEach(field =>
            field.classList.remove("is-valid", "is-invalid"),
          );
          setTimeout(() => {
            closeForm();
            setFormStatus("", "");
          }, 1200);
        },
        function (error) {
          console.error("EmailJS error:", error);
          setFormStatus(
            "Unable to send right now. Please try again in a few minutes.",
            "error",
          );
          trackEvent("form_submit", "contact_form_error");
        },
      )
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send";
      });
  });
}

// close popup when clicking outside container
window.addEventListener("click", function (e) {
  if (popup && e.target === popup) {
    closeForm();
  }
});

window.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeForm();
  }
});

// back to top button logic
const backBtn = document.getElementById("backToTop");
if (backBtn) {
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backBtn.classList.add("show");
    } else {
      backBtn.classList.remove("show");
    }
  });
  backBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (mobileHireBtn) {
  mobileHireBtn.addEventListener("click", () => {
    if (popup) {
      popup.style.display = "flex";
    }
  });
}

function updateScrollLinkedUI() {
  const documentHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const scrolled =
    documentHeight > 0 ? (window.scrollY / documentHeight) * 100 : 0;

  if (scrollProgress) {
    scrollProgress.style.width = `${Math.min(Math.max(scrolled, 0), 100)}%`;
  }

  if (mobileHireBtn) {
    if (window.innerWidth <= 768 && window.pageYOffset > 260) {
      mobileHireBtn.classList.add("show");
    } else {
      mobileHireBtn.classList.remove("show");
    }
  }
}

window.addEventListener("scroll", updateScrollLinkedUI);
window.addEventListener("resize", updateScrollLinkedUI);
updateScrollLinkedUI();

// navbar background toggle on scroll
const navbar = document.querySelector(".navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

// intersection observer for reveal animations
const observerOptions = { threshold: 0.12 };
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// observe elements
const toReveal = document.querySelectorAll(
  ".timeline-box, .name-text, .icons, .skill-card",
);
toReveal.forEach(el => revealObserver.observe(el));

// scrollspy for navbar active link
const sections = document.querySelectorAll(
  "#home, #experience, #expertise, #contact",
);
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(sec => {
    const top = sec.offsetTop - 90; // account for navbar height
    if (window.pageYOffset >= top) {
      current = sec.getAttribute("id");
    }
  });
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

window.dispatchEvent(new Event("scroll"));

// collapse navbar on mobile after click
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    const navCollapse = document.getElementById("navbarSupportedContent");
    if (navCollapse.classList.contains("show")) {
      new bootstrap.Collapse(navCollapse).hide();
    }
  });
});
