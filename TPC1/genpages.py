import os
import shutil
import xml.etree.ElementTree as ET


PAGES_RUA = "pages"
DATASET = "public/texto"

def gen_html_pages(root, id):
    file = f"pages/{id}.html"

    shutil.copyfile("ex-details.html", file)

    nome = root.find('.//nome').text

    corpo = root.find('.//corpo')

    paragraphs = corpo.findall('.//para')
    paragraphs_list = []
    for p in paragraphs:
        paragraphs_list.append(p.text)

    paragraphs_div = ""
    for p in paragraphs_list:
        para = f"""
                    <p>{p}<p>\n
                """
        paragraphs_div += para

    figures = root.findall('.//figura')
    figures_div = gen_images(figures)

    houses_list = corpo.findall('.//lista-casas')
    houses_div = "\n"
    for lists  in houses_list:
        houses_div += gen_houses(lists) + "\n"
        
    with open(file, 'r') as f:
        html_content = f.read()

    modified_content = html_content.replace("{NAME}", nome)
    modified_content = modified_content.replace("{HOMES}", houses_div)
    modified_content = modified_content.replace("{FIGURES}", figures_div)
    modified_content = modified_content.replace("{DETAILS}", paragraphs_div)

    with open(file, 'w') as f:
        f.write(modified_content)

    

def gen_images(figures):
    result = "".replace("..", "../public")
    for f in figures:
        img = f.find('./imagem')
        caption = f.find('./legenda').text
        # Check if 'path' attribute exists
        if 'path' in img.attrib:
            img_src = img.attrib.get('path', '')
            img_src = img_src.replace("..", "../public")
            figure = f"""<div>
                            <img src="{img_src}" alt="No image found" />
                            <p>{caption}</p>
                         </div>\n"""
            result += figure
        else:
            print("Warning: Element has no 'path' attribute:", f.attrib)

    print(result)
    return result


def gen_house(house):
    num = house.find(".//número").text
    enfiteuta_element = house.find(".//enfiteuta")
    enfiteuta = enfiteuta_element.text if enfiteuta_element is not None else "Unknown"

    foro_element = house.find(".//foro")
    foro = foro_element.text if foro_element is not None else "Unknown"

    desc_element = house.find(".//desc")
    desc = desc_element.text if desc_element is not None else "Unknown"

    res =f"""
            <div class="justify-items-center p-2 flex-auto border-2 rounded-lg border-gray-500">
                <p><b>Número</b>: {num}</p>
                <p><b>Enfiteuta</b>: {enfiteuta}</p>
                <p><b>Foro</b>: {foro}</p>
                <p><b>Descrição</b>:</p>
                <p>{desc}</p>
            </div>
        """
    return res

def gen_houses(houses):
    list = houses.findall(".//casa")
    res = "\n"

    for h in list:
        res += gen_house(h) + "\n"

    return res
               





