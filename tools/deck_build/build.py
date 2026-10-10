# usage: python3 -I build.py <src.html> <workdir> <out.html>
import sys, re, html
src_path, wd, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
s = open(src_path, encoding='utf-8').read()
rd = lambda n: open(f'{wd}/{n}', encoding='utf-8').read()

def once(old, new, text):
    n = text.count(old)
    assert n == 1, f'{n}x: {old[:70]!r}'
    return text.replace(old, new)

# --- 1) CSS
css = rd('m.css').replace('/*SLIDE-CSS*/', rd('scss.css'))
i = s.index('</style>')
s = s[:i] + css + s[i:]

# --- 2) JS engine
eng = rd('m.js').replace('/*MCF*/', rd('mcf.js'))
OLD_FIT = "function fit(){var k=Math.min(window.innerWidth/1920,window.innerHeight/1080);stage.style.transform='scale('+k+')';}"
NEW_FIT = eng + rd('fit.js')
s = once(OLD_FIT, NEW_FIT, s)
s = once("inc.style.transition='none';inc.style.visibility='visible';inc.style.zIndex=3;",
         "inc.style.transition='none';inc.style.visibility='visible';inc.style.zIndex=3;layM(inc);", s)
s = once("function setUI(){", "function setUI(){moreUpd(S[cur]);", s)
s = once("idle=setTimeout(function(){if(!notes.classList.contains('show')){",
         "idle=setTimeout(function(){if(!M&&!notes.classList.contains('show')){", s)
END = "show(isNaN(start)?0:Math.min(N,Math.max(1,start))-1,1);\n})();"
s = once(END, END.replace('\n})();', '\n' + rd('embed.js') + '\n})();'), s)

# --- 2b) UI: saytga qaytish tugmasi + mobil yo'riqnoma
s = once('<div id="ui">\n', '<div id="ui">\n  <a id="home" href="/" aria-label="Saytga qaytish" title="ibrohimov-dev.uz"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/></svg></a>\n', s)
s = once("var start=parseInt(", rd('ui.js') + "\nvar start=parseInt(", s)

# --- 2c) head: tavsif, ulashish teglari, favicon (sayt view'i __STATIC__ ni almashtiradi)
s = once('<meta name="viewport" content="width=device-width, initial-scale=1">\n',
 '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
 '<meta name="description" content="Raximboy Ibrohimov taqdimoti: AI qanday tug\u2018iladi, ish o\u2018rinlariga ta\u2019siri, prompt yozish, AI agentlar, skill va 24/7 Telegram yordamchi. 24 slayd, telefonga moslashgan.">\n'
 '<meta name="theme-color" content="#04070F">\n'
 '<meta property="og:type" content="article">\n'
 '<meta property="og:title" content="Sun\u2019iy intellekt \u00b7 taqdimot">\n'
 '<meta property="og:description" content="AI qanday tug\u2018iladi, ish o\u2018rinlariga ta\u2019siri va undan amalda foydalanish: prompt, agentlar, skill, Telegram yordamchi.">\n'
 '<meta property="og:url" content="https://ibrohimov-dev.uz/taqdimot/">\n'
 '<link rel="icon" type="image/svg+xml" href="__STATIC__portfolio/img/favicon.svg">\n', s)

# --- 3) srcdoc patches
def patch_srcdoc(text, sid, pairs):
    sec_start = text.index(f'id="{sid}"')
    m = re.compile(r'data-srcdoc="([^"]*)"').search(text, sec_start)
    doc = html.unescape(m.group(1))
    for a, b in pairs:
        assert doc.count(a) == 1, (sid, a[:60], doc.count(a))
        doc = doc.replace(a, b)
    enc = html.escape(doc, quote=True)
    return text[:m.start(1)] + enc + text[m.end(1):]

s = patch_srcdoc(s, 'yangi-kasblar', [
    ("function ring(cy,p,c1,c2,al){var cx=W/2,r=Math.min(W/2-20,100);",
     "function ring(cy,p,c1,c2,al,cx){cx=cx||W/2;var hz=W>H,r=Math.min((hz?W/4:W/2)-20,hz?H/2-14:100,100);"),
    ("ring(120,.77*eo((tt-.3)/1.8),'#4D8DFF','#3EE6F0',al);",
     "ring(W>H?H/2:120,.77*eo((tt-.3)/1.8),'#4D8DFF','#3EE6F0',al,W>H?W*.25:0);"),
    ("ring(420,.39*eo((tt-1)/1.8),'#3EE6F0','#B9F3FA',al);",
     "ring(W>H?H/2:420,.39*eo((tt-1)/1.8),'#3EE6F0','#B9F3FA',al,W>H?W*.75:0);"),
])

# --- 4) text fixes (separate file, list of [old, new])
import json, os
fx = f'{wd}/textfix.json'
if os.path.exists(fx):
    for a, b in json.load(open(fx, encoding='utf-8')):
        n = s.count(a)
        assert n >= 1, ('textfix not found', a[:60])
        s = s.replace(a, b)

open(out_path, 'w', encoding='utf-8').write(s)
print('ok', len(s))
