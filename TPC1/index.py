import os
import xml.etree.ElementTree as ET
import shutil
from genpages import gen_html_pages

PAGES_RUA = "pages"
DATASET = "public/texto"

def gen_index_card(src, nome, img_src):
    card = f"""
            <a href="{src}">
                <div class="border-2 border-gray-800 rounded-lg overflow-hidden">
                    <img class="h-64 w-full object-cover" alt="No image found" src="{img_src}" />
                    <div class="m-4">{nome}</div>
                </div>
            </a>
            """

    return card

# def replace_flags_page(root,file):
def gen_index_grid(dir):
    file = "pages/index.html"

    if not os.path.exists(file):
        shutil.copyfile("ex-index.html", file)


    xml_files = [file for file in os.listdir(dir) if file.endswith('.xml')]
    xml_files.sort()
    res=""

    if not os.path.exists(PAGES_RUA):
        os.makedirs(PAGES_RUA)

    for file in xml_files:
        file = os.path.join(dir,file)

        root = ET.parse(file).getroot()
        numero_value = root.find('.//número').text
        nome_value = root.find('.//nome').text

        first_image = root.find('.//figura/imagem')
        img_src= first_image.attrib['path'].replace("..", "public")
        img_src = "../" + img_src
        print(img_src)

        gen_html_pages(root, numero_value)

        href = f"{numero_value}.html"
        res += gen_index_card(href, nome_value, img_src)

    return res

if not os.path.exists(PAGES_RUA):
            os.makedirs(PAGES_RUA)

res = gen_index_grid(DATASET)

file_path = PAGES_RUA +"/index.html"
with open(file_path, 'r') as file:
        html_content = file.read()

modified_content = html_content.replace("{GRID}", res)

with open(file_path, 'w') as file:
    file.write(modified_content)
