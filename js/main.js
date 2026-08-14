document.addEventListener("DOMContentLoaded", () => {
  /* ------------------------------------------
     Año en el footer
  ------------------------------------------ */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------
     Menú móvil
  ------------------------------------------ */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen);
    });

    navMenu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ------------------------------------------
     Revelado de secciones al hacer scroll
  ------------------------------------------ */
  const revealEls = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ------------------------------------------
     Terminal del hero: efecto de escritura
  ------------------------------------------ */
  const terminalOutput = document.getElementById("terminalOutput");

  const terminalLines = [
    "$ whoami",
    "tony — desarrollador front-end",
    "",
    "$ ls proyectos/",
    "greilysrivassacademy.com/",
    "ladolceria.cl/",
    "drjulioestrada.com/",
    "",
    "$ cat stack.txt",
    "HTML · CSS · JavaScript",
    "React (Vite) · jQuery · Bootstrap",
    "",
    '$ echo "disponible para nuevos proyectos"',
    "disponible para nuevos proyectos_",
  ];

  function typeTerminal() {
    if (!terminalOutput) return;

    if (prefersReducedMotion) {
      terminalOutput.textContent = terminalLines.join("\n");
      return;
    }

    let lineIndex = 0;
    let charIndex = 0;
    let buffer = "";

    function typeChar() {
      if (lineIndex >= terminalLines.length) return;

      const currentLine = terminalLines[lineIndex];

      if (charIndex < currentLine.length) {
        buffer += currentLine.charAt(charIndex);
        charIndex++;
        terminalOutput.textContent = buffer;
        setTimeout(typeChar, 18 + Math.random() * 22);
      } else {
        buffer += "\n";
        lineIndex++;
        charIndex = 0;
        terminalOutput.textContent = buffer;
        setTimeout(typeChar, 220);
      }
    }

    typeChar();
  }

  typeTerminal();

  /* ------------------------------------------
     Formulario de contacto (envío por correo vía Formspree)
  ------------------------------------------ */
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre = contactForm.nombre.value.trim();
      const correo = contactForm.correo.value.trim();
      const mensaje = contactForm.mensaje.value.trim();

      if (!nombre || !correo || !mensaje) {
        formStatus.textContent = "Completa todos los campos antes de enviar.";
        return;
      }

      const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
      if (!correoValido) {
        formStatus.textContent = "Revisa el formato de tu correo.";
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      formStatus.textContent = "Enviando...";

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(contactForm),
        });

        if (response.ok) {
          formStatus.textContent = `Gracias, ${nombre}. Tu mensaje fue enviado.`;
          contactForm.reset();
        } else {
          formStatus.textContent =
            "No se pudo enviar. Intenta de nuevo o escríbeme directo por correo.";
        }
      } catch (error) {
        formStatus.textContent =
          "No se pudo enviar. Revisa tu conexión e intenta de nuevo.";
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
});
