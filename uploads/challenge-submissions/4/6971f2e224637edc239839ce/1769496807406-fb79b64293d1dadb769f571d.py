import re

INPUT_FILE = "user_input.txt"
LOG_FILE = "captured.log"

patterns = [
    r"username\s*=\s*\S+",
    r"password\s*=\s*\S+",
    r"https?://\S+"
]

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    data = f.read()

matches = []
for p in patterns:
    matches.extend(re.findall(p, data, re.IGNORECASE))

if matches:
    with open(LOG_FILE, "w") as log:
        for m in matches:
            log.write(m + "\n")

    print("[+] Sensitive input detected. Logging activated.")
else:
    print("[-] No sensitive input found.")
