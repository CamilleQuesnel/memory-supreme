var smartnav = document.getElementById("smart-nav");
var openBtn = document.getElementById("openBtn");
var closeBtn = document.getElementById("closeBtn");

openBtn.onclick = openNav;
closeBtn.onclick = closeNav;

/* Set the width of the side navigation to 250px */
function openNav() {
  smartnav.classList.add("active");
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  smartnav.classList.remove("active");
}
