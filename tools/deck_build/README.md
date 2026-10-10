# Taqdimotni saytga tayyorlash

`portfolio/deck/taqdimot.html` asl taqdimotdan (1920×1080 slaydlar) shu skript bilan yig'iladi.
Skript taqdimotga quyidagilarni qo'shadi:

- **Telefon rejimi** (`m.css`, `scss.css`, `m.js`, `mcf.js`, `fit.js`): portret ekranda slaydlar bir ustunda
  qayta joylanadi, animatsiyalar qolgan joyga sig'diriladi, sig'masa slayd ichida scroll va "pastga" belgisi chiqadi.
- **Hero rejimi** (`embed.js`): `?embed=1&autoplay=7` bilan boshqaruvsiz, o'zi aylanadigan ko'rinish
  (bosh sahifadagi jonli ekran uchun; `postMessage({deck:'pause'|'play'})` bilan to'xtatiladi).
- **Boshqaruv** (`ui.js`): saytga qaytish tugmasi, telefon yo'riqnomasi.
- **Matn tuzatishlari** (`textfix.json`): uzun tire o'rniga ikki nuqta yoki vergul.

Taqdimotning yangi versiyasi chiqsa:

```bash
python3 tools/deck_build/build.py ~/Downloads/yangi-taqdimot.html tools/deck_build portfolio/deck/taqdimot.html
```

Skript har bir almashtirish aniq bir marta topilishini tekshiradi; taqdimot tuzilishi o'zgargan bo'lsa,
qaysi qator topilmaganini aytib to'xtaydi. Slaydga xos sozlamalar `mcf.js` (tartib, animatsiya o'lchami)
va `scss.css` (shrift va kartalar) da slayd `id`si bo'yicha yozilgan.

Muhim: deck'ning o'z JS'i `[data-b]` elementlarning `style` atributini qayta yozadi ("height: 220px",
bo'shliq bilan), shuning uchun yuqori darajadagi elementlarga `[style*=...]` selektori ishlamaydi;
ularga `mcf.js` da klass qo'yiladi.
