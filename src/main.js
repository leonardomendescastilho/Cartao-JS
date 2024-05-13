import './css/index.css';
import IMask, { MaskedRange } from 'imask';

const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img');
const cardHolder = document.querySelector('#card-holder');
const cardNumber = document.querySelector('#card-number');
const expirationDate = document.querySelector('#expiration-date');
const securityCode = document.querySelector('#security-code');
const addBtn = document.querySelector('#add-card');
const ccBgColor01 = document.querySelector(
  '.cc-bg svg > g g:nth-child(1) path'
);
const ccBgColor02 = document.querySelector(
  '.cc-bg svg > g g:nth-child(2) path'
);

const cardNumberPattern = {
  mask: [
    {
      mask: '0000 0000 0000 0000',
      regex: /^4\d{0,15}/,
      cardType: 'visa',
    },
    {
      mask: '0000 0000 0000 0000',
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: 'mastercard',
    },
    {
      mask: '0000 0000 0000 0000',
      cardType: 'default',
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, '');
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex);
    });
    return foundMask;
  },
};
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

const expirationDatePattern = {
  mask: 'MM{/}YY',
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },

    YY: {
      mask: MaskedRange,
      from: new Date().getFullYear() % 100,
      to: (new Date().getFullYear() % 100) + 10,
    },
  },
};
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

const securityCodePattern = {
  mask: '0000',
};
const securityCodeMasked = IMask(securityCode, securityCodePattern);

function setCardType(type) {
  const colors = {
    visa: ['#436D99', '#2D57F2'],
    mastercard: ['#C69347', '#DF6F29'],
    default: ['black', 'gray'],
  };

  ccBgColor01.setAttribute('fill', colors[type][0]);
  ccBgColor02.setAttribute('fill', colors[type][1]);
  ccLogo.setAttribute('src', `/cc-${type}.svg`);
}

addBtn.addEventListener('click', () => {
  if (
    cardNumber.value === '' ||
    cardHolder.value === '' ||
    expirationDate.value === 0 ||
    securityCode.value === ''
  ) {
    alert('Por favor, preencha todo formulário.');
  } else {
    alert('Parabéns! Cartão Adicionado.');
  }
});

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
});


cardHolder.addEventListener('input', () => {
  const cardHolderValue = cardHolder.value;
  const onlyLettersRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]*$/
  if (!onlyLettersRegex.test(cardHolderValue)) {
    alert('Atenção! Nome do titular conter apenas letras.');
    cardHolder.value = '';
  }
  const ccHolder = document.querySelector('.cc-holder .value');
  ccHolder.innerHTML =
    cardHolder.value.length === 0 ? 'FULANO DA SILVA' : cardHolder.value;
});

cardNumberMasked.on('accept', () => {
  const ccNumber = document.querySelector('.cc-info .cc-number');
  const cardType = cardNumberMasked.masked.currentMask.cardType;
  setCardType(cardType);
  ccNumber.innerText =
    cardNumberMasked.value.length === 0
      ? '1234 5678 9012 3456'
      : cardNumberMasked.value;
});

expirationDateMasked.on('accept', () => {
  const ccExpiration = document.querySelector('.cc-expiration .value');

  ccExpiration.innerText =
    expirationDateMasked.value.length === 0
      ? '02/32'
      : expirationDateMasked.value;
});

securityCodeMasked.on('accept', () => {
  const ccSecurityCode = document.querySelector('.cc-security .value');

  ccSecurityCode.innerText =
    securityCodeMasked.value.length === 0 ? '123' : securityCodeMasked.value;
});
