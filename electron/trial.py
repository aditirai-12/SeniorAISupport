import os
import re
import subprocess

def run_bat_file(file_path, output_folder):
    try:
        # Ensure the output folder exists, create if not
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)

        # Formulate the complete output file path
        output_file_path = os.path.join(output_folder, "output.nfo")

        # Use subprocess.call() to run the .bat file and redirect output to the specified folder
        subprocess.call([file_path, ">", output_file_path], shell=True)

        print(f"{file_path} executed successfully. NFO file saved to {output_file_path}")
    except subprocess.CalledProcessError as e:
        print(f"Error occurred while executing {file_path}: {e}")
    except FileNotFoundError:
        print(f"The file {file_path} was not found.")
    except Exception as e:
        print(f"An error occurred: {e}")



def scrape_nfo_file(file_path):
    print('hi')
    system_info = {}

    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
            lines = file.readlines()

            # Example: Extracting specific information based on line content
            for line in lines:
                # Example: Extracting OS version
                match = re.match(r"Operating System: (.+)", line)
                if match:
                    system_info["os_version"] = match.group(1).strip()

                # Add more conditions to extract other relevant information

    except FileNotFoundError:
        print(f"The file {file_path} was not found.")
    except Exception as e:
        print(f"An error occurred while reading the file: {e}")

    return system_info




# Example usage:
bat_file_path = "info.bat"  # Update this with your actual .bat file path
output_folder = "/Users/asrak/classes/cse412/finalProject/untitled"  # Update this with your desired output folder
#run_bat_file(bat_file_path, output_folder)

#.nfo file
nfo_file_path = ".nfo"
system_info = scrape_nfo_file(nfo_file_path)
print(system_info)