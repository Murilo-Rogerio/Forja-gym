import re, glob

wiring_content = open('js/app/wiring.js', 'r', encoding='utf-8').read()
actions_match = re.findall(r"'([a-zA-Z0-9_\-]+)'\s*:\s*(?:async\s+)?function", wiring_content)
actions_set = set(actions_match)

print(f"Registered actions in wiring.js: {len(actions_set)}")

all_files = glob.glob('js/**/*.js', recursive=True)
data_acts_found = set()
for f in all_files:
    content = open(f, 'r', encoding='utf-8').read()
    acts = re.findall(r'data-act=[\'"]([a-zA-Z0-9_\-]+)[\'"]', content)
    for a in acts:
        data_acts_found.add((a, f))

missing = []
for act, file in data_acts_found:
    if act not in actions_set:
        missing.append((act, file))

if missing:
    print(f"WARNING: Found {len(missing)} data-act without handler in ACTIONS:")
    for m in missing:
        print(f"  - {m[0]} in {m[1]}")
else:
    print("ALL data-act references across all JS files have corresponding handlers in wiring.js!")
