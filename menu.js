const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");

modalTriggers.forEach((trigger) =>
  trigger.addEventListener("click", toggleModal)
);

function toggleModal() {
  modalContainer.classList.toggle("active");
}

const slideValue = document.querySelector("span");
const inputSlider = document.getElementById("sound");
inputSlider.oninput = () => {
  let value = inputSlider.value;
  slideValue.textContent = value;
  slideValue.style.left = value / 2 + "%";
  slideValue.classList.add("show");
};
inputSlider.onblur = () => {
  slideValue.classList.remove("show");
};
