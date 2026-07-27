/* ============================================================
   Марафон «Карьера» — логика лендинга
   ============================================================ */

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
    a: 'Бот сразу пришлёт ссылку в закрытый чат и впустит тебя — ждать никого не нужно. Внутри уже ветки: знакомства, ежедневные отчёты, материалы и эфиры. Даша и Оксана свяжутся с тобой лично.',
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
