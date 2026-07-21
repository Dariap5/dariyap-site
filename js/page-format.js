(function () {
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
