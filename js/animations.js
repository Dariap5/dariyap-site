(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const heroContent = document.querySelector(".hero__content");
  if (heroContent && !prefersReduced) {
    heroContent.classList.add("reveal");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => heroContent.classList.add("is-visible"));
    });
  }

  /* Scroll reveal */
  if (!prefersReduced) {
    const revealSelectors = [
      "main > section .container",
      "main > section .section-title",
      ".footer .footer__shell",
    ];

    const revealEls = new Set();
    revealSelectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.classList.add("reveal");
        revealEls.add(el);
      });
    });

    document.querySelectorAll(".topic-card, .format-card, .process-card, .blog-card").forEach((el, i) => {
      el.classList.add("reveal", `reveal--delay-${(i % 3) + 1}`);
      revealEls.add(el);
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  /* Topics tab crossfade */
  const topicDetail = document.getElementById("topic-detail");
  const topicLabel = document.getElementById("topic-label");
  const topicText = document.getElementById("topic-text");
  const tabs = document.querySelectorAll(".topics__tab");

  if (topicDetail && tabs.length) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        if (tab.classList.contains("is-active") || prefersReduced) return;

        topicDetail.classList.add("is-fading");
        window.setTimeout(() => {
          topicDetail.classList.remove("is-fading");
        }, 280);
      });
    });
  }

  /* Reviews accordion — обёртка для плавной высоты */
  document.querySelectorAll(".review-item__body").forEach((body) => {
    if (body.querySelector(".review-item__body-inner")) return;
    const inner = document.createElement("div");
    inner.className = "review-item__body-inner";
    while (body.firstChild) {
      inner.appendChild(body.firstChild);
    }
    body.appendChild(inner);
  });

  /* Blog — плавный сдвиг уже в CSS; сброс при ресайзе */
  const track = document.getElementById("blog-track");
  if (track) {
    track.style.willChange = "transform";
  }
})();
