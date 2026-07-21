/* Марафон «Карьера» — сбор заявок и оплат в одну Google-таблицу.

   Этот файл НЕ участвует в работе сайта: его нужно скопировать
   в редактор Apps Script внутри таблицы. Инструкция — в README.md.

   Скрипт принимает два разных потока:
     • заявка с лендинга      → лист «Заявки»
     • уведомление от ЮKassa  → лист «Оплаты»

   Токен бота и секретное слово живут здесь, на серверах Google,
   и в браузер посетителя не попадают. */

const TELEGRAM_TOKEN = '';    // от @BotFather, вида 8123456789:AAF...
const TELEGRAM_CHAT_ID = '';  // от @userinfobot, или id общего чата

/* Секретное слово для уведомлений ЮKassa. Придумай любую длинную строку
   без пробелов. Адрес скрипта виден всем в коде лендинга, поэтому без
   этой проверки кто угодно смог бы записать выдуманную оплату. */
const WEBHOOK_KEY = '';

const LEADS = 'Заявки';
const PAYMENTS = 'Оплаты';

/* ============ приём данных ============ */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // уведомления ЮKassa приходят с ключом в адресе, заявки — без него
    if (e.parameter && e.parameter.key) {
      if (e.parameter.key !== WEBHOOK_KEY) {
        console.warn('Отклонено: неверный ключ');
        return json({ ok: false });
      }
      return handlePayment(data);
    }

    return handleLead(data);
  } catch (err) {
    console.error(err, e && e.postData && e.postData.contents);
    return json({ ok: false, error: String(err) });
  }
}

/* ============ заявка с лендинга ============ */

function handleLead(data) {
  const name = clean(data.name);
  const telegram = clean(data.telegram);
  const tariff = clean(data.tariff);

  if (!name || !telegram) return json({ ok: false, error: 'пустые поля' });

  sheet(LEADS, ['Дата', 'Имя', 'Telegram', 'Тариф', 'Оплата', 'Страница'])
    .appendRow([new Date(), name, telegram, tariff, '', clean(data.page)]);

  notify('Новая заявка\n\nИмя: ' + name + '\nTelegram: ' + telegram + '\nТариф: ' + (tariff || '—'));

  return json({ ok: true });
}

/* ============ уведомление об оплате ============ */

function handlePayment(data) {
  const event = String(data.event || '');
  const o = data.object || {};

  // интересуют только успешные платежи и возвраты
  if (event !== 'payment.succeeded' && event !== 'refund.succeeded') {
    return json({ ok: true, skipped: event });
  }

  const id = clean(o.id);
  const sh = sheet(PAYMENTS, ['Дата', 'Событие', 'Сумма', 'Описание', 'Плательщик', 'Метка', 'ID платежа']);

  /* ЮKassa повторяет уведомление, пока не получит ответ, поэтому
     одно и то же событие может прийти несколько раз. */
  if (id && alreadySaved(sh, id)) return json({ ok: true, duplicate: true });

  const amount = o.amount ? o.amount.value + ' ' + o.amount.currency : '';
  const description = clean(o.description);
  const payer = payerOf(o);

  // телеграм-ник, если его удалось передать в платёж
  const tag = findTelegram([description, JSON.stringify(o.metadata || {})].join(' '));

  sh.appendRow([new Date(), event, amount, description, payer, tag, id]);

  const matched = tag ? markPaid(tag, event) : false;
  const refund = event === 'refund.succeeded';

  notify(
    (refund ? 'Возврат' : 'Оплата') + '\n\n' +
      'Сумма: ' + amount + '\n' +
      (description ? 'Назначение: ' + description + '\n' : '') +
      (payer ? 'Плательщик: ' + payer + '\n' : '') +
      (tag ? 'Telegram: ' + tag + (matched ? ' — заявка найдена' : ' — заявки нет') : 'Заявку нужно сопоставить вручную')
  );

  return json({ ok: true });
}

/* Проставляет отметку об оплате в строке заявки с этим ником. */
function markPaid(tag, event) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LEADS);
  if (!sh || sh.getLastRow() < 2) return false;

  const rows = sh.getRange(2, 3, sh.getLastRow() - 1, 1).getValues(); // колонка Telegram
  const want = tag.toLowerCase();
  const mark = event === 'refund.succeeded' ? 'возврат' : 'оплачено';

  for (let i = rows.length - 1; i >= 0; i--) {
    if (String(rows[i][0]).trim().toLowerCase() === want) {
      sh.getRange(i + 2, 5).setValue(mark); // колонка «Оплата»
      return true;
    }
  }
  return false;
}

/* ============ мелочи ============ */

function clean(v) {
  return String(v == null ? '' : v).trim().slice(0, 300);
}

function findTelegram(text) {
  const m = String(text).match(/@[A-Za-z0-9_]{3,}/);
  return m ? m[0] : '';
}

function payerOf(o) {
  if (o.payer_email) return clean(o.payer_email);
  const pm = o.payment_method || {};
  if (pm.card && pm.card.last4) return '•••• ' + pm.card.last4;
  if (pm.account_number) return clean(pm.account_number);
  return '';
}

function alreadySaved(sh, id) {
  if (sh.getLastRow() < 2) return false;
  const ids = sh.getRange(2, 7, sh.getLastRow() - 1, 1).getValues(); // колонка ID
  return ids.some((r) => String(r[0]) === id);
}

/* Возвращает лист с нужными заголовками, создавая его при первом обращении. */
function sheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);

  if (!sh) {
    sh = ss.insertSheet(name);
  }
  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function notify(text) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) return;

  // muteHttpExceptions — упавший телеграм не должен ронять запись в таблицу
  UrlFetchApp.fetch('https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/sendMessage', {
    method: 'post',
    payload: { chat_id: TELEGRAM_CHAT_ID, text: text },
    muteHttpExceptions: true,
  });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/* ============ проверка настройки ============ */

/* Запусти вручную кнопкой «Выполнить», выбрав эту функцию:
   создаст оба листа и пришлёт тестовое сообщение в Telegram. */
function setup() {
  sheet(LEADS, ['Дата', 'Имя', 'Telegram', 'Тариф', 'Оплата', 'Страница']);
  sheet(PAYMENTS, ['Дата', 'Событие', 'Сумма', 'Описание', 'Плательщик', 'Метка', 'ID платежа']);

  if (!WEBHOOK_KEY) {
    console.warn('WEBHOOK_KEY пустой — уведомления от ЮKassa принимать нельзя');
  }
  notify('Проверка связи: таблица марафона на месте');
}
