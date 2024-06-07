const http = require("http");
const axios = require("axios");

const HEADERS = { "Content-Type": "text/html" };
const CSS_LINK = '<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">';
const BASE_URL = "http://localhost:3000";

function render404(res) {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Error 404: Resource not found.");
}

function renderPage(res, title, body) {
  res.writeHead(200, HEADERS);
  res.end(
    `<!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      ${CSS_LINK}
    </head>
    <body>
      <div class="w3-container w3-pink">
        <h2><a href="/" style="text-decoration: none">Filmes</a></h2>
      </div>
      <div class="w3-container">
        ${body}
      </div>
    </body>
    </html>`
  );
}

function renderMain(res) {
  renderPage(
    res,
    "Filmes",
    `<p><a href="/filmes">Filmes</a></p>
     <p><a href="/generos">Generos</a></p>
     <p><a href="/atores">Atores</a></p>`
  );
}

function renderList(res, url, title, linkPrefix) {
  axios.get(`${BASE_URL}${url}`)
    .then(response => {
      const itemsHTML = response.data.map(item => 
        `<li><a href="${linkPrefix}/${item.id}">${item.name || item.title}</a></li>`
      ).join("");
      renderPage(res, title, `<h2>${title}</h2><ul>${itemsHTML}</ul>`);
    })
    .catch(() => render404(res));
}

function renderItem(res, url, itemId, titleKey, extraFields) {
  axios.get(`${BASE_URL}${url}/${itemId}`)
    .then(response => {
      const item = response.data;
      const extraContentPromises = extraFields.map(([key, label, linkPrefix]) => {
        const ids = item[key];
        return Promise.all(ids.map(id => 
          axios.get(`${BASE_URL}${linkPrefix}/${id}`)
            .then(resp => `<li><a href="${linkPrefix}/${id}">${resp.data.name || resp.data.title}</a></li>`)
            .catch(() => `<li>Erro</li>`)
        )).then(itemsHTML => `<h3>${label}</h3><ul>${itemsHTML.join("")}</ul>`);
      });
      Promise.all(extraContentPromises).then(extraContent => {
        renderPage(res, item[titleKey], 
          `<h2>${item[titleKey]}</h2>
           <p><b>Ano de lançamento:</b> ${item.year || ''}</p>
           ${extraContent.join("")}`
        );
      });
    })
    .catch(() => render404(res));
}

const routes = {
  "": renderMain,
  "/filmes": res => renderList(res, "/movies", "Filmes", "/filmes"),
  "/generos": res => renderList(res, "/genres", "Géneros", "/generos"),
  "/atores": res => renderList(res, "/actors", "Atores", "/atores"),
};

http.createServer((req, res) => {
  let url = req.url.replace(/\/$/, "");
  const parts = url.split("/");
  const id = parts[2];
  const mainRoute = parts.slice(0, 2).join("/");

  if (routes[mainRoute]) {
    routes[mainRoute](res);
  } else if (mainRoute === "/filmes" && id) {
    renderItem(res, "/movies", id, "title", [
      ["genres", "Géneros", "/generos"],
      ["cast", "Atores", "/atores"]
    ]);
  } else if (mainRoute === "/generos" && id) {
    renderItem(res, "/genres", id, "name", [
      ["movies", "Filmes de", "/filmes"]
    ]);
  } else if (mainRoute === "/atores" && id) {
    renderItem(res, "/actors", id, "name", [
      ["present_in", "Filmes em que", "/filmes"]
    ]);
  } else {
    render404(res);
  }
}).listen(7777);

console.log("Server running at http://localhost:7777");
