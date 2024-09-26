/**
 * Initializes the mobile menu functionality by adding click event listeners to the links.
 */
document.addEventListener("DOMContentLoaded", function () {
  var links = document.querySelectorAll(".mobile-menu_link_container");

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      // Setze die Hintergrundfarbe aller Links zurück
      links.forEach(function (resetLink) {
        resetLink.classList.remove("active");
      });

      // Setze die Hintergrundfarbe des geklickten Links
      link.classList.add("active");
    });
  });
});
