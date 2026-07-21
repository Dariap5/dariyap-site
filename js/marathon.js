/* ============================================================
   Марафон «Карьера» — логика лендинга
   ============================================================ */

/* ⚠️ КУДА ПАДАЮТ ЗАЯВКИ — инструкция в README.md

   Заполненных адресов может быть один или два. Если заданы оба, заявка
   уходит в оба сразу, и хватит, чтобы сработал хотя бы один.
   Пока обе строки пустые, форма показывает «Готово!», но никуда не пишет. */

/* Письмо на почту через FormSubmit. Строка вместо самого адреса:
   всё отсюда видно посетителям сайта, а открытые адреса собирают спам-боты.

   ⚠️ FormSubmit активирует пару «почта + домен», а не почту вообще.
   С нового домена первая заявка НЕ придёт: вместо неё на почту упадёт
   письмо «Activate FormSubmit on …». Пока в нём не нажать кнопку,
   заявки с этого домена теряются. Поднимаешь лендинг на новом адресе —
   сначала отправь пробную заявку сам и активируй. */
const MAIL_ENDPOINT = 'https://formsubmit.co/ajax/4d834242d1d860d97e31cb423bfa9ffd';

// Необязательно: таблица + сообщение в Telegram (см. apps-script.gs)
const SHEET_ENDPOINT = '';   // https://script.google.com/macros/s/.../exec

/* Оплата через ЮKassa. Ссылки берутся в кабинете Даши: конструктор
   платёжных форм или «Оплата по ссылке» — там же, где shopId 1339878.
   Секретный ключ API сюда вставлять нельзя: он даёт полный доступ
   к деньгам магазина, а всё отсюда видно посетителям сайта.

   Ключи объекта — id переключателей тарифа в форме.
   Пока пусто, форма просто показывает «Готово!» без перехода к оплате. */
const PAY_LINKS = {
  't-month': '',   // 1 месяц — 2 800 ₽
  't-three': '',   // 3 месяца — 6 000 ₽
};

/* ============ данные ============ */

const OFFERS = {
  school:  'Трек школьника: за 4 недели — выбранная специальность, все пути поступления (ЕГЭ, олимпиады, льготы, колледж) и стратегия на год.',
  student: 'Трек студента: за 4 недели — выбранное направление, готовое резюме и 12+ откликов на стажировки и junior-позиции.',
};

const WEEK_ONE = {
  label: 'Неделя 1',
  title: 'Кто я и куда хочу',
  desc: 'Самоопределение и обзор направлений: что нравится, что получается и что будет востребовано через 5–10 лет. Промт «личный коуч» в помощь.',
  live: 'Эфир «Как я выбрала свою сферу» — личный опыт Даши',
  task: 'карта распаковки личности (+20 баллов)',
  result: 'карта распаковки личности',
};

const WEEKS = {
  school: [
    WEEK_ONE,
    {
      label: 'Неделя 2',
      title: 'Пути поступления',
      desc: 'ЕГЭ, перечневые олимпиады (БВИ и 100 баллов), льготы, колледж. И запасные варианты: ошибка не фатальна — есть gap year, пересдача и перевод.',
      live: 'Эфир про поступление — формат выбираем опросом в чате',
      task: 'карточка «моя специальность и путь поступления» (+20 баллов)',
      result: 'выбранная специальность и путь к ней',
    },
    {
      label: 'Неделя 3',
      title: 'Сообщества и практики',
      desc: 'Чемпионаты, конкурсы и сообщества по твоей теме: где искать, как участвовать и как собрать команду уже со школы.',
      live: 'Эфир про чемпионаты, каналы поиска и нетворкинг',
      task: 'найти 3 сообщества и задать вопрос практику (+25 баллов)',
      result: '3 сообщества + первый контакт с практиком',
    },
    {
      label: 'Неделя 4',
      title: 'Стратегия на год',
      desc: 'ОГЭ/ЕГЭ, олимпиады и чемпионаты — распределяем по календарю, чтобы год работал на поступление.',
      live: 'Эфир про стратегию + финальный эфир: итоги, топ рейтинга, награждение',
      task: 'стратегия на год (+30 баллов)',
      result: 'готовая стратегия на год',
    },
  ],
  student: [
    WEEK_ONE,
    {
      label: 'Неделя 2',
      title: 'Вход в карьеру',
      desc: 'Точки входа: стажировки, junior, бизнес-ассистент, фриланс. Резюме по методологии: задачи и результаты вместо перечисления мест.',
      live: 'Эфир про вход в карьеру и фриланс — формат выбираем опросом',
      task: 'карточка «карьерный вектор» — 3 направления (+20 баллов)',
      result: 'карьерный вектор — 3 направления',
    },
    {
      label: 'Неделя 3',
      title: 'Поиск и нетворкинг',
      desc: 'HH, LinkedIn, TG-каналы, хакатоны и кейс-чемпионаты. Разбор примера резюме и портфолио с сопроводительным письмом.',
      live: 'Эфир про чемпионаты, каналы поиска и нетворкинг',
      task: 'резюме на проверку с указанием должности (+25 баллов)',
      result: 'резюме сдано на проверку',
    },
    {
      label: 'Неделя 4',
      title: 'Отборы и собеседования',
      desc: 'HR-скрининг, кейс-интервью, оформление профиля так, чтобы рекрутеры писали первыми. И что делать после отказа.',
      live: 'Эфир про отборы + финальный эфир: итоги, топ рейтинга, награждение',
      task: '12 откликов с фиксацией в отчёте (+30 баллов)',
      result: '12+ откликов отправлено',
    },
  ],
};

const FAQ = [
  {
    q: 'Я школьник / первокурсник — мне рано?',
    a: 'В самый раз. Марафон рассчитан на 15–22 года: чем раньше начнёшь разбираться, тем спокойнее пройдут выпускные годы. Задания адаптируются под твой уровень.',
  },
  {
    q: 'У меня совсем нет опыта — что писать в резюме?',
    a: 'Именно этому посвящена вторая неделя. Учёба, проекты, олимпиады, волонтёрство, свои мини-инициативы — всё это опыт. Покажем, как собрать его в сильное резюме без «работал 5 лет».',
  },
  {
    q: 'Сколько времени это займёт?',
    a: '30–60 минут в день: короткое задание и отчёт. Эфиры идут в записи, так что можно смотреть тогда, когда удобно, и не выпадать из ритма.',
  },
  {
    q: 'Что будет после оплаты?',
    a: 'Даша напишет тебе в Telegram, добавит в закрытый чат потока и пришлёт всё для старта: расписание, первые материалы и доступ к веткам по интересам.',
  },
  {
    q: 'А если мне не зайдёт?',
    a: 'В первые 3 дня можно вернуть оплату без вопросов. А ещё внутри ты не наедине с этим: если начнёшь буксовать, тебя поддержат и куратор, и ребята в чате.',
  },
];

/* ============ утилиты ============ */

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ============ печатающийся текст ============ */

(function typewriter() {
  const el = $('#typed');
  if (!el) return;

  const phrases = [
    'разбираем, куда двигаться',
    'собираем резюме и портфолио',
    'находим пути поступления',
    'отправляем первые отклики',
  ];

  // при prefers-reduced-motion показываем первую фразу статично
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = phrases[0];
    return;
  }

  let pi = 0, ci = 0, deleting = false;

  (function tick() {
    const full = phrases[pi];
    ci += deleting ? -1 : 1;
    el.textContent = full.slice(0, ci);

    let delay = deleting ? 28 : 55;
    if (!deleting && ci === full.length) { deleting = true; delay = 2000; }
    else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 400; }

    setTimeout(tick, delay);
  })();
})();

/* ============ треки + карточки недель ============ */

(function tracks() {
  const wrap = $('#weeks');
  const offer = $('#trackOffer');
  const buttons = document.querySelectorAll('.switch button');
  if (!wrap || !offer) return;

  function render(track) {
    offer.textContent = OFFERS[track];

    wrap.innerHTML = WEEKS[track].map((w) => `
      <div class="week" role="button" tabindex="0" aria-expanded="false">
        <span class="week-label">${esc(w.label)}</span>
        <h3>${esc(w.title)}</h3>
        <p class="week-result"><b>Результат:</b> ${esc(w.result)}</p>
        <div class="week-detail">
          <div class="week-detail-in">
            <p class="desc">${esc(w.desc)}</p>
            <p><b>Эфир:</b> ${esc(w.live)}</p>
            <p><b>Задание:</b> ${esc(w.task)}</p>
          </div>
        </div>
      </div>
    `).join('');

    // тап по карточке на мобильных (на десктопе раскрывается по ховеру)
    wrap.querySelectorAll('.week').forEach((card) => {
      const toggle = () => {
        const open = card.classList.toggle('open');
        card.setAttribute('aria-expanded', String(open));
      };
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.setAttribute('aria-selected', String(b === btn)));
      render(btn.dataset.track);
    });
  });

  render('school');
})();

/* ============ FAQ ============ */

(function faq() {
  const wrap = $('#faq');
  if (!wrap) return;

  wrap.innerHTML = FAQ.map((f, i) => `
    <div class="faq-item">
      <button type="button" class="faq-q" aria-expanded="false" aria-controls="faq-a-${i}">
        <span>${esc(f.q)}</span>
        <span class="faq-ico">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#DDA9A9" stroke-width="2" aria-hidden="true"><path d="M3 6l5 5 5-5"/></svg>
        </span>
      </button>
      <div class="faq-a" id="faq-a-${i}"><p>${esc(f.a)}</p></div>
    </div>
  `).join('');

  wrap.querySelectorAll('.faq-q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const panel = item.querySelector('.faq-a');
      const isOpen = item.classList.contains('open');

      // закрываем все — аккордеон, как в макете
      wrap.querySelectorAll('.faq-item').forEach((el) => {
        el.classList.remove('open');
        el.querySelector('.faq-a').style.maxHeight = '0px';
        el.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* ============ форма заявки ============ */

/* Apps Script не отвечает на preflight-запрос, поэтому Content-Type
   должен быть text/plain — тогда браузер шлёт запрос напрямую.
   Тело всё равно остаётся JSON, скрипт разбирает его сам. */
function sendToSheet(payload) {
  return fetch(SHEET_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  }).then((res) => {
    if (!res.ok) throw new Error('Google HTTP ' + res.status);
  });
}

function sendToMail(payload) {
  return fetch(MAIL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    // поля с подчёркиванием — настройки письма, в тело они не попадают
    body: JSON.stringify({
      ...payload,
      _subject: 'Заявка на марафон «Карьера»',
      _template: 'table',
    }),
  }).then((res) => {
    if (!res.ok) throw new Error('Почта HTTP ' + res.status);
  });
}

/* Кнопка «Занять место» у тарифа отмечает этот тариф в форме,
   чтобы человек не выбирал одно, а платил за другое. */
(function tariffPick() {
  document.querySelectorAll('[data-tariff]').forEach((link) => {
    link.addEventListener('click', () => {
      const radio = document.getElementById(link.dataset.tariff);
      if (radio) radio.checked = true;
    });
  });
})();

(function form() {
  const el = $('#form');
  const thanks = $('#thanks');
  const errBox = $('#formErr');
  if (!el) return;

  const showErr = (msg) => {
    errBox.textContent = msg;
    errBox.hidden = false;
  };

  el.addEventListener('submit', async (e) => {
    e.preventDefault();
    errBox.hidden = true;

    // именно el.elements — у формы уже есть своё свойство .name
    const name = el.elements.name.value.trim();
    const telegram = el.elements.telegram.value.trim();

    // ловушка для ботов: поле спрятано, живой человек его не увидит
    if (el.elements.company.value) return;

    if (!name || !telegram) {
      showErr('Заполни оба поля, пожалуйста');
      return;
    }

    const btn = el.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Отправляем…';

    const tariffInput = el.querySelector('input[name="tariff"]:checked');
    const tariff = tariffInput ? tariffInput.value : '';
    const payUrl = tariffInput ? PAY_LINKS[tariffInput.id] : '';

    const payload = { name, telegram, tariff, page: location.href, date: new Date().toISOString() };

    const jobs = [];
    if (MAIL_ENDPOINT) jobs.push(sendToMail(payload));
    if (SHEET_ENDPOINT) jobs.push(sendToSheet(payload));

    if (!jobs.length) {
      console.warn('[форма] адреса не заданы в app.js — заявка никуда не ушла:', payload);
      showDone();
      return;
    }

    const results = await Promise.allSettled(jobs);
    results.filter((r) => r.status === 'rejected').forEach((r) => console.error(r.reason));

    // успех, если сработал хотя бы один канал
    if (results.some((r) => r.status === 'fulfilled')) {
      showDone();
    } else {
      btn.disabled = false;
      btn.textContent = 'Перейти к оплате →';
      showErr('Не получилось отправить. Напиши нам в Telegram — разберёмся.');
    }

    function showDone() {
      el.hidden = true;
      thanks.hidden = false;
      thanks.scrollIntoView({ block: 'center', behavior: 'smooth' });

      // ссылки на оплату ещё не заведены — просто благодарим
      if (!payUrl) return;

      const payBtn = $('#payBtn');
      const payAlt = $('#payAlt');
      $('#thanksText').textContent =
        'Заявка принята. Открываем оплату — ' + tariff.toLowerCase() + '.';
      payBtn.href = payUrl;
      payBtn.hidden = false;
      payAlt.hidden = false;

      /* Небольшая пауза, чтобы человек успел увидеть подтверждение
         и не решил, что заявка потерялась. Кнопка остаётся запасным
         путём: браузер может заблокировать переход из скрипта. */
      setTimeout(() => {
        location.href = payUrl;
      }, 1600);
    }
  });
})();
