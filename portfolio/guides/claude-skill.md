---
title: Skill yaratish: AI’ga doimiy yo‘riqnoma
summary: Qoidalarni bir marta yozasiz, AI ularni doim qo‘llaydi. Claude’da SKILL.md bilan rasmiy xat yozish skillini 4 qadamda yaratamiz.
icon: skill
slide: 20
order: 3
updated: 2026-10-10
---
**Skill**: AI’ga bir marta o‘rgatiladigan doimiy yo‘riqnoma. Har safar “rasmiy xat shunday yoziladi, tuzilmasi bunday” deb tushuntirib o‘tirmaysiz: qoidalarni bir marta yozasiz, keyin AI ularni o‘zi qo‘llaydi.

Masalan, tashkilot nomidan rasmiy xat qanday yozilishi: tuzilma, uslub va tekshiruv qoidalari. Skill yuklangandan keyin “rasmiy xat yoz” deyishning o‘zi yetarli.

> **Claude bepul tarifida ham ishlaydi.** Interfeysdagi bo‘lim nomlari vaqt o‘tishi bilan o‘zgarishi mumkin, lekin tartib o‘sha-o‘sha.

## 1. Yoqing

**Settings → Capabilities** bo‘limida **“Code execution and file creation”** imkoniyatini yoqing. Skill’lar shu imkoniyat orqali ishlaydi.

## 2. Yozing

Kompyuteringizda papka oching (masalan, `agentlik-rasmiy-xat`) va ichida `SKILL.md` faylini yarating. Fayl ikki qismdan iborat: tepada nom va tavsif, pastda qoidalar.

```markdown
---
name: agentlik-rasmiy-xat
description: Rasmiy yoki javob xati yozishda ishlat.
---

# Rasmiy xat

1. Tuzilma: murojaat → asosiy qism → xulosa
2. Uslub: o'zbek lotin, rasmiy, qisqa gaplar
3. Sana va F.I.Sh. o'rniga [ ] qoldir
4. Oxirida tekshir: shaxsiy ma'lumot yo'q
```

**Tavsif (description) eng muhim qator.** AI skillni qachon ishga tushirishni aynan shu jumladan biladi, shuning uchun qaysi vaziyatda ishlatilishini aniq yozing.

## 3. Yuklang

Papkani **ZIP** qiling, so‘ng **Customize → Skills → + → Create skill** orqali yuklang.

## 4. Sinang

Yangi suhbatda shunchaki yozing:

```text
Rasmiy xat yoz: talabalar uchun qo'shma amaliy loyiha bo'yicha hamkorlik taklifi.
```

Skill o‘zi ishga tushadi va xat qoidalar bo‘yicha chiqadi:

> Hurmatli [F.I.Sh.]!
> Yoshlar ishlari agentligi talabalar uchun qo‘shma amaliy loyiha bo‘yicha hamkorlik taklif etadi.
> Uchrashuv sanasini [sana] kelishib olishni so‘raymiz.
> Hurmat bilan, [lavozim, F.I.Sh.]

## Qanday skill’lar foydali

- **Hisobot shabloni:** bo‘limlar tartibi, raqamlar formati, xulosa qoidasi.
- **Brend uslubi:** post va e’lonlar uchun ohang, ishlatilmaydigan so‘zlar, imzo.
- **Javoblar bazasi:** ko‘p beriladigan savollarga tasdiqlangan javoblar.
- **Tekshiruv ro‘yxati:** hujjatni topshirishdan oldin nimalarni tekshirish kerak.

## Boshqa xizmatlarda

Taqdimot tayyorlangan paytdagi holat: ChatGPT’ning shaxsiy akkauntlarida yangi GPT yaratib bo‘lmaydi, Gemini Gems esa 2026-yil noyabridan skill’larga o‘tadi. Ya’ni skill yozish ertangi kunning asosiy ko‘nikmalaridan biri.
