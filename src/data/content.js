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
      ["/service", "Гарантія та сервіс"],
    ],
    order: {
      navLabel: "Замовлення",
      title: "Каталог виробів D·Vision SDR",
      photoPendingLabel: "Фото додається",
      priceLabel: "Ціна",
      descriptionLabel: "Опис",
      quickNav: [
        ["Детектор", "detector"],
        ["Виносна антена", "antenna"],
        ["Кріплення в авто", "holder"],
      ],
      items: [
        {
          id: "detector",
          category: "detector",
          icon: "radar",
          photo: "/products/detector-1.jpg",
          tagStatus: "preorder",
          tag: "Передзамовлення",
          name: "Детектор дронів D·Vision SDR",
          short: "Портативний детектор БПЛА широкого діапазону (500–8700 МГц) на основі SDR-платформи.",
          description: [
            "D·Vision SDR — це пристрій нового покоління, що працює на основі SDR-платформи та забезпечує перехоплення й перетворення радіосигналу у відеотрансляцію. Інноваційна технологія дозволяє сканувати аналогові частоти в діапазоні 500–8700 МГц.",
            "Сканування запускається автоматично. Окрім звукового сповіщення про виявлення дрона, пристрій транслює кольорове зображення з камери зафіксованого безпілотника, що дозволяє оперативно й точно визначити напрямок його руху.",
            "На відміну від аналогів, що базуються на класичних відеоприймачах, D·Vision SDR має оптимізовану архітектуру без активних елементів охолодження. Відсутність вентилятора гарантує повну безшумність роботи, а спрощення апаратної частини дозволило досягти оптимального на ринку співвідношення ціни та можливостей.",
            "Доступні додаткові функції: перевірка роботи власних РЕБ систем та виявлення цифрових БПЛА.",
          ],
          characteristics: [
            {
              title: "Основні характеристики",
              rows: [
                ["Діапазон сканування", "500–8700 МГц"],
                ["Сканування повного кола", "~9 секунд"],
                ["Дальність сканування", "до 10 км (500–6000 МГц)\nдо 5 км (6000–7000 МГц)\nдо 3,5 км (7000–8700 МГц)"],
              ],
            },
            {
              title: "Інші характеристики",
              rows: [
                ["Батарея", "10 000 мА/год"],
                ["Живлення", "USB Type-C, робота під час заряджання"],
                ["Корпус", "130 × 80 × 22 мм (без антен)"],
                ["Вага", "290 г"],
                ["Дисплей", "4,3 дюйма"],
                ["Режими", "Нічний режим, сплячий режим, гучність"],
                ["Інтерфейс", "Українською та англійською"],
                ["Оновлення", "Регулярні оновлення прошивки"],
              ],
            },
          ],
          functionality: {
            title: "Додатковий функціонал",
            items: [
              "Віддалений моніторинг з ПК (Windows), планшета або телефона (Android)",
              "Моніторинг конкретної частоти або діапазону",
              "Запис відео та фото на SD-карту",
              "Тестування власних РЕБ систем",
              "Виявлення цифрових БПЛА",
              "Інструмент «Водоспад»",
            ],
          },
          extras: [
            {
              title: "Комплектація",
              items: ["Детектор дронів.", "2 всеспрямовані антени (антени можуть відрізнятися від фото)."],
            },
          ],
          price: "22 000 грн",
        },
        {
          id: "car-antenna",
          category: "antenna",
          icon: "antenna",
          photo: "/products/external-antena-for-car.jpg",
          tagStatus: "in-stock",
          tag: "В наявності",
          name: "Виносна антена для авто",
          short:
            "Двохантенна система на магнітному кріпленні з кабелем 2, 5 або 10 м на вибір для винесення точки прийому сигналу за межі транспортного засобу.",
          description: [
            "Виносна антена розроблена спеціально під робочі частоти детектора D·Vision SDR. Вона призначена для винесення приймальних елементів на дах автомобіля, що дозволяє усунути екранування сигналу металевим кузовом і суттєво підвищує дальність та стабільність виявлення БПЛА.",
            "Конструкція містить дві внутрішні антени, оптимізовані для роботи в діапазонах детектора. Фіксація на металевих поверхнях здійснюється за допомогою потужної основи з трьох неодимових магнітів, що забезпечує надійне утримання модуля на даху авто під час руху на високій швидкості та в умовах інтенсивної вібрації.",
            "Комплект поставляється з гнучким високочастотним кабелем довжиною 2, 5 або 10 метрів на вибір, який має мінімальне згасання сигналу та дозволяє зручно завести підключення в салон автомобіля.",
          ],
          characteristics: [
            {
              title: "Конструкція та кріплення",
              rows: [
                ["Кількість антен", "2 внутрішні всеспрямовані"],
                ["Тип кріплення", "Основа з 3 неодимових магнітів"],
                ["Довжина кабелю", "2, 5 або 10 м на вибір"],
                ["Конектори", "Стандартні ВЧ-роз'єми"],
              ],
            },
          ],
          functionality: {
            title: "Особливості",
            items: [
              "Оптимізація під діапазони D·Vision SDR",
              "Надійне утримання на даху авто бездоріжжям",
              "Усунення екранування кузовом авто",
            ],
          },
          extras: [],
          price: [
            ["Антена 2 м", "7 000 грн"],
            ["Антена 5 м", "13 000 грн"],
            ["Антена 10 м", "14 200 грн"],
          ],
        },
        {
          id: "bunker-antenna",
          category: "antenna",
          icon: "shield-half",
          photo: "/products/external-antena-for-shelter.jpg",
          tagStatus: "in-stock",
          tag: "В наявності",
          name: "Виносна антена для бліндажа",
          short:
            "Двохантенна система з підсилювачем та ВЧ-кабелем (14 або 20 м) для винесення точки прийому сигналу з укриттів та захищених позицій.",
          description: [
            "Виносна антена розроблена спеціально під робочі частоти детектора D·Vision SDR для забезпечення ефективного моніторингу повітряного простору безпосередньо з укриттів, бліндажів або підземних командних пунктів. Вона дозволяє винести приймальний модуль на поверхню або висотну позицію, усуваючи екранування сигналу ґрунтом, перекриттями та фортифікаційними спорудами.",
            "Конструкція містить дві внутрішні антени та вбудований двоканальний підсилювач (20 dBm на нижній діапазон та 13 dBm на верхній діапазон), що компенсує втрати сигналу в довгому кабелі та гарантує високу чутливість виявлення БПЛА. Монтаж приймального модуля здійснюється за допомогою будівельних або тактичних стяжок на будь-які підручні конструкції (опори, дерева, щогли або елементи фортифікації).",
            "Комплект поставляється з високочастотним кабелем з низьким рівнем згасання довжиною 14 або 20 метрів на вибір, що забезпечує безпечну дистанцію між позицією оператора та точкою прийому сигналу.",
          ],
          characteristics: [
            {
              title: "Конструкція та кріплення",
              rows: [
                ["Кількість антен", "2 внутрішні всеспрямовані"],
                ["Підсилення сигналу", "20 dBm (нижній) / 13 dBm (верхній діапазон)"],
                ["Тип кріплення", "Стяжки (щогли, дерева, фортифікація)"],
                ["Довжина кабелю", "14 або 20 м на вибір"],
                ["Конектори", "Стандартні ВЧ-роз'єми"],
              ],
            },
          ],
          functionality: {
            title: "Особливості",
            items: [
              "Оптимізація під діапазони D·Vision SDR",
              "Компенсація втрат у кабелі підсилювачем",
              "Захист особового складу винесенням точки прийому",
              "Швидкий польовий монтаж стяжками",
            ],
          },
          extras: [],
          price: [
            ["Антена 14 м", "15 600 грн"],
            ["Антена 20 м", "16 000 грн"],
          ],
        },
        {
          id: "car-holder",
          category: "holder",
          icon: "car-front",
          photo: "/products/car-holder-1.jpg",
          tagStatus: "in-stock",
          tag: "В наявності",
          name: "Автомобільний тримач",
          short: "Надійне кріплення на посиленій вакуумній присосці для фіксації детектора на панелі авто.",
          description: [
            "Автомобільний тримач призначений для надійної фіксації детектора D·Vision SDR всередині транспортного засобу. Кріплення дозволяє розмістити прилад у зоні видимості водія або оператора, забезпечуючи зручний моніторинг радіоелектронної обстановки під час руху.",
            "Посилена вакуумна присоска з важелем фіксації забезпечує надійне утримання на склі чи гладких поверхнях навіть в умовах інтенсивної вібрації та їзди бездоріжжям. Шарнірний механізм регулювання дозволяє підібрати оптимальний кут огляду екрана та швидко змінити орієнтацію приладу.",
            "Пристрій легко встановлюється та знімається без використання додаткових інструментів, зберігаючи вільний доступ до роз'ємів живлення та органів керування детектором.",
          ],
          characteristics: [
            {
              title: "Конструкція та кріплення",
              rows: [
                ["Тип фіксації", "Посилена вакуумна присоска з механічним важелем"],
                ["Регулювання", "Шарнір, поворот 180°, вибір кута нахилу"],
                ["Фіксація приладу", "Розсувний механізм під габарити D·Vision SDR"],
                ["Матеріал", "Ударостійкий ABS-пластик, силікон"],
              ],
            },
          ],
          functionality: {
            title: "Особливості",
            items: [
              "Сумісність із детектором D·Vision SDR",
              "Стійкість до вібрацій і перепадів температур",
              "Вільний доступ до Type-C під час руху",
              "Швидкий монтаж і демонтаж",
            ],
          },
          extras: [],
          price: "1000 грн",
        },
      ],
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
        ["Покриття відеочастот", "500–8700 МГц", "Обмежене окремими діапазонами"],
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
      ["/service", "Service & Warranty"],
    ],
    order: {
      navLabel: "Order",
      title: "D·Vision SDR Product Catalog",
      photoPendingLabel: "Photo coming soon",
      priceLabel: "Price",
      descriptionLabel: "Description",
      quickNav: [
        ["Detector", "detector"],
        ["External Antenna", "antenna"],
        ["Car Mount", "holder"],
      ],
      items: [
        {
          id: "detector",
          category: "detector",
          icon: "radar",
          photo: "/products/detector-1.jpg",
          tagStatus: "preorder",
          tag: "Pre-order",
          name: "D·Vision SDR Drone Detector",
          short: "A portable wide-band UAV detector (500-8700 MHz) built on an SDR platform.",
          description: [
            "D·Vision SDR is a new-generation device built on an SDR platform that intercepts a radio signal and converts it into video. The technology scans analog frequencies across the 500-8700 MHz range.",
            "Scanning starts automatically. Alongside an audio alert on drone detection, the device streams a color video feed from the detected aircraft's camera, helping to quickly and accurately determine its direction of travel.",
            "Unlike analogs built on classic video receivers, D·Vision SDR has an optimized architecture with no active cooling elements. The absence of a fan guarantees fully silent operation, and the simplified hardware achieves one of the best price-to-capability ratios on the market.",
            "Additional available functions: testing your own EW systems and detecting digital UAVs.",
          ],
          characteristics: [
            {
              title: "Core specifications",
              rows: [
                ["Scanning range", "500-8700 MHz"],
                ["Full-circle scan", "~9 seconds"],
                ["Detection range", "up to 10 km (500-6000 MHz)\nup to 5 km (6000-7000 MHz)\nup to 3.5 km (7000-8700 MHz)"],
              ],
            },
            {
              title: "Other specifications",
              rows: [
                ["Battery", "10,000 mAh"],
                ["Power", "USB Type-C, works while charging"],
                ["Body", "130 x 80 x 22 mm (without antennas)"],
                ["Weight", "290 g"],
                ["Display", "4.3 inches"],
                ["Modes", "Night mode, sleep mode, volume settings"],
                ["Interface", "Ukrainian and English"],
                ["Updates", "Regular firmware updates"],
              ],
            },
          ],
          functionality: {
            title: "Additional functionality",
            items: [
              "Remote monitoring from a PC (Windows), tablet, or phone (Android)",
              "Monitoring a specific frequency or band",
              "Video and photo recording to an SD card",
              "Testing your own EW systems",
              "Digital UAV detection",
              "Waterfall tool",
            ],
          },
          extras: [
            {
              title: "What's included",
              items: ["Drone detector.", "2 omnidirectional antennas (antennas may differ from photo)."],
            },
          ],
          price: "UAH 22,000",
        },
        {
          id: "car-antenna",
          category: "antenna",
          icon: "antenna",
          photo: "/products/external-antena-for-car.jpg",
          tagStatus: "in-stock",
          tag: "In stock",
          name: "External Antenna for Car",
          short: "A dual-antenna magnetic-mount system with a 2, 5, or 10 m cable for moving the receiving point outside the vehicle.",
          description: [
            "The external antenna is designed specifically for the D·Vision SDR detector's operating frequencies. It moves the receiving elements onto the car's roof, eliminating signal shielding from the metal body and significantly improving UAV detection range and stability.",
            "The unit contains two internal antennas optimized for the detector's bands. It attaches to metal surfaces via a base with three powerful neodymium magnets, holding firmly on a car roof at high speed and under heavy vibration.",
            "It ships with a flexible, low-loss RF cable 2, 5, or 10 meters long, making it easy to route the connection into the cabin.",
          ],
          characteristics: [
            {
              title: "Build and mounting",
              rows: [
                ["Antennas", "2 internal omnidirectional"],
                ["Mount type", "Base with 3 neodymium magnets"],
                ["Cable length", "2, 5, or 10 m, your choice"],
                ["Connectors", "Standard RF connectors"],
              ],
            },
          ],
          functionality: {
            title: "Usage notes",
            items: [
              "Optimized for the D·Vision SDR's bands",
              "Holds firmly on a car roof over rough roads",
              "Removes the vehicle body's shielding effect",
            ],
          },
          extras: [],
          price: [
            ["2 m antenna", "UAH 7,000"],
            ["5 m antenna", "UAH 13,000"],
            ["10 m antenna", "UAH 14,200"],
          ],
        },
        {
          id: "bunker-antenna",
          category: "antenna",
          icon: "shield-half",
          photo: "/products/external-antena-for-shelter.jpg",
          tagStatus: "in-stock",
          tag: "In stock",
          name: "External Antenna for Bunker/Dugout",
          short:
            "A dual-antenna system with a built-in amplifier and a 14 or 20 m RF cable for moving the receiving point out of shelters and protected positions.",
          description: [
            "The external antenna is designed specifically for the D·Vision SDR detector's operating frequencies to support effective airspace monitoring directly from shelters, dugouts, or underground command posts. It moves the receiving module to the surface or to an elevated position, removing signal shielding from soil, overhead cover, and fortifications.",
            "The unit contains two internal antennas and a built-in dual-channel amplifier (20 dBm on the lower band, 13 dBm on the upper band) that compensates for signal loss over the long cable and ensures high detection sensitivity. The receiving module mounts with construction or tactical ties to almost any available structure (posts, trees, masts, or fortification elements).",
            "It ships with a low-loss RF cable 14 or 20 meters long, your choice, keeping a safe distance between the operator's position and the receiving point.",
          ],
          characteristics: [
            {
              title: "Build and mounting",
              rows: [
                ["Antennas", "2 internal omnidirectional"],
                ["Signal amplification", "20 dBm (lower) / 13 dBm (upper band)"],
                ["Mount type", "Cable ties (masts, trees, fortifications)"],
                ["Cable length", "14 or 20 m, your choice"],
                ["Connectors", "Standard RF connectors"],
              ],
            },
          ],
          functionality: {
            title: "Usage notes",
            items: [
              "Optimized for the D·Vision SDR's bands",
              "Compensates cable loss via the built-in amplifier",
              "Protects personnel by moving the receiving point away",
              "Quick field installation with cable ties",
            ],
          },
          extras: [],
          price: [
            ["14 m antenna", "UAH 15,600"],
            ["20 m antenna", "UAH 16,000"],
          ],
        },
        {
          id: "car-holder",
          category: "holder",
          icon: "car-front",
          photo: "/products/car-holder-1.jpg",
          tagStatus: "in-stock",
          tag: "In stock",
          name: "Car Holder",
          short: "A reliable mount on a reinforced vacuum suction cup for securing the detector to a car dashboard.",
          description: [
            "The car holder is designed to securely mount the D·Vision SDR detector inside a vehicle. The mount places the device within the driver's or operator's line of sight, providing convenient monitoring of the radio-electronic environment while driving.",
            "A reinforced vacuum suction cup with a locking lever holds firmly on glass or smooth surfaces even under heavy vibration and off-road driving. A hinge mechanism lets you pick the optimal screen viewing angle and quickly reorient the device.",
            "The holder installs and removes without extra tools, keeping the detector's power ports and controls freely accessible.",
          ],
          characteristics: [
            {
              title: "Build and mounting",
              rows: [
                ["Surface fixation", "Reinforced vacuum suction cup with a locking lever"],
                ["Adjustment", "Hinge joint, 180° rotation, tilt-angle selection"],
                ["Device fixation", "Sliding mechanism sized for the D·Vision SDR"],
                ["Material", "Impact-resistant ABS plastic, silicone"],
              ],
            },
          ],
          functionality: {
            title: "Usage notes",
            items: [
              "Compatible with the D·Vision SDR detector",
              "Resistant to vibration and temperature swings",
              "Free access to the Type-C port while driving",
              "Quick to install and remove",
            ],
          },
          extras: [],
          price: "UAH 1,000",
        },
      ],
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
        ["Video-frequency coverage", "500-8700 MHz", "Limited to separate bands"],
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
    footer: "D·Vision SDR ™, 2026",
  },
};
