// Хранение данных
const chatHistory = [];

const chatContent = document.getElementById("chatContent");
const typingIndicator = document.getElementById("typingIndicator");
const botNotificationSound = new Audio('audio/ringtone.mp3');
const muteIcon = document.getElementById('muteIcon');
const muteText = document.getElementById('muteText');

let lastOptions = null;
let isBotBusy = false;
let allowedScroll = false;
let botMessageCount = 0;
let swiperInstance = null;
let currentVideoKey = null;
let isMuted = true;
let muteTextTimeout;
let isInitialInteraction = true;
let lastBotMessage = null;

$(document).one("click", ".response-options button", function() {
  allowedScroll = true
});

document.addEventListener("click", function initialInteractionHandler() {
  if (isInitialInteraction) {
    const videos = document.querySelectorAll('#videoContainer video');
    videos.forEach(video => {
      video.muted = false;
      video.play();
    });
    isMuted = false;
    if (muteIcon) muteIcon.src = 'images/unmute.svg';

    if (muteText) muteText.classList.remove('visible');

    isInitialInteraction = false;
    document.removeEventListener("click", initialInteractionHandler);
  }
});

function toggleMute() {
  isMuted = !isMuted;
  const videos = document.querySelectorAll('#videoContainer video');

  videos.forEach(video => {
    video.muted = isMuted;
  });

  if (muteIcon) muteIcon.src = isMuted ? 'images/mute.svg' : 'images/unmute.svg';

  clearTimeout(muteTextTimeout);

  if (muteText) {
    if (isMuted) {
      muteTextTimeout = setTimeout(() => {
        muteText.classList.add('visible');
      }, 3000);
    } else {
      muteText.classList.remove('visible');
    }
  }
}

function initializeMuteText() {
  if (muteText) {
    if (isMuted) {
      muteTextTimeout = setTimeout(() => {
        muteText.classList.add('visible');
      }, 3000);
    } else {
      muteText.classList.remove('visible');
    }
  }
}

function animateVideoOpacity(videoElement, fromOpacity, toOpacity, onBegin = null, onComplete = null) {
  anime({
    targets: videoElement,
    opacity: [fromOpacity, toOpacity],
    duration: 600,
    easing: 'easeInOutElastic(1, 0.5)',
    begin: onBegin,
    complete: onComplete,
  });
}

function createBaseVideoElement(videoPath, isMuted, key = null) {
  const videoElement = document.createElement('video');
  videoElement.src = videoPath;
  videoElement.preload = 'auto';
  videoElement.muted = isMuted;
  videoElement.controls = false;
  videoElement.className = 'chat-video';
  videoElement.style.width = '100%';
  videoElement.style.opacity = '0';
  if (key) {
    videoElement.setAttribute('data-key', key);
  }
  return videoElement;
}

function addVideoWithAnimation(container, videoPath, isMuted, key = null) {
  const videoElement = createBaseVideoElement(videoPath, isMuted, key);
  container.appendChild(videoElement);

  videoElement.addEventListener('loadeddata', () => {
    animateVideoOpacity(videoElement, 0, 1, () => videoElement.play());
  });

  return videoElement;
}

function preloadInitialVideo(videoPath, isMuted) {
  const videoContainer = document.getElementById("videoContainer");
  addVideoWithAnimation(videoContainer, videoPath, isMuted);
}

function playMessageVideo(key) {
  const state = chatScenario[key];
  if (!state || !state.video) return;

  const videoContainer = document.getElementById("videoContainer");
  const existingVideo = videoContainer.querySelector(`video[data-key="${key}"]`);
  const preloadedVideo = videoContainer.querySelector('video:not([data-key])');
  const currentVideo = videoContainer.querySelector('video[data-key]');

  if (currentVideoKey === key && existingVideo && existingVideo.style.opacity === "1") {
    return;
  }

  const isFirstVideo = currentVideoKey === null;
  currentVideoKey = key;

  if (currentVideo && currentVideo !== existingVideo) {
    animateVideoOpacity(currentVideo, 1, 0, null, () => currentVideo.remove());
  }

  if (existingVideo) {
    existingVideo.muted = isMuted;
    animateVideoOpacity(existingVideo, 0, 1, () => existingVideo.play());
  } 
  else if (preloadedVideo) {
    preloadedVideo.setAttribute('data-key', key);
    preloadedVideo.muted = isMuted;

    if (isFirstVideo) {
      preloadedVideo.style.opacity = "1";
      preloadedVideo.play();
    } else {
      animateVideoOpacity(preloadedVideo, 0, 1, () => preloadedVideo.play());
    }
  } 
  else {
    const newVideo = addVideoWithAnimation(videoContainer, state.video, isMuted, key);
    newVideo.muted = isMuted;
  }
}

function animateFadeIn(element) {
  anime({
    targets: element,
    opacity: [0, 1],
    translateY: [10, 0],
    duration: 600,
    easing: "easeOutQuad",
  });
}

function smoothScrollToBottom() {
  if (!allowedScroll) {
    return
  }

  anime({
    targets: [document.documentElement, document.body],
    scrollTop: chatContent.scrollHeight + 40,
    duration: 800,
    easing: "easeInOutQuad",
  });
}

function displayStatus(status) {
  const statusContainer = document.querySelector('#status');
  
  if (statusContainer) {
    if (status) {

      statusContainer.style.display = 'block';
      anime({
        targets: statusContainer,
        opacity: [0, 1],
        translateY: [8, 0],
        duration: 800,
        easing: 'easeOutQuad',
      });
    } else {
      statusContainer.style.display = 'none';
    }
  }
}

function clearOptions() {
  if (lastOptions) {
    lastOptions.remove();
    lastOptions = null;
  }
}

function appendMessage({ text, value, key, isUser, skipScroll }) {
  const message = document.createElement("div");
  message.className = `message ${isUser ? "user-message" : "bot-message"}`;
  message.innerHTML = `<p>${text}</p>`;
  chatContent.appendChild(message);

  chatHistory.push({
    sender: isUser ? "user" : "bot",
    key: key,
    message: value || text,
    timestamp: new Date().toISOString(),
  });

  animateFadeIn(message);
  if (!isUser) {
    lastBotMessage = message;
  }
  if (!skipScroll) smoothScrollToBottom();

  return message;
}

function showTypingIndicator(delay) {

  anime({
    targets: typingIndicator,
    opacity: 1,
    duration: 400,
    translateX: [-2, 0],
    easing: 'easeInOutQuad',
    begin: () => {
      if (typingIndicator) {
        typingIndicator.style.display = 'block';
      }
    },
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      anime({
        targets: typingIndicator,
        opacity: 0,
        duration: 200,
        translateX: [0, 0],
        easing: 'easeInOutQuad',
        complete: () => {
          if (typingIndicator) {
            typingIndicator.style.display = 'none';
          }
          resolve()
          },
        });
    }, delay)
  })
}

async function appendBotMessageWithDelay(message, key) {
  const delayMap = {
    'text': message.value ? Math.min(message.value.length * 0, 4000) : 0,
    'swiper': 2000,
    'map': 1000,
  }

  isBotBusy = true;

  await showTypingIndicator(delayMap[message.type] || 0)

  botNotificationSound.play();

  playMessageVideo(key);

  switch(message.type) {
    case 'text':
      appendMessage({ text: message.value, key: key });
      break;
    case 'swiper':
      renderSwiper(message.value);
      break;
    case 'options':
      renderOptions(key, message.value);
      break;
    case 'map':
      renderMap();
      break;
  }

  isBotBusy = false;
}

function renderMap() {
  const mapContainer = document.createElement("div");
  mapContainer.id = "yandexMap";
  mapContainer.className = "map-chat";
  chatContent.appendChild(mapContainer);
  animateFadeIn(mapContainer);
  smoothScrollToBottom();

  const script = document.createElement("script");
  script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
  script.onload = () => {
    ymaps.ready(initMap);
  };
  document.head.appendChild(script);
}

function initMap() {
  const map = new ymaps.Map("yandexMap", {
    center: [51.128201, 71.430429],
    zoom: 5,
  });

  const locations = [
    {
      coords: [51.160223, 71.482963],
      name: "ТРЦ Аружан"
    },
    {
      coords: [51.132644, 71.366819],
      name: "ТЦ TUMAR"
    },
    {
      coords: [50.289072, 57.193271],
      name: "ТРЦ KeruenCity"
    },
    {
      coords: [51.140346, 71.465973],
      name: "ТРЦ Astana Mall"
    },
    {
      coords: [51.161743, 71.422802],
      name: "ул. А.Мамбетова 1а"
    },
    {
      coords: [51.157608, 71.427357],
      name: "ул.Республика 3/2"
    },
  ];
  locations.forEach((location) => {
    const placemark = new ymaps.Placemark(location.coords, {
      balloonContent: location.name,
    });
    map.geoObjects.add(placemark);
  });
}

function renderOptions(key, options) {
  clearOptions();

  const state = chatScenario[key];
  const responseContainer = document.createElement("div");

  responseContainer.className = "response-options" + (state.optionsClass ? ` ${state.optionsClass}` : "");

  options.forEach(({ label, value, next, url }) => {
    const button = document.createElement("button");
    button.type = 'button';
    button.innerHTML = label;
    button.onclick = () => {
      if (isBotBusy) return;
      appendMessage({ text: label, value: value, key: key, isUser: true });

      if (/^questionFranchise\d*$/.test(key) && lastBotMessage) {
        lastBotMessage.remove();
        lastBotMessage = null;
      }

      clearOptions();

      if (url) {
        window.open(url, '_blank');
      }

      if (next) {
        processChatState(next);
      }
    };
    responseContainer.appendChild(button);
  });

  chatContent.appendChild(responseContainer);
  animateFadeIn(responseContainer);
  smoothScrollToBottom();
  lastOptions = responseContainer;
}

function renderSwiper(swiperItems) {
  const itemsTemplate = swiperItems.map(({src, numVideo }) => `
    <div class="swiper-slide">
      <div class="card-swiper">
        <img class="tap-color" src="${src}" alt="${src.split('/').pop()}" />
      </div>
    </div>
  `);

  const template = `
    <div class="swiper-container swiper-chat">
      <div class="swiper-wrapper">
        ${itemsTemplate.join('')}
      </div>
      <div class="gallery-pagination swiper-bullets"></div>
    </div>
  `;

  const element = new DOMParser()
    .parseFromString(template, "text/html")
    .body
    .firstElementChild;

  chatContent.appendChild(element);
  animateFadeIn(element);
  smoothScrollToBottom();

  new Swiper(element, {
    speed: 450,
    effect: 'slide',
    rewind: true,
    grabCursor: true,
    pagination: {
      el: '.gallery-pagination',
      clickable: true,
    },
    breakpoints: {
      200: { spaceBetween: 10, slidesPerView: 1 },
      768: { spaceBetween: 10, slidesPerView: 2 },
      1024: { spaceBetween: 10, slidesPerView: 2 },
      1400: { spaceBetween: 10, slidesPerView: 2 },
    },
  });
}

function createAgreementBlock() {
  const agreementBlock = document.createElement("div");
  agreementBlock.className = "agree";
  agreementBlock.innerHTML = `
    <label class="agree__label tap-color">
      <input type="checkbox" name="agree" class="agree__checkbox" required>
      <span class="agree__custom"></span>
      <span>Я принимаю условия 
        <a href="#" data-remodal-target="privacy" class="agree-link">Политики конфиденциальности</a>
      </span>
    </label>
  `;
  return agreementBlock;
}

function renderTextInput(key, callback) {
  const inputContainer = document.createElement("div");
  inputContainer.className = "textarea-container";

  const form = document.createElement("form");
  form.className = "dynamic-form";
  form.noValidate = true;

  const formBox = document.createElement("div");
  formBox.className = "dynamic-form__box";

  const textarea = document.createElement("textarea");
  textarea.name = "question";
  textarea.className = "input__field input__field--textarea";
  textarea.placeholder = "Ваше сообщение...";

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.className = "btn";
  submitButton.textContent = "Отправить";

  formBox.appendChild(textarea);
  formBox.appendChild(submitButton);

  form.appendChild(formBox);
  // form.appendChild(createAgreementBlock());

  inputContainer.appendChild(form);
  chatContent.appendChild(inputContainer);

  animateFadeIn(inputContainer);
  smoothScrollToBottom();
  lastOptions = inputContainer;

  $(form).validate({
    errorPlacement: function (error, element) {
      if (element.attr("name") === "agree") {
        error.addClass('error--privacy');
        error.appendTo(element.closest('.agree'));
      }
    },
    rules: {
      question: {
        required: true,
      },
      agree: {
        required: true,
      },
    },
    messages: {
      agree: 'Подтвердите согласие с политикой конфиденциальности',
    },
    submitHandler: function () {
      const userInput = textarea.value.trim();
      appendMessage({ text: userInput, key: key, isUser: true });
      inputContainer.remove();
      if (callback) callback(userInput);
    },
  });
}

function renderPhoneInput(key, callback) {
  const inputContainer = document.createElement("div");

  const form = document.createElement("form");
  form.className = "dynamic-form";
  form.noValidate = true;

  const formBox = document.createElement("div");
  formBox.className = "dynamic-form__box";

  const inputField = document.createElement("input");
  inputField.type = "tel";
  inputField.name = "phone";
  inputField.placeholder = "Ваш телефон";
  inputField.className = "input__field";
  inputField.autocomplete = "off";

  Inputmask({ mask: "+7 (999) 999 9999", showMaskOnHover: false }).mask(inputField);

  const submitButton = document.createElement("button");
  submitButton.className = "btn";
  submitButton.type = "submit";
  submitButton.textContent = "Отправить";

  formBox.appendChild(inputField);
  formBox.appendChild(submitButton);

  form.appendChild(formBox);
  form.appendChild(createAgreementBlock());

  inputContainer.appendChild(form);
  chatContent.appendChild(inputContainer);

  animateFadeIn(inputContainer);
  smoothScrollToBottom();
  lastOptions = inputContainer;

  $(form).validate({
    errorPlacement: function (error, element) {
      if (element.attr("name") === "agree") {
        error.addClass('error--privacy');
        error.appendTo(element.closest('.agree'));
      }
    },
    rules: {
      phone: {
        required: true,
        phone: true,
      },
      agree: {
        required: true,
      },
    },
    messages: {
      agree: 'Подтвердите согласие с политикой конфиденциальности',
    },
    submitHandler: function () {
      const phoneNumber = inputField.value.trim();
      appendMessage({ text: phoneNumber, key: key, isUser: true });
      inputContainer.remove();
      if (callback) callback(phoneNumber);
    },
  });
}

function renderModelInput(key, callback) {
  const inputContainer = document.createElement("div");

  const form = document.createElement("form");
  form.className = "dynamic-form";
  form.noValidate = true;

  const formBox = document.createElement("div");
  formBox.className = "dynamic-form__box";

  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.name = "model";
  inputField.placeholder = "Ваш ответ";
  inputField.className = "input__field";
  inputField.autocomplete = "off";

  const submitButton = document.createElement("button");
  submitButton.className = "btn";
  submitButton.type = "submit";
  submitButton.textContent = "Отправить";

  formBox.appendChild(inputField);
  formBox.appendChild(submitButton);

  form.appendChild(formBox);
  // form.appendChild(createAgreementBlock());

  inputContainer.appendChild(form);
  chatContent.appendChild(inputContainer);

  animateFadeIn(inputContainer);
  smoothScrollToBottom();
  lastOptions = inputContainer;

  $(form).validate({
    errorPlacement: function (error, element) {
      if (element.attr("name") === "agree") {
        error.addClass('error--privacy');
        error.appendTo(element.closest('.agree'));
      }
    },
    rules: {
      model: {
        required: true,
      },
      agree: {
        required: true,
      },
    },
    messages: {
      agree: 'Подтвердите согласие с политикой конфиденциальности',
    },
    submitHandler: function () {
      const userModel = inputField.value.trim();
      appendMessage({ text: userModel, key: key, isUser: true });
      inputContainer.remove();
      if (callback) callback(userModel);
    },
  });
}

function renderBudgetInput(key, callback) {
  const inputContainer = document.createElement("div");

  const form = document.createElement("form");
  form.className = "dynamic-form";
  form.noValidate = true;

  const formBox = document.createElement("div");
  formBox.className = "dynamic-form__box";

  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.name = "budget";
  inputField.placeholder = "Ваш ответ";
  inputField.className = "input__field";
  inputField.autocomplete = "off";

  $(inputField).on("input", function () {
    let value = $(this).val();
    $(this).val(value.replace(/[^0-9\- ]/g, ''));
  });

  const submitButton = document.createElement("button");
  submitButton.className = "btn";
  submitButton.type = "submit";
  submitButton.textContent = "Отправить";

  formBox.appendChild(inputField);
  formBox.appendChild(submitButton);

  form.appendChild(formBox);
  // form.appendChild(createAgreementBlock());

  inputContainer.appendChild(form);
  chatContent.appendChild(inputContainer);

  animateFadeIn(inputContainer);
  smoothScrollToBottom();
  lastOptions = inputContainer;

  $(form).validate({
    errorPlacement: function (error, element) {
      if (element.attr("name") === "agree") {
        error.addClass('error--privacy');
        error.appendTo(element.closest('.agree'));
      }
    },
    rules: {
      budget: {
        required: true,
      },
      agree: {
        required: true,
      },
    },
    messages: {
      agree: 'Подтвердите согласие с политикой конфиденциальности',
    },
    submitHandler: function () {
      const userBudget = inputField.value.trim();
      appendMessage({ text: userBudget, key: key, isUser: true });
      inputContainer.remove();
      if (callback) callback(userBudget);
    },
  });
}

function renderAlternativeInput(key, callback) {
  const inputContainer = document.createElement("div");

  const form = document.createElement("form");
  form.className = "dynamic-form";
  form.noValidate = true;

  const formBox = document.createElement("div");
  formBox.className = "dynamic-form__box";

  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.name = "alternative";
  inputField.placeholder = "Ваш ответ";
  inputField.className = "input__field";
  inputField.autocomplete = "off";

  const submitButton = document.createElement("button");
  submitButton.className = "btn";
  submitButton.type = "submit";
  submitButton.textContent = "Отправить";

  formBox.appendChild(inputField);
  formBox.appendChild(submitButton);

  form.appendChild(formBox);
  // form.appendChild(createAgreementBlock());

  inputContainer.appendChild(form);
  chatContent.appendChild(inputContainer);

  animateFadeIn(inputContainer);
  smoothScrollToBottom();
  lastOptions = inputContainer;

  $(form).validate({
    errorPlacement: function (error, element) {
      if (element.attr("name") === "agree") {
        error.addClass('error--privacy');
        error.appendTo(element.closest('.agree'));
      }
    },
    rules: {
      alternative: {
        required: true,
      },
      agree: {
        required: true,
      },
    },
    messages: {
      agree: 'Подтвердите согласие с политикой конфиденциальности',
    },
    submitHandler: function () {
      const userAlternative = inputField.value.trim();
      appendMessage({ text: userAlternative, key: key, isUser: true });
      inputContainer.remove();
      if (callback) callback(userAlternative);
    },
  });
}

function renderCityInput(key, callback) {
  const inputContainer = document.createElement("div");

  const form = document.createElement("form");
  form.className = "dynamic-form";
  form.noValidate = true;

  const formBox = document.createElement("div");
  formBox.className = "dynamic-form__box";

  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.name = "city";
  inputField.placeholder = "Ваш город";
  inputField.className = "input__field";
  inputField.autocomplete = "off";

  const submitButton = document.createElement("button");
  submitButton.className = "btn";
  submitButton.type = "submit";
  submitButton.textContent = "Отправить";

  formBox.appendChild(inputField);
  formBox.appendChild(submitButton);

  form.appendChild(formBox);
  // form.appendChild(createAgreementBlock());

  inputContainer.appendChild(form);
  chatContent.appendChild(inputContainer);

  animateFadeIn(inputContainer);
  smoothScrollToBottom();
  lastOptions = inputContainer;

  $(form).validate({
    errorPlacement: function (error, element) {
      if (element.attr("name") === "agree") {
        error.addClass('error--privacy');
        error.appendTo(element.closest('.agree'));
      }
    },
    rules: {
      city: {
        required: true,
      },
      agree: {
        required: true,
      },
    },
    messages: {
      agree: 'Подтвердите согласие с политикой конфиденциальности',
    },
    submitHandler: function () {
      const userCity = inputField.value.trim();
      appendMessage({ text: userCity, key: key, isUser: true });
      inputContainer.remove();
      if (callback) callback(userCity);
    },
  });
}

function renderNameInput(key, callback) {
  const inputContainer = document.createElement("div");

  const form = document.createElement("form");
  form.className = "dynamic-form";
  form.noValidate = true;

  const formBox = document.createElement("div");
  formBox.className = "dynamic-form__box";

  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.name = "name";
  inputField.placeholder = "Ваше имя";
  inputField.className = "input__field";
  inputField.autocomplete = "off";

  $(inputField).on("input", function () {
    let value = $(this).val();
    $(this).val(value.replace(/[^a-zA-Zа-яА-ЯёЁ ]/g, ''));
  });

  const submitButton = document.createElement("button");
  submitButton.className = "btn";
  submitButton.type = "submit";
  submitButton.textContent = "Отправить";

  formBox.appendChild(inputField);
  formBox.appendChild(submitButton);

  form.appendChild(formBox);
  // form.appendChild(createAgreementBlock());

  inputContainer.appendChild(form);
  chatContent.appendChild(inputContainer);

  animateFadeIn(inputContainer);
  smoothScrollToBottom();
  lastOptions = inputContainer;

  $(form).validate({
    errorPlacement: function (error, element) {
      if (element.attr("name") === "agree") {
        error.addClass('error--privacy');
        error.appendTo(element.closest('.agree'));
      }
    },
    rules: {
      name: {
        required: true,
      },
      agree: {
        required: true,
      },
    },
    messages: {
      agree: 'Подтвердите согласие с политикой конфиденциальности',
    },
    submitHandler: function () {
      const userName = inputField.value.trim();
      appendMessage({ text: userName, key: key, isUser: true });
      inputContainer.remove();
      if (callback) callback(userName);
    },
  });
}

async function processChatState(stateKey) {
  const state = chatScenario[stateKey];
  if (!state) return;

  const {
    messages = [],
    showStatus,
    options
  } = state;

  if (showStatus) {
    setTimeout(() => {
      displayStatus(true);
    }, 3000);
  } else {
    displayStatus(false);
  }

  let accumulatedDelay = 0;

  if (messages.length > 0) {
    for (let index = 0; index < messages.length; index++) {
      await appendBotMessageWithDelay(messages[index], stateKey);

      if (index === messages.length - 1) {
        await handleLastMessage(state);
      }
    }
  } else {
    await handleLastMessage(state);
  }

  if (!options || options.length === 0) {
    setTimeout(() => {
      isBotBusy = false;
    }, accumulatedDelay + 1000);
  }
}

async function handleLastMessage(state) {
  const {
    requiresInput,
    inputType,
    options,
    action,
    actionRedirect,
    next,
    key,
    optionsClass
  } = state;

  if (requiresInput) {
    const callback = () => {
      processChatState(next);
    };

    switch (inputType) {
      case "phone":
        renderPhoneInput(key, callback);
        break;
      case "name":
        renderNameInput(key, callback);
        break;
      case "city":
        renderCityInput(key, callback);
        break;
      case "model":
        renderModelInput(key, callback);
        break;
      case "budget":
        renderBudgetInput(key, callback);
        break;
      case "alternative":
        renderAlternativeInput(key, callback);
        break;
      default:
        renderTextInput(key, callback);
        break;
    }

  } else if (options && options.length > 0) {
    renderOptions(key, options, optionsClass);
  } else if (action) {
    action();
  }

  if (actionRedirect) {
    sendChatHistory();
    setTimeout(() => {
      window.location.href = 'thanks.html';
    }, 6000);
  }
}

function getUTMData() {
  return {
    phone: '',
    email: '',
    name: '',
    city: '',
    question: '',
    answer: '',
    brand: '',
    timezone: (-1 * new Date().getTimezoneOffset()) / 60,
    utm_medium: $.query.get('utm_medium') || '',
    utm_placement: $.query.get('utm_placement') || '',
    utm_source: $.query.get('utm_source') || '',
    utm_term: $.query.get('utm_term') || '',
    utm_content: $.query.get('utm_content') || '',
    utm_campaign: $.query.get('utm_campaign') || '',
    utm_campaign_name: $.query.get('utm_campaign_name') || '',
    device_type: $.query.get('device_type') || '',
    utm_region_name: $.query.get('utm_region_name') || '',
    utm_placement: $.query.get('utm_placement') || '',
    utm_description: $.query.get('utm_description') || '',
    utm_device: $.query.get('utm_device') || '',
    page_url: window.location.href,
    user_location_ip: '',
    yclid: $.query.get('yclid') || '',
  };
}

function getPayload(history) {
  const payloadMap = {
    questionFranchise: 'phone',
  };

  function filterHistory(item) {
    return item.sender === "user";
  }

  function reduceHistory(acc, item) {
    if (!item.key || !item.message) {
      return acc;
    }

    const normalizedKey = item.key.replace(/\d+$/, "");
    const payloadKey = payloadMap[normalizedKey] || normalizedKey;

    return { ...acc, [payloadKey]: item.message };
  }

  const chatData = history.filter(filterHistory).reduce(reduceHistory, {});
  const payload = {
    ...getUTMData(),
    ...chatData,
  };

  console.log("Сформированные данные для отправки:", payload);
  return payload;
}

function sendChatHistory() {
  const payload = getPayload(chatHistory);
  const formData = createFormData(payload);
  // const dataToSend = JSON.stringify({ chatHistory });

  function createFormData(data) {
    var formData = new FormData()
  
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value)
      }
    })

    return formData
  }

  $.ajax({
    url: 'php/formProcessor.php',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    dataType: 'json',
  })
}

document.addEventListener("DOMContentLoaded", () => {
  setInitialFeedbackStore();
  processChatState("start");
});
