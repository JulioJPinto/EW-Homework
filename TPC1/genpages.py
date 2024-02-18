import os
import shutil
import xml.etree.ElementTree as ET


PAGES_RUA = "pages"
DATASET = "public/texto"

def gen_html_pages(root, id):
    file = f"pages/{id}.html"

    if not os.path.exists(file):
        shutil.copyfile("ex-details.html", file)

    nome = root.find('.//nome').text

    corpo = root.find('.//corpo')

    figures = corpo.findall('.//figuras')
    figures_div = gen_images(figures)

    houses_list = corpo.findall('.//lista-casas')
    houses_div = "\n"
    for lists  in houses_list:
        houses_div += gen_houses(lists) + "\n"
        
        

    with open(file, 'r') as f:
        html_content = f.read()

    print(html_content)
    modified_content = html_content.replace("{NAME}", nome)
    modified_content.replace("{HOMES}", houses_div)
    modified_content.replace("{FIGURES}", figures_div)
    print(modified_content)

    with open(file, 'w') as f:
        f.write(modified_content)

    

def gen_images(figures):
    result = ""
    for f in figures:
        # Check if 'path' attribute exists
        if 'path' in f.attrib:
            img_src = f.attrib['path'].replace("..", "../public")
            figure = f"""<div><img src="{img_src}" /></div>\n"""
            result += figure
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
            <div class="justify-items-center p-2 border-2 rounded-sm border-gray-100">
                <p>Número: {num}</p>
                <p>Enfiteuta: {enfiteuta}</p>
                <p>Foro: {foro}</p>
                <p>Descrição:</p>
                <p>{desc}</p>
            </div>
        """
    
    print(res)
    return res

def gen_houses(houses):
    list = houses.findall(".//casa")
    res = "\n"

    for h in list:
        res += gen_house(h) + "\n"

    return res
               





