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
  fr: { label: "FR", flag: "🇫🇷", locale: "fr-FR" },
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
      text: "Відео показує реальний форм-фактор Oberig SDR: компактний корпус, антени та польову ергономіку без зайвих декоративних макетів.",
      badge: "Вигляд продукту",
      videoLabel: "Відео з оглядом Oberig SDR",
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
        ["Чи доступні інші мови інтерфейсу для іноземних користувачів?", "Так. Сайт доступний українською, англійською та французькою мовами. Інтерфейс пристрою локалізований українською та англійською."],
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
      menuLabel: "Menu",
      closeMenuLabel: "Close menu",
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
      text: "The video shows the real Oberig SDR form factor: compact body, antennas and field ergonomics without decorative mockups.",
      badge: "Product view",
      videoLabel: "Oberig SDR product view video",
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
        ["Are other interface languages available for foreign users?", "Yes. The website is available in Ukrainian, English and French. The device interface is localized in Ukrainian and English."],
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
  fr: {
    ...shared,
    meta: {
      lang: "fr",
      navLabel: "Navigation de la page",
      primaryAction: "Commander",
      secondaryAction: "Nous contacter",
      ctaLabel: "Actions principales",
      menuLabel: "Menu",
      closeMenuLabel: "Fermer le menu",
    },
    nav: [
      ["#advantages", "Avantages"],
      ["#design", "Caractéristiques"],
      ["#comparison", "Comparer"],
      ["#faq", "FAQ"],
    ],
    hero: {
      eyebrow: "Temps de scan complet : ~9 secondes",
      title: "Oberig SDR",
      subtitle: "Détecteur de drones large bande couvrant 500-9000 MHz",
      chips: ["FPV", "Drones à voilure fixe", "UGV analogiques"],
      imageAlt: "Détecteur de drones Oberig SDR avec antennes",
    },
    advantages: {
      kicker: "Avantages techniques",
      title: "La capacité de détection maximale disponible sur le marché",
      text:
        "La technologie brevetée de la plateforme SDR reçoit le signal radio et le transforme en vidéo, avec une image couleur claire du drone dans la zone de scan.",
      stats: [
        ["Portée de scan", "jusqu’à 10 km"],
        ["Couverture de fréquences", "500-9000 MHz"],
        ["Scan complet", "~9 secondes"],
        ["Vidéo", "couleur"],
        ["Format", "appareil compact"],
        ["Écran", "protection renforcée"],
      ],
    },
    spotlight: {
      title: "Un oberig ukrainien moderne",
      text: "La vidéo montre le vrai format d’Oberig SDR : boîtier compact, antennes et ergonomie terrain sans maquettes décoratives.",
      badge: "Vue produit",
      videoLabel: "Vidéo de présentation produit Oberig SDR",
    },
    design: {
      kicker: "Logique terrain",
      title: "Un détecteur conçu autour des besoins opérationnels actuels",
      cards: [
        ["Autonomie", ["Alimentation externe via USB Type-C.", "Fonctionne pendant la charge."]],
        ["Observation à distance", ["Connexion à un ordinateur Windows, une tablette Android ou un téléphone Android.", "Enregistrement vidéo et capture photo."]],
        ["Protection de l’appareil", ["Protection d’écran en plastique PETG ultra-résistant."]],
        ["Ergonomie", ["Boîtier compact : 13 × 8 cm sans antennes.", "Écran optimal de 4,3 pouces."]],
        ["Large éventail d’usages", ["Connexion d’antennes externes.", "Supports véhicule et fixation MOLLE sur gilet."]],
        ["Adaptation aux conditions de travail", ["Mode nuit.", "Réglage du volume sonore."]],
        ["Accessibilité", ["Prix compétitif : à partir de 22 000 UAH.", "Délais de livraison : jusqu’à 5 semaines."]],
      ],
    },
    comparison: {
      kicker: "Comparaison",
      title: "Comparaison avec les détecteurs de drones du marché",
      text:
        "Les détecteurs de drones sont devenus un équipement essentiel pour les militaires, car ils protègent contre les menaces venant du ciel. Oberig SDR offre une haute précision et aide à détecter la menace plus tôt que les alternatives typiques du marché.",
      columns: ["Caractéristique", "Détecteur Oberig SDR", "Appareil typique"],
      rows: [
        ["Architecture", "Plateforme SDR", "Récepteur vidéo"],
        ["Couverture vidéo-fréquences", "500-9000 MHz", "Limitée à des bandes séparées"],
        ["Antennes", "Deux antennes avec commutation automatique", "Approche standard typique"],
        ["Mises à jour firmware", "Processus OTA", "Dépend du fabricant"],
        ["Ventilateur bruyant", "Refroidissement passif, sans ventilateur", "Bruit de ventilateur présent"],
        ["Indication de charge batterie", "Indication claire de la charge", "Souvent peu claire ou absente"],
        ["Prix compétitif", "22 000 UAH", "25 000-33 000 UAH"],
      ],
    },
    useCases: {
      kicker: "Scénarios",
      title: "Scénarios d’utilisation",
      cards: [
        ["Sécurité personnelle pendant les rotations", "La fixation sur gilet fait d’Oberig SDR un élément de protection individuelle."],
        ["Protection de l’équipage à l’entrée et à la sortie des positions", "Le montage véhicule aide le conducteur à connaître le danger à temps et à garder le contrôle de la situation."],
        ["Scan depuis des véhicules blindés", "Les antennes externes réduisent l’effet d’écran du blindage et soutiennent une portée de détection maximale."],
        ["Interaction avec les systèmes de guerre électronique", "La haute sensibilité permet de travailler près d’un système EW actif, tandis que la portée jusqu’à 10 km aide à n’activer l’EW qu’après détection d’un drone."],
        ["Logistique en zones proches du front", "Volontaires, journalistes et missions logistiques ont besoin d’une protection fiable contre les drones. Oberig SDR est une solution accessible pour chaque trajet."],
      ],
    },
    faq: {
      kicker: "FAQ",
      title: "Questions fréquentes",
      items: [
        ["En quoi Oberig SDR diffère-t-il d’un récepteur vidéo classique ?", "Oberig SDR est construit sur une plateforme SDR. Live Video, scanner spectral, Waterfall et analyses RSSI/SNR aident à détecter l’activité du signal vidéo analogique beaucoup plus tôt et à prévenir à temps d’une menace UAV."],
        ["Qu’est-ce que Waterfall et à quoi sert-il ?", "Waterfall est l’historique graphique en temps réel de l’activité radio. Il aide à repérer même les signaux faibles dans le spectre, encore trop faibles pour décoder la vidéo mais déjà critiques pour l’alerte précoce."],
        ["Que montrent RSSI et SNR ?", "RSSI indique la puissance du signal reçu, tandis que SNR indique le rapport signal utile/bruit radio. Ensemble, ils aident à évaluer la qualité de liaison et à détecter l’activité d’un UAV en conditions d’interférences radio."],
        ["Oberig SDR détecte-t-il tous les drones ?", "Non. Il n’existe pas de détecteur universel pour tous les drones. Oberig SDR est spécialisé dans la détection précoce des signaux vidéo analogiques, largement utilisés par les drones FPV d’attaque et de nombreux UAV de reconnaissance."],
        ["Pourquoi l’appareil est-il plus accessible que les alternatives ?", "Un brevet propriétaire sur la plateforme SDR permet de scanner le spectre sans récepteurs vidéo standards. L’optimisation de l’architecture réduit le coût de production sans compromis sur la fiabilité."],
        ["D’autres langues d’interface sont-elles disponibles pour les utilisateurs étrangers ?", "Oui. Le site est disponible en ukrainien, anglais et français. L’interface de l’appareil est localisée en ukrainien et en anglais."],
      ],
    },
    team: {
      kicker: "Équipe",
      title: "L’équipe Oberig SDR",
      text: [
        "Nous sommes une équipe d’ingénieurs et de product managers activement engagés dans des initiatives bénévoles liées aux UAV depuis le début de l’invasion à grande échelle.",
        "En développant une nouvelle technologie de scan de plage, nous pensons qu’elle peut aider à préserver la vie et la santé de milliers de militaires, bénévoles et civils.",
        "Notre objectif est que les défenseurs, les bénévoles et les civils rentrent chez eux indemnes.",
      ],
    },
    footer: "Oberig SDR ™",
  },
};
