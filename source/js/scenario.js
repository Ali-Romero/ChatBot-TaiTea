const createState = ({
  key,
  showStatus = false,
  messages,
  options = [],
  requiresInput = false,
  inputType = null,
  next = null,
  autoNext = false,
  actionRedirect = false,
  action = null,
  optionsClass = null,
}) => ({
  key,
  showStatus,
  messages,
  options,
  requiresInput,
  inputType,
  next,
  autoNext,
  actionRedirect,
  action,
  optionsClass,
});

const createOption = (label, value, next) => ({
  label,
  value,
  next,
});

const chatScenario = (() => {
  const states = {};

  const addState = (stateConfig) => {
    const state = createState(stateConfig);
    states[state.key] = state;
  };

  addState({
    key: "start",
    messages: [
      {
        type: 'text',
        value: "Привет! Меня зовут Мадина и я виртуальный консультант франшизы «TaiTea» 🙂 <br> С радостью отвечу на ваши вопросы!",
      },
      {
        type: 'text',
        value: 'У нас уже открыто 10 точек в Астане и мы готовы к новым масштабам 🎉 <br><br> Мы предоставим вам проверенный план запуска, поможем настроить работу маркетинга и выйти на вашу целевую аудиторию. Вы можете не сомневаться в успешности вашего запуска! «TaiTea» — это команда, которая по-настоящему помогает прийти к результатам 🧋 <br><br> Выберите, что вас интересует?',
      },
    ],
    options: [
      createOption("Могу я открыть «TaiTea» без опыта в бизнесе?", "about", "about"),
      createOption("Какие инвестиции потребуются для старта?", "investment", "investment"),
      createOption("Какую поддержку вы окажете на старте бизнеса?", "support", "support"),
      createOption("Какое у вас меню?", "menu", "menu"),
      createOption("Кто ваша целевая аудитория?", "target", "target"),
      createOption("Хочу посмотреть где вы находитесь", "map", "map"),
      createOption("Хочу задать свой вопрос", "question", "question"),
    ],
    optionsClass: 'response-options--main'
  });

  addState({
    key: "about",
    messages: [
      {
        type: 'text',
        value: 'Да, даже если вы еще не занимались предпринимательской деятельностью или не имеете опыта работы в этой нише, мы поможем вам запустить и вести работу бизнеса. <br><br> Для нас важны ваши результаты, поэтому мы проведем для вас подробное обучение и будем сопровождать на всех этапах открытия и развития вашего безалкогольного бара 🤝',
      },
      {
        type: 'text',
        value: 'Хотите получить пример партнерского договора, где описаны все детали сотрудничества? ',
      },
    ],
    options: [
      createOption("Да", "yes", "contactOptions"),
      createOption("Нет", "no", "questionFranchise"),
    ],
  });

  addState({
    key: "investment",
    messages: [
      {
        type: 'text',
        value: `
          Для старта вам потребуется от 4 млн тенге, точная сумма будет зависеть от величины вашего города и выбранного формата работы. Вы можете выбрать для себя подходящий формат:
          <br class="d-i-block"><br class="d-i-block">
          <span class="message-container">
          <span>-</span>
          <span>Островок в ТЦ </span>
          </span>
          <span class="message-container">
          <span>-</span>
          <span>Павильон</span>
          </span>
          <span class="message-container">
          <span>-</span>
          <span>Кафе с посадочными местами</span>
          </span>
        `,
      },
      {
        type: 'text',
        value: "Хотите получить подробное описание форматов и фин.модель франшизы?",
      },
    ],
    options: [
      createOption("Да", "yes", "contactOptions2"),
      createOption("Нет", "no", "responseChoice"),
    ],
  });

  addState({
    key: "support",
    messages: [
      {
        type: 'text',
        value: `
          У нас уже есть готовый алгоритм запуска бизнеса, который мы опробовали на наших филиалах. Вот что мы предлагаем франчайзи: 
          <br class="d-i-block"><br class="d-i-block">
          <span class="message-container">
          <span>-</span>
          <span>Помощь в поиске лучшего помещения и локации</span>
          </span>
          <span class="message-container">
          <span>-</span>
          <span>Рекомендации по формированию команды</span>
          </span>
          <span class="message-container">
          <span>-</span>
          <span>Обучение для вас и ваших сотрудников </span>
          </span>
          <span class="message-container">
          <span>-</span>
          <span>Тех.карты и фирменные рецепты напитков и блюд</span>
          </span>
          <span class="message-container">
          <span>-</span>
          <span>Поставки основных ингредиентов и брендированной упаковки</span>
          </span>
          <span class="message-container">
          <span>-</span>
          <span>Рекомендации по ведению эффективного маркетинга</span>
          </span>
          <span class="message-container">
          <span>-</span>
          <span>Проверенные рекламные инструменты</span>
          </span>
          <span class="message-container">
          <span>-</span>
          <span>Сопровождение после открытия</span>
          </span>
          <br class="d-i-block">
          На запуск всех процессов потребуется всего 1 месяц 👍
        `,
      },
      {
        type: 'text',
        value: "Хотите посмотреть, как будет выглядеть ваш бар? Мы можем направить фото или видео",
      },
    ],
    options: [
      createOption("Да", "yes", "contactOptions4"),
      createOption("Нет", "no", "responseChoice2"),
    ],
  });

  addState({
    key: "menu",
    messages: [
      {
        type: 'text',
        value: 'В наше меню входит много вариантов bubble-tea, мороженного и десертов. Средний чек одного клиента - от 1625 тенге, среднее количество заказов в день - от 106-ти🧋'
      },
      {
        type: 'text',
        value: 'Вот так выглядит наше меню:'
      },
      {
        type: 'swiper',
        value: [
          { src: "images/gallery-img-1.jpg" },
          { src: "images/gallery-img-1.jpg" },
          { src: "images/gallery-img-1.jpg" },
          { src: "images/gallery-img-1.jpg" },
          { src: "images/gallery-img-1.jpg" },
          { src: "images/gallery-img-1.jpg" },

        ],
      },
      {
        type: 'text',
        value: 'Мы передадим вам наши фирменные рецепты приготовления напитков и будем регулярно обновлять меню 🤩'
      },
      {
        type: 'text',
        value: 'Хотите получить подробную презентацию франшизы? Там мы более подробно описали нашу концепцию и прочее'
      },
    ],
    options: [
      createOption("Да", "yes", "contactOptions6"),
      createOption("Нет", "no", "responseChoice3"),
    ],
  });

  addState({
    key: "target",
    messages: [
      {
        type: 'text',
        value: 'Платежеспособные молодые люди от 16 до 30-ти лет 💁 <br><br> Свободные, жаждущие экспериментировать и пробовать что-то новое, предпочитают сладкие вкусы и уникальные или сезонные предложения🍓 <br><br> Бренд «TaiTea» уже известен во всех популярных сетях, поэтому вы быстро привлечете ваших клиентов! 😉',
      },
      {
        type: 'text',
        value: "Мы можем провести для вас бесплатную онлайн-консультацию и более подробно рассказать о нашем бренде, клиентах и прочем. Хотите?",
      },
    ],
    options: [
      createOption("Да", "yes", "contactOptions8"),
      createOption("Нет", "no", "questionFranchise5"),
    ],
  });

  addState({
    key: "map",
    messages: [
      {
        type: 'text',
        value: "Будем рады видеть вас в наших барах:",
      },
      {
        type: 'map',
      },
      {
        type: 'text',
        value: "Хотите узнать как будет выглядеть ваш бар «TaiTea»? Мы можем направить вам фото и видео",
      },
    ],
    options: [
      createOption("Да", "yes", "contactOptions9"),
      createOption("Нет", "no", "questionFranchise6"),
    ],
    optionsClass: 'response-options--1'
  });

  addState({
    key: "question",
    messages: [
      {
        type: 'text',
        value: "Что вас интересует?",
      },
    ],
    requiresInput: true,
    next: "contactOptions10",
  });

  addState({
    key: "contactOptions",
    messages: [
      {
        type: 'text',
        value: "Где мы можем с вами связаться?",
      },
    ],
    options: [
      createOption("Telegram", "telegram", "phone"),
      createOption("WhatsApp", "whatsapp", "phone"),
    ],
    optionsClass: 'response-options--2'
  });

  addState({
    key: "contactOptions2",
    messages: [
      {
        type: 'text',
        value: "Где мы можем с вами связаться?",
      },
    ],
    options: [
      createOption("Telegram", "telegram", "phone2"),
      createOption("WhatsApp", "whatsapp", "phone2"),
    ],
    optionsClass: 'response-options--2'
  });

  addState({
    key: "contactOptions3",
    messages: [
      {
        type: 'text',
        value: "Куда вам направить план?",
      },
    ],
    options: [
      createOption("Telegram", "telegram", "phone3"),
      createOption("WhatsApp", "whatsapp", "phone3"),
    ],
    optionsClass: 'response-options--2'
  });

  addState({
    key: "contactOptions4",
    messages: [
      {
        type: 'text',
        value: "Где мы можем связаться с вами?",
      },
    ],
    options: [
      createOption("Telegram", "telegram", "phone4"),
      createOption("WhatsApp", "whatsapp", "phone4"),
    ],
    optionsClass: 'response-options--2'
  });

  addState({
    key: "contactOptions5",
    messages: [
      {
        type: 'text',
        value: "Где мы можем связаться с вами?",
      },
    ],
    options: [
      createOption("Telegram", "telegram", "phone5"),
      createOption("WhatsApp", "whatsapp", "phone5"),
    ],
    optionsClass: 'response-options--2'
  });

  addState({
    key: "contactOptions6",
    messages: [
      {
        type: 'text',
        value: "Куда вам направить презентацию?",
      },
    ],
    options: [
      createOption("Telegram", "telegram", "phone6"),
      createOption("WhatsApp", "whatsapp", "phone6"),
    ],
    optionsClass: 'response-options--2'
  });

  addState({
    key: "contactOptions7",
    messages: [
      {
        type: 'text',
        value: "Куда вам направить план?",
      },
    ],
    options: [
      createOption("Telegram", "telegram", "phone7"),
      createOption("WhatsApp", "whatsapp", "phone7"),
    ],
    optionsClass: 'response-options--2'
  });

  addState({
    key: "contactOptions8",
    messages: [
      {
        type: 'text',
        value: "Где мы можем связаться с вами?",
      },
    ],
    options: [
      createOption("Telegram", "telegram", "phone8"),
      createOption("WhatsApp", "whatsapp", "phone8"),
    ],
    optionsClass: 'response-options--2'
  });

  addState({
    key: "contactOptions9",
    messages: [
      {
        type: 'text',
        value: "Где мы можем связаться с вами?",
      },
    ],
    options: [
      createOption("Telegram", "telegram", "phone9"),
      createOption("WhatsApp", "whatsapp", "phone9"),
    ],
    optionsClass: 'response-options--2'
  });

  addState({
    key: "contactOptions10",
    messages: [
      {
        type: 'text',
        value: "Мы передали ваш вопрос менеджеру и он уже готов связаться с вами, чтобы ответить на него лично. Где вам удобнее связаться?",
      },
    ],
    options: [
      createOption("Telegram", "telegram", "phone10"),
      createOption("WhatsApp", "whatsapp", "phone10"),
    ],
    optionsClass: 'response-options--2'
  });

  addState({
    key: "phone",
    messages: [
      {
        type: 'text',
        value: "Оставьте, пожалуйста, ваш номер телефона",
      },
    ],
    requiresInput: true,
    inputType: "phone",
    next: "name",
  });

  addState({
    key: "phone2",
    messages: [
      {
        type: 'text',
        value: "Оставьте, пожалуйста, ваш номер телефона",
      },
    ],
    requiresInput: true,
    inputType: "phone",
    next: "name2",
  });

  addState({
    key: "phone3",
    messages: [
      {
        type: 'text',
        value: "Оставьте, пожалуйста, ваш номер телефона",
      },
    ],
    requiresInput: true,
    inputType: "phone",
    next: "name3",
  });

  addState({
    key: "phone4",
    messages: [
      {
        type: 'text',
        value: "Оставьте, пожалуйста, ваш номер телефона",
      },
    ],
    requiresInput: true,
    inputType: "phone",
    next: "name4",
  });

  addState({
    key: "phone5",
    messages: [
      {
        type: 'text',
        value: "Оставьте, пожалуйста, ваш номер телефона",
      },
    ],
    requiresInput: true,
    inputType: "phone",
    next: "name5",
  });

  addState({
    key: "phone6",
    messages: [
      {
        type: 'text',
        value: "Оставьте, пожалуйста, ваш номер телефона",
      },
    ],
    requiresInput: true,
    inputType: "phone",
    next: "name6",
  });

  addState({
    key: "phone7",
    messages: [
      {
        type: 'text',
        value: "Оставьте, пожалуйста, ваш номер телефона",
      },
    ],
    requiresInput: true,
    inputType: "phone",
    next: "name7",
  });

  addState({
    key: "phone8",
    messages: [
      {
        type: 'text',
        value: "Оставьте, пожалуйста, ваш номер телефона",
      },
    ],
    requiresInput: true,
    inputType: "phone",
    next: "name8",
  });

  addState({
    key: "phone9",
    messages: [
      {
        type: 'text',
        value: "Оставьте, пожалуйста, ваш номер телефона",
      },
    ],
    requiresInput: true,
    inputType: "phone",
    next: "name9",
  });

  addState({
    key: "phone10",
    messages: [
      {
        type: 'text',
        value: "Оставьте ваш номер телефона 😉",
      },
    ],
    requiresInput: true,
    inputType: "phone",
    next: "responseChoice4",
  });

  addState({
    key: "name",
    messages: [
      {
        type: 'text',
        value: "Как мы можем к вам обращаться?",
      },
    ],
    requiresInput: true,
    inputType: "name",
    next: "end",
  });

  addState({
    key: "name2",
    messages: [
      {
        type: 'text',
        value: "Как мы можем к вам обращаться?",
      },
    ],
    requiresInput: true,
    inputType: "name",
    next: "end2",
  });

  addState({
    key: "name3",
    messages: [
      {
        type: 'text',
        value: "Как мы можем к вам обращаться?",
      },
    ],
    requiresInput: true,
    inputType: "name",
    next: "end3",
  });

  addState({
    key: "name4",
    messages: [
      {
        type: 'text',
        value: "Как мы можем к вам обращаться?",
      },
    ],
    requiresInput: true,
    inputType: "name",
    next: "end4",
  });

  addState({
    key: "name5",
    messages: [
      {
        type: 'text',
        value: "Как мы можем к вам обращаться?",
      },
    ],
    requiresInput: true,
    inputType: "name",
    next: "end5",
  });

  addState({
    key: "name6",
    messages: [
      {
        type: 'text',
        value: "Как мы можем к вам обращаться?",
      },
    ],
    requiresInput: true,
    inputType: "name",
    next: "end6",
  });

  addState({
    key: "name7",
    messages: [
      {
        type: 'text',
        value: "Как мы можем к вам обращаться?",
      },
    ],
    requiresInput: true,
    inputType: "name",
    next: "end7",
  });

  addState({
    key: "name8",
    messages: [
      {
        type: 'text',
        value: "Как мы можем к вам обращаться?",
      },
    ],
    requiresInput: true,
    inputType: "name",
    next: "end8",
  });

  addState({
    key: "name9",
    messages: [
      {
        type: 'text',
        value: "Как мы можем к вам обращаться?",
      },
    ],
    requiresInput: true,
    inputType: "name",
    next: "end9",
  });

  addState({
    key: "name10",
    messages: [
      {
        type: 'text',
        value: "Как мы можем к вам обращаться?",
      },
    ],
    requiresInput: true,
    inputType: "name",
    next: "end10",
  });

  addState({
    key: "city",
    messages: [
      {
        type: 'text',
        value: "В каком городе вы проживаете?",
      },
    ],
    requiresInput: true,
    inputType: "city",
    next: "contactOptions",
  });

  addState({
    key: "end",
    showStatus: true,
    messages: [
      {
        type: 'text',
        value: "Спасибо! Наш менеджер скоро свяжется с вами!",
      },
    ],
    actionRedirect: true,
  });

  addState({
    key: "end2",
    showStatus: true,
    messages: [
      {
        type: 'text',
        value: "Спасибо! Наш менеджер скоро свяжется с вами!",
      },
    ],
    actionRedirect: true,
  });

  addState({
    key: "end3",
    showStatus: true,
    messages: [
      {
        type: 'text',
        value: "Спасибо! Наш менеджер скоро свяжется с вами!",
      },
    ],
    actionRedirect: true,
  });

  addState({
    key: "end4",
    showStatus: true,
    messages: [
      {
        type: 'text',
        value: "Спасибо! Наш менеджер скоро свяжется с вами!",
      },
    ],
    actionRedirect: true,
  });

  addState({
    key: "end5",
    showStatus: true,
    messages: [
      {
        type: 'text',
        value: "Спасибо! Наш менеджер скоро свяжется с вами!",
      },
    ],
    actionRedirect: true,
  });

  addState({
    key: "end6",
    showStatus: true,
    messages: [
      {
        type: 'text',
        value: "Спасибо! Наш менеджер скоро свяжется с вами!",
      },
    ],
    actionRedirect: true,
  });

  addState({
    key: "end7",
    showStatus: true,
    messages: [
      {
        type: 'text',
        value: "Спасибо! Наш менеджер скоро свяжется с вами!",
      },
    ],
    actionRedirect: true,
  });

  addState({
    key: "end8",
    showStatus: true,
    messages: [
      {
        type: 'text',
        value: "Спасибо! Наш менеджер скоро свяжется с вами!",
      },
    ],
    actionRedirect: true,
  });

  addState({
    key: "end9",
    showStatus: true,
    messages: [
      {
        type: 'text',
        value: "Спасибо! Наш менеджер скоро свяжется с вами!",
      },
    ],
    actionRedirect: true,
  });

  addState({
    key: "end10",
    showStatus: true,
    messages: [
      {
        type: 'text',
        value: "Спасибо! Скоро мы свяжемся с вами😉",
      },
    ],
    actionRedirect: true,
  });

  addState({
    key: "responseChoice",
    messages: [
      {
        type: 'text',
        value: "Может вы хотите получить подробный план запуска бизнеса?",
      },
    ],
    options: [
      createOption("Да", "yes", "contactOptions3"),
      createOption("Нет", "no", "questionFranchise2"),
    ],
    optionsClass: 'response-options--1'
  });

  addState({
    key: "responseChoice2",
    messages: [
      {
        type: 'text',
        value: "Может вы хотите получить подробную презентацию нашего бизнеса?",
      },
    ],
    options: [
      createOption("Да", "yes", "contactOptions5"),
      createOption("Нет", "no", "questionFranchise3"),
    ],
    optionsClass: 'response-options--1'
  });

  addState({
    key: "responseChoice3",
    messages: [
      {
        type: 'text',
        value: "Может вы хотите получить подробный план запуска бизнеса?",
      },
    ],
    options: [
      createOption("Да", "yes", "contactOptions7"),
      createOption("Нет", "no", "questionFranchise4"),
    ],
    optionsClass: 'response-options--1'
  });

  addState({
    key: "responseChoice4",
    messages: [
      {
        type: 'text',
        value: "Вам лучше позвонить или написать?",
      },
    ],
    options: [
      createOption("Позвонить", "call", "name10"),
      createOption("Написать", "write", "name10"),
    ],
  });

  addState({
    key: "questionFranchise",
    messages: [
      {
        type: 'text',
        value: "Может вас заинтересуют другие вопросы о работе франшизы?",
      },
    ],
    options: [
      createOption("Какие инвестиции потребуются для старта?", "investment", "investment"),
      createOption("Какую поддержку вы окажете на старте бизнеса?", "support", "support"),
      createOption("Какое у вас меню?", "menu", "menu"),
      createOption("Кто ваша целевая аудитория?", "target", "target"),
      createOption("Хочу посмотреть где вы находитесь", "map", "map"),
      createOption("Хочу задать свой вопрос", "question", "question"),
    ],
    optionsClass: 'response-options--main'
  });

  addState({
    key: "questionFranchise2",
    messages: [
      {
        type: 'text',
        value: "Может вас заинтересуют другие вопросы о работе франшизы?",
      },
    ],
    options: [
      createOption("Могу я открыть «TaiTea» без опыта в бизнесе?", "about", "about"),
      createOption("Какую поддержку вы окажете на старте бизнеса?", "support", "support"),
      createOption("Какое у вас меню?", "menu", "menu"),
      createOption("Кто ваша целевая аудитория?", "target", "target"),
      createOption("Хочу посмотреть где вы находитесь", "map", "map"),
      createOption("Хочу задать свой вопрос", "question", "question"),
    ],
    optionsClass: 'response-options--main'
  });

  addState({
    key: "questionFranchise3",
    messages: [
      {
        type: 'text',
        value: "Может вас заинтересуют другие вопросы о работе франшизы?",
      },
    ],
    options: [
      createOption("Могу я открыть «TaiTea» без опыта в бизнесе?", "about", "about"),
      createOption("Какие инвестиции потребуются для старта?", "investment", "investment"),
      createOption("Какое у вас меню?", "menu", "menu"),
      createOption("Кто ваша целевая аудитория?", "target", "target"),
      createOption("Хочу посмотреть где вы находитесь", "map", "map"),
      createOption("Хочу задать свой вопрос", "question", "question"),
    ],
    optionsClass: 'response-options--main'
  });

  addState({
    key: "questionFranchise4",
    messages: [
      {
        type: 'text',
        value: "Может вас заинтересуют другие вопросы о работе франшизы?",
      },
    ],
    options: [
      createOption("Могу я открыть «TaiTea» без опыта в бизнесе?", "about", "about"),
      createOption("Какие инвестиции потребуются для старта?", "investment", "investment"),
      createOption("Какую поддержку вы окажете на старте бизнеса?", "support", "support"),
      createOption("Кто ваша целевая аудитория?", "target", "target"),
      createOption("Хочу посмотреть где вы находитесь", "map", "map"),
      createOption("Хочу задать свой вопрос", "question", "question"),
    ],
    optionsClass: 'response-options--main'
  });

  addState({
    key: "questionFranchise5",
    messages: [
      {
        type: 'text',
        value: "Может вас заинтересуют другие вопросы о работе франшизы?",
      },
    ],
    options: [
      createOption("Могу я открыть «TaiTea» без опыта в бизнесе?", "about", "about"),
      createOption("Какие инвестиции потребуются для старта?", "investment", "investment"),
      createOption("Какую поддержку вы окажете на старте бизнеса?", "support", "support"),
      createOption("Какое у вас меню?", "menu", "menu"),
      createOption("Хочу посмотреть где вы находитесь", "map", "map"),
      createOption("Хочу задать свой вопрос", "question", "question"),
    ],
    optionsClass: 'response-options--main'
  });

  addState({
    key: "questionFranchise6",
    messages: [
      {
        type: 'text',
        value: "Может вас заинтересуют другие вопросы о работе франшизы?",
      },
    ],
    options: [
      createOption("Могу я открыть «TaiTea» без опыта в бизнесе?", "about", "about"),
      createOption("Какие инвестиции потребуются для старта?", "investment", "investment"),
      createOption("Какую поддержку вы окажете на старте бизнеса?", "support", "support"),
      createOption("Какое у вас меню?", "menu", "menu"),
      createOption("Хочу посмотреть где вы находитесь", "map", "map"),
      createOption("Хочу задать свой вопрос", "question", "question"),
    ],
    optionsClass: 'response-options--main'
  });

  return states;
})();
