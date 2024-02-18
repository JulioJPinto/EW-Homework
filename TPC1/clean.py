import shutil
import os

def delete_directory(directory):
    try:
        if os.path.exists(directory):
            shutil.rmtree(directory)
            print(f"Directory '{directory}' and its contents deleted successfully.")
        else:
            print(f"Directory '{directory}' does not exist.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage:
directory_to_delete = "pages"
delete_directory(directory_to_delete)
