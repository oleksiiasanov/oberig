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
- Основний фокусний колір bronze: `rgb(195, 141, 24)` / `#c38d18`.
- Похідні bronze-кольори: soft glow `#f2c15a`, muted bronze `#7b5310`,
  translucent surfaces `rgba(195, 141, 24, 0.08–0.15)`, borders `rgba(195, 141, 24, 0.28–0.48)`.
- Green palette лишається B-варіантом для внутрішнього порівняння: `rgb(162, 251, 10)` / `#a2fb0a`,
  soft glow `#d7ff7a`, muted green `#6fae05`.
- Палітра не має повертатися до синьо-жовтої теми.
- Усі brand assets мають бути оптимізовані та мати коректні alt/aria рішення залежно від контексту.
