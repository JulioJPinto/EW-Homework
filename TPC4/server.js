const http = require("http");
const url = require("url");
const axios = require("axios");

const buildPage = (title, content) => `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <title>${title}</title>
</head>
<body class="bg-neutral-100 font-inter">
    <header class="w-full border-b bg-white shadow-sm p-4 px-32">
        <h1 class="text-3xl text-blue-800 font-medium"> Compositores Musicais</h1>
    </header>  
    <main class="py-8 px-32">
        ${title === "Compositores" ? `
            <div class="flex space-x-4 my-4">
                <a href="/adicionar" class="w-64 rounded bg-blue-800 text-white p-4 shadow-sm hover:shadow-md transition-all text-center">
                     Adicionar Compositor
                </a>
                <a href="/eliminar" class="w-64 rounded bg-blue-800 text-white p-4 shadow-sm hover:shadow-md transition-all text-center">
                     Eliminar Compositor
                </a>
            </div>` : ""}
        ${["Compositores", "Períodos"].includes(title) ? `
            <div class="grid grid-cols-2 gap-4">${content}</div>` : `
            <div>${content}</div>`}
    </main>
</body>
</html>`;

const genLink = name => name.replaceAll(" ", "_");
const getNameFromLink = link => link.replaceAll("_", " ");

const genCompositorBlock = ({ id, nome, periodo }) => id && nome && periodo ? `
<a href="/compositores/${id}" class="bg-white w-full p-4 rounded border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center">
    <p class="text-xl font-medium"> ${nome}</p>
    <p class="text-neutral-400"> ${periodo}</p>
</a>` : "";

const genPeriodoBlock = periodo => `
<a href="/periodos/${genLink(periodo)}" class="bg-white w-full p-4 rounded border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center">
    <p class="text-xl font-medium"> ${periodo}</p>
</a>`;

const genCompositoresPage = compositores => buildPage("Compositores", compositores.map(genCompositorBlock).join("\n"));
const genPeriodosPage = periodos => buildPage("Períodos", periodos.map(genPeriodoBlock).join("\n"));
const genPeriodoPage = compositores => buildPage("Períodos", compositores.map(genCompositorBlock).join("\n"));

const genAddCompositorPage = () => buildPage("Adicionar Compositor", `
<form action="/adicionar" method="post" class="space-y-4">
    <input type="text" name="nome" placeholder="Nome do Compositor" class="w-96 p-3 rounded border">
    <input type="text" name="periodo" placeholder="Período do Compositor" class="w-96 p-3 rounded border">
    <input type="text" name="dataNasc" placeholder="Data de Nascimento" class="w-96 p-3 rounded border">
    <input type="text" name="dataObito" placeholder="Data de Óbito" class="w-96 p-3 rounded border">
    <textarea name="bio" placeholder="Biografia" class="w-96 p-3 rounded border"></textarea>
    <button type="submit" class="w-96 p-3 rounded bg-blue-800 text-white font-medium shadow-sm hover:shadow-md transition-all"> Adicionar Compositor</button>
</form>`);

const genDeleteCompositorPage = () => buildPage("Eliminar Compositor", `
<form action="/eliminar" method="post" class="space-y-4">
    <input type="text" name="id" placeholder="ID do Compositor" class="w-96 p-3 rounded border">
    <button type="submit" class="w-96 p-3 rounded bg-blue-800 text-white font-medium shadow-sm hover:shadow-md transition-all"> Eliminar Compositor</button>
</form>`);

const genCompositorPage = compositor => buildPage(compositor.nome, `
<div class="space-y-4 w-[45rem] relative">
    <a href="/compositores/${compositor.id}/editar" class="absolute top-0 right-0 bg-blue-800 p-4 text-white rounded shadow-sm hover:shadow-md"> Editar</a>
    <h1 class="text-4xl font-bold"> ${compositor.nome}</h1>
    <div class="text-neutral-400 font-medium"> ${compositor.periodo}</div>
    <div class="text-neutral-400 font-medium"> ${compositor.dataNasc || "?"} até ${compositor.dataObito || "?"}</div>
    <h2 class="text-3xl font-bold"> Biografia</h2>
    <p class="text-justify">${compositor.bio || "Sem biografia disponível."}</p>        
</div>`);

const genEditCompositorPage = compositor => buildPage("Editar Compositor", `
<form action="compositores/${compositor.id}/editar" method="post" class="space-y-4">
    <input type="text" name="nome" value="${compositor.nome}" class="w-96 p-3 rounded border">
    <input type="text" name="periodo" value="${compositor.periodo}" class="w-96 p-3 rounded border">
    <input type="text" name="dataNasc" value="${compositor.dataNasc}" class="w-96 p-3 rounded border">
    <input type="text" name="dataObito" value="${compositor.dataObito}" class="w-96 p-3 rounded border">
    <textarea name="bio" placeholder="Biografia" class="w-96 p-3 rounded border">${compositor.bio}</textarea>
    <button type="submit" class="w-96 p-3 rounded bg-blue-800 text-white font-medium shadow-sm hover:shadow-md transition-all"> Editar Compositor</button>
</form>`);

const fetchCompositores = async () => {
    try {
        const response = await axios.get("http://localhost:3000/compositores");
        return response.data;
    } catch (error) {
        console.error("Error fetching composers:", error);
        return [];
    }
};

const fetchPeriodos = async () => {
    try {
        const response = await axios.get("http://localhost:3000/periodos");
        return response.data;
    } catch (error) {
        console.error("Error fetching periods:", error);
        return [];
    }
};

const fetchCompositoresByPeriodo = async periodo => {
    try {
        const response = await axios.get(`http://localhost:3000/compositores/periodo/${periodo}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching composers by period:", error);
        return [];
    }
};

const fetchCompositorById = async id => {
    try {
        const response = await axios.get(`http://localhost:3000/compositores/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching composer by id:", error);
        return null;
    }
};

const handleGetRequest = async (req, res) => {
    const path = url.parse(req.url).pathname;
    
    if (path === "/compositores") {
        const compositores = await fetchCompositores();
        res.end(genCompositoresPage(compositores));
    } else if (path === "/periodos") {
        const periodos = await fetchPeriodos();
        res.end(genPeriodosPage(periodos));
    } else if (path.startsWith("/periodos/")) {
        const periodo = path.split("/")[2];
        const compositores = await fetchCompositoresByPeriodo(getNameFromLink(periodo));
        res.end(genPeriodoPage(compositores));
    } else if (path.startsWith("/compositores/") && path.endsWith("/editar")) {
        const id = path.split("/")[2];
        const compositor = await fetchCompositorById(id);
        res.end(genEditCompositorPage(compositor));
    } else if (path.startsWith("/compositores/")) {
        const id = path.split("/")[2];
        const compositor = await fetchCompositorById(id);
        res.end(genCompositorPage(compositor));
    } else if (path === "/adicionar") {
        res.end(genAddCompositorPage());
    } else if (path === "/eliminar") {
        res.end(genDeleteCompositorPage());
    } else {
        res.end(buildPage("404 - Not Found", "<h1>404 - Page Not Found</h1>"));
    }
};

const handlePostRequest = async (req, res) => {
    const path = url.parse(req.url).pathname;

    let body = "";
    req.on("data", chunk => {
        body += chunk.toString();
    });
    req.on("end", async () => {
        const params = new URLSearchParams(body);
        const data = Object.fromEntries(params.entries());
        
        try {
            if (path === "/adicionar") {
                await axios.post("http://localhost:3000/compositores", data);
            } else if (path === "/eliminar") {
                await axios.delete(`http://localhost:3000/compositores/${data.id}`);
            } else if (path.endsWith("/editar")) {
                const id = path.split("/")[2];
                await axios.put(`http://localhost:3000/compositores/${id}`, data);
            }
            res.writeHead(302, { Location: "/compositores" });
            res.end();
        } catch (error) {
            console.error("Error processing form data:", error);
            res.end(buildPage("Error", "<h1>There was an error processing your request.</h1>"));
        }
    });
};

http.createServer(async (req, res) => {
    if (req.method === "GET") {
        await handleGetRequest(req, res);
    } else if (req.method === "POST") {
        await handlePostRequest(req, res);
    }
}).listen(4000, () => {
    console.log("Server running on port 4000");
});
