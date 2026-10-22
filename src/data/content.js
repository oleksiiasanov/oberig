export const ORDER_URL = "https://forms.gle/xFcMaTWR1G5pR4qW6";
export const WHATSAPP_URL = "https://wa.me/380954716680";

export const SOCIAL_LINKS = [
  ["TikTok", "TT", "https://www.tiktok.com/@dvision_sdr"],
  ["Instagram", "IG", "https://www.instagram.com/dvision_sdr"],
  ["Facebook", "FB", "https://www.facebook.com/dvision.sdr"],
  ["YouTube", "YT", "https://youtube.com/@d.visionsdr"],
];

export const LANGUAGES = {
  uk: { label: "UA", locale: "uk-UA" },
  en: { label: "EN", locale: "en-US" },
};

export const SELECTABLE_LANGUAGE_CODES = ["uk", "en"];

const shared = {
  orderUrl: ORDER_URL,
  whatsappUrl: WHATSAPP_URL,
  socials: SOCIAL_LINKS,
};

export const landingContent = {
  uk: {
    ...shared,
    meta: {
      lang: "uk",
      navLabel: "Навігація сторінки",
      primaryAction: "Замовити",
      secondaryAction: "Зв’язатись з нами",
      ctaLabel: "Основні дії",
      menuLabel: "Меню",
      closeMenuLabel: "Закрити меню",
    },
    nav: [
      ["/order", "Каталог"],
      ["/manual", "Інструкція"],
      ["/payment-and-delivery", "Оплата і доставка"],
      ["/service", "Гарантія та сервіс"],
    ],
    order: {
      navLabel: "Замовлення",
      title: "Каталог виробів D·Vision SDR",
      photoPendingLabel: "Фото додається",
      priceLabel: "Ціна",
      modelLabel: "Модель",
      descriptionLabel: "Опис",
      quickNav: [
        ["Детектор", "detector"],
        ["Виносна антена", "antenna"],
        ["Кріплення в авто", "holder"],
        ["Кріплення на бронежилет", "molle"],
        ["Комплектуючі", "part"],
      ],
      partsTitle: "Комплектуючі",
      items: [],
    },
    paymentDelivery: {
      navLabel: "Оплата і доставка",
      title: "Оплата і доставка",
      sections: [
        {
          icon: "check",
          title: "Передзамовлення та терміни виготовлення",
          items: [
            [
              "Термін очікування",
              "Усі пристрої виготовляються під замовлення. Орієнтовний термін комплектації та відправки становить до 8 тижнів із моменту оформлення.",
            ],
          ],
        },
        {
          icon: "check",
          title: "Умови оплати",
          items: [
            [
              "Один детектор",
              "Для замовлення 1 одиниці товару передплата не потрібна. Повна оплата здійснюється перед безпосереднім відправленням пристрою.",
            ],
            [
              "Від 2-х детекторів",
              "При замовленні від 2 одиниць пристроїв діє передплата у розмірі 50% від загальної вартості. Друга частина (50%) сплачується безпосередньо перед відправленням замовлення.",
            ],
            ["Спосіб оплати", "Усі розрахунки здійснюються офіційним переказом на розрахунковий рахунок (IBAN)."],
          ],
          noteLabel: "Зверніть увагу",
          note: "Наразі ми не надаємо послуги післяплати (накладеного платежу), розстрочки та оплати частинами. Відправка пристроїв здійснюється тільки після 100% оплати замовлення.",
        },
        {
          icon: "check",
          title: "Доставка",
          items: [
            [
              "Служба доставки",
              "Усі відправлення по території України здійснюються компанією «Нова Пошта» (у відділення, поштомат або кур'єром за адресою).",
            ],
            [
              "Страхування та вартість",
              "Доставка сплачується отримувачем за тарифами перевізника. Кожне відправлення застраховане на повну вартість пристрою.",
            ],
          ],
        },
      ],
    },
    cart: {
      navLabel: "Замовлення",
      openLabel: "Кошик",
      title: "Ваше замовлення",
      addedLabel: "Додано до замовлення",
      quantityLabel: "Кількість",
      remove: "Видалити з замовлення",
      emptyTotal: "Замовлення порожнє. Додайте товар, щоб залишити заявку.",
      details: "Детальніше",
      close: "Закрити",
      productsTitle: "Виберіть товари",
      accessoriesTitle: "Виберіть супутнє обладнання",
      partsTitle: "Комплектуючі",
      contactTitle: "Контактні дані",
      nameLabel: "Ім’я",
      phoneLabel: "Телефон",
      requiredLabel: "(обовʼязково)",
      nameError: "Вкажіть ім’я.",
      phoneError: "Введіть номер у міжнародному форматі, наприклад +380501234567.",
      submit: "Залишити заявку",
      sending: "Надсилаємо…",
      errorMessage: "Не вдалося підтвердити замовлення. Спробуйте ще раз.",
      success: "Дякуємо за замовлення. Ми зв'яжемося з вами для підтвердження черги та уточнення деталей найближчим часом.",
      backToCatalog: "До каталогу",
      survey: {
        title: "Допоможіть нам краще розуміти нашу аудиторію",
        question: "Звідки ви дізналися про D·Vision SDR?",
        recommendation: "Рекомендація побратимів або суміжників",
        socialTitle: "З соцмереж",
        social: ["Instagram", "Facebook", "TikTok"],
        google: "З пошуку в Google",
        other: "Інше",
        otherPlaceholder: "Напишіть, звідки саме",
        submit: "Надіслати",
        sending: "Надсилаємо…",
        error: "Не вдалося надіслати відповідь. Спробуйте ще раз.",
        thanks: "Дякуємо за відповідь!",
      },
      totalTitle: "Разом",
      totalLabel: "Загальна сума",
      moneyPrefix: "",
      moneySuffix: " грн",
      lengthLabel: "Довжина кабелю",
      lengthUnit: "м",
      commentTitle: "Коментар",
      optionalLabel: "(опціонально)",
      termsTitle: "Умови замовлення",
      terms: [
        "Очікування по передзамовленню: до 8 тижнів",
        "При замовленні від 2од. необхідно внести передплату 50% від суми замовлення.",
        "Повна оплата здійснюється перед відправленням замовлення на розрахунковий рахунок. Післяплата наразі недоступна.",
      ],
      consent: "Оформлюючи замовлення, я надаю згоду на отримання сповіщень щодо статусу замовлення, оновлень та спілкування з представником D·Vision SDR у WhatsApp на вказаний номер.",
    },
    service: {
      navLabel: "Гарантія та сервіс",
      title: "Гарантійне обслуговування\nта підтримка",
      lead: "Ми гарантуємо надійність нашої продукції та забезпечуємо повний супровід обладнання на всіх етапах його експлуатації.",
      sections: [
        {
          icon: "check",
          title: "1 рік гарантії",
          text: "На всі оригінальні детектори D·Vision SDR діє гарантійний термін 12 місяців з моменту отримання пристрою.",
          listIntro: "У межах гарантійного обслуговування ми безкоштовно:",
          items: [
            "Діагностуємо та усуваємо заводські дефекти/брак.",
            "Виконуємо ремонт або заміну комплектуючих при виникненні дрібних технічних несправностей.",
          ],
        },
        {
          icon: "x",
          title: "Негарантійні випадки",
          text: "Гарантія не поширюється на пристрої, які мають ознаки:",
          items: [
            "Значних фізичних пошкоджень, деформацій корпусу або повного знищення детектора.",
            "Потрапляння всередину води, бруду або агресивних речовин.",
            "Слідів самостійного розбирання, стороннього ремонту чи модифікації.",
          ],
          note: "Примітка: у разі виникнення негарантійного випадку ми можемо запропонувати відновлення або ремонт за собівартістю запчастин (за умови технічної можливості).",
        },
        {
          icon: "check",
          title: "Пожиттєва консультаційна підтримка",
          text: "Навіть після закінчення 12 місяців гарантії ми залишаємося на зв'язку. Для всіх користувачів D·Vision SDR діє пожиттєвий консультаційний супровід:",
          items: [
            "Допомога у налаштуванні детектора та оновленні програмного забезпечення.",
            "Консультації щодо віддаленого спостереження та роботи із зовнішніми антенами.",
          ],
        },
      ],
    },
    manual: {
      navLabel: "Інструкція",
      kicker: "Посібник",
      title: "Посібник користувача",
      lead:
        "Актуальна інструкція з підготовки, роботи з відеосигналами, збереження результатів та оновлення пристрою.",
      syncLabel: "Синхронізовано з Notion",
      updatedLabel: "Оновлено",
      sourceLabel: "Джерело",
      openSourceLabel: "Відкрити Notion",
      contentsLabel: "Зміст",
      emptyTitle: "Інструкція ще синхронізується",
      emptyText: "Після щоденного оновлення тут з’явиться актуальний текст із Notion.",
    },
    hero: {
      eyebrow: "Час сканування: ~9 секунд",
      title: "D·Vision SDR",
      subtitle: "Детектор дронів широкого діапазону 500–8700 МГц",
      chips: ["FPV", "Крила", "Аналогові НРК"],
      chipsLabel: "Ключові переваги",
      imageAlt: "D·Vision SDR детектор дронів з антенами",
    },
    reels: {
      kicker: "Огляд детектора",
      title: "Відео-огляд D·Vision SDR",
      text: "Огляд і інструкції з використання для детектора D·Vision SDR",
      accountName: "D·Vision SDR",
      handle: "@D·VisionSDR",
      playLabel: "Відтворити відео",
      closeLabel: "Закрити відео",
      prevLabel: "Попередні відео",
      nextLabel: "Наступні відео",
      emptyText: "Відео скоро з’являться.",
    },
    product: {
      kicker: "Про пристрій",
      title: "Детектор БПЛА D·Vision SDR",
      intro:
        "D·Vision SDR — інноваційний детектор БПЛА на основі SDR-платформи, створений для моніторингу радіоефіру та завчасного виявлення дронів. Детектор оснащений розширеним набором інструментів (зокрема Водоспад, Віддалений моніторинг, Тест РЕБ тощо), які надають гнучкі можливості для аналізу частотного діапазону та ефективної роботи в польових умовах.",
      imageAlt: "Детектор БПЛА D·Vision SDR — фото пристрою",
      advantagesTitle: "Ключові переваги",
      advantages: [
        ["Широкий діапазон", ["Безперервний моніторинг частот від **500 до 8700 МГц**."]],
        ["Без «сліпих зон»", ["Суцільне покриття робочого спектра завдяки **SDR-архітектурі**."]],
        ["Висока дальність", ["Виявлення сигналів на відстані **до 10 км**."]],
        ["Швидка детекція", ["Повний цикл сканування ефіру за **~9 секунд**."]],
      ],
      featuresTitle: "Функціональні особливості",
      features: [
        ["Маркування «Свій»", ["Швидка ідентифікація власних бортів."]],
        ["Оцінка дистанції", ["Відстеження наближення та віддалення як цифрових, так і аналогових БПЛА."]],
        ["Точковий контроль", ["Моніторинг конкретної частоти або заданого діапазону."]],
        ["Безперервна робота", ["Можливість функціонування безпосередньо під час заряджання."]],
        ["Нічний режим", ["Адаптація яскравості екрана та гучності звукових сповіщень для маскування."]],
        ["Фіксація даних", ["Можливість запису відео та фото на SD-карту."]],
      ],
    },
    tools: {
      kicker: "Інструменти",
      title: "Вбудовані інструменти D·Vision SDR",
      lead: "Від віддаленого керування з укриття до аналізу складних сигналів та детекції цифрових БПЛА. Ознайомтеся з інструментами, які роблять виявлення дронів простим і надійним.",
      characteristicsLabel: "Основні характеристики",
      items: [
        {
          title: "Виявлення цифрових БПЛА (DJI)",
          description:
            "Модуль детекції цифрових сигналів БПЛА (DJI), який працює паралельно з моніторингом аналогових каналів.",
          characteristics: [
            "Єдиний зручний інтерфейс для одночасного перегляду аналогового відео та детекції цифрових сигналів.",
            "Відсутність потреби перемикатися між різними вікнами чи режимами — усе на одному екрані.",
            "Автоматичне сповіщення про виявлення цифрових дронів у зоні дії.",
            "Моніторинг наближення та віддалення БПЛА за рівнем сигналу (дБм / dBm).",
          ],
          note: "Відео зображення недоступне — детектор забезпечує звукове сповіщення та відображення конкретних частот при їх виявленні.",
          imageAlt: "Виявлення цифрових БПЛА (DJI) D·Vision SDR",
          photo: "/tools/dji-detection.jpg",
        },
        {
          title: "Водоспад (Waterfall)",
          description:
            "Візуальне відображення радіочастотного спектра у часі, що дозволяє виявляти, аналізувати та фіксувати радіовипромінювання від БПЛА на різних частотах.",
          characteristics: [
            "Наочна візуалізація інтенсивності сигналу залежно від часу та частоти.",
            "Виявлення короткочасних сплесків, стрибків частот та прихованих сигналів.",
            "Чітке розділення сигналів БПЛА та фонових радіозавад.",
            "Колірна градація потужності сигналу для швидкого аналізу ситуації.",
          ],
          imageAlt: "Інструмент «Водоспад» D·Vision SDR",
          photo: "/tools/waterfall.jpg",
        },
        {
          title: "Тест РЕБ",
          description:
            "Спеціалізований інструмент для перевірки увімкнення та робочих частот засобів радіоелектронної боротьби (РЕБ).",
          characteristics: [
            "Контроль випромінювання та перевірка працездатності засобів РЕБ безпосередньо у польових умовах.",
            "Фіксація частотних діапазонів, які закриваються обладнанням.",
          ],
          imageAlt: "Інструмент «Тест РЕБ» D·Vision SDR",
          photo: "/tools/ew-test.jpg",
        },
        {
          title: "Віддалений моніторинг",
          description:
            "Інструмент для дистанційного спостереження та керування детектором D·Vision SDR без необхідності перебувати безпосередньо поруч із пристроєм у небезпечній зоні.",
          characteristics: [
            "Підключення через USB Type-C кабель до ПК, ноутбука чи Android-пристрою (смартфона/планшета).",
            "Можливість винести сам детектор на потрібну відстань і працювати зі стаціонарного укриття.",
            "Відображення даних моніторингу в режимі реального часу на зовнішньому екрані.",
            "Не потрібен окремий застосунок: з'єднання відбувається напряму між детектором і вашим пристроєм для спостереження.",
          ],
          imageAlt: "Віддалений моніторинг D·Vision SDR",
          photo: "/tools/remote-monitoring.jpg",
        },
      ],
    },
    faq: {
      kicker: "FAQ",
      title: "Часті питання",
      items: [
        {
          question: "Чим D·Vision SDR відрізняється від детектора на основі відеоприймачів?",
          intro: [
            "Більшість класичних аналогових детекторів побудовані на базі стандартних відеоприймачів із фіксованою сіткою частот. D·Vision SDR використовує технологію програмно-визначеного радіо (SDR). Це дає два ключових технологічних плюси:",
          ],
          listType: "ul",
          list: [
            [
              "Суцільний діапазон без «сліпих зон»",
              "за рахунок відсутності класичних відеоприймачів у конструкції пристрою немає між діапазонних стиків, через що не виникають «сліпі зони» і детектор фіксує навіть нестандартні та зміщені частоти ворога.",
            ],
            ["Гнучкість", "розпізнавання нових типів БПЛА додається через оновлення ПЗ без необхідності змінювати «залізо»."],
          ],
        },
        {
          question: "Як працює SDR-платформа?",
          intro: [
            "Більшість детекторів чекають на готову картинку від стандартних відеоприймачів. D·Vision SDR оцифровує та аналізує сам радіосигнал.",
          ],
          listIntro: "Основний принцип роботи:",
          listType: "ol",
          list: [
            [
              "Сканування ефіру",
              "пристрій покроково аналізує широкий діапазон частот (від 500 до 8700 МГц) з кроком в 10 МГц. Повний цикл перевірки займає лише 9 секунд.",
            ],
            [
              "Аналіз «сирих» даних",
              "SDR оцифровує весь ефір та досліджує безпосередньо склад радіосигналу, а не чекає на готову картинку.",
            ],
            [
              "Пошук сигнатур",
              "процесор шукає в отриманому сигналі специфічні радіо відбитки (сигнатури), характерні для FPV-відео, сигналів DJI тощо.",
            ],
            [
              "Сповіщення та виведення",
              "знайшовши сигнатуру, пристрій миттєво сповіщає про це, фіксує частоту в списку та виводить відеопотік на дисплей (за наявності сумісного відеосигналу).",
            ],
          ],
          note: "Для цифрових БПЛА зображення недоступне — пристрій забезпечує звукове сповіщення та відображення конкретних частот при їх виявленні.",
        },
        {
          question: "Скільки потоків сканування?",
          intro: [
            "D·Vision SDR — це однопотоковий SDR-детектор. Під час автосканування пристрій послідовно проходить весь діапазон від 500 до 8700 МГц за ~9 секунд. Якщо оператор зупиняється на конкретному каналі для детального перегляду відео трансляції FPV, сканування решти діапазону призупиняється.",
          ],
        },
        {
          question: "Чи правда, що D·Vision SDR дає суцільний діапазон?",
          intro: [
            "Так, це правда. Завдяки SDR-архітектурі пристрій забезпечує суцільне сканування в межах 500–8700 МГц без фіксованої сітки каналів чи «сліпих зон» між діапазонами. Це дозволяє виявляти дрони, які працюють на нестандартних, зсунутих або рідкісних частотах.",
          ],
        },
        {
          question: "Чому тільки 2 антени?",
          intro: [
            "Завдяки широкій смузі пропускання та ефективному SDR-модулю двох всеспрямованих антен повністю достатньо для покриття всього робочого діапазону. Перша антена оптимізована під низький та середній діапазони, а друга — під високі частоти.",
          ],
        },
        {
          question: "Які частоти цих антен?",
          intro: ["Штатні антени покривають увесь спектр детектора:"],
          listType: "ul",
          list: [
            ["Антена 1 (Low Band)", "діапазон від 500 до 3000 МГц."],
            ["Антена 2 (High Band)", "діапазон від 3000 до 8700 МГц."],
          ],
        },
        {
          question: "Чи можна підключити до виносних антен?",
          intro: ["Так, D·Vision SDR підтримує виносні антени. Ви можете підключати:"],
          listType: "ul",
          list: [
            [
              "Автомобільні виносні антени (кабель 2–10 м)",
              "для винесення точки прийому на дах авто, щоб усунути екранування кузовом під час руху.",
            ],
            [
              "Бліндажні / стаціонарні антени (кабель 14–20 м)",
              "для винесення антен із підсилювачами на щоглу або відкриту місцевість.",
            ],
          ],
        },
        {
          question: "Чому пристрій доступніший за аналоги?",
          intro: [
            "Завдяки оптимізованій SDR-архітектурі та пасивному охолодженню (без кулера та складних механічних вузлів) вдалося спростити апаратну частину та знизити собівартість виробництва без втрати надійності. Актуальну ціну наведено в каталозі.",
          ],
        },
      ],
    },
    footer: "D·Vision SDR ™, 2026",
  },
  en: {
    ...shared,
    meta: {
      lang: "en",
      navLabel: "Page navigation",
      primaryAction: "Order",
      secondaryAction: "Contact us",
      ctaLabel: "Primary actions",
      menuLabel: "Menu",
      closeMenuLabel: "Close menu",
    },
    nav: [
      ["/order", "Catalog"],
      ["/manual", "Manual"],
      ["/payment-and-delivery", "Payment & Delivery"],
      ["/service", "Service & Warranty"],
    ],
    order: {
      navLabel: "Order",
      title: "D·Vision SDR Product Catalog",
      photoPendingLabel: "Photo coming soon",
      priceLabel: "Price",
      modelLabel: "Model",
      descriptionLabel: "Description",
      quickNav: [
        ["Detector", "detector"],
        ["External Antenna", "antenna"],
        ["Car Mount", "holder"],
        ["Body Armor Mount", "molle"],
        ["Spare Parts", "part"],
      ],
      partsTitle: "Spare Parts",
      items: [],
    },
    paymentDelivery: {
      navLabel: "Payment & Delivery",
      title: "Payment & Delivery",
      sections: [
        {
          icon: "check",
          title: "Pre-order & Production Timeline",
          items: [
            [
              "Lead time",
              "All devices are made to order. The estimated time to assemble and ship your order is up to 8 weeks from the date you place it.",
            ],
          ],
        },
        {
          icon: "check",
          title: "Payment Terms",
          items: [
            ["Single detector", "For an order of 1 unit, no prepayment is required. Full payment is made right before the device ships."],
            [
              "2+ detectors",
              "For orders of 2 or more units, a 50% prepayment of the total order value applies. The remaining 50% is paid right before the order ships.",
            ],
            ["Payment method", "All payments are made by official bank transfer to our account (IBAN)."],
          ],
          noteLabel: "Please note",
          note: "We do not currently offer cash on delivery, installment plans, or split payments. Devices ship only after the order has been paid in full.",
        },
        {
          icon: "check",
          title: "Delivery",
          items: [
            [
              "Courier service",
              "All shipments within Ukraine are handled by Nova Poshta (to a branch, parcel locker, or courier delivery to your address).",
            ],
            [
              "Insurance & cost",
              "Delivery is paid by the recipient at the carrier's rates. Every shipment is insured for the full value of the device.",
            ],
          ],
        },
      ],
    },
    cart: {
      navLabel: "Order",
      openLabel: "Cart",
      title: "Your order",
      addedLabel: "Added to order",
      quantityLabel: "Quantity",
      remove: "Remove from order",
      emptyTotal: "Your order is empty. Add an item to submit a request.",
      details: "Details",
      close: "Close",
      productsTitle: "Choose products",
      accessoriesTitle: "Choose additional equipment",
      partsTitle: "Spare parts",
      contactTitle: "Contact details",
      nameLabel: "Name",
      phoneLabel: "Phone",
      requiredLabel: "(required)",
      nameError: "Enter your name.",
      phoneError: "Enter a phone number in international format, e.g. +380501234567.",
      submit: "Submit request",
      sending: "Sending…",
      errorMessage: "Could not send the request. Try again or message us on WhatsApp.",
      success: "Thank you for your order. We will contact you shortly to confirm your place in the queue and clarify the details.",
      backToCatalog: "Back to catalog",
      survey: {
        title: "Help us understand our audience better",
        question: "Where did you hear about D·Vision SDR?",
        recommendation: "Recommendation from fellow soldiers or partner units",
        socialTitle: "Social media",
        social: ["Instagram", "Facebook", "TikTok"],
        google: "Google search",
        other: "Other",
        otherPlaceholder: "Tell us where exactly",
        submit: "Send",
        sending: "Sending…",
        error: "Could not send your answer. Please try again.",
        thanks: "Thank you for your answer!",
      },
      totalTitle: "Summary",
      totalLabel: "Total",
      moneyPrefix: "UAH ",
      moneySuffix: "",
      lengthLabel: "Cable length",
      lengthUnit: "m",
      commentTitle: "Comment",
      optionalLabel: "optional",
      termsTitle: "Order terms",
      terms: [
        "Pre-order lead time: up to 8 weeks",
        "For orders of 2 or more units, a 50% prepayment of the order total is required.",
        "Full payment is made to our bank account before the order is shipped. Cash on delivery is not available at the moment.",
      ],
      consent: "By placing this order, I agree to receive notifications about the order status and updates, and to communicate with a D·Vision SDR representative on WhatsApp at the number provided.",
    },
    service: {
      navLabel: "Service & Warranty",
      title: "Service & Warranty",
      lead: "We stand behind the reliability of our products and provide full support throughout the equipment's service life.",
      sections: [
        {
          icon: "check",
          title: "1-year warranty",
          text: "All original D·Vision SDR detectors carry a 12-month warranty from the date the device is received.",
          listIntro: "Under the warranty we cover, free of charge:",
          items: [
            "Diagnosing and fixing factory defects.",
            "Repairing or replacing components for minor technical faults.",
          ],
        },
        {
          icon: "x",
          title: "Cases not covered by warranty",
          text: "The warranty does not cover devices showing signs of:",
          items: [
            "Significant physical damage, a deformed housing, or a destroyed detector.",
            "Water, dirt, or corrosive substances getting inside the unit.",
            "Unauthorized disassembly, third-party repair, or modification.",
          ],
          note: "Note: for a case outside the warranty, we may offer restoration or repair at the cost of parts (where technically possible).",
        },
        {
          icon: "check",
          title: "Lifetime consultation support",
          text: "Even after the 12-month warranty ends, we stay in touch. Every D·Vision SDR user gets lifetime consultation support:",
          items: [
            "Help setting up the detector and updating its firmware.",
            "Guidance on remote observation and working with external antennas.",
          ],
        },
      ],
    },
    manual: {
      navLabel: "Manual",
      kicker: "User manual",
      title: "SDR user manual",
      lead:
        "The current guide for setup, video-signal operation, saving results, and updating the device.",
      syncLabel: "Synced from Notion",
      updatedLabel: "Updated",
      sourceLabel: "Source",
      openSourceLabel: "Open Notion",
      contentsLabel: "Contents",
      emptyTitle: "The manual is still syncing",
      emptyText: "The latest Notion instruction will appear here after the daily update.",
    },
    hero: {
      eyebrow: "Full-range scan time: ~9 seconds",
      title: "D·Vision SDR",
      subtitle: "Wide-band drone detector covering 500-8700 MHz",
      chips: ["FPV", "Fixed-wing UAVs", "Analog UGVs"],
      chipsLabel: "Key advantages",
      imageAlt: "D·Vision SDR drone detector with antennas",
    },
    reels: {
      kicker: "Detector overview",
      title: "D·Vision SDR video overview",
      text: "Overview and usage guides for the D·Vision SDR detector",
      accountName: "D·Vision SDR",
      handle: "@D·VisionSDR",
      playLabel: "Play video",
      closeLabel: "Close video",
      prevLabel: "Previous videos",
      nextLabel: "Next videos",
      emptyText: "Videos are coming soon.",
    },
    product: {
      kicker: "About the device",
      title: "D·Vision SDR Drone Detector",
      intro:
        "D·Vision SDR is an innovative UAV detector built on an SDR platform, designed to monitor the radio spectrum and give early warning of drones. The detector ships with an extended toolset (including Waterfall, remote monitoring, an EW test, and more) that provides flexible options for frequency-band analysis and reliable operation in the field.",
      imageAlt: "D·Vision SDR drone detector — device photo",
      advantagesTitle: "Key advantages",
      advantages: [
        ["Wide range", ["Continuous monitoring of frequencies from **500 to 8700 MHz**."]],
        ["No blind spots", ["Full coverage of the working spectrum thanks to the **SDR architecture**."]],
        ["Long range", ["Detects signals at a distance of **up to 10 km**."]],
        ["Fast detection", ["A full scanning cycle takes **~9 seconds**."]],
      ],
      featuresTitle: "Functional features",
      features: [
        ["Friend marking", ["Quickly identifies your own aircraft."]],
        ["Distance estimate", ["Tracks both digital and analog UAVs approaching or moving away."]],
        ["Targeted monitoring", ["Monitors a specific frequency or a selected band."]],
        ["Uninterrupted operation", ["Works while charging."]],
        ["Night mode", ["Adjusts screen brightness and alert volume for concealment."]],
        ["Data logging", ["Records video and photos to an SD card."]],
      ],
    },
    tools: {
      kicker: "Tools",
      title: "Built-in D·Vision SDR tools",
      lead: "From remote control out of a shelter to analyzing complex signals and detecting digital UAVs — explore the tools that make drone detection simple and reliable.",
      characteristicsLabel: "Key features",
      items: [
        {
          title: "Digital UAV detection (DJI)",
          description:
            "A detection module for digital UAV signals (DJI) that runs alongside analog-channel monitoring.",
          characteristics: [
            "One convenient interface for viewing analog video and digital-signal detection at the same time.",
            "No need to switch between windows or modes — everything on one screen.",
            "Automatic alert when a digital drone is detected in range.",
            "Tracks a UAV approaching or moving away by signal level (dBm).",
          ],
          note: "No video image is available — the detector provides an audio alert and displays the specific frequencies detected.",
          imageAlt: "D·Vision SDR digital UAV (DJI) detection",
          photo: "/tools/dji-detection.jpg",
        },
        {
          title: "Waterfall",
          description:
            "A visual display of the radio-frequency spectrum over time that helps detect, analyze, and record UAV radio emissions across different frequencies.",
          characteristics: [
            "Clear visualization of signal intensity over time and frequency.",
            "Detects short bursts, frequency hopping, and hidden signals.",
            "Clearly separates UAV signals from background radio interference.",
            "Color-coded signal strength for a quick read of the situation.",
          ],
          imageAlt: "D·Vision SDR Waterfall tool",
          photo: "/tools/waterfall.jpg",
        },
        {
          title: "EW test",
          description:
            "A dedicated tool for checking whether your electronic-warfare (EW) equipment is active and verifying its operating frequencies.",
          characteristics: [
            "Checks emissions and verifies EW equipment performance directly in the field.",
            "Records the frequency bands the equipment is jamming.",
          ],
          imageAlt: "D·Vision SDR EW test tool",
          photo: "/tools/ew-test.jpg",
        },
        {
          title: "Remote monitoring",
          description:
            "A tool for observing and controlling the D·Vision SDR detector remotely, without needing to stay right next to the device in a danger zone.",
          characteristics: [
            "Connects via a USB Type-C cable to a PC, laptop, or Android device (phone/tablet).",
            "Lets you place the detector at a distance and work from a fixed shelter.",
            "Shows monitoring data in real time on an external screen.",
            "No separate app needed: the connection runs directly between the detector and your viewing device.",
          ],
          imageAlt: "D·Vision SDR remote monitoring",
          photo: "/tools/remote-monitoring.jpg",
        },
      ],
    },
    faq: {
      kicker: "FAQ",
      title: "Frequently asked questions",
      items: [
        {
          question: "How is D·Vision SDR different from a detector based on video receivers?",
          intro: [
            "Most classic analog detectors are built on standard video receivers with a fixed frequency grid. D·Vision SDR uses software-defined radio (SDR) technology instead. This gives two key technical advantages:",
          ],
          listType: "ul",
          list: [
            [
              "Continuous range with no blind spots",
              "without classic video receivers in its design, there are no gaps between bands, so no blind spots appear and the detector picks up even non-standard or shifted enemy frequencies.",
            ],
            ["Flexibility", "support for new UAV types is added through firmware updates, with no need to change the hardware."],
          ],
        },
        {
          question: "How does the SDR platform work?",
          intro: [
            "Most detectors wait for a ready-made picture from a standard video receiver. D·Vision SDR digitizes and analyzes the radio signal itself.",
          ],
          listIntro: "The basic operating principle:",
          listType: "ol",
          list: [
            [
              "Scanning the air",
              "the device steps through the wide frequency range (500 to 8700 MHz) in 10 MHz increments. A full check cycle takes only 9 seconds.",
            ],
            [
              "Analyzing raw data",
              "SDR digitizes the entire spectrum and examines the radio signal's composition directly, instead of waiting for a ready-made picture.",
            ],
            [
              "Looking for signatures",
              "the processor searches the received signal for specific radio fingerprints (signatures) typical of FPV video, DJI signals, and so on.",
            ],
            [
              "Alert and output",
              "once it finds a signature, the device instantly alerts you, logs the frequency in the list, and displays the video feed on-screen (if a compatible video signal is present).",
            ],
          ],
          note: "For digital UAVs no image is available — the device provides an audio alert and shows the specific detected frequencies.",
        },
        {
          question: "How many scanning streams does it have?",
          intro: [
            "D·Vision SDR is a single-stream SDR detector. During auto-scan, the device sequentially steps through the entire range from 500 to 8700 MHz in about 9 seconds. If the operator stops on a specific channel for a detailed look at the FPV video feed, scanning of the rest of the range is paused.",
          ],
        },
        {
          question: "Does D·Vision SDR really give continuous coverage?",
          intro: [
            "Yes, that's true. Thanks to its SDR architecture, the device provides continuous scanning within 500-8700 MHz with no fixed channel grid and no blind spots between bands. This makes it possible to detect drones operating on non-standard, shifted, or rare frequencies.",
          ],
        },
        {
          question: "Why only 2 antennas?",
          intro: [
            "Thanks to the wide bandwidth and an efficient SDR module, two omnidirectional antennas are fully sufficient to cover the entire working range. The first antenna is optimized for the low and mid bands, and the second for high frequencies.",
          ],
        },
        {
          question: "What frequencies do these antennas cover?",
          intro: ["The stock antennas cover the detector's entire spectrum:"],
          listType: "ul",
          list: [
            ["Antenna 1 (Low Band)", "range from 500 to 3000 MHz."],
            ["Antenna 2 (High Band)", "range from 3000 to 8700 MHz."],
          ],
        },
        {
          question: "Can I connect external antennas?",
          intro: ["Yes, D·Vision SDR supports external antennas. You can connect:"],
          listType: "ul",
          list: [
            [
              "Car external antennas (2-10 m cable)",
              "for moving the receiving point to the car roof, to remove the body's shielding effect while driving.",
            ],
            [
              "Bunker / stationary antennas (14-20 m cable)",
              "for moving amplified antennas to a mast or open ground.",
            ],
          ],
        },
        {
          question: "Why is the device more affordable than alternatives?",
          intro: [
            "Thanks to an optimized SDR architecture and passive cooling (no fan or complex mechanical parts), it was possible to simplify the hardware and lower production cost without losing reliability. The current price is listed in the catalog.",
          ],
        },
      ],
    },
    footer: "D·Vision SDR ™, 2026",
  },
};
