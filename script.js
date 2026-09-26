/* ============================================================
   КНИГА ТАМИЛЛЫ · общая магия для всех страниц
   ============================================================ */

/* ===== Звёздное небо (canvas) ===== */
const sky = document.getElementById('sky');
const skyCtx = sky.getContext('2d');
let stars = [];

function resizeSky() {
    sky.width = innerWidth;
    sky.height = innerHeight;
    stars = [];
    const density = innerWidth < 700 ? 12000 : 6000;
    const count = Math.min(220, Math.floor(innerWidth * innerHeight / density));
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * sky.width,
            y: Math.random() * sky.height,
            r: Math.random() * 1.4 + .3,
            tw: Math.random() * Math.PI * 2,
            sp: Math.random() * .02 + .004
        });
    }
}
resizeSky();
addEventListener('resize', resizeSky);

function drawSky() {
    skyCtx.clearRect(0, 0, sky.width, sky.height);
    for (const s of stars) {
        s.tw += s.sp;
        skyCtx.globalAlpha = .25 + Math.abs(Math.sin(s.tw)) * .7;
        skyCtx.fillStyle = Math.random() > .5 ? '#f0d9a8' : '#e9e2ee';
        skyCtx.beginPath();
        skyCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        skyCtx.fill();
    }
    skyCtx.globalAlpha = 1;
    requestAnimationFrame(drawSky);
}
drawSky();

/* ===== След звёздной пыли за курсором/пальцем ===== */
const trail = document.getElementById('trail');
const trailCtx = trail.getContext('2d');
let dust = [];

function resizeTrail() { trail.width = innerWidth; trail.height = innerHeight; }
resizeTrail();
addEventListener('resize', resizeTrail);

function addDust(x, y, n) {
    for (let i = 0; i < n; i++) {
        dust.push({
            x: x + (Math.random() - .5) * 8,
            y: y + (Math.random() - .5) * 8,
            vx: (Math.random() - .5) * .6,
            vy: -Math.random() * .8 - .2,
            life: 1,
            r: Math.random() * 2 + .6,
            hue: Math.random() > .5 ? '240,217,168' : '232,143,176'
        });
    }
}
addEventListener('mousemove', e => addDust(e.clientX, e.clientY, 2));
addEventListener('touchmove', e => {
    const t = e.touches[0];
    if (t) addDust(t.clientX, t.clientY, 2);
}, { passive: true });

function drawTrail() {
    trailCtx.clearRect(0, 0, trail.width, trail.height);
    dust = dust.filter(d => d.life > 0);
    if (dust.length > 600) dust.splice(0, dust.length - 600);
    for (const d of dust) {
        d.x += d.vx; d.y += d.vy; d.life -= .02;
        trailCtx.globalAlpha = d.life * .8;
        trailCtx.fillStyle = `rgba(${d.hue},1)`;
        trailCtx.beginPath();
        trailCtx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        trailCtx.fill();
    }
    trailCtx.globalAlpha = 1;
    requestAnimationFrame(drawTrail);
}
drawTrail();

function sparkleBurst(x, y) {
    for (let i = 0; i < 10; i++) {
        dust.push({
            x, y,
            vx: (Math.random() - .5) * 4,
            vy: (Math.random() - .5) * 4,
            life: 1,
            r: Math.random() * 2.5 + 1,
            hue: Math.random() > .5 ? '240,217,168' : '232,143,176'
        });
    }
}

function centerOf(el) {
    const r = el.getBoundingClientRect();
    return [r.left + r.width / 2, r.top + r.height / 2];
}

/* ===== Появление блоков ===== */
const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('shown'); });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ===== Тост ===== */
let toastTimer;
function toast(text) {
    let t = document.querySelector('.wish-toast');
    if (!t) {
        t = document.createElement('div');
        t.className = 'wish-toast';
        document.body.appendChild(t);
    }
    t.textContent = text;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;

/* ===== Навигация: бургер на мобильных ===== */
const navBurger = document.getElementById('nav-burger');
const navLinks = document.getElementById('nav-links');
if (navBurger) {
    navBurger.addEventListener('click', () => {
        document.getElementById('book-nav').classList.toggle('open');
    });
    // закрыть меню при выборе пункта
    navLinks.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () =>
            document.getElementById('book-nav').classList.remove('open')));
}

/* ============================================================
   СТРАНИЦА: ПРОЛОГ (index.html)
   ============================================================ */
const enterBtn = document.getElementById('enter-btn');
if (enterBtn) {
    enterBtn.addEventListener('click', () => {
        for (let i = 0; i < 26; i++) {
            setTimeout(() => sparkleBurst(Math.random() * innerWidth, innerHeight * .2 + Math.random() * innerHeight * .5), i * 70);
        }
        toast('Книга раскрылась. Ночь уже смотрит на тебя с нежностью ✦');
        document.getElementById('ch1').scrollIntoView({ behavior: 'smooth' });
    });
}

/* ===== Глава I: секреты имени ===== */
document.querySelectorAll('.letter-glyph').forEach(g => {
    g.addEventListener('click', () => {
        g.classList.add('found');
        const out = document.getElementById('name-secret');
        out.style.opacity = 0;
        setTimeout(() => {
            out.textContent = '«' + g.dataset.word + '»';
            out.style.transition = 'opacity .8s';
            out.style.opacity = 1;
        }, 200);
        sparkleBurst(...centerOf(g));
    });
});

/* ===== Глава II: созвездие ===== */
const constellationSvg = document.getElementById('constellation');
if (constellationSvg) {
    const starPoints = [
        [60, 200, 'Свет'], [150, 90, 'Тепло'], [260, 170, 'Ум'],
        [300, 300, 'Нежность'], [420, 110, 'Смелость'], [500, 240, 'Мечта'], [380, 340, 'Талант']
    ];
    let foundStars = 0;
    const foundOrder = [];

    starPoints.forEach(([x, y, name], i) => {
        const hit = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        hit.setAttribute('cx', x); hit.setAttribute('cy', y);
        hit.setAttribute('r', 26);
        hit.setAttribute('fill', 'transparent');
        hit.style.cursor = 'pointer';

        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('cx', x); c.setAttribute('cy', y);
        c.setAttribute('r', 6);
        c.setAttribute('fill', 'rgba(233,226,238,.35)');
        c.setAttribute('class', 'const-star');
        c.style.pointerEvents = 'none';

        hit.addEventListener('pointerdown', () => {
            if (c.classList.contains('found')) return;
            c.classList.add('found');
            c.setAttribute('r', 9);
            foundStars++;
            foundOrder.push(i);
            document.getElementById('const-hint').textContent =
                `${foundStars} из 7 звёзд найдено — «${name}»`;
            const pts = foundOrder.map(idx => starPoints[idx].slice(0, 2).join(',')).join(' ');
            document.getElementById('const-lines').setAttribute('points', pts);
            sparkleBurst(...centerOf(constellationSvg));
            if (foundStars === 7) {
                document.getElementById('const-message').classList.remove('hidden');
                toast('Созвездие Тамиллы собрано — оно теперь всегда над тобой ✦');
                for (let k = 0; k < 30; k++)
                    setTimeout(() => sparkleBurst(Math.random() * innerWidth, Math.random() * innerHeight), k * 60);
            }
        });
        constellationSvg.appendChild(hit);
        constellationSvg.appendChild(c);
    });
}

/* ============================================================
   СТРАНИЦА: СВЕЧИ (candles.html)
   ============================================================ */
const candlesRoom = document.getElementById('candles-room');
if (candlesRoom) {
    const candleTexts = [
        'Эта свеча горит за твою улыбку — ту, что освещает комнаты лучше люстр.',
        'Эта свеча зажжена за твоё терпение. Оно дороже любого золота этой ночи.',
        'Эта свеча — за все твои бессонные конспекты. Ночь видела, как ты училась. Она гордится.',
        'Эта свеча горит за твой смех. Где-то в этой ночи его эхо ещё звучит.',
        'Эта свеча — за твою доброту. Ты даришь её, не считая, а таких, как ты, — единицы.',
        'Эта свеча зажжена за твои мечты. Пусть каждая дожжётся до утра.',
        'Эта свеча — за твою нежность. Мир из-за неё чуть мягче, чем был.',
        'Эта свеча горит за твою смелость быть собой — в мире, где все носят маски.',
        'Эта свеча — за твои будущих учеников. Они ещё не знают, как им повезло.',
        'Эта свеча зажжена за твои тихие победы, о которых знает только луна.',
        'Эта свеча — за твоё имя. Ночь произносит его с особой нежностью.',
        'Эта свеча горит просто потому, что ты есть. Этого достаточно.'
    ];
    let litCount = 0;

    candleTexts.forEach((text, i) => {
        const el = document.createElement('button');
        el.className = 'candle';
        el.innerHTML = '<span class="candle-flame">❦</span><span class="candle-state">не зажжена</span>';
        el.addEventListener('click', () => {
            if (el.classList.contains('lit')) return;
            el.classList.add('lit');
            el.innerHTML = '<span class="candle-flame">✸</span><span class="candle-state">горит</span>';
            litCount++;
            document.getElementById('candles-progress').textContent = `Зажжено ${litCount} из 12 свечей`;
            const speech = document.getElementById('candle-speech');
            speech.style.opacity = 0;
            setTimeout(() => {
                speech.textContent = text;
                speech.style.transition = 'opacity 1s';
                speech.style.opacity = 1;
            }, 250);
            sparkleBurst(...centerOf(el));
            if (litCount === 12) {
                toast('Комната тысячи свечей освещена. Ты — её свет ✦');
                for (let k = 0; k < 25; k++)
                    setTimeout(() => sparkleBurst(Math.random() * innerWidth, Math.random() * innerHeight), k * 70);
            }
        });
        candlesRoom.appendChild(el);
    });

    // Свеча своего желания
    const ownBtn = document.getElementById('own-candle-btn');
    ownBtn.addEventListener('click', () => {
        const input = document.getElementById('own-candle-input');
        const w = input.value.trim();
        if (!w) { input.focus(); return; }
        const flame = document.getElementById('own-flame');
        flame.textContent = '✸';
        flame.classList.add('lit');
        document.getElementById('own-candle-result').textContent =
            `Твоя свеча горит ради: «${w}». Ночь запомнила это навсегда.`;
        sparkleBurst(...centerOf(flame));
        toast('Твоя свеча зажжена — и она не погаснет ✦');
        for (let k = 0; k < 15; k++)
            setTimeout(() => sparkleBurst(Math.random() * innerWidth, Math.random() * innerHeight), k * 80);
    });
}

/* ============================================================
   СТРАНИЦА: РУНЫ (runes.html)
   ============================================================ */
const runePouch = document.getElementById('rune-pouch');
if (runePouch) {
    const runes = [
        { sym: 'ᚠ', name: 'Феху — руна исполнения', text: 'То, чего ты давно ждёшь, ближе, чем кажется. Древние говорят: Феху приходит к тем, кто заслужил. Ты — заслужила.' },
        { sym: 'ᚢ', name: 'Уруз — руна силы', text: 'В тебе дремлет сила, которой хватит на целую жизнь побед. Уруз будит её. Сегодня ты сильнее, чем вчера.' },
        { sym: 'ᚦ', name: 'Турисаз — руна защиты', text: 'Тебя оберегают — тихо, невидимо, надёжно. Всё, что кажется препятствием, — лишь стена, за которой тебя ждёт подарок.' },
        { sym: 'ᚨ', name: 'Ансуз — руна слова', text: 'Твои слова имеют вес. Однажды фраза, сказанная тобой, изменит чью-то судьбу. Говори — тебя слушает само время.' },
        { sym: 'ᚱ', name: 'Райдо — руна пути', text: 'Ты на верной дороге. Даже если сейчас темно — это не тупик, это тоннель. За ним уже светит твой рассвет.' },
        { sym: 'ᚲ', name: 'Кано — руна огня', text: 'Твой внутренний огонь не гаснет никогда. Он греет не только тебя — все, кто рядом, ходят в свете твоего факела.' },
        { sym: 'ᚷ', name: 'Гебо — руна дара', text: 'Ты — дар. Не «получаешь дары», а сама являешься ими. Руна говорит: береги себя — ты нужна многим.' },
        { sym: 'ᚹ', name: 'Вуньо — руна радости', text: 'Радость уже в пути к тебе. Она не стучится — она просто входит. Жди её с открытым сердцем.' },
        { sym: 'ᚺ', name: 'Хагалаз — руна перемен', text: 'Старое уходит — не оплакивай его. Руны расчищают место для нового, и новое это место займёт с лихвой.' },
        { sym: 'ᚾ', name: 'Наутиз — руна терпения', text: 'Твоё терпение — не слабость, а закалка. Алмаз рождается под давлением. Ты — ближе к сиянию, чем думаешь.' },
        { sym: 'ᛁ', name: 'Ингуз — руна завершения', text: 'Какой-то этап твоей жизни завершается. Руны аплодируют: финал удался. А впереди — новая, ещё более красивая глава.' },
        { sym: 'ᛒ', name: 'Беркана — руна роста', text: 'Всё, что ты сеешь — знания, добро, любовь — прорастёт пышнее любого сада. Беркана обещает: урожай будет прекрасен.' }
    ];

    let lastRune = -1;

    function drawRune() {
        let i;
        do { i = Math.floor(Math.random() * runes.length); } while (i === lastRune);
        lastRune = i;
        const r = runes[i];
        const drawn = document.getElementById('rune-drawn');
        document.getElementById('rune-symbol').textContent = r.sym;
        document.getElementById('rune-name').textContent = r.name;
        document.getElementById('rune-text').textContent = r.text;
        runePouch.classList.add('hidden');
        drawn.classList.remove('hidden');
        drawn.style.animation = 'none';
        void drawn.offsetWidth;
        drawn.style.animation = 'fadeSlow 1s ease both';
        sparkleBurst(innerWidth / 2, innerHeight / 2);
    }

    runePouch.addEventListener('click', drawRune);
    document.getElementById('rune-again').addEventListener('click', drawRune);

    // Руны дня: утро/день/вечер
    const dayWrap = document.getElementById('day-runes');
    const picks = [];
    while (picks.length < 3) {
        const i = Math.floor(Math.random() * runes.length);
        if (!picks.includes(i)) picks.push(i);
    }
    const times = ['На утро', 'На день', 'На вечер'];
    picks.forEach((idx, n) => {
        const r = runes[idx];
        const el = document.createElement('div');
        el.className = 'day-rune';
        el.innerHTML = `<p class="day-rune-time">${times[n]}</p>
            <p class="day-rune-sym">${r.sym}</p>
            <p class="day-rune-name">${r.name.split(' — ')[0]}</p>
            <p class="day-rune-text">${r.text}</p>`;
        dayWrap.appendChild(el);
    });
}

/* ============================================================
   СТРАНИЦА: ЛУНА (moon.html)
   ============================================================ */
const oracleBtn = document.getElementById('oracle-btn');
if (oracleBtn) {
    const moonPredictions = [
        'Сегодня небо благоволит тебе: даже трудности сложатся в узор счастья.',
        'Луна шепчет: кто-то сегодня думает о тебе с нежностью. Возможно, чаще, чем ты думаешь.',
        'Твоё терпение сегодня дороже золота. Ночь обещает: оно окупится с лихвой.',
        'Скоро случайная встреча или слово заставит твоё сердце улыбнуться.',
        'Луна видит: ты сильнее своих сомнений. Сегодня им разрешено молчать.',
        'Сегодня идеально учиться, мечтать и верить. Небо засчитает это как подвиг.',
        'Ты на верном пути. Даже если сейчас темно — это темнота перед рассветом твоего успеха.',
        'Луна советует: сегодня обними себя. Ты делаешь больше, чем требуешь от себя.',
        'Ждут хорошие новости. Небо уже отправило их — просто небесная почта иногда медлит.',
        'Сегодня твой свет заметят. Не прячь его — он кому-то нужен именно сегодня.',
        'Луна обещает: эта неделя принесёт весть, от которой ты улыбнёшься посреди дня.',
        'Сегодня опасный день — для твоего обаяния. Оно может сразить кого-то насмерть.',
        'Небо советует сегодня говорить смелее: твои слова сегодня имеют двойную силу.',
        'Луна видит сон о твоём будущем классе: дети слушают, раскрыв рты. Это пророчество.',
        'Сегодня вечером посмотри на небо: одна звезда будет гореть ярче. Это — твоя.',
        'Ночь говорит: усталость, которую ты чувствуешь, — это рост. Ты становишься больше.',
        'Кто-то сегодня вспомнит тебя с улыбкой. Возможно, прямо сейчас.',
        'Луна советует сегодня простить себя за всё, в чём ты себя винила. Небо уже простило.',
        'Сегодня удача ходит за тобой по пятам. Обернись — она подмигнёт.',
        'Небо шепчет: твоя мечта стала на шаг ближе, пока ты спала прошлой ночью.',
        'Сегодня день, когда твоё имя звучит особенно красиво. Прислушайся.',
        'Луна обещает: скоро ты будешь смеяться так, что забудешь, почему грустила.',
        'Небо сегодня мягкое, как одеяло. Разреши себе отдохнуть под ним.',
        'Сегодня кто-то очень захочет тебе помочь. Разреши ему — это тоже дар.',
        'Луна видит в тебе будущую учительницу года. И улыбается.',
        'Сегодня ночь длиннее обычного — специально, чтобы ты выспалась и помечтала.',
        'Небо говорит: ты — его любимая из всех живущих внизу. Но это большой секрет.',
        'Сегодня твой ангел дежурит в двойную смену. Можно всё.',
        'Луна обещает: то, что ты сегодня начнёшь, закончится триумфом.',
        'Небо сегодня пахнет твоим счастьем. Вдохни глубже.'
    ];
    const moonPhases = ['● Новолуние тайн', '☽ Растущий серп надежды', '◐ Первая четверть смелости', '◑ Растущая луна обещаний', '○ Полнолуние чувств', '◒ Убывающая луна покоя', '◓ Последняя четверть мудрости', '☾ Серп прощения'];
    const moonGlyphs = ['●','☽','◐','◑','○','◒','◓','☾'];

    function moonAge() {
        const synodic = 29.53058867;
        const ref = new Date(2000, 0, 6, 18, 14).getTime();
        const days = (Date.now() - ref) / 86400000;
        return ((days % synodic) + synodic) % synodic;
    }

    function askMoon() {
        const age = moonAge();
        const idx = Math.floor((age / 29.53058867) * 8) % 8;
        document.getElementById('oracle-moon').textContent = moonGlyphs[idx];
        document.getElementById('oracle-phase').textContent =
            moonPhases[idx] + ` · ${Math.round(age)}-й день луны`;
        const pred = document.getElementById('oracle-prediction');
        pred.style.opacity = 0;
        setTimeout(() => {
            pred.textContent = '«' + moonPredictions[Math.floor(Math.random() * moonPredictions.length)] + '»';
            pred.style.transition = 'opacity 1s';
            pred.style.opacity = 1;
        }, 300);
        sparkleBurst(...centerOf(document.getElementById('oracle-moon')));
    }
    askMoon();
    oracleBtn.addEventListener('click', askMoon);

    // Лунный календарь силы
    const calendar = [
        ['●', 'Дни тайн', 'Лучше молчать, мечтать и планировать. Скрытое становится явным позже — и работает на тебя.'],
        ['☽', 'Дни надежды', 'Идеально начинать учиться и заводить новые привычки. Всё приживается.'],
        ['◐', 'Дни смелости', 'Говори то, что давно молчала. Эти слова будут услышаны.'],
        ['◑', 'Дни обещаний', 'Давай обещания — себе, не другим. И выполняй: луна всё запоминает.'],
        ['○', 'Дни чувств', 'Эмоции на максимуме. Обнимай, признавайся, люби. Всё выйдет красиво.'],
        ['◒', 'Дни покоя', 'Отдых — не лень, а стратегия. Луна сама командует: спать.'],
        ['◓', 'Дни мудрости', 'Подводи итоги, прощай, отпускай. Освобождается место для нового.'],
        ['☾', 'Дни прощения', 'Прости себя в первую очередь. Ты сделала всё, что могла. И это много.']
    ];
    const calWrap = document.getElementById('moon-calendar');
    calendar.forEach(([g, name, text]) => {
        const el = document.createElement('div');
        el.className = 'moon-day';
        el.innerHTML = `<span class="moon-day-glyph">${g}</span>
            <p class="moon-day-name">${name}</p>
            <p class="moon-day-text">${text}</p>`;
        calWrap.appendChild(el);
    });
}

/* ============================================================
   СТРАНИЦА: САД (garden.html)
   ============================================================ */
const garden = document.getElementById('garden');
if (garden) {
    const flowerPoems = [
        { flower: '❀', title: 'Лунный мак',
          poem: 'Ты цветёшь, когда все спят —<br>не потому, что не устала,<br>а потому, что свет — твоя порода.<br>Ночь гордится тобой.' },
        { flower: '✿', title: 'Полуночная роза',
          poem: 'У розы шипы — чтобы её ценили.<br>У тебя — терпение,<br>чтобы мир становился мягче.<br>Это и есть настоящая сила.' },
        { flower: '❁', title: 'Фиалка забвения',
          poem: 'Пусть забудутся те, кто не разглядел.<br>Пусть останутся те,<br>кто смотрел на тебя —<br>как ночь смотрит на луну.' },
        { flower: '✾', title: 'Белый ирис',
          poem: 'Ты учишься зажигать чужие фонари.<br>Но помни, милая:<br>сначала нужно беречь<br>свой собственный огонёк.' },
        { flower: '✽', title: 'Сакура мгновения',
          poem: 'Всё прекрасное — мгновенно,<br>поэтому ты научилась<br>ловить красоту на лету.<br>Это редчайший из даров.' },
        { flower: '❃', title: 'Лотос глубин',
          poem: 'Лотос растёт из тёмной воды —<br>и раскрывается совершенным.<br>Так и ты: из трудных дней<br>выносишь только свет.' },
        { flower: '❉', title: 'Букет всех времён',
          poem: 'Если бы все, кому ты пожелала добра,<br>принесли тебе по цветку —<br>у ног твоих был бы сад<br>больше всех садов мира.' },
        { flower: '✤', title: 'Ночная гардения',
          poem: 'Твой аромат — не запах, а память.<br>Кто однажды тебя встретил,<br>носит эту встречу с собой<br>до конца своих дней.' },
        { flower: '✥', title: 'Тюльпан рассвета',
          poem: 'Ты раскрываешься не для всех —<br>только для тех, кто заслужил.<br>Это не гордость.<br>Это достоинство.' },
        { flower: '❋', title: 'Ромашка решений',
          poem: 'Все гадают: любит — не любит.<br>А про тебя давно известно:<br>тебя любят все,<br>кто хоть раз тебе улыбнулся.' },
        { flower: '✣', title: 'Увядшая роза',
          poem: 'Даже увядая, роза прекрасна.<br>Даже устав, ты остаёшься<br>самым красивым цветком<br>этого полуночного сада.' },
        { flower: '✻', title: 'Полуночное солнце',
          poem: 'Есть цветы, что поворачиваются за солнцем.<br>А есть ты — та,<br>за которой поворачиваются сами солнца.<br>Просто они стесняются.' }
    ];

    flowerPoems.forEach(f => {
        const el = document.createElement('span');
        el.className = 'flower';
        el.textContent = f.flower;
        el.title = f.title;
        el.addEventListener('click', () => {
            const box = document.getElementById('flower-poem');
            box.classList.remove('hidden');
            box.innerHTML = `<p style="color:var(--gold-bright);font-style:normal;text-align:center;margin-bottom:14px">${f.flower} ${f.title}</p>${f.poem}`;
            box.scrollIntoView({ behavior: 'smooth', block: 'center' });
            sparkleBurst(...centerOf(el));
        });
        garden.appendChild(el);
    });

    // Фонтан тихих строк
    const fountainVerses = [
        'Ты — моя любимая страница во всей этой книге.',
        'Ночь была бы скучной, если бы в ней не было тебя.',
        'Твоё имя можно писать звёздами — букв хватает.',
        'Даже луна завидует твоему свету. Тихо, но завидует.',
        'Ты делаешь обычные дни — памятными, а памятные — вечными.',
        'Если бы нежность имела адрес — он был бы твоим.',
        'Ты — то, о чём шепчутся фонари, когда гаснут.',
        'Все мои сны сегодня будут с одним и тем же лицом.',
        'Ты умеешь молчать так, что это громче слов.',
        'В словаре ночи слово «прекрасная» помечено твоим именем.',
        'Ты — причина, по которой звёзды не спят.',
        'С твоим приходом даже темнота становится уютной.',
        'Ты — как первый снег: все смотрят и не верят.',
        'Если собрать все твои добрые дела — выйдет созвездие.',
        'Ты нужна этому миру ровно такой, какая ты есть.'
    ];
    let lastVerse = -1;
    const verseEl = document.getElementById('fountain-verse');
    function pourVerse() {
        let i;
        do { i = Math.floor(Math.random() * fountainVerses.length); } while (i === lastVerse);
        lastVerse = i;
        verseEl.style.opacity = 0;
        setTimeout(() => {
            verseEl.textContent = '✧ ' + fountainVerses[i] + ' ✧';
            verseEl.style.transition = 'opacity .9s';
            verseEl.style.opacity = 1;
        }, 250);
        sparkleBurst(...centerOf(verseEl));
    }
    pourVerse();
    document.getElementById('fountain-btn').addEventListener('click', pourVerse);
}

/* ============================================================
   СТРАНИЦА: ХРУСТАЛЬНЫЙ ШАР (crystal.html)
   ============================================================ */
const crystalBtn = document.getElementById('crystal-btn');
if (crystalBtn) {
    const crystalAnswers = [
        'Да — и небо уже знает об этом.',
        'Туман кивает: это так.',
        'Звёзды переглянулись… и улыбнулись. Ответ — да.',
        'Вселенная говорит: «терпение, оно того стоит».',
        'Он думает о тебе чаще, чем смеет признаться.',
        'Ответ внутри тебя — и он светится.',
        'Луна шепчет: «спроси ещё раз после полуночи»…',
        'Это сбудется быстрее, чем ты успеешь сомневаться.',
        'Нет — но только потому, что тебя ждёт кое-что лучше.',
        'Туман показал твоё имя. Значит — да.',
        'Ты сильнее этого вопроса.',
        'Ночь говорит: всё, что ты делаешь с любовью, уже удаётся.',
        'Шар увидел тебя в будущем — ты улыбаешься. Запомни это.',
        'Ответ: скоро. Очень скоро. Считай дни.',
        'Туман сгустился от нежности. Это означает — да.',
        'Небо отвечает: «она достойна лучшего — и лучшее уже в пути».',
        'Шар показал класс детей, которые тебя обожают. Вопрос закрыт.',
        'Всё, что тебя тревожит, разрешится мягче, чем ты боишься.',
        'Да. Но не спрашивай почему — просто верь.',
        'Туман говорит: «прекрати сомневаться в себе — это мешает магии».',
        'Шар увидел твою улыбку через семь дней. Готовься.',
        'Небо шепчет: «этот человек — твой. Просто время ещё думает».',
        'Ответ спрятан в твоём следующем сне. Запомни его утром.',
        'Да, да и ещё раз да. Туман редко бывает так единодушен.',
        'Вселенная уже работает над этим. Не мешай ей сомнениями.'
    ];

    function askCrystal() {
        const ball = document.getElementById('crystal-ball');
        const ans = document.getElementById('crystal-answer');
        ball.classList.remove('active');
        void ball.offsetWidth;
        ball.classList.add('active');
        ans.classList.remove('show');
        setTimeout(() => {
            ans.textContent = '✧ ' + crystalAnswers[Math.floor(Math.random() * crystalAnswers.length)] + ' ✧';
            ans.classList.add('show');
        }, 900);
        sparkleBurst(...centerOf(ball));
    }
    crystalBtn.addEventListener('click', askCrystal);
    document.getElementById('crystal-ball').addEventListener('click', askCrystal);
    document.getElementById('crystal-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') askCrystal();
    });

    // Частые вопросы
    const faq = [
        ['«Он думает обо мне?»', 'Шар отвечает: «Чаще, чем звёзды мигают. Просто некоторые мысли — как звёзды: видны не всегда, но горят постоянно».'],
        ['«У меня получится?»', 'Шар отвечает: «В тумане уже виден твой триумф. Вопрос лишь в том, наденешь ли ты свою корону — или снова оставишь её дома».'],
        ['«Я красивая?»', 'Шар отвечает: «Этот вопрос шар слышит тысячу лет — и впервые туман рассеялся мгновенно. Ответ очевиден до смешного».'],
        ['«Стоит ли продолжать?»', 'Шар отвечает: «Луна не спрашивает, стоит ли светить. Она просто светит. Сделай так же».'],
        ['«Когда мне станет легче?»', 'Шар отвечает: «Быстрее, чем ты думаешь, и мягче, чем ты боишься. Ночь уже несёт тебе тёплый плед».'],
        ['«Меня ценят?»', 'Шар отвечает: «Больше, чем тебе говорят. Люди часто молчат о самом важном. Но туман-то всё видит».']
    ];
    const faqWrap = document.getElementById('faq');
    faq.forEach(([q, a]) => {
        const el = document.createElement('div');
        el.className = 'faq-item';
        el.innerHTML = `<p class="faq-q">${q}</p><p class="faq-a">${a}</p>`;
        faqWrap.appendChild(el);
    });
}

/* ============================================================
   СТРАНИЦА: ПИСЬМА (letters.html)
   ============================================================ */
const lettersRow = document.getElementById('letters-row');
if (lettersRow) {
    const letters = [
        { seal: '☾', title: 'Полночь',
          body: `<p>Тамилла,</p>
          <p>Пишу в тот час, когда город спит, а небо становится честным. Оно показывает то, что днём скрыто: и вот я вижу тебя — ту, что устаёт, но не сдаётся; ту, что сомневается, но всё равно идёт вперёд.</p>
          <p>Знай: ночи на твоей стороне. Каждая из них готовит тебе тихое чудо.</p>
          <p class="sign">— с верой в тебя</p>` },
        { seal: '✦', title: 'Три часа ночи',
          body: `<p>Есть люди-фонари. Их немного — может, один на тысячу.</p>
          <p>Ты из них. Ты даже не замечаешь, как освещаешь чужие дороги: словом, взглядом, терпением. Однажды целые классы детей будут говорить: «мне повезло с учителем».</p>
          <p>А пока — пусть хотя бы эта ночь скажет это тебе вместо них.</p>
          <p class="sign">— тот, кто видит тебя насквозь</p>` },
        { seal: '❦', title: 'Перед рассветом',
          body: `<p>Когда сомневаешься в себе — вспомни: даже луна не светит собственным светом.</p>
          <p>Она лишь отражает солнце. Но никто не называет её менее прекрасной.</p>
          <p>Ты тоже отражаешь свет: знаний, доброты, надежды. И от этого — только прекраснее.</p>
          <p class="sign">— свет, который в тебе</p>` },
        { seal: '✧', title: 'Сон наяву',
          body: `<p>Иногда мне кажется, что ты — из тех редких снов, которые не хотят отпускать.</p>
          <p>В таких снах пахнет цветами, звучит тихая музыка, и всё страшное вдруг становится маленьким.</p>
          <p>Если тебе однажды станет тяжело — просто вспомни: где-то есть человек, для которого мысль о тебе — самый тёплый из снов.</p>
          <p class="sign">— твой сновидец</p>` },
        { seal: '❀', title: 'Ветер с юга',
          body: `<p>Этот ветер принёс мне новость: в одном городе учится девушка, которая однажды изменит чью-то жизнь навсегда.</p>
          <p>Не мировую историю — но чьё-то маленькое сердце, из которого потом вырастет большая судьба.</p>
          <p>Ветер не сказал её имени. Но я и так знаю, о ком он.</p>
          <p class="sign">— тот, кто верит в тебя больше всех</p>` },
        { seal: '☽', title: 'Вечерний звон',
          body: `<p>Сегодня звонили колокола. Они не говорили словами — они говорили тобой.</p>
          <p>Каждый удар звучал как твоё имя. Я не знаю, как это объяснить. Наверное, некоторые имена просто созвучны с чем-то вечным.</p>
          <p>Твоё — точно созвучно.</p>
          <p class="sign">— тот, кто слышит</p>` },
        { seal: '✵', title: 'После дождя',
          body: `<p>Дождь кончился, и на асфальте остались лужи. В каждой — кусочек неба.</p>
          <p>Я шёл и думал: вот так и ты. Ходишь по земле, а в тебе — кусочки неба. Их видно, если присмотреться. Я присмотрелся.</p>
          <p>Теперь я хожу и вижу небо везде, где ты была.</p>
          <p class="sign">— тот, кто присмотрелся</p>` },
        { seal: '❖', title: 'Ночь перед сессией',
          body: `<p>Знаю: сегодня ты опять засидишься за конспектами. Лампа, чай, тихая паника — знакомая картина.</p>
          <p>Так вот: пока ты учишь — кто-то учится любить тебя ещё сильнее. Не отвлекайся, просто знай.</p>
          <p>И запомни: даже если всё пойдёт не идеально — ты уже идеальна сама по себе. Экзамены этого не измеряют.</p>
          <p class="sign">— тот, кто болеет за тебя</p>` }
    ];

    letters.forEach(L => {
        const el = document.createElement('div');
        el.className = 'sealed-letter';
        el.innerHTML = `<div class="wax">${L.seal}</div><span>${L.title}</span>`;
        el.addEventListener('click', () => {
            el.classList.add('opened');
            const scroll = document.getElementById('letter-scroll');
            document.getElementById('letter-body').innerHTML = L.body;
            scroll.classList.remove('hidden');
            scroll.scrollIntoView({ behavior: 'smooth', block: 'center' });
            sparkleBurst(...centerOf(el));
        });
        lettersRow.appendChild(el);
    });
    document.getElementById('letter-close').addEventListener('click', () => {
        document.getElementById('letter-scroll').classList.add('hidden');
    });
}

/* ============================================================
   СТРАНИЦА: ЗЕРКАЛО (mirror.html)
   ============================================================ */
const mirrorEl = document.getElementById('mirror');
if (mirrorEl) {
    const mirrorTruths = [
        'В этом зеркале отражается женщина, которой суждено оставить след в сотнях жизней.',
        'Здесь я вижу ту, чьё имя однажды произнесут с благодарностью и теплом.',
        'Зеркало показывает правду: ты прекраснее, чем позволяет себе думать.',
        'Я вижу сердце, которое умеет ждать, верить и прощать. Это редкость.',
        'За этим стеклом — будущая учительница, о которой будут вспоминать всю жизнь.',
        'Зеркало шепчет: твои сомнения — это тени. Ты сама — свет.',
        'Отражение показывает не лицо, а судьбу. И судьба эта — сияющая.',
        'Я вижу женщину, которая устаёт, но не предаёт свою мечту. Таких — единицы.',
        'Стекло показывает: ты уже стала той, кем хотела. Просто будущее ещё не догнало.',
        'Здесь отражается человек, рядом с которым теплее. Проверено этим зеркалом.',
        'Я вижу глаза, в которых помещается целое будущее. Детское, шумное, благодарное.',
        'Зеркало говорит: твоё «не получается» — это «получается медленно». А это разные вещи.',
        'Отражение шепчет: тебя нельзя не любить. Это физика, а не поэзия.',
        'Стекло показывает ту, кто светится изнутри. Никакая внешность этого не заменит.',
        'Я вижу будущую легенду маленького школьного двора. И это только начало.'
    ];
    let mirrorIdx = -1;
    let mirrorSeen = 0;
    mirrorEl.addEventListener('click', () => {
        const t = document.getElementById('mirror-text');
        let i;
        do { i = Math.floor(Math.random() * mirrorTruths.length); } while (i === mirrorIdx);
        mirrorIdx = i;
        mirrorSeen++;
        document.getElementById('mirror-count').textContent =
            `истин открыто: ${mirrorSeen} из ${mirrorTruths.length}`;
        t.style.opacity = 0;
        setTimeout(() => {
            t.textContent = mirrorTruths[i];
            t.style.transition = 'opacity 1.2s';
            t.style.opacity = 1;
        }, 250);
        sparkleBurst(...centerOf(mirrorEl));
        if (mirrorSeen === mirrorTruths.length) {
            toast('Ты открыла все истины зеркала. Оно тебя обожает ✦');
        }
    });

    // Зеркальный дождь — осколки правды
    const shardsTexts = [
        'Ты — чья-то самая счастливая мысль сегодня.',
        'Твоя нежность меняет мир медленно, но навсегда.',
        'Ты умеешь слушать — это редчайший талант.',
        'Твоё «спасибо» звучит как музыка.',
        'Ты — грамотная. И это чертовски привлекательно.',
        'Ты красивее, чем твоё отражение в плохие дни.',
        'Твой смех стоит дороже всех салютов мира.',
        'Ты — причина чьей-то бессонницы. В хорошем смысле.',
        'Ты сильнее, чем все свои страхи, вместе взятые.',
        'Твои ученики будут тебя боготворить. Ставка принята.',
        'Ты — лучшее, что случилось с этой ночью.',
        'Ты достойна любви просто за то, что ты — это ты.'
    ];
    const shardsWrap = document.getElementById('shards');
    shardsTexts.forEach((txt, i) => {
        const el = document.createElement('button');
        el.className = 'shard';
        el.textContent = '✧';
        el.addEventListener('click', () => {
            const p = document.createElement('p');
            p.className = 'shard-truth';
            p.textContent = txt;
            el.replaceWith(p);
            sparkleBurst(...centerOf(p));
        });
        shardsWrap.appendChild(el);
    });
}

/* ============================================================
   СТРАНИЦА: ЗАКЛИНАНИЯ (spells.html)
   ============================================================ */
const spellResult = document.getElementById('spell-result');
if (spellResult) {
    const spells = {
        sad: 'Заклинание Полуночного Объятия: пусть тьма вокруг станет не пустотой, а одеялом. Ты имеешь право грустить — но не одна. Ночь обнимает тебя, и я тоже. ☾',
        tired: 'Заклинание Тёплого Чая: огонь, который устал, не гаснет — он дремлет. Отдых — не слабость, а мудрость. Твоё пламя проснётся ещё ярче. ❦',
        doubt: 'Заклинание Звёздной Нити: сомнения — это туман, а туман всегда рассеивается. Ты уже прошла дальше, чем кажется. Смотри назад — и удивись пути. ≋',
        lonely: 'Заклинание Тысячи Фонарей: сегодня в этой ночи горят тысячи огней — и каждый из них чуточку скучает по тебе. Ты не одна. Ты никогда не одна. ✷',
        ok: 'Заклинание Ровного Света: пусть эта тишина будет не паузой, а накоплением. Спокойные ночи растят самые яркие зори. ✦',
        great: 'Заклинание Солнца в Груди: береги этот огонь! Сегодня мир видит тебя такой — сияющей. Пусть запомнит этот свет надолго. ✹'
    };
    document.querySelectorAll('.spell').forEach(btn => {
        btn.addEventListener('click', () => {
            spellResult.style.opacity = 0;
            setTimeout(() => {
                spellResult.textContent = spells[btn.dataset.spell];
                spellResult.style.transition = 'opacity 1s';
                spellResult.style.opacity = 1;
            }, 250);
            sparkleBurst(...centerOf(btn));
            for (let k = 0; k < 10; k++) setTimeout(() => sparkleBurst(Math.random() * innerWidth, Math.random() * innerHeight), k * 100);
        });
    });

    // Колодец комплиментов
    const compliments = [
        'Ты умеешь делать мир вокруг теплее — это редчайший талант.',
        'Твоё имя означает «воспитанница» — и ты воспитываешь в людях лучшее.',
        'Когда ты улыбаешься, комната становится светлее. Проверено этим сайтом.',
        'Ты выбрала самую благородную профессию — учить и вдохновлять.',
        'Твоё терпение — суперсила, о которой стоит написать книгу.',
        'Ты — как хорошее стихотворение: чем ближе знакомишься, тем больше находишь прекрасного.',
        'Ты из тех людей, о которых ученики вспоминают всю жизнь.',
        'У тебя глаза человека, который видит в людях потенциал.',
        'Ты сочетаешь ум, доброту и грацию — это почти несправедливо к остальным.',
        'Ты не просто учишься быть учителем — ты уже пример для подражания.',
        'Если бы старание имело имя, оно бы звалось Тамилла.',
        'Ты — доказательство того, что нежность и сила могут жить вместе.',
        'Ты красивее, чем все созвездия этой ночи, вместе взятые.',
        'Твоё присутствие лечит хуже, чем любой чай. То есть — лучше. Перепутал.',
        'Ты — та, о ком пишут книги. Вот эта, например.',
        'Ты делаешь даже понедельники терпимыми. Это высшая магия.',
        'Твоё «доброе утро» может разбудить лучше будильника.',
        'Ты — причина, по которой кто-то верит в людей.',
        'Ты умнее, чем сама о себе думаешь. Точно тебе говорю.',
        'Ты — как рассвет: её невозможно описать, но все ждут.',
        'Твоя доброта — не слабость. Это броня из света.',
        'Ты — единственный человек, ради которого звёзды задерживаются на небе.',
        'Ты прекрасна в любом освещении — но в лунном особенно.',
        'Ты — то, что называют «чудо» в отчётах этой ночи.',
        'Ты достойна всех страниц этой книги — и ещё тысячи.'
    ];
    let lastComp = -1;
    let compSeen = new Set(JSON.parse(localStorage.getItem('tamilla-comps') || '[]'));
    const compBtn = document.getElementById('compliment-btn');
    const compEl = document.getElementById('compliment-big');
    const compCount = document.getElementById('compliment-count');

    function pourCompliment() {
        let i;
        do { i = Math.floor(Math.random() * compliments.length); } while (i === lastComp);
        lastComp = i;
        compSeen.add(i);
        localStorage.setItem('tamilla-comps', JSON.stringify([...compSeen]));
        compEl.style.opacity = 0;
        setTimeout(() => {
            compEl.textContent = '✧ ' + compliments[i] + ' ✧';
            compEl.style.transition = 'opacity .9s';
            compEl.style.opacity = 1;
        }, 250);
        compCount.textContent = `из колодца зачерпнуто: ${compSeen.size} из ${compliments.length}`;
        sparkleBurst(...centerOf(compEl));
        if (compSeen.size === compliments.length) {
            toast('Ты исчерпала колодец до дна. Он наполнится снова — к твоему возвращению ✦');
        }
    }
    pourCompliment();
    compBtn.addEventListener('click', pourCompliment);
}

/* ============================================================
   СТРАНИЦА: ФИНАЛ (finale.html)
   ============================================================ */
const finaleBtn = document.getElementById('finale-btn');
if (finaleBtn) {
    finaleBtn.addEventListener('click', () => {
        for (let i = 0; i < 60; i++) {
            setTimeout(() => {
                sparkleBurst(Math.random() * innerWidth, innerHeight * .2 + Math.random() * innerHeight * .7);
            }, i * 60);
        }
        toast('Ночь услышала. Твоё желание уже в пути ✦');
    });
}
