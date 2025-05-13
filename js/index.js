import { getWeatherData, getWeatherByCoords } from "./weatherService.js";
import { capitalizeFirstLetter } from "./utils.js";

const form = document.getElementById("header__form");
const input = document.getElementById("city");

const cityTitle = document.querySelector(".city__name");
const iconImg = document.querySelector(".weather__icon");
const tempValue = document.querySelector(".weather__value");
const description = document.querySelector(".weather__description");
const infoItems = document.querySelectorAll(".weather__info-item");

function renderWeatherData(data) {
  cityTitle.textContent = data.name;

  iconImg.classList.remove("pulsing"); // Анимация "пульсации" иконки с текущей погодой
  iconImg.offsetWidth;
  iconImg.classList.add("pulsing");

  const iconCode = data.weather[0].icon;
  iconImg.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  iconImg.alt = data.weather[0].description;

  const favicon = document.getElementById("favicon");
  favicon.href = `https://openweathermap.org/img/wn/${iconCode}.png`; // Добавил так же фавикон с текущей погодой

  tempValue.textContent = Math.round(data.main.temp);

  description.textContent = capitalizeFirstLetter(data.weather[0].description);

  infoItems[0].textContent = `Ветер: ${Math.round(data.wind.speed)} км/ч`;
  infoItems[1].textContent = `Влажность: ${data.main.humidity}%`;
  infoItems[2].textContent = `Давление: ${data.main.pressure} гПа`;
}

async function loadDefaultCity() {
  try {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const data = await getWeatherByCoords(latitude, longitude);

          renderWeatherData(data);
        } catch (err) {
          console.error("Ошибка при получении данных по координатам:", err);
          fallbackToDefault();
        }
      },

      (error) => {
        console.error("Геолокация недоступна или отклонена:", error);
        fallbackToDefault();
      }
    );
  } catch (error) {
    console.error("Ошибка при инициализации геопозиции:", error);
    fallbackToDefault();
  }
}

async function fallbackToDefault() {
  try {
    const defaultCity = "Нью-Йорк";

    const data = await getWeatherData(defaultCity);

    renderWeatherData(data);
  } catch (error) {
    console.error("Ошибка при загрузке города по умолчанию:", error);
    alert("Не удалось загрузить погоду.");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = input.value.trim();

  if (!city) return;

  try {
    const data = await getWeatherData(city);

    renderWeatherData(data);

    input.value = "";
  } catch (error) {
    alert("Город не найден или ошибка при получении данных.");
    console.error("Ошибка запроса:", error);
  }
});

loadDefaultCity();
