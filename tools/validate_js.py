import glob, sys, re

files = glob.glob('js/**/*.js', recursive=True)

def strip_all(code):
    # Strip comments, strings, and simple regex literals
    out = []
    i = 0
    n = len(code)
    state = 'code'
    while i < n:
        c = code[i]
        c2 = code[i:i+2] if i+1 < n else ''
        if state == 'code':
            if c2 == '//':
                state = 'single_comment'
                i += 2
                continue
            elif c2 == '/*':
                state = 'multi_comment'
                i += 2
                continue
            elif c == "'":
                state = 'single_quote'
                i += 1
                continue
            elif c == '"':
                state = 'double_quote'
                i += 1
                continue
            elif c == '`':
                state = 'backtick'
                i += 1
                continue
            elif c == '/' and i > 0 and code[i-1] in '=(:,;!&|':
                state = 'regex'
                i += 1
                continue
            else:
                out.append(c)
                i += 1
        elif state == 'single_comment':
            if c == '\n':
                out.append('\n')
                state = 'code'
            i += 1
        elif state == 'multi_comment':
            if c2 == '*/':
                state = 'code'
                i += 2
                continue
            elif c == '\n':
                out.append('\n')
            i += 1
        elif state == 'single_quote':
            if c == '\\':
                i += 2
                continue
            elif c == "'":
                state = 'code'
            elif c == '\n':
                out.append('\n')
            i += 1
        elif state == 'double_quote':
            if c == '\\':
                i += 2
                continue
            elif c == '"':
                state = 'code'
            elif c == '\n':
                out.append('\n')
            i += 1
        elif state == 'backtick':
            if c == '\\':
                i += 2
                continue
            elif c == '`':
                state = 'code'
            elif c == '\n':
                out.append('\n')
            i += 1
        elif state == 'regex':
            if c == '\\':
                i += 2
                continue
            elif c == '/':
                state = 'code'
            elif c == '\n':
                out.append('\n')
                state = 'code'
            i += 1
    return ''.join(out)

has_error = False
for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        raw = fp.read()
    stripped = strip_all(raw)
    brackets = {'(': ')', '{': '}', '[': ']'}
    stack = []
    line = 1
    for char in stripped:
        if char == '\n':
            line += 1
        if char in brackets:
            stack.append((char, line))
        elif char in brackets.values():
            if not stack:
                print(f'Unmatched {char} in {f} line {line}')
                has_error = True
                break
            top, tl = stack.pop()
            if brackets[top] != char:
                print(f'Mismatch {top} (line {tl}) vs {char} in {f} line {line}')
                has_error = True
                break
    else:
        if stack:
            print(f'Unclosed {stack[-1][0]} from line {stack[-1][1]} in {f}')
            has_error = True
        else:
            print(f'OK: {f}')

if has_error:
    sys.exit(1)
print('SUCCESS: ALL 26 JAVASCRIPT FILES ARE 100% VALID AND BALANCED!')
