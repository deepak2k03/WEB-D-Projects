const button = document.body.querySelector(".button");
function changecolor() {
  const r = Math.floor(Math.random() * 126);
  const g = Math.floor(Math.random() * 126);
  const b = Math.floor(Math.random() * 126);
  const rgb = `rgb(${r}, ${g}, ${b})`;
  document.body.style.backgroundColor = rgb;
}
button.addEventListener("click", () => {
    changecolor();
});
