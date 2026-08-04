(function () {
  document.querySelectorAll(".people-card--flippable").forEach((card) => {
    const toggle = () => {
      const flipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(flipped));
    };
    card.addEventListener("click", toggle);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  });

  document.querySelectorAll(".page-faq").forEach((faq) => {
    const items = faq.querySelectorAll(".page-faq__item");

    items.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        items.forEach((other) => {
          if (other !== item) other.open = false;
        });
      });
    });
  });
})();
