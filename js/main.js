(function () {
  const topics = {
    career: {
      label: "Карьера",
      text: "Помогаю понять, с чего начать работать, как собрать первый опыт, что писать в резюме и как искать проекты, даже если кажется, что нечего показать.",
      image: "assets/images/topic-photo.jpg",
    },
    ai: {
      label: "AI и вайбкодинг",
      text: "Разбираем, как использовать AI в учёбе и проектах: от промптов до первого лендинга и прототипа без лишней теории.",
      image: "assets/images/topic-ai.png",
    },
    business: {
      label: "Бизнес-проекты",
      text: "Помогаю собрать идею в понятный план: гипотеза, первые шаги, MVP и что показывать на старте.",
      image: "assets/images/topic-business.png",
    },
    strategy: {
      label: "Личная стратегия",
      text: "Смотрим на цели, приоритеты и ресурсы — чтобы перестать метаться и выбрать направление.",
      image: "assets/images/topic-strategy.png",
    },
    goals: {
      label: "Цели и дисциплина",
      text: "Строим систему привычек и шагов, которые реально выполняются, а не остаются в блокноте.",
      image: "assets/images/topic-goals.png",
    },
    brand: {
      label: "Личный бренд",
      text: "Помогаю упаковать опыт и историю так, чтобы тебя замечали: профиль, контент, портфолио.",
      image: "assets/images/topic-brand.png",
    },
  };

  /* Topics tabs */
  const tabs = document.querySelectorAll(".topics__tab");
  const topicLabel = document.getElementById("topic-label");
  const topicText = document.getElementById("topic-text");
  const topicImage = document.getElementById("topic-image");
  const topicSwitchName = document.getElementById("topic-switch-name");
  const topicKeys = Array.from(tabs).map((t) => t.dataset.topic);
  let topicIndex = 0;

  function setTopic(key) {
    const data = topics[key];
    if (!data) return;
    topicIndex = Math.max(0, topicKeys.indexOf(key));

    tabs.forEach((t) => {
      const active = t.dataset.topic === key;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    });

    if (topicLabel) topicLabel.textContent = data.label;
    if (topicText) topicText.textContent = data.text;
    if (topicSwitchName) topicSwitchName.textContent = data.label;
    if (topicImage && data.image) topicImage.src = data.image;
    if (topicImage) topicImage.style.objectPosition = key === "business" ? "center top" : "";
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setTopic(tab.dataset.topic));
  });

  const topicPrev = document.getElementById("topic-prev");
  const topicNext = document.getElementById("topic-next");
  topicPrev?.addEventListener("click", () => {
    topicIndex = (topicIndex - 1 + topicKeys.length) % topicKeys.length;
    setTopic(topicKeys[topicIndex]);
  });
  topicNext?.addEventListener("click", () => {
    topicIndex = (topicIndex + 1) % topicKeys.length;
    setTopic(topicKeys[topicIndex]);
  });

  /* Reviews accordion */
  const reviewItems = document.querySelectorAll(".review-item");
  const reviewScreenshot = document.getElementById("reviews-screenshot");
  const chevronActive = "assets/images/review-chevron-active.svg";
  const chevronClosed = "assets/images/review-chevron.svg";

  function syncReviewScreenshot() {
    if (!reviewScreenshot) return;
    const openItem = document.querySelector(".review-item.is-open");
    const src = openItem?.dataset.screenshot;
    if (src) reviewScreenshot.src = src;
  }

  function syncReviewToggleIcons() {
    reviewItems.forEach((item) => {
      const img = item.querySelector(".review-item__toggle img");
      if (!img) return;
      img.src = item.classList.contains("is-open") ? chevronActive : chevronClosed;
    });
  }

  reviewItems.forEach((item) => {
    const head = item.querySelector(".review-item__head");
    const body = item.querySelector(".review-item__body");

    head?.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      reviewItems.forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector(".review-item__body")?.setAttribute("hidden", "");
        other.querySelector(".review-item__head")?.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        body?.removeAttribute("hidden");
        head.setAttribute("aria-expanded", "true");
      }

      syncReviewToggleIcons();
      syncReviewScreenshot();
    });
  });

  syncReviewToggleIcons();
  syncReviewScreenshot();

  /* Mobile menu */
  const header = document.getElementById("header");
  const burger = document.getElementById("burger");

  burger?.addEventListener("click", () => {
    const open = header.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  header?.querySelectorAll(".header__nav a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("is-open");
      burger?.setAttribute("aria-expanded", "false");
    });
  });

  /* Blog carousel */
  const track = document.getElementById("blog-track");
  const prevBtn = document.getElementById("blog-prev");
  const nextBtn = document.getElementById("blog-next");
  let blogOffset = 0;

  function getCardStep() {
    const card = track?.querySelector(".blog-card");
    if (!card) return 0;
    return card.offsetWidth + 30;
  }

  function moveBlog(dir) {
    const step = getCardStep();
    const max = Math.max(0, track.scrollWidth - track.parentElement.clientWidth);
    blogOffset = Math.min(max, Math.max(0, blogOffset + dir * step));
    track.style.transform = `translateX(-${blogOffset}px)`;
  }

  prevBtn?.addEventListener("click", () => moveBlog(-1));
  nextBtn?.addEventListener("click", () => moveBlog(1));

  window.addEventListener("resize", () => {
    blogOffset = 0;
    if (track) track.style.transform = "translateX(0)";
  });

  /* FAB — показываем после выхода из hero */
  const hero = document.getElementById("hero");
  const fab = document.querySelector(".fab");

  if (hero && fab) {
    const fabObserver = new IntersectionObserver(
      ([entry]) => {
        fab.classList.toggle("is-visible", !entry.isIntersecting);
      },
      { threshold: 0 }
    );
    fabObserver.observe(hero);
  }

})();
