import os

def count_lines_of_code(directory, extensions):
    total_lines = 0

    for root, dirs, files in os.walk(directory):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    total_lines += len(lines)

    return total_lines

if __name__ == "__main__":
    src_directory = "./src"  # Adjust directory path as needed
    file_extensions = ['.ts', '.tsx']  # Add more extensions if needed
    lines_of_code = count_lines_of_code(src_directory, file_extensions)
    print(f"Total lines of code in {src_directory}: {lines_of_code}")