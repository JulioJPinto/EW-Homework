import xmlschema as ET
import os

def validate_xml(xml_file, xsd_file):
    try:
        # Parse XML file and XSD schema
        xmlschema_doc = ET.parse(xsd_file)
        xmlschema = ET.XMLSchema(xmlschema_doc)
        xml_doc = ET.parse(xml_file)

        # Validate XML against XSD schema
        xmlschema.assertValid(xml_doc)
        print(f"{xml_file} is valid according to {xsd_file}.")
    except ET.XMLSchemaError as e:
        print(f"Error: {str(e)}")
        print(f"{xml_file} is NOT valid according to {xsd_file}.")

# Example usage
dir = "public/texto"
xml_files = [os.path.join(dir, file) for file in os.listdir(dir) if file.endswith('.xml')]
xsd_file = "public/MRB-rua.xsd"
for file in xml_files:
    validate_xml(file, xsd_file)
