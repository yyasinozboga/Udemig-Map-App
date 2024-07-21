export const iconType = (status) => {
  switch (status) {
    case "park":
      return carIcon;
    case "home":
      return homeIcon;
    case "job":
      return jobIcon;
    case "goto":
      return visitIcon;
    default:
      throw new Error("Lütfen geçerli bir seçeneği seçiniz!");
  }
};

let carIcon = L.icon({
  iconUrl: "./images/car.png",
  iconSize: [50, 60],
});

let homeIcon = L.icon({
  iconUrl: "./images/home-marker.png",
  iconSize: [50, 60],
});

let jobIcon = L.icon({
  iconUrl: "./images/job.png",
  iconSize: [50, 60],
});

let visitIcon = L.icon({
  iconUrl: "./images/visit.png",
  iconSize: [50, 60],
});

export const getTasksFromLS = () => {
  return JSON.parse(localStorage.getItem("tasks")) || [];
};

export const addToLS = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};
