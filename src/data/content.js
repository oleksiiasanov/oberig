export const ORDER_URL = "https://forms.gle/xFcMaTWR1G5pR4qW6";
export const WHATSAPP_URL = "https://wa.me/380954716680";

export const SOCIAL_LINKS = [
  ["Facebook", "FB", "https://www.facebook.com/oberig.sdr"],
  ["TikTok", "TT", "https://www.tiktok.com/@oberig.sdr"],
  ["Instagram", "IG", "https://www.instagram.com/oberig_sdr/"],
];

export const LANGUAGES = {
  uk: { label: "UA", flag: "🇺🇦", locale: "uk-UA" },
  en: { label: "EN", flag: "🇬🇧", locale: "en-US" },
};

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
    },
    nav: [
      ["#advantages", "Переваги"],
      ["#design", "Характеристики"],
      ["#comparison", "Порівняння"],
      ["#faq", "FAQ"],
    ],
    hero: {
      eyebrow: "Час сканування: ~9 секунд",
      title: "Oberig SDR",
      subtitle: "Детектор дронів широкого діапазону 500–9000 МГц",
      chips: ["FPV", "Крила", "Аналогові НРК"],
      imageAlt: "Oberig SDR детектор дронів з антенами",
    },
    advantages: {
      kicker: "Технічні переваги",
      title: "Максимальна детекція доступна на ринку",
      text:
        "Інноваційна запатентована технологія SDR-платформи дозволяє приймати радіосигнал та трансформувати його у відео, що забезпечує чітке кольорове зображення з БПЛА в межах зони сканування.",
      stats: [
        ["Дальність сканування", "до 10 км"],
        ["Діапазон сканування", "500–9000 МГц"],
        ["Сканування повного кола", "~9 секунд"],
        ["Відео", "кольорове"],
        ["Формат", "компактний девайс"],
        ["Екран", "посилений захист"],
      ],
    },
    spotlight: {
      title: "Сучасний український оберіг",
      text: "Медіа-блок під відео з обертанням детектора. Поки відео не додано, використовуємо актуальне фото продукту.",
      badge: "Product view",
    },
    design: {
      kicker: "Польова логіка",
      title: "Детектор, спроектований за актуальними запитами",
      cards: [
        ["Автономність роботи", ["Підтримка зовнішнього живлення через USB Type-C.", "Робота під час заряджання."]],
        ["Формат віддаленого спостереження", ["Підключення до ноутбука Windows, планшета та телефона Android.", "Запис відео та фіксація фото."]],
        ["Захист девайсу", ["Захист екрана з ультраміцного пластику PETG."]],
        ["Ергономіка", ["Компактний корпус: 13 × 8 см без антен.", "Оптимальний дисплей 4,3 дюйма."]],
        ["Широкі можливості застосування", ["Підключення виносних антен.", "Автотримачі та кріплення на бронежилет MOLLE."]],
        ["Адаптація під умови роботи", ["Нічний режим.", "Налаштування гучності звуку."]],
        ["Доступність", ["Конкурентна ціна: від 22 000 грн.", "Терміни поставок: до 5 тижнів."]],
      ],
    },
    comparison: {
      kicker: "Порівняння",
      title: "Порівняння з детекторами на ринку",
      text:
        "Детектори дронів стали обов'язковим приладом для кожного військового, адже вони оберігають від небезпеки з неба. Oberig SDR забезпечує високу точність і дозволяє виявити загрозу раніше за типові ринкові аналоги.",
      columns: ["Характеристика", "Детектор Oberig SDR", "Типовий прилад"],
      rows: [
        ["Архітектура", "SDR-платформа", "Відеоприймач"],
        ["Покриття відеочастот", "500–9000 МГц", "Обмежене окремими діапазонами"],
        ["Антени", "Дві антени з автоперемиканням", "Типово stock-підхід"],
        ["Оновлення прошивки", "OTA-процес", "Залежить від виробника"],
        ["Гучний вентилятор", "Пасивне охолодження, вентилятор відсутній", "Наявність шуму від вентилятора"],
        ["Індикація заряду батареї", "Чітка індикація заряду", "Часто незрозуміла або відсутня"],
        ["Конкурентна ціна", "22 000 грн", "25 000–33 000 грн"],
      ],
    },
    useCases: {
      kicker: "Сценарії",
      title: "Сценарії використання",
      cards: [
        ["Особиста безпека під час ротації", "Зручне кріплення на бронежилет робить Oberig SDR елементом індивідуального захисту бійця."],
        ["Захист екіпажу під час в'їзду та виїзду з позицій", "Кріплення в авто дозволяє водієві вчасно дізнатися про небезпеку та контролювати ситуацію."],
        ["Сканування з броньованих авто", "Виносні антени нівелюють екранування броні, забезпечуючи максимальну дальність детекції та вчасне реагування."],
        ["Взаємодія з системами РЕБ", "Висока чутливість дозволяє працювати поруч із увімкненим РЕБ, а дальність сканування до 10 км допомагає активувати РЕБ лише при виявленні БПЛА."],
        ["Логістика в прифронтових зонах", "Волонтери, журналісти та логістичні місії потребують надійного прикриття від дронів. Oberig SDR — доступне рішення для захисту кожної поїздки."],
      ],
    },
    faq: {
      kicker: "FAQ",
      title: "Часті питання",
      items: [
        ["Чим Oberig SDR відрізняється від звичайного відеоприймача?", "Oberig SDR побудований на базі SDR-платформи. Live Video, спектральний сканер, «Водоспад» та аналітика RSSI/SNR дозволяють виявляти активність аналогового відеосигналу значно раніше, забезпечуючи вчасне попередження про загрозу БПЛА."],
        ["Що таке «Водоспад» і навіщо він потрібен?", "«Водоспад» — це графічне відображення історії радіоефіру в реальному часі. Він дозволяє фіксувати навіть найслабші сигнали в спектрі, які ще занадто слабкі для декодування відео, але вже критично важливі для раннього попередження."],
        ["Що показують RSSI та SNR?", "RSSI відображає загальну потужність отриманого сигналу, а SNR — співвідношення корисного сигналу до радіошуму. Разом вони допомагають оцінити якість зв'язку та виявити роботу БПЛА в умовах радіозавад."],
        ["Чи виявляє Oberig SDR усі дрони?", "Ні, універсального детектора для всіх дронів не існує. Oberig SDR спеціалізований під раннє виявлення аналогових відеосигналів, які масово використовуються на ударних FPV-дронах та багатьох розвідувальних БПЛА."],
        ["Чому пристрій доступніший за аналоги?", "Власний патент на SDR-платформу дозволяє сканувати ефір без використання стандартних відеоприймачів. Оптимізація архітектури знизила собівартість виробництва без компромісів із надійністю."],
        ["Чи доступні інші мови інтерфейсу для іноземних користувачів?", "Так. Інтерфейс пристрою локалізований двома мовами — українською та англійською."],
      ],
    },
    team: {
      kicker: "Команда",
      title: "Команда Oberig SDR",
      text: [
        "Ми — команда інженерів та продукт-менеджерів/-ок, які з початку повномасштабного вторгнення активно задіяні у волонтерських ініціативах у сфері БПЛА.",
        "Розробивши нову технологію сканування діапазону, ми віримо, що вона допоможе зберегти життя та здоров’я тисяч наших військових, волонтерів/-ок, а також цивільних громадян.",
        "Наша мета — щоб усі наші захисники, захисниці та цивільні поверталися додому неушкодженими.",
      ],
    },
    footer: "Oberig SDR ™",
  },
  en: {
    ...shared,
    meta: {
      lang: "en",
      navLabel: "Page navigation",
      primaryAction: "Order",
      secondaryAction: "Contact us",
      ctaLabel: "Primary actions",
    },
    nav: [
      ["#advantages", "Advantages"],
      ["#design", "Specs"],
      ["#comparison", "Compare"],
      ["#faq", "FAQ"],
    ],
    hero: {
      eyebrow: "Full-range scan time: ~9 seconds",
      title: "Oberig SDR",
      subtitle: "Wide-band drone detector covering 500-9000 MHz",
      chips: ["FPV", "Fixed-wing UAVs", "Analog UGVs"],
      imageAlt: "Oberig SDR drone detector with antennas",
    },
    advantages: {
      kicker: "Technical advantages",
      title: "Maximum detection capability available on the market",
      text:
        "An innovative patented SDR-platform technology receives a radio signal and transforms it into video, delivering a clear color image from a UAV within the scanning zone.",
      stats: [
        ["Scanning range", "up to 10 km"],
        ["Frequency coverage", "500-9000 MHz"],
        ["Full-circle scan", "~9 seconds"],
        ["Video", "color"],
        ["Format", "compact device"],
        ["Screen", "reinforced protection"],
      ],
    },
    spotlight: {
      title: "A modern Ukrainian oberig",
      text: "Media block prepared for a rotating detector video. Until the video asset is added, the current product image is used.",
      badge: "Product view",
    },
    design: {
      kicker: "Field logic",
      title: "A detector designed around current operational needs",
      cards: [
        ["Power autonomy", ["External power through USB Type-C.", "Works while charging."]],
        ["Remote observation format", ["Connects to a Windows laptop, Android tablet or phone.", "Video recording and photo capture."]],
        ["Device protection", ["Screen protection made from ultra-strong PETG plastic."]],
        ["Ergonomics", ["Compact body: 13 × 8 cm without antennas.", "Optimal 4.3-inch display."]],
        ["Wide application options", ["External antenna connection.", "Car mounts and MOLLE vest mounting."]],
        ["Adaptation to working conditions", ["Night mode.", "Sound volume settings."]],
        ["Accessibility", ["Competitive price: from UAH 22,000.", "Delivery terms: up to 5 weeks."]],
      ],
    },
    comparison: {
      kicker: "Comparison",
      title: "Comparison with market drone detectors",
      text:
        "Drone detectors have become essential equipment for military personnel because they protect against threats from the sky. Oberig SDR provides high accuracy and helps detect threats earlier than typical market alternatives.",
      columns: ["Characteristic", "Oberig SDR detector", "Typical device"],
      rows: [
        ["Architecture", "SDR platform", "Video receiver"],
        ["Video-frequency coverage", "500-9000 MHz", "Limited to separate bands"],
        ["Antennas", "Two antennas with auto-switching", "Typically stock approach"],
        ["Firmware updates", "OTA process", "Depends on manufacturer"],
        ["Noisy fan", "Passive cooling, no fan", "Fan noise present"],
        ["Battery charge indication", "Clear charge indication", "Often unclear or missing"],
        ["Competitive price", "UAH 22,000", "UAH 25,000-33,000"],
      ],
    },
    useCases: {
      kicker: "Use cases",
      title: "Use cases",
      cards: [
        ["Personal safety during rotation", "A convenient vest mount makes Oberig SDR part of an individual protection setup."],
        ["Crew protection when entering or leaving positions", "Vehicle mounting helps the driver learn about danger in time and maintain situational control."],
        ["Scanning from armored vehicles", "External antennas reduce armor shielding and support maximum detection range and timely reaction."],
        ["Interaction with EW systems", "High sensitivity supports operation near active EW, while up to 10 km scanning range helps keep EW off until a UAV is detected."],
        ["Logistics in near-frontline zones", "Volunteers, journalists and logistics missions need reliable drone protection. Oberig SDR is an accessible solution for every trip."],
      ],
    },
    faq: {
      kicker: "FAQ",
      title: "Frequently asked questions",
      items: [
        ["How is Oberig SDR different from a regular video receiver?", "Oberig SDR is built on an SDR platform. Live Video, spectrum scanner, Waterfall and RSSI/SNR analytics help detect analog video-signal activity much earlier and provide timely warning about UAV threats."],
        ["What is Waterfall and why is it needed?", "Waterfall is a real-time graphical history of radio activity. It helps visually capture even weak spectrum signals that are too weak for video decoding but already critical for early warning."],
        ["What do RSSI and SNR show?", "RSSI shows the received signal power, while SNR shows the useful signal-to-noise ratio. Together they help evaluate link quality and detect UAV operation in radio-interference conditions."],
        ["Does Oberig SDR detect every drone?", "No. A universal detector for every drone does not exist. Oberig SDR specializes in early detection of analog video signals, which are widely used on FPV strike drones and many reconnaissance UAVs."],
        ["Why is the device more accessible than alternatives?", "A proprietary patent for the SDR platform enables spectrum scanning without standard video receivers. Architecture optimization reduced production cost without compromising reliability."],
        ["Are other interface languages available for foreign users?", "Yes. The device interface is localized in two languages: Ukrainian and English."],
      ],
    },
    team: {
      kicker: "Team",
      title: "The Oberig SDR team",
      text: [
        "We are a team of engineers and product managers who have been actively involved in UAV-related volunteer initiatives since the beginning of the full-scale invasion.",
        "By developing a new range-scanning technology, we believe it can help preserve the lives and health of thousands of military personnel, volunteers and civilians.",
        "Our goal is for defenders, volunteers and civilians to return home unharmed.",
      ],
    },
    footer: "Oberig SDR ™",
  },
};
