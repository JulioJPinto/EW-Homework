import requests
import json
import os

# URL to the API
URL = "http://localhost:3000/api/pessoas"
HEADERS = {'Content-Type': 'application/json'}
FILES = ["../datasets/dataset-extra1.json", "../datasets/dataset-extra2.json", "../datasets/dataset-extra3.json"]

def insert_pessoa(data):
    response = requests.post(URL, json=data, headers=HEADERS)
    print(response.text)

def main():
    for file in FILES:
        with open(os.path.join(os.path.dirname(__file__), file), "r") as f:
            data = json.load(f)
            for pessoa in data["pessoas"]:
                insert_pessoa(pessoa)

if __name__ == "__main__":
    main()
