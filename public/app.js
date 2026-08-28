const KEY = 'jikyu-log-entries';
const form = document.getElementById('entry-form');
const list = document.getElementById('list');
const summary = document.getElementById('summary');

const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
};
const save = (entries) => localStorage.setItem(KEY, JSON.stringify(entries));

const startOfWeek = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
};

const render = () => {
  const entries = load().sort((a, b) => b.date.localeCompare(a.date));
  const from = startOfWeek(new Date());
  const week = entries.filter((e) => new Date(e.date) >= from);
  const min = week.reduce((s, e) => s + e.minutes, 0);
  const yen = week.reduce((s, e) => s + e.reward, 0);
  const rate = min > 0 ? Math.round((yen / min) * 60) : 0;

  summary.innerHTML = `今週の作業 ${(min / 60).toFixed(1)} 時間 / 報酬 ${yen.toLocaleString()} 円<br>`
    + `実質時給 <strong>${rate.toLocaleString()} 円</strong>`;

  list.innerHTML = '';
  entries.forEach((e) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${e.date} ${e.task}</span>`
      + `<span>${e.minutes}分 / ${e.reward.toLocaleString()}円</span>`;
    const del = document.createElement('button');
    del.textContent = '削除';
    del.onclick = () => { save(load().filter((x) => x.id !== e.id)); render(); };
    li.appendChild(del);
    list.appendChild(li);
  });
};

form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const entry = {
    id: crypto.randomUUID(),
    date: document.getElementById('date').value,
    task: document.getElementById('task').value.trim(),
    minutes: Number(document.getElementById('minutes').value),
    reward: Number(document.getElementById('reward').value),
  };
  save([...load(), entry]);
  form.reset();
  render();
});

document.getElementById('date').valueAsDate = new Date();
render();
