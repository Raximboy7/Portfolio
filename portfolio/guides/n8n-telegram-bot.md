---
title: 24/7 Telegram yordamchi: n8n bilan
summary: Murojaatni qabul qiladigan, toifalaydigan, javob beradigan va jadvalga yozadigan Telegram bot. Dasturlashsiz, n8n’da 4 qadamda yig‘iladi.
icon: bot
slide: 22
order: 5
updated: 2026-10-10
---
**n8n**: avtomatlashtirish platformasi. Unda “shu bo‘lsa, buni qil” zanjirlarini bloklarni ulab yig‘asiz, kod yozish shart emas. O‘z kompyuteringizga bepul o‘rnatiladi.

Bugun yig‘adigan zanjirimiz uch qismdan iborat:

| Blok | Vazifasi |
|---|---|
| **Telegram Trigger** | botga kelgan yangi xabarni qabul qiladi |
| **AI Agent** | xabarni toifalaydi va javob tayyorlaydi |
| **Google Sheets** | murojaatni jadvalga yozadi |

## 1. O‘rnating

Kompyuterda Node.js (20.19 dan 24 gacha versiya) o‘rnatilgan bo‘lsa, terminalda bitta buyruq yetarli:

```bash
npx n8n
```

Ishga tushgach, brauzerda `http://localhost:5678` manzilini oching va akkaunt yarating.

## 2. Ulang

Telegram’da **@BotFather**’ga yozing, `/newbot` buyrug‘i bilan bot yarating va u bergan **tokenni** nusxalang. n8n’da **Telegram Trigger** blokini qo‘shib, shu tokenni kiriting.

> **Token parol bilan teng.** Uni hech kimga bermang va ochiq joyga joylamang.

## 3. Yig‘ing

1. **Telegram Trigger:** botga yangi xabar kelganda zanjirni ishga tushiradi.
2. **AI Agent:** xabarni o‘qiydi, toifalaydi (savol, shikoyat yoki taklif) va javob tayyorlaydi. Unga til modeli ulanadi (masalan, Gemini yoki OpenAI); buning uchun provayderdan API kalit olinadi, ba’zilarida bepul limit bor.
3. **Google Sheets:** har bir murojaatni jadvalga yozadi: sana, foydalanuvchi, toifa, matn, javob.
4. Oxiriga **Telegram** blokini qo‘shib, AI javobini foydalanuvchiga qaytaring.

AI Agent uchun yo‘riqnoma namunasi:

```text
Sen tashkilotning Telegram yordamchisisan.
Har bir xabarni toifala: savol, shikoyat yoki taklif.
Qisqa va xushmuomala javob yoz (3 gapdan oshmasin).
Bilmagan narsangni o'ylab topma: "mutaxassisga yo'naltiraman" de.
```

## 4. Ishga tushiring

Zanjirni faollashtiring. Endi bot murojaatni qabul qiladi, jadvalga yozadi va javob beradi.

## Kun-u tun ishlashi uchun

- `npx n8n` kompyuteringiz yoqiq turgandagina ishlaydi. Bot 24/7 ishlashi uchun n8n’ni doimiy yoqiq serverga (VPS) o‘rnating.
- Telegram Trigger webhook orqali ishlaydi va Telegram faqat ochiq HTTPS manzilni qabul qiladi (`localhost` ishlamaydi). Serverda bu odatiy holat. O‘z kompyuteringizda sinash uchun tunnel oching (masalan, Cloudflare Tunnel yoki ngrok) va n8n’ga shu manzilni ayting:

```bash
WEBHOOK_URL=https://sizning-tunnel-manzilingiz npx n8n
```
- Jadvalga shaxsiy ma’lumot yozilsa, unga kirish huquqini cheklang.
