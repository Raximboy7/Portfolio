---
title: AI agent: chatbotdan farqi va ishda qo‘llash
summary: Chatbot savolga javob beradi, agent esa vazifani oxirigacha bajaradi: reja tuzadi, qidiradi, fayl bilan ishlaydi va natijani o‘zi tekshiradi.
icon: agent
slide: 17
order: 2
updated: 2026-10-10
---
**Chatbot** savolga javob beradi: bir savol, bir javob. Keyingi qadamni har safar o‘zingiz so‘raysiz.

**AI agent** esa vazifani oxirigacha bajaradi. U maqsadni oladi, reja tuzadi, internetda qidiradi, fayl va jadval bilan ishlaydi, natijani o‘zi tekshiradi. Siz yakunda faqat tasdiqlaysiz.

## Chatbot va agent

| | Chatbot | AI agent |
|---|---|---|
| **Ish usuli** | Bir savol, bir javob | Maqsad → reja → natija |
| **Imkoniyat** | Faqat matn | Qidiruv, fayl, jadval, pochta |
| **Sizning rolingiz** | Har qadamni siz so‘raysiz | Siz faqat tasdiqlaysiz |

> **Siz rahbarsiz:** agent bajaradi, siz tasdiqlaysiz.

## Agent qanday ishlaydi: 5 bosqich

1. **Maqsad.** Siz natijani tasvirlaysiz: “Yoshlar uchun bepul IT kurslari bo‘yicha ma’lumotnoma tayyorla”.
2. **Reja.** Agent ishni qadamlarga bo‘ladi: qidirish → solishtirish → jadval → xulosa.
3. **Harakat.** Vositalardan foydalanadi: 12 ta manbani o‘qiydi, 8 ta kursni jadvalga yig‘adi, hisobot faylini yaratadi.
4. **Tekshirish.** Natijani o‘zi qayta ko‘radi. Masalan, 2 ta manba eskirganini sezsa, qayta qidiradi.
5. **Natija.** 1 sahifalik ma’lumotnoma tayyor bo‘ladi, siz uni o‘qib tasdiqlaysiz.

## Agentga vazifa qanday beriladi

Agentga yangi xodimga topshiriq bergandek yozing: maqsad, manbalar, natija ko‘rinishi va cheklovlar.

```text
Maqsad: Yoshlar uchun bepul IT kurslari bo'yicha 1 sahifalik ma'lumotnoma.
Manbalar: faqat rasmiy saytlar, joriy yil ma'lumotlari.
Natija: jadval (kurs nomi, tashkilot, muddat, havola) va 3 ta xulosa.
Cheklov: ishonchsiz manbani ishlatma, shubhali joyni belgilab qo'y.
```

Topshiriq qancha aniq bo‘lsa, agent shuncha kam adashadi. Prompt yozish qoidalari agentga ham to‘liq tegishli: [5 qismli formula](/qollanmalar/prompt-yozish/).

## Ishdan 6 ta tayyor stsenariy

| Stsenariy | Agentga topshiriq |
|---|---|
| **Hisobot** | “Shu raqamlardan oylik hisobot loyihasini tuz” |
| **Tadbir** | “200 kishilik forum: reja, smeta va vazifalar” |
| **SMM** | “1 haftalik post rejasi va 7 ta matn” |
| **Tahlil** | “So‘rovnoma natijasini jadvalga sol, 3 xulosa chiqar” |
| **Grant** | “Loyiha g‘oyasidan grant arizasi loyihasini tuz” |
| **Savollar bazasi** | “Ko‘p beriladigan 20 savolga javoblar bazasi” |

Har biri agentga beriladigan aniq topshiriq. O‘zingizga eng kerakli uchtasini tanlab, real ishda sinab ko‘ring.

## Yakuniy javobgar: inson

Agent tez ishlaydi, lekin u ham xato qiladi. Shuning uchun:

- natijadagi faktlarni manbadan tekshiring;
- shaxsiy va maxfiy ma’lumotlarni agentga bermang;
- muhim harakatlarni (xat yuborish, to‘lov, e’lon) faqat o‘zingiz tasdiqlang.

Batafsil: [AI’dan xavfsiz foydalanish](/qollanmalar/xavfsiz-foydalanish/).
