const menuIcon = document.querySelector(".menu-icon-container");
const headerContent = document.querySelector(".header-container");
const closeIcon = document.querySelector(".close-icon");
const goToTop = document.querySelector(".go-to-top");
const mainDiv = document.querySelector(".main-div");
menuIcon.addEventListener("click", () => {
  headerContent.classList.add("menu-open");
});
closeIcon.addEventListener("click", () => {
  headerContent.classList.remove("menu-open");
});
goToTop.addEventListener("click", () => {
  mainDiv.scrollTo(0, 0);
});
