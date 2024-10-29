// Import data
import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

// Initialize variables
let page = 1;
let matches = books;

// Create book preview
const createBookPreview = ({ author, id, image, title }) => {
  const element = document.createElement("button");
  element.classList = "preview";
  element.setAttribute("data-preview", id);
  element.innerHTML = `
    <img class="preview__image" src="${image}" />
    <div class="preview__info">
      <h3 class="preview__title">${title}</h3>
      <div class="preview__author">${authors[author]}</div>
    </div>
  `;
  return element;
};

// Create option element
const createOptionElement = (value, text) => {
  const element = document.createElement("option");
  element.value = value;
  element.innerText = text;
  return element;
};

// Append initial book previews
const starting = document.createDocumentFragment();
matches.slice(0, BOOKS_PER_PAGE).forEach((book) => {
  starting.appendChild(createBookPreview(book));
});
document.querySelector("[data-list-items]").appendChild(starting);

// Append genre options
const genreHtml = document.createDocumentFragment();
genreHtml.appendChild(createOptionElement("any", "All Genres"));
Object.entries(genres).forEach(([id, name]) => {
  genreHtml.appendChild(createOptionElement(id, name));
});
document.querySelector("[data-search-genres]").appendChild(genreHtml);

// Append author options
const authorsHtml = document.createDocumentFragment();
authorsHtml.appendChild(createOptionElement("any", "All Authors"));
Object.entries(authors).forEach(([id, name]) => {
  authorsHtml.appendChild(createOptionElement(id, name));
});
document.querySelector("[data-search-authors]").appendChild(authorsHtml);

// Set theme based on user preference
const setTheme = (theme) => {
  if (theme === "night") {
    document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
    document.documentElement.style.setProperty("--color-light", "10, 10, 20");
  } else {
    document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
    document.documentElement.style.setProperty(
      "--color-light",
      "255, 255, 255"
    );
  }
};
const prefersDarkScheme =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;
document.querySelector("[data-settings-theme]").value = prefersDarkScheme
  ? "night"
  : "day";
setTheme(prefersDarkScheme ? "night" : "day");

// Update "Show more" button
const updateShowMoreButton = () => {
  const remaining = matches.length - page * BOOKS_PER_PAGE;
  document.querySelector("[data-list-button]").innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>
  `;
  document.querySelector("[data-list-button]").disabled = remaining <= 0;
};
updateShowMoreButton();

// Event listeners
document.querySelector("[data-search-cancel]").addEventListener("click", () => {
  document.querySelector("[data-search-overlay]").open = false;
});

document
  .querySelector("[data-settings-cancel]")
  .addEventListener("click", () => {
    document.querySelector("[data-settings-overlay]").open = false;
  });

document.querySelector("[data-header-search]").addEventListener("click", () => {
  document.querySelector("[data-search-overlay]").open = true;
  document.querySelector("[data-search-title]").focus();
});

document
  .querySelector("[data-header-settings]")
  .addEventListener("click", () => {
    document.querySelector("[data-settings-overlay]").open = true;
  });

document.querySelector("[data-list-close]").addEventListener("click", () => {
  document.querySelector("[data-list-active]").open = false;
});

document
  .querySelector("[data-settings-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);
    setTheme(theme);
    document.querySelector("[data-settings-overlay]").open = false;
  });

document
  .querySelector("[data-search-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    matches = books.filter((book) => {
      const genreMatch =
        filters.genre === "any" || book.genres.includes(filters.genre);
      const titleMatch =
        filters.title.trim() === "" ||
        book.title.toLowerCase().includes(filters.title.toLowerCase());
      const authorMatch =
        filters.author === "any" || book.author === filters.author;
      return genreMatch && titleMatch && authorMatch;
    });
    page = 1;
    document
      .querySelector("[data-list-message]")
      .classList.toggle("list__message_show", matches.length < 1);
    document.querySelector("[data-list-items]").innerHTML = "";
    const newItems = document.createDocumentFragment();
    matches.slice(0, BOOKS_PER_PAGE).forEach((book) => {
      newItems.appendChild(createBookPreview(book));
    });
    document.querySelector("[data-list-items]").appendChild(newItems);
    updateShowMoreButton();
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.querySelector("[data-search-overlay]").open = false;
  });

document.querySelector("[data-list-button]").addEventListener("click", () => {
  const fragment = document.createDocumentFragment();
  matches
    .slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)
    .forEach((book) => {
      fragment.appendChild(createBookPreview(book));
    });
  document.querySelector("[data-list-items]").appendChild(fragment);
  page += 1;
  updateShowMoreButton();
});

document
  .querySelector("[data-list-items]")
  .addEventListener("click", (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    const active = pathArray.find((node) => node?.dataset?.preview)?.dataset
      ?.preview;
    if (active) {
      const book = books.find((book) => book.id === active);
      if (book) {
        document.querySelector("[data-list-active]").open = true;
        document.querySelector("[data-list-blur]").src = book.image;
        document.querySelector("[data-list-image]").src = book.image;
        document.querySelector("[data-list-title]").innerText = book.title;
        document.querySelector("[data-list-subtitle]").innerText =
          `${authors[book.author]} (${new Date(book.published).getFullYear()})`;
        document.querySelector("[data-list-description]").innerText =
          book.description;
      }
    }
  });

TextDecoderStream;
