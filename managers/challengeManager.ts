<<<<<<< HEAD
import User from "../models/User.ts";
import ChallengeSubmission from "../models/ChallengeSubmission.ts";
import Team from "../models/Team.ts";
import type { IUser } from "../models/User.ts";
import AppError from "../utils/AppError.ts";
=======
import User from "../models/User.js";
import ChallengeSubmission from "../models/ChallengeSubmission.js";
import type { IUser } from "../models/User.js";
import AppError from "../utils/AppError.js";
>>>>>>> c88ab55bbcc333c38255d9416fce02fe67ac52fd

// Hint costs
const HINT_COSTS = {
  1: 1,  // Hint 1 costs -1 point
  2: 2,  // Hint 2 costs -2 points
  3: 3,  // Hint 3 costs -3 points
};

// Dummy challenges data with points based on difficulty and hints
const challenges = [
  { 
    id: 'machine1', 
    name: 'Bashful', 
    description: 'We found this legacy server running ancient scripts in a visible bin. The admin swears it\'s secure, but we have a feeling the shell is a bit fragile.', 
    link: 'http://142.93.164.70:8080/', 
    flags: [
      'FLAG{shellshock-3f9a21}',
      'FLAG{shellshock-4d5e6f}',
      'FLAG{shellshock-7890ab}',
      'FLAG{shellshock-cdef12}',
      'FLAG{shellshock-345678}',
      'FLAG{shellshock-90abcd}',
      'FLAG{shellshock-ef1234}',
      'FLAG{shellshock-567890}',
      'FLAG{shellshock-abcdef}',
      'FLAG{shellshock-13579b}',
      'FLAG{shellshock-2468ac}',
      'FLAG{shellshock-b0a192}',
      'FLAG{shellshock-83c7d6}',
      'FLAG{shellshock-f5e4d3}',
      'FLAG{shellshock-c2b1a0}',
      'FLAG{shellshock-987654}',
      'FLAG{shellshock-3210fe}',
      'FLAG{shellshock-dcba09}',
      'FLAG{shellshock-876543}',
      'FLAG{shellshock-210fed}',
      'FLAG{shellshock-cba987}',
      'FLAG{shellshock-654321}',
      'FLAG{shellshock-0fedcb}',
      'FLAG{shellshock-a98765}',
      'FLAG{shellshock-43210f}',
      'FLAG{shellshock-edcba9}',
      'FLAG{shellshock-876543}',
      'FLAG{shellshock-210fed}',
      'FLAG{shellshock-cba987}',
      'FLAG{shellshock-654321}',
      'FLAG{shellshock-0fedcb}',
      'FLAG{shellshock-a98765}',
      'FLAG{shellshock-43210f}',
      'FLAG{shellshock-edcba9}',
      'FLAG{shellshock-1b3d5f}',
      'FLAG{shellshock-2c4e6a}',
      'FLAG{shellshock-3d5f7b}',
      'FLAG{shellshock-4e6a8c}',
      'FLAG{shellshock-5f7b9d}',
      'FLAG{shellshock-6a8cae}',
      'FLAG{shellshock-7b9dbf}',
      'FLAG{shellshock-8caec0}',
      'FLAG{shellshock-9dbfd1}',
      'FLAG{shellshock-aec0e2}',
      'FLAG{shellshock-bfd1f3}',
      'FLAG{shellshock-c0e204}',
      'FLAG{shellshock-d1f315}',
      'FLAG{shellshock-e20426}',
      'FLAG{shellshock-f31537}',
      'FLAG{shellshock-042648}',
      'FLAG{shellshock-153759}',
      'FLAG{shellshock-26486a}',
      'FLAG{shellshock-37597b}',
      'FLAG{shellshock-486a8c}',
      'FLAG{shellshock-597b9d}',
      'FLAG{shellshock-6a8cae}',
      'FLAG{shellshock-7b9dbf}',
      'FLAG{shellshock-8caec0}',
      'FLAG{shellshock-9dbfd1}',
      'FLAG{shellshock-aec0e2}',
      'FLAG{shellshock-bfd1f3}',
      'FLAG{shellshock-c0e204}',
      'FLAG{shellshock-d1f315}',
      'FLAG{shellshock-e20426}',
      'FLAG{shellshock-f31537}',
      'FLAG{shellshock-042648}',
      'FLAG{shellshock-153759}',
      'FLAG{shellshock-26486a}',
      'FLAG{shellshock-37597b}',
      'FLAG{shellshock-486a8c}',
      'FLAG{shellshock-597b9d}',
      'FLAG{shellshock-6a8cae}',
      'FLAG{shellshock-7b9dbf}',
      'FLAG{shellshock-8caec0}',
      'FLAG{shellshock-9dbfd1}',
      'FLAG{shellshock-aec0e2}',
      'FLAG{shellshock-bfd1f3}',
      'FLAG{shellshock-c0e204}',
      'FLAG{shellshock-d1f315}',
      'FLAG{shellshock-e20426}',
      'FLAG{shellshock-f31537}',
      'FLAG{shellshock-042648}',
      'FLAG{shellshock-153759}',
      'FLAG{shellshock-26486a}',
      'FLAG{shellshock-37597b}',
      'FLAG{shellshock-486a8c}',
      'FLAG{shellshock-597b9d}',
      'FLAG{shellshock-6a8cae}',
      'FLAG{shellshock-7b9dbf}',
      'FLAG{shellshock-8caec0}',
      'FLAG{shellshock-9dbfd1}',
      'FLAG{shellshock-aec0e2}',
      'FLAG{shellshock-bfd1f3}',
      'FLAG{shellshock-c0e204}',
      'FLAG{shellshock-d1f315}',
      'FLAG{shellshock-e20426}',
      'FLAG{shellshock-f31537}',
      'FLAG{shellshock-042648}'
    ],
    difficulty: 'easy', 
    points: 5,
    hints: [
      "Scan the web directory carefully. Are there any scripts in folders like /cgi-bin/ or extensions like .sh or .cgi that return a 500 error or text output?",
      "The server is passing your HTTP headers (like User-Agent or Referer) directly into the environment variables of a Bash script. Bash seems to be an outdated version.",
      "The magic string () { :;}; confuses the Bash parser. Append your command after this string in a request header to execute it."
    ]
  },
  { 
    id: 'machine2', 
    name: 'BreakFast', 
    description: 'This high-performance PHP setup is built for speed. It handles standard traffic fine, but we suspect the configuration might behave unexpectedly if you push the URLs too far.', 
    link: 'http://209.38.236.96:8080/', 
    flags: [
      'FLAG{fastcgi_param_is_not_your_friend}',
      'FLAG{fastcgi_param_is_not_your_friend-4f5e6a}',
      'FLAG{fastcgi_param_is_not_your_friend-789012}',
      'FLAG{fastcgi_param_is_not_your_friend-345678}',
      'FLAG{fastcgi_param_is_not_your_friend-90abcd}',
      'FLAG{fastcgi_param_is_not_your_friend-ef1234}',
      'FLAG{fastcgi_param_is_not_your_friend-567890}',
      'FLAG{fastcgi_param_is_not_your_friend-abcdef}',
      'FLAG{fastcgi_param_is_not_your_friend-13579b}',
      'FLAG{fastcgi_param_is_not_your_friend-2468ac}',
      'FLAG{fastcgi_param_is_not_your_friend-b0a192}',
      'FLAG{fastcgi_param_is_not_your_friend-83c7d6}',
      'FLAG{fastcgi_param_is_not_your_friend-f5e4d3}',
      'FLAG{fastcgi_param_is_not_your_friend-c2b1a0}',
      'FLAG{fastcgi_param_is_not_your_friend-987654}',
      'FLAG{fastcgi_param_is_not_your_friend-3210fe}',
      'FLAG{fastcgi_param_is_not_your_friend-dcba09}',
      'FLAG{fastcgi_param_is_not_your_friend-876543}',
      'FLAG{fastcgi_param_is_not_your_friend-210fed}',
      'FLAG{fastcgi_param_is_not_your_friend-cba987}',
      'FLAG{fastcgi_param_is_not_your_friend-654321}',
      'FLAG{fastcgi_param_is_not_your_friend-0fedcb}',
      'FLAG{fastcgi_param_is_not_your_friend-a98765}',
      'FLAG{fastcgi_param_is_not_your_friend-43210f}',
      'FLAG{fastcgi_param_is_not_your_friend-edcba9}',
      'FLAG{fastcgi_param_is_not_your_friend-1a2b3c}',
      'FLAG{fastcgi_param_is_not_your_friend-2b3c4d}',
      'FLAG{fastcgi_param_is_not_your_friend-3c4d5e}',
      'FLAG{fastcgi_param_is_not_your_friend-4d5e6f}',
      'FLAG{fastcgi_param_is_not_your_friend-5e6f7a}',
      'FLAG{fastcgi_param_is_not_your_friend-6f7a8b}',
      'FLAG{fastcgi_param_is_not_your_friend-7a8b9c}',
      'FLAG{fastcgi_param_is_not_your_friend-8b9cad}',
      'FLAG{fastcgi_param_is_not_your_friend-9cadef}',
      'FLAG{fastcgi_param_is_not_your_friend-adef01}',
      'FLAG{fastcgi_param_is_not_your_friend-bef012}',
      'FLAG{fastcgi_param_is_not_your_friend-cf0123}',
      'FLAG{fastcgi_param_is_not_your_friend-d01234}',
      'FLAG{fastcgi_param_is_not_your_friend-e12345}',
      'FLAG{fastcgi_param_is_not_your_friend-f23456}',
      'FLAG{fastcgi_param_is_not_your_friend-034567}',
      'FLAG{fastcgi_param_is_not_your_friend-145678}',
      'FLAG{fastcgi_param_is_not_your_friend-256789}',
      'FLAG{fastcgi_param_is_not_your_friend-36789a}',
      'FLAG{fastcgi_param_is_not_your_friend-4789ab}',
      'FLAG{fastcgi_param_is_not_your_friend-589abc}',
      'FLAG{fastcgi_param_is_not_your_friend-69abcd}',
      'FLAG{fastcgi_param_is_not_your_friend-7abcde}',
      'FLAG{fastcgi_param_is_not_your_friend-8bcdef}',
      'FLAG{fastcgi_param_is_not_your_friend-9cdef0}',
      'FLAG{fastcgi_param_is_not_your_friend-acdef1}',
      'FLAG{fastcgi_param_is_not_your_friend-bdef12}',
      'FLAG{fastcgi_param_is_not_your_friend-cef123}',
      'FLAG{fastcgi_param_is_not_your_friend-df1234}',
      'FLAG{fastcgi_param_is_not_your_friend-ef2345}',
      'FLAG{fastcgi_param_is_not_your_friend-f03456}',
      'FLAG{fastcgi_param_is_not_your_friend-014567}',
      'FLAG{fastcgi_param_is_not_your_friend-125678}',
      'FLAG{fastcgi_param_is_not_your_friend-236789}',
      'FLAG{fastcgi_param_is_not_your_friend-34789a}',
      'FLAG{fastcgi_param_is_not_your_friend-4589ab}',
      'FLAG{fastcgi_param_is_not_your_friend-569abc}',
      'FLAG{fastcgi_param_is_not_your_friend-67abcd}',
      'FLAG{fastcgi_param_is_not_your_friend-78bcde}',
      'FLAG{fastcgi_param_is_not_your_friend-89cdef}',
      'FLAG{fastcgi_param_is_not_your_friend-9aef01}',
      'FLAG{fastcgi_param_is_not_your_friend-abf012}',
      'FLAG{fastcgi_param_is_not_your_friend-bc0123}',
      'FLAG{fastcgi_param_is_not_your_friend-cd1234}',
      'FLAG{fastcgi_param_is_not_your_friend-de2345}',
      'FLAG{fastcgi_param_is_not_your_friend-ef3456}',
      'FLAG{fastcgi_param_is_not_your_friend-f04567}',
      'FLAG{fastcgi_param_is_not_your_friend-015678}',
      'FLAG{fastcgi_param_is_not_your_friend-126789}',
      'FLAG{fastcgi_param_is_not_your_friend-23789a}',
      'FLAG{fastcgi_param_is_not_your_friend-3489ab}',
      'FLAG{fastcgi_param_is_not_your_friend-459abc}',
      'FLAG{fastcgi_param_is_not_your_friend-56abcd}',
      'FLAG{fastcgi_param_is_not_your_friend-67bcde}',
      'FLAG{fastcgi_param_is_not_your_friend-78cdef}',
      'FLAG{fastcgi_param_is_not_your_friend-89def0}',
      'FLAG{fastcgi_param_is_not_your_friend-9aef01}',
      'FLAG{fastcgi_param_is_not_your_friend-abf012}',
      'FLAG{fastcgi_param_is_not_your_friend-bc0123}',
      'FLAG{fastcgi_param_is_not_your_friend-cd1234}',
      'FLAG{fastcgi_param_is_not_your_friend-de2345}',
      'FLAG{fastcgi_param_is_not_your_friend-ef3456}',
      'FLAG{fastcgi_param_is_not_your_friend-f04567}',
      'FLAG{fastcgi_param_is_not_your_friend-015678}',
      'FLAG{fastcgi_param_is_not_your_friend-126789}',
      'FLAG{fastcgi_param_is_not_your_friend-23789a}',
      'FLAG{fastcgi_param_is_not_your_friend-3489ab}',
      'FLAG{fastcgi_param_is_not_your_friend-459abc}',
      'FLAG{fastcgi_param_is_not_your_friend-56abcd}',
      'FLAG{fastcgi_param_is_not_your_friend-67bcde}',
      'FLAG{fastcgi_param_is_not_your_friend-78cdef}',
      'FLAG{fastcgi_param_is_not_your_friend-89def0}',
      'FLAG{fastcgi_param_is_not_your_friend-9aef01}',
      'FLAG{fastcgi_param_is_not_your_friend-abf012}',
      'FLAG{fastcgi_param_is_not_your_friend-bc0123}'
    ],
    difficulty: 'easy', 
    points: 5,
    hints: [
      "The server uses Nginx and PHP-FPM. Check if the standard Nginx configuration for fastcgi_split_path_info is present and if the application behaves oddly with long URLs.",
      "This is a buffer underflow vulnerability. By manipulating the path info and query string (look for \"securimage\" or just standard path splitting), you can corrupt the memory pointer.",
      "Writing the payload manually is difficult due to the binary offsets. Search for a tool named phuip-fpizdam to automate the memory corruption and gain RCE."
    ]
  },
  { 
    id: 'machine3', 
    name: 'Insider', 
    description: 'A retro page that serves up dynamic content like it\'s 1999. It is designed to just display the date, but it seems a bit too obedient to server-side instructions.', 
    link: 'http://159.89.192.57:8080/', 
    flags: [
      'flag{ssi_was_a_bad_idea}',
      'FLAG{ssi_was_a_bad_idea-4c5d6}',
      'FLAG{ssi_was_a_bad_idea-7e8f9}',
      'FLAG{ssi_was_a_bad_idea-0a1b2}',
      'FLAG{ssi_was_a_bad_idea-3c4d5}',
      'FLAG{ssi_was_a_bad_idea-6e7f8}',
      'FLAG{ssi_was_a_bad_idea-90123}',
      'FLAG{ssi_was_a_bad_idea-45678}',
      'FLAG{ssi_was_a_bad_idea-9abcd}',
      'FLAG{ssi_was_a_bad_idea-ef012}',
      'FLAG{ssi_was_a_bad_idea-34567}',
      'FLAG{ssi_was_a_bad_idea-89abc}',
      'FLAG{ssi_was_a_bad_idea-def01}',
      'FLAG{ssi_was_a_bad_idea-23456}',
      'FLAG{ssi_was_a_bad_idea-789ab}',
      'FLAG{ssi_was_a_bad_idea-cdef0}',
      'FLAG{ssi_was_a_bad_idea-12345}',
      'FLAG{ssi_was_a_bad_idea-6789a}',
      'FLAG{ssi_was_a_bad_idea-bcdef}',
      'FLAG{ssi_was_a_bad_idea-01234}',
      'FLAG{ssi_was_a_bad_idea-56789}',
      'FLAG{ssi_was_a_bad_idea-abcde}',
      'FLAG{ssi_was_a_bad_idea-f0123}',
      'FLAG{ssi_was_a_bad_idea-45678}',
      'FLAG{ssi_was_a_bad_idea-9abcd}',
      'FLAG{ssi_was_a_bad_idea-ef123}',
      'FLAG{ssi_was_a_bad_idea-45678}',
      'FLAG{ssi_was_a_bad_idea-90abc}',
      'FLAG{ssi_was_a_bad_idea-def12}',
      'FLAG{ssi_was_a_bad_idea-34567}',
      'FLAG{ssi_was_a_bad_idea-890ab}',
      'FLAG{ssi_was_a_bad_idea-cdef1}',
      'FLAG{ssi_was_a_bad_idea-23456}',
      'FLAG{ssi_was_a_bad_idea-7890a}',
      'FLAG{ssi_was_a_bad_idea-bcdef}',
      'FLAG{ssi_was_a_bad_idea-12345}',
      'FLAG{ssi_was_a_bad_idea-67890}',
      'FLAG{ssi_was_a_bad_idea-abcde}',
      'FLAG{ssi_was_a_bad_idea-f1234}',
      'FLAG{ssi_was_a_bad_idea-56789}',
      'FLAG{ssi_was_a_bad_idea-0abcd}',
      'FLAG{ssi_was_a_bad_idea-ef123}',
      'FLAG{ssi_was_a_bad_idea-45678}',
      'FLAG{ssi_was_a_bad_idea-90abc}',
      'FLAG{ssi_was_a_bad_idea-d1e2f}',
      'FLAG{ssi_was_a_bad_idea-3a4b5}',
      'FLAG{ssi_was_a_bad_idea-c6d7e}',
      'FLAG{ssi_was_a_bad_idea-8f9a0}',
      'FLAG{ssi_was_a_bad_idea-1b2c3}',
      'FLAG{ssi_was_a_bad_idea-5d6e7}',
      'FLAG{ssi_was_a_bad_idea-9f0a1}',
      'FLAG{ssi_was_a_bad_idea-2b3c4}',
      'FLAG{ssi_was_a_bad_idea-6d7e8}',
      'FLAG{ssi_was_a_bad_idea-0f1a2}',
      'FLAG{ssi_was_a_bad_idea-4b5c6}',
      'FLAG{ssi_was_a_bad_idea-8d9e0}',
      'FLAG{ssi_was_a_bad_idea-2f3a4}',
      'FLAG{ssi_was_a_bad_idea-6b7c8}',
      'FLAG{ssi_was_a_bad_idea-0d1e2}',
      'FLAG{ssi_was_a_bad_idea-4f5a6}',
      'FLAG{ssi_was_a_bad_idea-8b9c0}',
      'FLAG{ssi_was_a_bad_idea-2d3e4}',
      'FLAG{ssi_was_a_bad_idea-6f7a8}',
      'FLAG{ssi_was_a_bad_idea-0b1c2}',
      'FLAG{ssi_was_a_bad_idea-4d5e6}',
      'FLAG{ssi_was_a_bad_idea-8f9a0}',
      'FLAG{ssi_was_a_bad_idea-2b3c4}',
      'FLAG{ssi_was_a_bad_idea-6d7e8}',
      'FLAG{ssi_was_a_bad_idea-0f1a2}',
      'FLAG{ssi_was_a_bad_idea-4b5c6}',
      'FLAG{ssi_was_a_bad_idea-8d9e0}',
      'FLAG{ssi_was_a_bad_idea-2f3a4}',
      'FLAG{ssi_was_a_bad_idea-6b7c8}',
      'FLAG{ssi_was_a_bad_idea-0d1e2}',
      'FLAG{ssi_was_a_bad_idea-4f5a6}',
      'FLAG{ssi_was_a_bad_idea-8b9c0}',
      'FLAG{ssi_was_a_bad_idea-2d3e4}',
      'FLAG{ssi_was_a_bad_idea-6f7a8}',
      'FLAG{ssi_was_a_bad_idea-0b1c2}',
      'FLAG{ssi_was_a_bad_idea-4d5e6}',
      'FLAG{ssi_was_a_bad_idea-8f9a0}',
      'FLAG{ssi_was_a_bad_idea-11223}',
      'FLAG{ssi_was_a_bad_idea-33445}',
      'FLAG{ssi_was_a_bad_idea-55667}',
      'FLAG{ssi_was_a_bad_idea-77889}',
      'FLAG{ssi_was_a_bad_idea-9900a}',
      'FLAG{ssi_was_a_bad_idea-aabbc}',
      'FLAG{ssi_was_a_bad_idea-ccdde}',
      'FLAG{ssi_was_a_bad_idea-eff00}',
      'FLAG{ssi_was_a_bad_idea-123ab}',
      'FLAG{ssi_was_a_bad_idea-456cd}',
      'FLAG{ssi_was_a_bad_idea-789ef}',
      'FLAG{ssi_was_a_bad_idea-01234}',
      'FLAG{ssi_was_a_bad_idea-56789}',
      'FLAG{ssi_was_a_bad_idea-abcde}',
      'FLAG{ssi_was_a_bad_idea-f0123}',
      'FLAG{ssi_was_a_bad_idea-45678}',
      'FLAG{ssi_was_a_bad_idea-9abcd}',
      'FLAG{ssi_was_a_bad_idea-ef123}',
      'FLAG{ssi_was_a_bad_idea-a1b2c}'
    ],
    difficulty: 'medium', 
    points: 10,
    hints: [
      "The website pages end in .shtml. This implies the server parses these files for special instructions before sending them to you.",
      "Can you inject your own HTML comments? Try asking the server to tell you the time using <!--#echo var=\"DATE_LOCAL\" -->.",
      "If echo works, the exec directive is likely enabled. Try <!--#exec cmd=\"whoami\" --> to run shell commands."
    ]
  },
  { 
    id: 'machine4', 
    name: 'Gemstone', 
    description: 'A helpful utility that fetches files from remote FTP servers. It retrieves exactly what you ask for—perhaps a little too literally.', 
    link: 'http://206.189.81.76:8080/', 
    flags: [
      'CTF{ruby_ftp_command_injection_2017}',
      'FLAG{ruby_ftp_command_injection_2017-x9y8z7}',
      'FLAG{ruby_ftp_command_injection_2017-q1w2e3}',
      'FLAG{ruby_ftp_command_injection_2017-r4t5y6}',
      'FLAG{ruby_ftp_command_injection_2017-u7i8o9}',
      'FLAG{ruby_ftp_command_injection_2017-p0a1s2}',
      'FLAG{ruby_ftp_command_injection_2017-d3f4g5}',
      'FLAG{ruby_ftp_command_injection_2017-h6j7k8}',
      'FLAG{ruby_ftp_command_injection_2017-l9z0x1}',
      'FLAG{ruby_ftp_command_injection_2017-c2v3b4}',
      'FLAG{ruby_ftp_command_injection_2017-n5m6q7}',
      'FLAG{ruby_ftp_command_injection_2017-w8e9r0}',
      'FLAG{ruby_ftp_command_injection_2017-t1y2u3}',
      'FLAG{ruby_ftp_command_injection_2017-i4o5p6}',
      'FLAG{ruby_ftp_command_injection_2017-a7s8d9}',
      'FLAG{ruby_ftp_command_injection_2017-f0g1h2}',
      'FLAG{ruby_ftp_command_injection_2017-j3k4l5}',
      'FLAG{ruby_ftp_command_injection_2017-z6x7c8}',
      'FLAG{ruby_ftp_command_injection_2017-v9b0n1}',
      'FLAG{ruby_ftp_command_injection_2017-m2q3w4}',
      'FLAG{ruby_ftp_command_injection_2017-e5r6t7}',
      'FLAG{ruby_ftp_command_injection_2017-y8u9i0}',
      'FLAG{ruby_ftp_command_injection_2017-o1p2a3}',
      'FLAG{ruby_ftp_command_injection_2017-s4d5f6}',
      'FLAG{ruby_ftp_command_injection_2017-g7h8j9}',
      'FLAG{ruby_ftp_command_injection_2017-k0l1z2}',
      'FLAG{ruby_ftp_command_injection_2017-x3c4v5}',
      'FLAG{ruby_ftp_command_injection_2017-b6n7m8}',
      'FLAG{ruby_ftp_command_injection_2017-q9w0e1}',
      'FLAG{ruby_ftp_command_injection_2017-r2t3y4}',
      'FLAG{ruby_ftp_command_injection_2017-u5i6o7}',
      'FLAG{ruby_ftp_command_injection_2017-p8a9s0}',
      'FLAG{ruby_ftp_command_injection_2017-d1f2g3}',
      'FLAG{ruby_ftp_command_injection_2017-h4j5k6}',
      'FLAG{ruby_ftp_command_injection_2017-l7z8x9}',
      'FLAG{ruby_ftp_command_injection_2017-c0v1b2}',
      'FLAG{ruby_ftp_command_injection_2017-n3m4q5}',
      'FLAG{ruby_ftp_command_injection_2017-w6e7r8}',
      'FLAG{ruby_ftp_command_injection_2017-t9y0u1}',
      'FLAG{ruby_ftp_command_injection_2017-i2o3p4}',
      'FLAG{ruby_ftp_command_injection_2017-a5s6d7}',
      'FLAG{ruby_ftp_command_injection_2017-f8g9h0}',
      'FLAG{ruby_ftp_command_injection_2017-j1k2l3}',
      'FLAG{ruby_ftp_command_injection_2017-z4x5c6}',
      'FLAG{ruby_ftp_command_injection_2017-v7b8n9}',
      'FLAG{ruby_ftp_command_injection_2017-m0q1w2}',
      'FLAG{ruby_ftp_command_injection_2017-e3r4t5}',
      'FLAG{ruby_ftp_command_injection_2017-y6u7i8}',
      'FLAG{ruby_ftp_command_injection_2017-o9p0a1}',
      'FLAG{ruby_ftp_command_injection_2017-s2d3f4}',
      'FLAG{ruby_ftp_command_injection_2017-g5h6j7}',
      'FLAG{ruby_ftp_command_injection_2017-k8l9z0}',
      'FLAG{ruby_ftp_command_injection_2017-x1c2v3}',
      'FLAG{ruby_ftp_command_injection_2017-b4n5m6}',
      'FLAG{ruby_ftp_command_injection_2017-q7w8e9}',
      'FLAG{ruby_ftp_command_injection_2017-r0t1y2}',
      'FLAG{ruby_ftp_command_injection_2017-u3i4o5}',
      'FLAG{ruby_ftp_command_injection_2017-p6a7s8}',
      'FLAG{ruby_ftp_command_injection_2017-d9f0g1}',
      'FLAG{ruby_ftp_command_injection_2017-h2j3k4}',
      'FLAG{ruby_ftp_command_injection_2017-l5z6x7}',
      'FLAG{ruby_ftp_command_injection_2017-c8v9b0}',
      'FLAG{ruby_ftp_command_injection_2017-n1m2q3}',
      'FLAG{ruby_ftp_command_injection_2017-w4e5r6}',
      'FLAG{ruby_ftp_command_injection_2017-t7y8u9}',
      'FLAG{ruby_ftp_command_injection_2017-i0o1p2}',
      'FLAG{ruby_ftp_command_injection_2017-a3s4d5}',
      'FLAG{ruby_ftp_command_injection_2017-f6g7h8}',
      'FLAG{ruby_ftp_command_injection_2017-j9k0l1}',
      'FLAG{ruby_ftp_command_injection_2017-z2x3c4}',
      'FLAG{ruby_ftp_command_injection_2017-v5b6n7}',
      'FLAG{ruby_ftp_command_injection_2017-m8q9w0}',
      'FLAG{ruby_ftp_command_injection_2017-e1r2t3}',
      'FLAG{ruby_ftp_command_injection_2017-y4u5i6}',
      'FLAG{ruby_ftp_command_injection_2017-o7p8a9}',
      'FLAG{ruby_ftp_command_injection_2017-s0d1f2}',
      'FLAG{ruby_ftp_command_injection_2017-g3h4j5}',
      'FLAG{ruby_ftp_command_injection_2017-k6l7z8}',
      'FLAG{ruby_ftp_command_injection_2017-x9c0v1}',
      'FLAG{ruby_ftp_command_injection_2017-b2n3m4}',
      'FLAG{ruby_ftp_command_injection_2017-q5w6e7}',
      'FLAG{ruby_ftp_command_injection_2017-r8t9y0}',
      'FLAG{ruby_ftp_command_injection_2017-u1i2o3}',
      'FLAG{ruby_ftp_command_injection_2017-p4a5s6}',
      'FLAG{ruby_ftp_command_injection_2017-d7f8g9}',
      'FLAG{ruby_ftp_command_injection_2017-h0j1k2}',
      'FLAG{ruby_ftp_command_injection_2017-l3z4x5}',
      'FLAG{ruby_ftp_command_injection_2017-c6v7b8}',
      'FLAG{ruby_ftp_command_injection_2017-n9m0q1}',
      'FLAG{ruby_ftp_command_injection_2017-w2e3r4}',
      'FLAG{ruby_ftp_command_injection_2017-t5y6u7}',
      'FLAG{ruby_ftp_command_injection_2017-i8o9p0}',
      'FLAG{ruby_ftp_command_injection_2017-a1s2d3}',
      'FLAG{ruby_ftp_command_injection_2017-f4g5h6}',
      'FLAG{ruby_ftp_command_injection_2017-j7k8l9}',
      'FLAG{ruby_ftp_command_injection_2017-z0x1c2}',
      'FLAG{ruby_ftp_command_injection_2017-v3b4n5}',
      'FLAG{ruby_ftp_command_injection_2017-m6q7w8}',
      'FLAG{ruby_ftp_command_injection_2017-e9r0t1}',
      'FLAG{ruby_ftp_command_injection_2017-y2u3i4}'
    ],
    difficulty: 'medium', 
    points: 10,
    hints: [
      "The application allows you to download files from an FTP server. Do you have control over the filenames hosted on that FTP server?",
      "The application uses Ruby's Net::FTP library. In vulnerable versions, the get method passes the filename to open(), which is dangerous if the filename contains special characters.",
      "Upload a file to your FTP server with a name starting with a pipe (|). When the app tries to download a file named |whoami, Ruby will execute the command instead of opening a file."
    ]
  },
  { 
    id: 'machine5', 
    name: 'MiddleEarth', 
    description: 'The admin dashboard is protected by a modern security layer that checks every request. It looks solid, but we think there might be a way to slip past the guard.', 
    link: 'http://209.97.161.3:3000/login', 
    flags: [
      'FLAG{the_hardworked_middle-a1b2c3}',
      'FLAG{the_hardworked_middle-d4e5f6}',
      'FLAG{the_hardworked_middle-g7h8i9}',
      'FLAG{the_hardworked_middle-j0k1l2}',
      'FLAG{the_hardworked_middle-m3n4o5}',
      'FLAG{the_hardworked_middle-p6q7r8}',
      'FLAG{the_hardworked_middle-s9t0u1}',
      'FLAG{the_hardworked_middle-v2w3x4}',
      'FLAG{the_hardworked_middle-y5z6a7}',
      'FLAG{the_hardworked_middle-b8c9d0}',
      'FLAG{the_hardworked_middle-e1f2g3}',
      'FLAG{the_hardworked_middle-h4i5j6}',
      'FLAG{the_hardworked_middle-k7l8m9}',
      'FLAG{the_hardworked_middle-n0o1p2}',
      'FLAG{the_hardworked_middle-q3r4s5}',
      'FLAG{the_hardworked_middle-t6u7v8}',
      'FLAG{the_hardworked_middle-w9x0y1}',
      'FLAG{the_hardworked_middle-z2a3b4}',
      'FLAG{the_hardworked_middle-c5d6e7}',
      'FLAG{the_hardworked_middle-f8g9h0}',
      'FLAG{the_hardworked_middle-i1j2k3}',
      'FLAG{the_hardworked_middle-l4m5n6}',
      'FLAG{the_hardworked_middle-o7p8q9}',
      'FLAG{the_hardworked_middle-r0s1t2}',
      'FLAG{the_hardworked_middle-u3v4w5}',
      'FLAG{the_hardworked_middle-x6y7z8}',
      'FLAG{the_hardworked_middle-a9b0c1}',
      'FLAG{the_hardworked_middle-d2e3f4}',
      'FLAG{the_hardworked_middle-g5h6i7}',
      'FLAG{the_hardworked_middle-j8k9l0}',
      'FLAG{the_hardworked_middle-m1n2o3}',
      'FLAG{the_hardworked_middle-p4q5r6}',
      'FLAG{the_hardworked_middle-s7t8u9}',
      'FLAG{the_hardworked_middle-v0w1x2}',
      'FLAG{the_hardworked_middle-y3z4a5}',
      'FLAG{the_hardworked_middle-b6c7d8}',
      'FLAG{the_hardworked_middle-e9f0g1}',
      'FLAG{the_hardworked_middle-h2i3j4}',
      'FLAG{the_hardworked_middle-k5l6m7}',
      'FLAG{the_hardworked_middle-n8o9p0}',
      'FLAG{the_hardworked_middle-q1r2s3}',
      'FLAG{the_hardworked_middle-t4u5v6}',
      'FLAG{the_hardworked_middle-w7x8y9}',
      'FLAG{the_hardworked_middle-z0a1b2}',
      'FLAG{the_hardworked_middle-c3d4e5}',
      'FLAG{the_hardworked_middle-f6g7h8}',
      'FLAG{the_hardworked_middle-i9j0k1}',
      'FLAG{the_hardworked_middle-l2m3n4}',
      'FLAG{the_hardworked_middle-o5p6q7}',
      'FLAG{the_hardworked_middle-r8s9t0}',
      'FLAG{the_hardworked_middle-u1v2w3}',
      'FLAG{the_hardworked_middle-x4y5z6}',
      'FLAG{the_hardworked_middle-a7b8c9}',
      'FLAG{the_hardworked_middle-d0e1f2}',
      'FLAG{the_hardworked_middle-g3h4i5}',
      'FLAG{the_hardworked_middle-j6k7l8}',
      'FLAG{the_hardworked_middle-m9n0o1}',
      'FLAG{the_hardworked_middle-p2q3r4}',
      'FLAG{the_hardworked_middle-s5t6u7}',
      'FLAG{the_hardworked_middle-v8w9x0}',
      'FLAG{the_hardworked_middle-y1z2a3}',
      'FLAG{the_hardworked_middle-b4c5d6}',
      'FLAG{the_hardworked_middle-e7f8g9}',
      'FLAG{the_hardworked_middle-h0i1j2}',
      'FLAG{the_hardworked_middle-k3l4m5}',
      'FLAG{the_hardworked_middle-n6o7p8}',
      'FLAG{the_hardworked_middle-q9r0s1}',
      'FLAG{the_hardworked_middle-t2u3v4}',
      'FLAG{the_hardworked_middle-w5x6y7}',
      'FLAG{the_hardworked_middle-z8a9b0}',
      'FLAG{the_hardworked_middle-c1d2e3}',
      'FLAG{the_hardworked_middle-f4g5h6}',
      'FLAG{the_hardworked_middle-i7j8k9}',
      'FLAG{the_hardworked_middle-l0m1n2}',
      'FLAG{the_hardworked_middle-o3p4q5}',
      'FLAG{the_hardworked_middle-r6s7t8}',
      'FLAG{the_hardworked_middle-u9v0w1}',
      'FLAG{the_hardworked_middle-x2y3z4}',
      'FLAG{the_hardworked_middle-a5b6c7}',
      'FLAG{the_hardworked_middle-d8e9f0}',
      'FLAG{the_hardworked_middle-g1h2i3}',
      'FLAG{the_hardworked_middle-j4k5l6}',
      'FLAG{the_hardworked_middle-m7n8o9}',
      'FLAG{the_hardworked_middle-p0q1r2}',
      'FLAG{the_hardworked_middle-s3t4u5}',
      'FLAG{the_hardworked_middle-v6w7x8}',
      'FLAG{the_hardworked_middle-y9z0a1}',
      'FLAG{the_hardworked_middle-b2c3d4}',
      'FLAG{the_hardworked_middle-e5f6g7}',
      'FLAG{the_hardworked_middle-h8i9j0}',
      'FLAG{the_hardworked_middle-k1l2m3}',
      'FLAG{the_hardworked_middle-n4o5p6}',
      'FLAG{the_hardworked_middle-q7r8s9}',
      'FLAG{the_hardworked_middle-t0u1v2}',
      'FLAG{the_hardworked_middle-w3x4y5}',
      'FLAG{the_hardworked_middle-z6a7b8}',
      'FLAG{the_hardworked_middle-c9d0e1}',
      'FLAG{the_hardworked_middle-f2g3h4}',
      'FLAG{the_hardworked_middle-i5j6k7}',
      'FLAG{the_hardworked_middle-l8m9n0}'
    ],
    difficulty: 'hard', 
    points: 15,
    hints: [
      "There is a protected route (e.g., /admin or /dashboard) that redirects you to login. The protection is handled by Next.js Middleware (middleware.ts).",
      "Middleware often uses regex or string matching to block paths. Does the middleware normalize the URL correctly? What happens if you use encoded characters (like %2e) or modify internal headers?",
      "The vulnerability involves a discrepancy between the Middleware matcher and the actual router. Try requesting the URL with slightly malformed path encoding or by stripping the x-middleware-prefetch header to slip past the check."
    ]
  },
];

// Get all challenges with solver information
const getChallenges = async (userId: string) => {
  // Get user's team
  const userTeam = await Team.findOne({ members: userId });
  
  // Get all correct submissions
  const submissions = await ChallengeSubmission.find({ isCorrect: true }).populate('userId', 'username').sort({ solvedAt: 1 });
  
  // Group submissions by machineId and find the first solver with their team
  const firstSolvers = new Map();
  for (const sub of submissions) {
    if (!firstSolvers.has(sub.machineId) && sub.userId) {
      // Find the team of the first solver
      const solverTeam = await Team.findOne({ members: (sub.userId as any)._id });
      firstSolvers.set(sub.machineId, {
        username: (sub.userId as any).username || 'Unknown User',
        teamName: solverTeam?.name || 'No Team',
        solvedAt: sub.solvedAt
      });
    }
  }
  
  // Map challenges with solver info and hints
  const challengesWithSolvers = challenges.map(challenge => {
    const solver = firstSolvers.get(challenge.id);
    const teamSolved = userTeam?.solvedMachines.find(sm => sm.machineId === challenge.id);
    
    // Get viewed hints for this challenge by the team
    const teamViewedHints = userTeam?.viewedHints.filter(vh => vh.machineId === challenge.id) || [];
    const viewedHintNumbers = teamViewedHints.map(vh => vh.hintNumber);
    
    // Build hints array with visibility status
    const hintsWithStatus = challenge.hints.map((hintText, index) => {
      const hintNumber = index + 1;
      const isViewed = viewedHintNumbers.includes(hintNumber);
      return {
        hintNumber,
        text: isViewed ? hintText : null, // Only show text if viewed
        cost: HINT_COSTS[hintNumber as keyof typeof HINT_COSTS],
        isViewed,
      };
    });
    
    return {
      id: challenge.id,
      name: challenge.name,
      description: challenge.description,
      link: challenge.link,
      difficulty: challenge.difficulty,
      points: challenge.points,
      hints: hintsWithStatus,
      firstSolver: solver ? {
        username: solver.username,
        teamName: solver.teamName,
        solvedAt: solver.solvedAt
      } : null,
      teamSolved: teamSolved ? {
        solvedBy: teamSolved.solvedBy,
        solvedAt: teamSolved.solvedAt
      } : null
    };
  });

  return {
    challenges: challengesWithSolvers,
    teamPoints: userTeam?.points || 0,
    teamName: userTeam?.name || null
  };
};

// Submit flag for a challenge (Team-based)
const submitFlag = async (user: IUser, machineId: string, flag: string) => {
  // Find the challenge
  const challenge = challenges.find(ch => ch.id === machineId);
  if (!challenge) {
    throw new AppError("Challenge not found", 404);
  }

  // Get user's team
  const userTeam = await Team.findOne({ members: user._id });
  if (!userTeam) {
    throw new AppError("You must be in a team to submit flags", 400);
  }

  // Check if team has already solved this machine
  const teamAlreadySolved = userTeam.solvedMachines.some(sm => sm.machineId === machineId);
  if (teamAlreadySolved) {
    throw new AppError("This machine has already been solved by your team", 400);
  }

  // Check if this user has already submitted a correct flag for this challenge
  const userPreviousCorrectSubmission = await ChallengeSubmission.findOne({ 
    userId: user._id, 
    machineId, 
    isCorrect: true 
  });

  if (userPreviousCorrectSubmission) {
    throw new AppError("You have already solved this challenge", 400);
  }

  // Check if flag is correct (check against all flags for this machine)
  const isCorrect = challenge.flags.includes(flag.trim());

  if (!isCorrect) {
    return {
      success: false,
      message: "Invalid flag",
    };
  }

  // *** CRITICAL: Check for First Blood BEFORE creating submission ***
  // Check if ANY team has solved this machine (not just submissions, but actual team solves)
  const teamsWithThisSolve = await Team.find({ 
    'solvedMachines.machineId': machineId 
  }).countDocuments();
  
  const isFirstSolver = teamsWithThisSolve === 0;

  // Calculate bonus points for first blood based on difficulty
  const firstBloodBonus = {
    'easy': 1,
    'medium': 2,
    'hard': 3
  };
  const bonusPoints = isFirstSolver ? (firstBloodBonus[challenge.difficulty as keyof typeof firstBloodBonus] || 0) : 0;
  const totalPoints = challenge.points + bonusPoints;

  // Create new submission (only for correct flags)
  const submission = await ChallengeSubmission.create({
    userId: user._id,
    machineId,
    submittedFlag: flag.trim(),
    isCorrect,
  });

  // Update team points and solved machines
  await Team.findByIdAndUpdate(userTeam._id, {
    $inc: { points: totalPoints },
    $push: {
      solvedMachines: {
        machineId: machineId,
        solvedBy: user._id,
        solvedAt: new Date(),
        points: totalPoints
      }
    }
  });

  if (isFirstSolver) {
    return {
      success: true,
      message: `🎉 First Blood! Your team "${userTeam.name}" is the first to solve this challenge! +${bonusPoints} bonus points!`,
      isFirstSolver: true,
      teamName: userTeam.name,
      pointsEarned: totalPoints,
      basePoints: challenge.points,
      bonusPoints: bonusPoints
    };
  } else {
    // Get the first team that solved this challenge
    const firstSolverTeam = await Team.findOne({ 
      'solvedMachines.machineId': machineId 
    }).sort({ 'solvedMachines.solvedAt': 1 });
    
    return {
      success: true,
      message: `Flag is correct! First Blood: ${firstSolverTeam?.name || 'Unknown Team'}`,
      isFirstSolver: false,
      firstSolverTeam: firstSolverTeam?.name || 'Unknown Team',
      teamName: userTeam.name,
      pointsEarned: challenge.points,
      basePoints: challenge.points,
      bonusPoints: 0
    };
  }
};

// Get user's solved machines count
const getUserStats = async (userId: string) => {
  const solvedCount = await ChallengeSubmission.countDocuments({ userId, isCorrect: true });
  const submissions = await ChallengeSubmission.find({ userId, isCorrect: true }).select('machineId solvedAt');
  
  return {
    totalSolved: solvedCount,
    solvedMachines: submissions.map(sub => ({
      machineId: sub.machineId,
      solvedAt: sub.solvedAt
    }))
  };
};

// Get user's solved challenges (machine IDs) - includes team solved
const getUserSolvedChallenges = async (userId: string) => {
  // Get individual submissions
  const submissions = await ChallengeSubmission.find({ userId, isCorrect: true }).select('machineId');
  const individualSolved = submissions.map(sub => sub.machineId);
  
  // Get team solved machines
  const userTeam = await Team.findOne({ members: userId });
  const teamSolved = userTeam?.solvedMachines.map(sm => sm.machineId) || [];
  
  // Combine and deduplicate
  const allSolved = [...new Set([...individualSolved, ...teamSolved])];
  
  return allSolved;
};

// View a hint for a challenge (deducts points from team)
const viewHint = async (user: IUser, machineId: string, hintNumber: number) => {
  // Validate hint number
  if (hintNumber < 1 || hintNumber > 3) {
    throw new AppError("Invalid hint number. Must be 1, 2, or 3", 400);
  }

  // Find the challenge
  const challenge = challenges.find(ch => ch.id === machineId);
  if (!challenge) {
    throw new AppError("Challenge not found", 404);
  }

  // Get user's team
  const userTeam = await Team.findOne({ members: user._id });
  if (!userTeam) {
    throw new AppError("You must be in a team to view hints", 400);
  }

  // Check if this hint has already been viewed by the team
  const alreadyViewed = userTeam.viewedHints.some(
    vh => vh.machineId === machineId && vh.hintNumber === hintNumber
  );
  if (alreadyViewed) {
    throw new AppError("This hint has already been viewed by your team", 400);
  }

  // Get hint cost
  const hintCost = HINT_COSTS[hintNumber as keyof typeof HINT_COSTS];

  // Deduct points and add to viewed hints
  await Team.findByIdAndUpdate(userTeam._id, {
    $inc: { points: -hintCost },
    $push: {
      viewedHints: {
        machineId,
        hintNumber,
        viewedBy: user._id,
        viewedAt: new Date(),
        pointsDeducted: hintCost,
      }
    }
  });

  // Get the hint text
  const hintText = challenge.hints[hintNumber - 1];

  return {
    success: true,
    message: `Hint ${hintNumber} unlocked! ${hintCost} point(s) deducted from your team.`,
    hint: {
      hintNumber,
      text: hintText,
      cost: hintCost,
    },
    newTeamPoints: userTeam.points - hintCost,
  };
};

export {
  getChallenges,
  submitFlag,
  getUserStats,
  getUserSolvedChallenges,
  viewHint,
};

