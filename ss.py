import os
import re

def rename_subject_files(directory):
    """
    Renames all files in the given directory to keep only the subject part (e.g., 'carrot')
    extracted from filenames like:
    'Minimalist vector illustration of a single carrot, studio lighting, ...'
    """
    names = []
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        if not os.path.isfile(file_path):
            continue
        names.append(file_path)
    print(names)
    


rename_subject_files("./assets/pantry")