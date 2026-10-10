---
title: Prompt yozish: 5 qismli formula
summary: AI fikringizni o‘qiy olmaydi. Rol, vazifa, kontekst, format va ohang: shu beshta qism bilan javob birinchi urinishdayoq aniq chiqadi.
icon: prompt
slide: 14
order: 1
updated: 2026-10-10
---
**Prompt**: AI’ga yozgan so‘rovingiz. AI fikringizni o‘qiy olmaydi, shuning uchun vazifani qanchalik **to‘liq va aniq** tushuntirsangiz, javob shunchalik yaxshi bo‘ladi.

## Nega “xat yoz” ishlamaydi

Faqat “Xat yoz” deb yozsangiz, AI ikki yo‘ldan birini tanlaydi: yo qayta savol beradi, yo hech kimga to‘g‘ri kelmaydigan umumiy matn yozadi.

> **AI javobi:** Qanday xat? Kimga, nima haqida va qanday ohangda yozay?

Shu savollarga javobni oldindan bersangiz, kerakli natijani bitta urinishda olasiz.

## Formula: 5 qism

| Qism | Savol | Misol |
|---|---|---|
| **Rol** | Kim bo‘lib javob bersin? | Sen tajribali kotibsan. |
| **Vazifa** | Aniq nima qilish kerak? | Qo‘shnilarni to‘yga taklif qiluvchi xat yoz. |
| **Kontekst** | Kim uchun, nima maqsadda? | To‘y 15-noyabr, soat 18:00 da. |
| **Format** | Qanday ko‘rinishda? | 5 qatordan oshmasin. |
| **Ohang** | Rasmiy, samimiy yoki oddiy? | Samimiy ohangda. |

Beshtasini birlashtiramiz:

```text
Sen tajribali kotibsan. Qo'shnilarni to'yga taklif qiluvchi xat yoz.
To'y 15-noyabr, soat 18:00 da. 5 qatordan oshmasin, samimiy ohangda.
```

Natija:

> «Aziz qo‘shnilar! 15-noyabr kuni soat 18:00 da to‘yimizga sizni chin dildan taklif qilamiz. Kelishingizni intizorlik bilan kutamiz!»

Har bir qism qo‘shilgani sari javob aniqroq bo‘ladi. Rol uslubni, vazifa maqsadni, kontekst faktlarni, format hajmni, ohang esa kayfiyatni belgilaydi.

## Ishdagi misol: Telegram post

**Yomon:** “Tadbir haqida post yoz”. Bunday so‘rovga AI istalgan tadbir haqida, istalgan uzunlikda yozadi.

**Yaxshi:**

```text
Rol: Sen yoshlar agentligi SMM mutaxassisisan.
Vazifa: Telegram uchun post yoz.
Kontekst: Shanba kuni, 18-30 yoshlilar uchun bepul IT forum.
Format: 80 so'zgacha, oxirida ro'yxat havolasi.
Ohang: Samimiy va g'ayratli.
```

Bunday prompt darhol kanalga qo‘yishga yaroqli post beradi:

> **Shanba kuni: bepul IT forum!**
> 18–30 yoshdagi yoshlar uchun dasturlash, dizayn va AI bo‘yicha amaliy seminarlar hamda mutaxassislar bilan uchrashuv. Ishtirok bepul, joylar soni cheklangan. Ro‘yxatdan o‘tish: havola

## Shablon: nusxa olib ishlating

```text
Rol: Sen [kasb yoki mutaxassis]san.
Vazifa: [aniq nima qilish kerak].
Kontekst: [kim uchun, nima maqsadda; sana, joy, raqamlar].
Format: [ro'yxat / jadval / N qator / N so'zgacha].
Ohang: [rasmiy / samimiy / oddiy].
```

## Yaxshi natija uchun 5 maslahat

1. **Bir xabarda bitta vazifa.** Ko‘p ishni bitta promptga jamlasangiz, sifat pasayadi.
2. **Faktlarni o‘zingiz bering.** Sana, narx, ism va raqamlarni AI o‘ylab topmasin.
3. **Javobni aniqlashtiring.** “Qisqaroq qil”, “rasmiyroq yoz”, “3 ta variant ber” kabi qo‘shimcha so‘rovlar bilan natijani yaxshilang.
4. **Namuna ko‘rsating.** Yoqqan matningiz bo‘lsa, uni qo‘shib “shu uslubda yoz” deng.
5. **O‘zbek tilida bemalol yozing.** Kim uchun, qanday ohangda va qancha hajmda kerakligini aytsangiz, javob o‘zbekcha ham aniq chiqadi.

## Mashq

O‘z ishingizdan bitta real vazifa oling va uni 5 qismli formula bo‘yicha prompt qiling. Natijani kamida ikki marta aniqlashtirib yaxshilang, so‘ng birinchi javob bilan oxirgisini solishtiring.
