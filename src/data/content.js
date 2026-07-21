export const ORDER_URL = "https://forms.gle/xFcMaTWR1G5pR4qW6";
export const WHATSAPP_URL = "https://wa.me/380954716680";

export const SOCIAL_LINKS = [
  ["TikTok", "TT", "https://www.tiktok.com/@dvision_sdr"],
  ["Instagram", "IG", "https://www.instagram.com/dvision_sdr"],
];

export const LANGUAGES = {
  uk: { label: "UA", flag: "🇺🇦", locale: "uk-UA" },
  en: { label: "EN", flag: "🇬🇧", locale: "en-US" },
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
      manualAction: "Посібник користувача",
      ctaLabel: "Основні дії",
      menuLabel: "Меню",
      closeMenuLabel: "Закрити меню",
    },
    nav: [
      ["#advantages", "Переваги"],
      ["#design", "Характеристики"],
      ["#comparison", "Порівняння"],
      ["/manual", "Інструкція"],
      ["#faq", "FAQ"],
    ],
    manual: {
      navLabel: "Інструкція",
      kicker: "Посібник",
      title: "Посібник користувача SDR",
      lead:
        "Актуальна інструкція з підготовки, роботи з відеосигналами, збереження результатів та оновлення пристрою.",
      backLabel: "На головну",
      syncLabel: "Синхронізовано з Notion",
      updatedLabel: "Оновлено",
      sourceLabel: "Джерело",
      openSourceLabel: "Відкрити Notion",
      emptyTitle: "Інструкція ще синхронізується",
      emptyText: "Після щоденного оновлення тут з’явиться актуальний текст із Notion.",
    },
    hero: {
      eyebrow: "Час сканування: ~9 секунд",
      title: "D·Vision SDR",
      subtitle: "Детектор дронів широкого діапазону 500–8000 МГц",
      chips: ["FPV", "Крила", "Аналогові НРК"],
      imageAlt: "D·Vision SDR детектор дронів з антенами",
    },
    advantages: {
      kicker: "Технічні переваги",
      title: "Ширше покриття, ніж у типових детекторів",
      text:
        "Інноваційна запатентована технологія SDR-платформи дозволяє приймати радіосигнал та трансформувати його у відео, що забезпечує чітке кольорове зображення з БПЛА в межах зони сканування.",
      stats: [
        ["Компактність", "13 × 8 см без антен"],
        ["Відображення", "Кольорове відео"],
        ["Захист дисплея", "Додатковий PETG протектор"],
      ],
    },
    design: {
      kicker: "Характеристики",
      title: "Детектор, спроектований за актуальними запитами",
      cards: [
        ["Автономність роботи", ["Підтримка зовнішнього живлення через USB Type-C.", "Робота під час заряджання."]],
        [
          "Формат віддаленого спостереження",
          ["Підключення до ноутбука (Windows OS), планшета та телефона (Android OS).", "Запис відео та фіксація фото."],
        ],
        ["Захист дисплея", ["Захист екрана з ультраміцного пластику PETG."]],
        ["Розміри девайсу", ["Компактний корпус: 13 × 8 см без антен.", "Оптимальний дисплей 4,3 дюйма."]],
        ["Широкі можливості застосування", ["Підключення виносних антен.", "Автотримачі та кріплення на бронежилет MOLLE."]],
        ["Адаптація під умови роботи", ["Нічний режим.", "Налаштування гучності звуку."]],
        ["Доступність", ["Конкурентна ціна: від 22 000 грн.", "Терміни поставок: до 5 тижнів."]],
      ],
    },
    comparison: {
      kicker: "Альтернативи",
      title: "Порівняння з рішеннями на ринку",
      text: "",
      otherLabel: "Інші",
      columns: ["Характеристика", "D·Vision SDR", "Типовий прилад"],
      rows: [
        ["Архітектура", "SDR-платформа", "Відеоприймач"],
        ["Покриття відеочастот", "500–8000 МГц", "Обмежене окремими діапазонами"],
        ["Антени", "Дві антени з автоперемиканням", "Типово stock-підхід"],
        ["Оновлення прошивки", "OTA-процес", "Залежить від виробника"],
        ["Гучність роботи", "Пасивне охолодження, вентилятор відсутній", "Наявність шуму від вентилятора"],
        ["Індикація заряду батареї", "Чітка індикація заряду", "Часто незрозуміла або відсутня"],
        ["Конкурентна ціна", "22 000 грн", "25 000–33 000 грн"],
      ],
    },
    useCases: {
      kicker: "Застосування",
      title: "Сценарії використання",
      cards: [
        ["Особиста безпека під час ротації", "Зручне кріплення на бронежилет робить D·Vision SDR елементом індивідуального захисту бійця."],
        ["Захист екіпажу під час в'їзду та виїзду з позицій", "Кріплення в авто дозволяє водієві вчасно дізнатися про небезпеку та контролювати ситуацію."],
        ["Сканування з броньованих авто", "Виносні антени нівелюють екранування броні, забезпечуючи максимальну дальність детекції та вчасне реагування."],
        ["Взаємодія з системами РЕБ", "Висока чутливість дозволяє працювати поруч із увімкненим РЕБ, а дальність сканування до 10 км допомагає активувати РЕБ лише при виявленні БПЛА."],
        ["Логістика в прифронтових зонах", "Волонтери, журналісти та логістичні місії потребують надійного прикриття від дронів. D·Vision SDR — доступне рішення для захисту кожної поїздки."],
      ],
    },
    faq: {
      kicker: "FAQ",
      title: "Часті питання",
      items: [
        [
          "Чим D·Vision SDR відрізняється від детектора на основі відеоприймачів?",
          "D·Vision SDR побудований на базі SDR-платформи. Live Video, спектральний сканер, «Водоспад» та аналітика RSSI/SNR дозволяють виявляти активність аналогового відеосигналу значно раніше, забезпечуючи вчасне попередження про загрозу БПЛА.",
        ],
        ["Що таке «Водоспад» і навіщо він потрібен?", "«Водоспад» — це графічне відображення історії радіоефіру в реальному часі. Він дозволяє фіксувати навіть найслабші сигнали в спектрі, які ще занадто слабкі для декодування відео, але вже критично важливі для раннього попередження."],
        ["Що показують RSSI та SNR?", "RSSI відображає загальну потужність отриманого сигналу, а SNR — співвідношення корисного сигналу до радіошуму. Разом вони допомагають оцінити якість зв'язку та виявити роботу БПЛА в умовах радіозавад."],
        ["Чи виявляє D·Vision SDR усі дрони?", "Ні, універсального детектора для всіх дронів не існує. D·Vision SDR спеціалізований під раннє виявлення аналогових відеосигналів, які масово використовуються на ударних FPV-дронах та багатьох розвідувальних БПЛА."],
        ["Чому пристрій доступніший за аналоги?", "Власний патент на SDR-платформу дозволяє сканувати ефір без використання стандартних відеоприймачів. Оптимізація архітектури знизила собівартість виробництва без компромісів із надійністю."],
        ["Чи доступні інші мови інтерфейсу для іноземних користувачів?", "Так. Сайт доступний українською та англійською мовами. Інтерфейс пристрою локалізований українською та англійською."],
      ],
    },
    team: {
      kicker: "Про нас",
      title: "Команда D·Vision SDR",
      text: [
        "Ми — команда інженерів та продукт-менеджерів/-ок, які з початку повномасштабного вторгнення активно задіяні у волонтерських ініціативах у сфері БПЛА.",
        "Розробивши нову технологію сканування діапазону, ми віримо, що вона допоможе зберегти життя та здоров’я тисяч наших військових, волонтерів/-ок, а також цивільних громадян.",
        "Наша мета — щоб усі наші захисники, захисниці та цивільні поверталися додому неушкодженими.",
      ],
    },
    footer: "D·Vision SDR ™",
  },
  en: {
    ...shared,
    meta: {
      lang: "en",
      navLabel: "Page navigation",
      primaryAction: "Order",
      secondaryAction: "Contact us",
      manualAction: "User manual",
      ctaLabel: "Primary actions",
      menuLabel: "Menu",
      closeMenuLabel: "Close menu",
    },
    nav: [
      ["#advantages", "Advantages"],
      ["#design", "Specs"],
      ["#comparison", "Compare"],
      ["/manual", "Manual"],
      ["#faq", "FAQ"],
    ],
    manual: {
      navLabel: "Manual",
      kicker: "User manual",
      title: "SDR user manual",
      lead:
        "The current guide for setup, video-signal operation, saving results, and updating the device.",
      backLabel: "Back to home",
      syncLabel: "Synced from Notion",
      updatedLabel: "Updated",
      sourceLabel: "Source",
      openSourceLabel: "Open Notion",
      emptyTitle: "The manual is still syncing",
      emptyText: "The latest Notion instruction will appear here after the daily update.",
    },
    hero: {
      eyebrow: "Full-range scan time: ~9 seconds",
      title: "D·Vision SDR",
      subtitle: "Wide-band drone detector covering 500-8000 MHz",
      chips: ["FPV", "Fixed-wing UAVs", "Analog UGVs"],
      imageAlt: "D·Vision SDR drone detector with antennas",
    },
    advantages: {
      kicker: "Technical advantages",
      title: "Broader coverage than typical detectors",
      text:
        "An innovative patented SDR-platform technology receives a radio signal and transforms it into video, delivering a clear color image from a UAV within the scanning zone.",
      stats: [
        ["Compactness", "13 × 8 cm without antennas"],
        ["Display", "Color video"],
        ["Display protection", "Additional PETG protector"],
      ],
    },
    design: {
      kicker: "Characteristics",
      title: "A detector designed around current operational needs",
      cards: [
        ["Power autonomy", ["External power through USB Type-C.", "Works while charging."]],
        ["Remote observation format", ["Connects to a laptop (Windows OS), tablet and phone (Android OS).", "Video recording and photo capture."]],
        ["Screen protection", ["Screen protection made from ultra-strong PETG plastic."]],
        ["Device dimensions", ["Compact body: 13 × 8 cm without antennas.", "Optimal 4.3-inch display."]],
        ["Wide application options", ["External antenna connection.", "Car mounts and MOLLE vest mounting."]],
        ["Adaptation to working conditions", ["Night mode.", "Sound volume settings."]],
        ["Accessibility", ["Competitive price: from UAH 22,000.", "Delivery terms: up to 5 weeks."]],
      ],
    },
    comparison: {
      kicker: "Alternatives",
      title: "Comparison with market solutions",
      text: "",
      otherLabel: "Others",
      columns: ["Characteristic", "D·Vision SDR", "Typical device"],
      rows: [
        ["Architecture", "SDR platform", "Video receiver"],
        ["Video-frequency coverage", "500-8000 MHz", "Limited to separate bands"],
        ["Antennas", "Two antennas with auto-switching", "Typically stock approach"],
        ["Firmware updates", "OTA process", "Depends on manufacturer"],
        ["Operating noise", "Passive cooling, no fan", "Fan noise present"],
        ["Battery charge indication", "Clear charge indication", "Often unclear or missing"],
        ["Competitive price", "UAH 22,000", "UAH 25,000-33,000"],
      ],
    },
    useCases: {
      kicker: "Usage scenario",
      title: "Use cases",
      cards: [
        ["Personal safety during rotation", "A convenient vest mount makes D·Vision SDR part of an individual protection setup."],
        ["Crew protection when entering or leaving positions", "Vehicle mounting helps the driver learn about danger in time and maintain situational control."],
        ["Scanning from armored vehicles", "External antennas reduce armor shielding and support maximum detection range and timely reaction."],
        ["Interaction with EW systems", "High sensitivity supports operation near active EW, while up to 10 km scanning range helps keep EW off until a UAV is detected."],
        ["Logistics in near-frontline zones", "Volunteers, journalists and logistics missions need reliable drone protection. D·Vision SDR is an accessible solution for every trip."],
      ],
    },
    faq: {
      kicker: "FAQ",
      title: "Frequently asked questions",
      items: [
        ["How is D·Vision SDR different from detectors based on video receivers?", "D·Vision SDR is built on an SDR platform. Live Video, spectrum scanner, Waterfall and RSSI/SNR analytics help detect analog video-signal activity much earlier and provide timely warning about UAV threats."],
        ["What is Waterfall and why is it needed?", "Waterfall is a real-time graphical history of radio activity. It helps visually capture even weak spectrum signals that are too weak for video decoding but already critical for early warning."],
        ["What do RSSI and SNR show?", "RSSI shows the received signal power, while SNR shows the useful signal-to-noise ratio. Together they help evaluate link quality and detect UAV operation in radio-interference conditions."],
        ["Does D·Vision SDR detect every drone?", "No. A universal detector for every drone does not exist. D·Vision SDR specializes in early detection of analog video signals, which are widely used on FPV strike drones and many reconnaissance UAVs."],
        ["Why is the device more accessible than alternatives?", "A proprietary patent for the SDR platform enables spectrum scanning without standard video receivers. Architecture optimization reduced production cost without compromising reliability."],
        ["Are other interface languages available for foreign users?", "Yes. The website is available in Ukrainian and English. The device interface is localized in Ukrainian and English."],
      ],
    },
    team: {
      kicker: "About us",
      title: "The D·Vision SDR team",
      text: [
        "We are a team of engineers and product managers who have been actively involved in UAV-related volunteer initiatives since the beginning of the full-scale invasion.",
        "By developing a new range-scanning technology, we believe it can help preserve the lives and health of thousands of military personnel, volunteers and civilians.",
        "Our goal is for defenders, volunteers and civilians to return home unharmed.",
      ],
    },
    footer: "D·Vision SDR ™",
  },
};
