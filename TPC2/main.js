var http = require("http")
var url = require("url")
var axios = require("axios")


function gen_city_block(city) {
    return `
    <a href= "${'cidades/' + city.id}">
        <div class="border-2 border-gray-800 rounded-lg overflow-hidden">
            <div class="m-4">${city.nome}</div>
        </div>
    </a>
    `
}

function gen_city_index(cities) {
    return `
    <!doctype html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    
    <body>
        <nav class="bg-gray-800">
            <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div class="relative flex h-16 items-center">
                    <a href="index.html">
                        <div class="text-white font-semibold text-xl">Ruas de Braga</div>
                    </a>
                </div>
            </div>
        </nav>
        <div class="mx-96 my-16">
            <div class="grid grid-cols-3 gap-4 justify-stretch">
                ${cities.map(gen_city_block).join('\n')}
            </div>
        </div>
    
    
    </body>
    </html>  
    `
}

function gen_city_page(city) {
    return `
    <!doctype html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <title>${city.nome}</title>
    </head>
    
    <body>
        <nav class="bg-gray-800">
            <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div class="relative flex h-16 items-center">
                    <a href="index.html">
                        <div class="text-white font-semibold text-xl">Ruas de Braga</div>
                    </a>
                </div>
            </div>
        </nav>
        <div class="mx-72 my-16">
            <p class="text-3xl font-bold">
                ${city.nome}
            </p>
            <div class="my-8 flex gap-4 flex-row">
                ${city.população} habitantes
            </div>
            <div class="text-md">
                Descrição: ${city.descrição}
                Distrito: ${city.distrito}
            </div>
   
        </div>
    
    
    </body>
    
    </html>
    `
}


http.createServer((request, response) => {
    var q = url.parse(request.url, true)
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})

    if (q.pathname == "/cidades") {
        axios.get("http://localhost:3000/cidades?_sort=nome")
            .then((resp) => {
                var data = resp.data
                response.write(gen_city_index(data))
                response.end()
            })
            .catch((err) => {
                console.log("Erro: " + err)
                response.write("<p>" + err + "</p>")
            })
    }
    else if (q.pathname.startsWith("/cidades/")) {
        axios.get("http://localhost:3000/cidades?id=" + q.pathname.split("/")[2])
            .then((resp) => {
                var data = resp.data
                response.write(gen_city_page(data[0]))
                response.end()
            })
    }
    else {
        response.write("Operação não suportada.")
        response.end()
    }
}).listen(1234)