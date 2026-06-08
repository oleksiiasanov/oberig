# 05 — Brand assets and CTA destinations

Статус: **Додано як вхідні дані; файли активів треба покласти в репозиторій під час імплементації.**

## CTA destinations

- **Консультація:** Signal-група  
  `https://signal.group/#CjQKIJtYdEsLqmFX_KES9TLN8lugJYrcXZCMHkJ5namzsW9mEhDpQtJzhrOuLiakfxgBDh2Y`
- **Замовлення:** Google Form  
  `https://forms.gle/xFcMaTWR1G5pR4qW6`

Правило: консультаційні CTA ведуть у Signal, CTA замовлення ведуть у Google Form. Ці дії різні
й мають бути візуально/семантично розрізнені.

## Logo input

Наданий логотип на прозорому фоні використовується як brand input:
- для wordmark-поведінки в хедері/герої;
- для підбору display-типографіки з технічним, широким, angular характером;
- для визначення ваги бренду в композиції.

## Favicon input

Наданий favicon/compact mark використовується як brand input:
- для фактичного favicon у фінальній реалізації;
- для компактної brand-позначки;
- для витягування палітри та матеріального відчуття, якщо це не конфліктує з premium-напрямом.

## Design-system implications

- Типографіка має відчуватися технічною, широкою й сучасною, але лишатися читабельною в українській.
- Фокусний колір бренду з оновленого логотипа: `rgb(162, 251, 10)` / `#a2fb0a`.
- Похідні кольори мають будуватися від цього accent: soft glow `#d7ff7a`, muted green `#6fae05`,
  translucent surfaces `rgba(162, 251, 10, 0.08–0.15)`, borders `rgba(162, 251, 10, 0.28–0.48)`.
- Палітра не має повертатися до старого olive/amber-dominant military skin або синьо-жовтої теми.
- Усі brand assets мають бути оптимізовані та мати коректні alt/aria рішення залежно від контексту.
