import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { iconType, getTasksFromLS, addToLS } from "./helpers.js";

const form = document.querySelector(".form");
const taskContainer = document.querySelector(".task-container");
const taskList = document.querySelector(".task-list");
let map;
let coords = [];
let layerGroup = [];
let tasks = getTasksFromLS();

const onMapClick = (e) => {
  form.style.display = "flex";
  taskContainer.classList.add("min");
  coords = [e.latlng.lat, e.latlng.lng];
};

const addInfo = (note, status, coords) => {
  const icon = iconType(status);
  L.marker(coords, { icon }).addTo(layerGroup).bindPopup(`${note}`);
};

const getLocation = (position) => {
  const { latitude, longitude } = position.coords;
  map = L.map("map").setView([latitude, longitude], 13);
  layerGroup = L.layerGroup().addTo(map);
  console.log(map);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  L.marker([latitude, longitude]).addTo(map);

  addTask(tasks);

  map.on("click", onMapClick);
};

const showError = () => {
  throw new Error("Koordinatınız bulunamadı!");
};

window.navigator.geolocation.getCurrentPosition(getLocation, showError);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const note = e.target[0].value;
  const date = e.target[1].value;
  const status = e.target[2].value;

  if (note !== "" && date !== "" && status !== "") {
    const taskItem = { id: uuidv4(), note, date, status, coords };
    tasks.push(taskItem);
    addToLS(tasks);
    addTask(tasks);
  }

  taskContainer.classList.remove("min");
  form.style.display = "none";
  form.reset();
});

const addTask = (tasks) => {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    const { id, note, date, status, coords } = task;
    taskItem.dataset.id = id;
    taskItem.classList.add("task");
    taskItem.innerHTML = `
        <p class="task-status">${note}</p>
        <span class="task-title"><h4>Tarih:</h4>${date}</span>
        <span class="task-title"><h4>Durum:</h4>${status}</span>
        <button class="task-delete-btn"><i class="bi bi-x"></i></button>
        <button class="fly-btn"><i class="bi bi-airplane-fill"></i></button>
    `;

    taskList.insertAdjacentElement("afterbegin", taskItem);

    addInfo(note, status, coords);

    taskItem.addEventListener("click", (e) => {
      const ele = e.target;
      handleClick(ele);
    });
  });
};

const handleClick = (element) => {
  const id = element.closest(".task").dataset.id;
  if (element.parentElement.className === "task-delete-btn") {
    tasks = tasks.filter((task) => task.id !== id);
    addToLS(tasks);
    addTask(tasks);
  }

  if (element.parentElement.className === "fly-btn") {
    const task = tasks.find((task) => task.id === id);
    map.flyTo(task.coords);
  }
};
