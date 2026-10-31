import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/environments/RoomEnvironment.js';

const $ = id => document.getElementById(id);

/* ---------- copy ----------
   structs: [nombre, resumen, detalle, ancla en el espacio del modelo o null, etiqueta en escena] */
const CELLS = [
  { key: 'plant', file: 'plant-cell', scale: 1.4, rotY: -Math.PI / 4, name: 'Célula vegetal', tag: 'Autótrofa', accent: '#5f9e57', soft: '#e3f0dc',
    lede: 'Una célula eucariota con pared que captura la luz del sol y la convierte en el azúcar del que depende buena parte de la vida terrestre.',
    kv: [['Tamaño', '10–100 µm'], ['Categoría', 'Célula eucariota'], ['Se encuentra en', 'Hojas, tallos, raíces y frutos']],
    structs: [
      ['Cloroplasto', 'Convierte luz, agua y dióxido de carbono en azúcar.', 'Pilas de membranas tilacoides contienen clorofila, que absorbe la luz roja y azul e impulsa la fotosíntesis.', [-0.103, 1.482, -0.03], 1],
      ['Vacuola central', 'Almacena agua y mantiene firme la célula.', 'La presión de esta reserva de agua empuja contra la pared y mantiene erguidos los tallos y planas las hojas.', [0.034, 1.255, 0.401], 1],
      ['Núcleo', 'Guarda el ADN y dirige la célula.', 'Los genes almacenados aquí se leen como instrucciones para cada proteína que fabrica la célula.', [0.114, 1.139, 0.378], 1],
      ['Pared celular', 'Un armazón rígido de celulosa alrededor de la célula.', 'Capas de fibras de celulosa dan a la célula su forma cuadrada y evitan que reviente.', [1.241, 1.505, -0.842], 0],
      ['Mitocondria', 'Libera energía a partir del azúcar.', 'Las plantas producen azúcar en los cloroplastos y la queman aquí para impulsar su crecimiento, de día y de noche.', [0.713, 0.773, -0.403], 0],
    ],
    fns: [['Fotosíntesis', 'Fabrica azúcar a partir de luz, agua y dióxido de carbono.'], ['Sostén', 'La presión de turgencia y la pared mantienen erguida la planta.'], ['Almacenamiento', 'Guarda agua, almidón, pigmentos y desechos en la vacuola.']],
    know: 'Una sola hoja puede contener millones de cloroplastos, cada uno una pequeña fábrica solar.', chips: ['Plantas terrestres', 'Algas', 'Musgos', 'Helechos'] },
  { key: 'animal', file: 'animal-cell', scale: 1.4, rotY: -Math.PI / 4, name: 'Célula animal', tag: 'Heterótrofa', accent: '#e07a93', soft: '#fbe4ea',
    lede: 'Una célula eucariota que forma los tejidos y órganos de los animales y coordina miles de procesos para mantenerse viva.',
    kv: [['Tamaño', '10–30 µm'], ['Categoría', 'Célula eucariota'], ['Se encuentra en', 'Tejidos y órganos animales']],
    structs: [
      ['Núcleo', 'Guarda el material genético y controla la célula.', 'Una doble membrana con poros rodea el ADN; el nucléolo denso del interior fabrica ribosomas.', [-0.096, 0.898, -0.082], 1],
      ['Mitocondria', 'Produce ATP, la principal fuente de energía de la célula.', 'Las membranas internas plegadas, llamadas crestas, le dan una gran superficie para las reacciones de la respiración.', [-0.509, 0.985, -0.037], 1],
      ['Retículo endoplasmático', 'Fabrica y transporta proteínas y lípidos.', 'El retículo rugoso está cubierto de ribosomas y pliega proteínas; el liso fabrica lípidos y almacena calcio.', [-0.364, 0.84, -0.364], 0],
      ['Aparato de Golgi', 'Modifica, clasifica y empaqueta proteínas.', 'Sacos aplanados etiquetan las proteínas y las envían en pequeñas vesículas hasta donde se necesitan.', [0.022, 1.098, -0.589], 0],
      ['Membrana celular', 'Controla lo que entra y sale de la célula.', 'Una fina bicapa de lípidos con proteínas incrustadas que actúan como compuertas, bombas y receptores de señales.', [1.439, -0.922, 0.554], 1],
    ],
    fns: [['Metabolismo', 'Descompone las moléculas de los alimentos para liberar energía.'], ['Síntesis de proteínas', 'Lee los genes y fabrica proteínas en los ribosomas.'], ['Señalización', 'Recibe y envía mensajes químicos a través de la membrana.'], ['División', 'Copia su ADN y se divide en dos células.']],
    know: 'El cuerpo de un adulto está formado por unos 37 billones de células que trabajan juntas.', chips: ['Mamíferos', 'Aves', 'Peces', 'Insectos'] },
  { key: 'wbc', file: 'white-blood-cell', scale: 1.4, rotY: -Math.PI / 4, name: 'Glóbulo blanco', tag: 'Célula inmune', accent: '#8f84d6', soft: '#ebe8fa',
    lede: 'Una célula inmune móvil que patrulla la sangre y la linfa, persigue a los invasores y limpia los daños.',
    kv: [['Tamaño', '7–20 µm'], ['Categoría', 'Célula inmune'], ['Se encuentra en', 'Sangre, linfa y médula ósea']],
    structs: [
      ['Núcleo lobulado', 'Dividido en lóbulos para poder pasar por espacios estrechos.', 'La forma segmentada le permite deslizarse entre las células de la pared de un vaso sanguíneo para llegar a una infección.', [0.554, 0.7, 0.701], 1],
      ['Gránulos', 'Sacos de enzimas que destruyen los microbios capturados.', 'Cuando la célula engulle una bacteria, los gránulos se fusionan con ella y liberan enzimas digestivas.', [0.972, 0.764, 0.21], 1],
      ['Membrana celular', 'Cambia de forma para arrastrarse y atrapar.', 'Pliegues y pseudópodos se extienden, rodean a los invasores y arrastran la célula por las superficies.', [1.46, 0.578, -0.012], 1],
    ],
    fns: [['Fagocitosis', 'Engulle y digiere bacterias y restos.'], ['Señales de alarma', 'Libera citocinas que llaman a otras células inmunes.'], ['Memoria', 'Algunos tipos recuerdan un patógeno para defenderse más rápido la próxima vez.']],
    know: 'Algunos glóbulos blancos salen de un vaso sanguíneo deslizándose entre las células de su pared.', chips: ['Neutrófilos', 'Linfocitos', 'Monocitos'] },
  { key: 'neuron', file: 'neuron', scale: 1.8, rotY: -Math.PI / 4, name: 'Neurona', tag: 'Transmisión de señales', accent: '#d98b3a', soft: '#f8e8d6',
    lede: 'Una célula nerviosa que recibe, suma y envía señales eléctricas, conectando el cerebro con el cuerpo.',
    kv: [['Tamaño', 'Cuerpo 4–100 µm'], ['Categoría', 'Célula excitable'], ['Se encuentra en', 'Cerebro, médula espinal y nervios']],
    structs: [
      ['Cuerpo celular', 'Contiene el núcleo y abastece a la neurona.', 'Las proteínas fabricadas aquí recorren todo el axón, a veces más de un metro.', [-0.362, 0.138, 0.797], 1],
      ['Dendritas', 'Ramas que reciben las señales entrantes.', 'Miles de sinapsis en las dendritas llevan señales hasta el cuerpo celular.', [-1.054, 0.978, 1.485], 1],
      ['Vaina de mielina', 'Aislante que acelera la señal.', 'Los huecos entre los segmentos de mielina permiten que el impulso salte hacia adelante, lo que lo hace viajar mucho más rápido.', [0.232, 0.089, -0.045], 1],
      ['Terminales del axón', 'Pasan la señal a la siguiente célula.', 'Los mensajeros químicos liberados aquí cruzan la sinapsis hacia la siguiente neurona o un músculo.', [1.64, -0.299, -1.295], 0],
    ],
    fns: [['Recibir', 'Las dendritas recogen señales de otras neuronas.'], ['Integrar', 'El cuerpo celular suma las entradas y decide si dispara.'], ['Transmitir', 'Un pulso eléctrico recorre el axón hasta los terminales.']],
    know: 'Las señales pueden recorrer un axón mielinizado a más de 100 metros por segundo.', chips: ['Sensoriales', 'Motoras', 'Interneuronas'] },
  { key: 'dna', file: 'dna', scale: 1.2, rotY: 0, name: 'ADN', tag: 'Material genético', accent: '#4a7fd1', soft: '#e2ebfa',
    lede: 'Dos cadenas enrolladas en una doble hélice que llevan las instrucciones que sigue toda célula viva.',
    kv: [['Ancho', 'Unos 2 nm'], ['Categoría', 'Ácido nucleico'], ['Se encuentra en', 'Núcleo, mitocondrias, cloroplastos']],
    structs: [
      ['Esqueleto azúcar-fosfato', 'Los raíles retorcidos de cada cadena.', 'Azúcares y fosfatos alternados forman un raíl exterior resistente que protege las bases del interior.', [0.278, 1.371, 0.535], 1],
      ['Pares de bases', 'A se une con T, G se une con C.', 'El orden de estos pares escribe los genes, de tres en tres bases.', [0.058, 1.232, -0.085], 1],
      ['Surco mayor', 'El hueco ancho donde las proteínas leen el código.', 'Las proteínas que activan y desactivan genes encajan en este surco para leer las bases sin abrir la hélice.', null, 0],
    ],
    fns: [['Almacenar información', 'Codifica las instrucciones para fabricar proteínas.'], ['Copiarse', 'Se abre para que cada cadena sirva de molde a una nueva.'], ['Herencia', 'Transmite las instrucciones de padres a descendientes.']],
    know: 'Estirado, el ADN de una sola célula humana mediría unos dos metros.', chips: ['Todo ser vivo', 'Muchos virus'] },
];

/* ---------- three setup ---------- */
const gl = $('gl'), stageEl = document.querySelector('.stage');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;
renderer.shadowMap.enabled = true;
gl.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const envTex = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
scene.environment = envTex; scene.environmentIntensity = .85;
const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 200);
const VIEW_DIR = new THREE.Vector3(.62, .42, 1).normalize(); // three-quarter view from front right, slightly above
scene.add(new THREE.HemisphereLight('#ffffff', '#f0dcc6', .6));
const key = new THREE.DirectionalLight('#fff1dc', 1.9); key.position.set(5, 8, 4);
key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.normalBias = .02;
Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 30 });
scene.add(key);
const fill = new THREE.DirectionalLight('#ffe6ea', .55); fill.position.set(-6, 3, -5); scene.add(fill);
const ground = new THREE.Mesh(new THREE.CircleGeometry(6, 48), new THREE.ShadowMaterial({ opacity: .1 }));
ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = .08; controls.enableZoom = false; // own wheel handler below releases the page at the zoom limits
controls.minPolarAngle = Math.PI * .08; controls.maxPolarAngle = Math.PI * .82;
renderer.domElement.style.touchAction = 'pan-y'; // vertical swipes scroll the page, horizontal swipes rotate

/* ---------- loading ---------- */
// Models: reference site's GLBs, kept local for preview only (rights unconfirmed, see BRIEF.md)
const gltf = new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath('https://media.prettysites.io/cell-studio/draco/'));
const models = {}, pending = {};
async function fetchModel(c, onProgress) {
  const res = await fetch(`https://media.prettysites.io/cell-studio/models/${c.file}.glb`);
  if (!res.ok) throw new Error(`${c.file}: ${res.status}`);
  const total = +res.headers.get('content-length') || 0, reader = res.body.getReader(), chunks = [];
  let got = 0;
  for (;;) { const { done, value } = await reader.read(); if (done) break; chunks.push(value); got += value.length; onProgress(total ? got / total : 0); }
  const root = (await gltf.parseAsync(await new Blob(chunks).arrayBuffer(), '')).scene;
  root.traverse(o => { if (o.isMesh) o.castShadow = true; });
  const size = new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3());
  root.scale.setScalar(2.3 * c.scale / Math.max(size.x, size.y, size.z));
  root.position.sub(new THREE.Box3().setFromObject(root).getCenter(new THREE.Vector3()));
  root.rotation.y = c.rotY;
  const holder = new THREE.Group(); holder.add(root);
  const box = new THREE.Box3().setFromObject(holder);
  holder.userData.radius = box.getBoundingSphere(new THREE.Sphere()).radius; holder.userData.minY = box.min.y;
  return holder;
}
function load(c) {
  if (models[c.key]) return Promise.resolve(models[c.key]);
  return pending[c.key] ||= fetchModel(c, p => progress(c, p)).then(h => { models[c.key] = h; snaps(c, h); return h; })
    .catch(e => { console.warn(e); delete pending[c.key]; throw e; });
}

/* ---------- snapshots: list thumbnails and structure close-ups ---------- */
const tr = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
tr.toneMapping = THREE.ACESFilmicToneMapping; tr.toneMappingExposure = 1.08;
const ts = new THREE.Scene(), tc = new THREE.PerspectiveCamera(30, 1, .01, 100);
ts.environment = new THREE.PMREMGenerator(tr).fromScene(new RoomEnvironment(), .04).texture; ts.environmentIntensity = .9;
ts.add(new THREE.HemisphereLight('#ffffff', '#f0dcc6', .8)); const tk = key.clone(); tk.castShadow = false; ts.add(tk);
const shots = {}; // key -> { card, [structName]: dataURL }
function shoot(h, w, ht, pos, look) {
  tr.setSize(w, ht); tc.aspect = w / ht; tc.updateProjectionMatrix(); tc.position.copy(pos); tc.lookAt(look);
  tr.render(ts, tc); return tr.domElement.toDataURL('image/webp', .9);
}
function snaps(c, h) {
  const parent = h.parent, rot = h.rotation.y; h.rotation.y = 0; ts.add(h); h.updateMatrixWorld();
  const r = h.userData.radius, s = shots[c.key] = {};
  s.card = shoot(h, 144, 168, VIEW_DIR.clone().multiplyScalar(r * 2.5), new THREE.Vector3());
  for (const [name, , , a] of c.structs) if (a) {
    const p = new THREE.Vector3(...a), out = p.clone().normalize().add(VIEW_DIR).normalize();
    s[name] = shoot(h, 152, 140, p.clone().addScaledVector(out, r * .55), p);
  }
  ts.remove(h); h.rotation.y = rot; if (parent) parent.add(h);
  const img = document.querySelector(`.card[data-k="${c.key}"] img`); if (img) img.src = s.card;
  if (want === c) renderStructs(c);
}

/* ---------- UI: list and panel ---------- */
const chev = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
$('list').innerHTML = CELLS.map(c => `<button class="card glass" data-k="${c.key}" aria-pressed="false" style="--accent:${c.accent}"><img alt="" width="72" height="84"><span><b>${c.name}</b><small>${c.tag}</small></span>${chev}</button>`).join('');
let current = null, want = null, spin = true, flat = false;

function progress(c, p) { if (c === want) { const pct = Math.round(p * 100); $('barFill').style.width = pct + '%'; $('pct').textContent = pct + '%'; } }
function renderStructs(c) {
  $('p-structures').innerHTML = c.structs.map(([n, s, l, a], i) => `<div class="st" data-i="${i}"><button aria-expanded="false">${shots[c.key]?.[n] ? `<img src="${shots[c.key][n]}" alt="">` : '<span class="ph"></span>'}<span><b>${n}</b><span>${s}</span></span><i class="pm" aria-hidden="true">+</i></button><div class="more">${l}${a ? ' <a role="button" tabindex="0" data-show>Ver en el modelo</a>' : ''}</div></div>`).join('');
  $('p-structures').querySelectorAll('.st').forEach(el => {
    const b = el.querySelector('button');
    b.onclick = () => { const open = !el.classList.contains('open'); el.classList.toggle('open', open); b.setAttribute('aria-expanded', open); el.querySelector('.pm').textContent = open ? '−' : '+'; };
    const show = el.querySelector('[data-show]'); if (show) show.onclick = show.onkeydown = e => { if (e.type === 'keydown' && e.key !== 'Enter') return; focusOn(c.structs[el.dataset.i][3]); };
  });
}
function tab(name) {
  ['structures', 'functions', 'details'].forEach(t => { $('t-' + t).setAttribute('aria-selected', t === name); $('p-' + t).hidden = t !== name; });
}
['structures', 'functions', 'details'].forEach(t => $('t-' + t).onclick = () => tab(t));
document.querySelectorAll('nav a[data-tab]').forEach(a => a.onclick = () => tab(a.dataset.tab));

async function select(k) {
  const c = CELLS.find(x => x.key === k), i = CELLS.indexOf(c); want = c;
  const root = document.documentElement.style; root.setProperty('--accent', c.accent); root.setProperty('--accent-soft', c.soft);
  document.querySelectorAll('.card').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === k));
  $('kName').textContent = c.name; $('kNum').textContent = `0${i + 1} / 0${CELLS.length}`; $('title').textContent = c.name; $('lede').textContent = c.lede;
  $('kv').innerHTML = c.kv.map(([a, b], j) => `<div class="${j === 2 ? 'wide' : ''}"><dt>${a}</dt><dd>${b}</dd></div>`).join('');
  renderStructs(c);
  $('p-functions').innerHTML = c.fns.map(([a, b]) => `<div class="fn"><b>${a}</b><span>${b}</span></div>`).join('');
  $('p-details').innerHTML = `<p class="know">${c.know}</p><div class="chips">${c.chips.map(x => `<span>${x}</span>`).join('')}</div><p class="note">Los modelos son ilustraciones didácticas, sin escala real.</p>`;
  buildCallouts(c);
  if (!models[k]) { $('loadName').textContent = c.name; $('barFill').style.width = '0%'; $('pct').textContent = '0%'; $('loading').hidden = false; }
  let h; try { h = await load(c); } catch { $('loadName').textContent = `${c.name}: no se pudo cargar`; return; }
  if (want !== c) return; // another cell was picked meanwhile
  $('loading').hidden = true;
  if (current) scene.remove(current);
  current = h; h.rotation.y = 0; scene.add(h); ground.position.y = h.userData.minY - .02; resetView();
}
document.querySelectorAll('.card').forEach(b => b.onclick = () => select(b.dataset.k));

/* ---------- callouts on the stage ---------- */
let calls = [];
function buildCallouts(c) {
  $('calls').innerHTML = ''; calls = [];
  c.structs.filter(s => s[4] && s[3]).forEach(([n, , , a]) => {
    const lead = Object.assign(document.createElement('span'), { className: 'lead off' });
    const dot = Object.assign(document.createElement('span'), { className: 'dot off' });
    const lab = Object.assign(document.createElement('button'), { className: 'call off', innerHTML: `<i></i>${n}` });
    lab.onclick = () => { tab('structures'); const el = [...document.querySelectorAll('.st')].find(e => e.querySelector('b').textContent === n); if (el && !el.classList.contains('open')) el.querySelector('button').click(); el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); };
    $('calls').append(lead, dot, lab); calls.push({ a: new THREE.Vector3(...a), lead, dot, lab });
  });
}
const tmp = new THREE.Vector3(), ctr = new THREE.Vector3(), camDir = new THREE.Vector3();
function placeCallouts() {
  if (!current) return;
  const w = gl.clientWidth, h = gl.clientHeight, ox = gl.offsetLeft, oy = gl.offsetTop, sw = stageEl.clientWidth;
  ctr.set(0, 0, 0).project(camera); const cx = (ctr.x + 1) / 2 * w + ox, cy = (1 - ctr.y) / 2 * h + oy;
  camDir.copy(camera.position).normalize();
  const placed = []; // label boxes so far, to nudge overlapping labels apart
  calls.forEach(k => {
    tmp.copy(k.a).applyMatrix4(current.matrixWorld);
    const facing = tmp.clone().normalize().dot(camDir) > -.05;
    tmp.project(camera);
    const x = (tmp.x + 1) / 2 * w + ox, y = (1 - tmp.y) / 2 * h + oy;
    let dx = x - cx, dy = y - cy; const len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;
    // push the label outward from the model's centre so it sits just past the silhouette
    const rPx = current.userData.radius / (camera.position.distanceTo(controls.target) * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) * h * .5;
    const reach = Math.max(36, rPx * .92 - len + (w < 600 ? 18 : 40));
    const lw = k.lab.offsetWidth;
    let lx = x + dx * reach, ly = Math.min(Math.max(y + dy * reach * .8, 24), stageEl.clientHeight - 100);
    lx = Math.min(Math.max(lx, dx < 0 ? lw + 8 : 8), sw - (dx < 0 ? 8 : lw + 8));
    const left = dx < 0 ? lx - lw : lx, lh = k.lab.offsetHeight + 6;
    for (const p of placed) if (left < p.r && left + lw > p.l && Math.abs(ly - p.y) < lh) ly = p.y + (ly >= p.y ? lh : -lh);
    placed.push({ l: left, r: left + lw, y: ly });
    k.lab.style.transform = `translate(${left}px,${ly - 10}px)`;
    const ex = dx < 0 ? lx + 4 : lx - 4, ey = ly;
    const L = Math.hypot(x - ex, y - ey), ang = Math.atan2(y - ey, x - ex);
    k.lead.style.width = L + 'px'; k.lead.style.transform = `translate(${ex}px,${ey}px) rotate(${ang}rad)`;
    k.dot.style.transform = `translate(${x}px,${y}px)`;
    [k.lab, k.lead, k.dot].forEach(e => e.classList.toggle('off', !facing || !$('loading').hidden));
  });
}

/* ---------- view controls ---------- */
function homeDist() { const r = current?.userData.radius || 2; return r / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * (want?.key === 'dna' ? 1.08 : .84) * Math.max(1, .95 / camera.aspect); } // the tall helix needs more room
let dMin = 2, dMax = 20;
function resetView() {
  const d = homeDist(); dMin = d * .45; dMax = d * 1.8;
  controls.target.set(0, 0, 0); camera.position.copy(flat ? new THREE.Vector3(0, 0, 1) : VIEW_DIR).multiplyScalar(d); controls.update(); syncSlider();
}
function setDist(d) { d = THREE.MathUtils.clamp(d, dMin, dMax); const v = camera.position.clone().sub(controls.target).setLength(d); camera.position.copy(controls.target).add(v); syncSlider(); }
const sliderToDist = v => dMax * Math.pow(dMin / dMax, v / 100);
function syncSlider() { const d = camera.position.distanceTo(controls.target); $('zr').value = Math.round(Math.log(d / dMax) / Math.log(dMin / dMax) * 100); }
$('zr').oninput = e => setDist(sliderToDist(+e.target.value));
$('zin').onclick = () => setDist(camera.position.distanceTo(controls.target) * .85);
$('zout').onclick = () => setDist(camera.position.distanceTo(controls.target) * 1.18);
$('recenter').onclick = () => { if (current) current.rotation.y = 0; resetView(); };
function setMode(f) {
  flat = f; $('m3').setAttribute('aria-pressed', !f); $('m2').setAttribute('aria-pressed', f);
  // 2D: a narrow lens from far away flattens perspective into an illustration-like front view
  camera.fov = f ? 12 : 38; camera.updateProjectionMatrix(); controls.enableRotate = !f;
  if (current) current.rotation.y = 0; resetView();
}
$('m3').onclick = () => setMode(false); $('m2').onclick = () => setMode(true);
$('fs').onclick = () => document.fullscreenElement ? document.exitFullscreen() : stageEl.requestFullscreen?.();
function focusOn(a) {
  if (!current || !a) return;
  setMode(false); spin = false;
  const p = new THREE.Vector3(...a).applyMatrix4(current.matrixWorld), out = p.clone().normalize().add(VIEW_DIR).normalize();
  controls.target.copy(p).multiplyScalar(.6); camera.position.copy(p).addScaledVector(out, homeDist() * .55); controls.update(); syncSlider();
  stageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
renderer.domElement.addEventListener('pointerdown', () => { spin = false; });
// wheel zooms the model, but once zoom hits its limit the wheel scrolls the page again, so it never traps
renderer.domElement.addEventListener('wheel', e => {
  if (!current || e.ctrlKey) return;
  const d = camera.position.distanceTo(controls.target), next = THREE.MathUtils.clamp(d * Math.exp(e.deltaY * .0012), dMin, dMax);
  if (Math.abs(next - d) < 1e-3) return;
  e.preventDefault(); setDist(next);
}, { passive: false });

/* ---------- search ---------- */
const INDEX = CELLS.flatMap(c => [...c.structs.map(s => ({ c, kind: 'structures', n: s[0], d: s[1] })), ...c.fns.map(f => ({ c, kind: 'functions', n: f[0], d: f[1] }))]);
$('q').oninput = e => {
  const q = e.target.value.trim().toLowerCase(), box = $('results');
  const hits = q ? INDEX.filter(x => (x.n + ' ' + x.d).toLowerCase().includes(q)).slice(0, 8) : [];
  box.innerHTML = hits.length ? hits.map((x, i) => `<button role="option" data-i="${i}">${x.n}<small>${x.c.name} · ${x.kind === 'structures' ? 'Estructura' : 'Función'}</small></button>`).join('') : q ? '<button disabled>Sin resultados</button>' : '';
  box.classList.toggle('on', !!q);
  box.querySelectorAll('[data-i]').forEach(b => b.onclick = async () => {
    const x = hits[b.dataset.i]; box.classList.remove('on'); e.target.value = '';
    await select(x.c.key); tab(x.kind);
    if (x.kind === 'structures') { const el = [...document.querySelectorAll('.st')].find(s => s.querySelector('b').textContent === x.n); el?.querySelector('button').click(); el?.scrollIntoView({ block: 'nearest' }); }
  });
};
$('q').onkeydown = e => { if (e.key === 'Escape') { e.target.value = ''; $('results').classList.remove('on'); } };
document.addEventListener('pointerdown', e => { if (!e.target.closest('.search')) $('results').classList.remove('on'); });

/* ---------- loop ---------- */
if (matchMedia('(prefers-reduced-motion: reduce)').matches) spin = false;
function size() { const w = gl.clientWidth, h = gl.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); if (current) resetView(); }
new ResizeObserver(size).observe(gl); size();
let visible = true, last = performance.now();
new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(gl);
renderer.setAnimationLoop(now => {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  if (!visible || !current) return;
  if (spin && !flat) current.rotation.y += dt * .16;
  controls.update(); renderer.render(scene, camera); placeCallouts();
});

// debug aid for placing anchors: open with ?pick and click the model to log a model-space point
if (location.search.includes('pick')) window.__cs = { THREE, models, CELLS, load };
if (location.search.includes('pick')) renderer.domElement.addEventListener('click', e => {
  const r = renderer.domElement.getBoundingClientRect(), ray = new THREE.Raycaster();
  ray.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1), camera);
  const hit = current && ray.intersectObject(current, true)[0];
  if (hit) { const p = current.worldToLocal(hit.point.clone()); window.__picks = [...(window.__picks || []), p.toArray().map(v => +v.toFixed(3))]; console.log('pick', window.__picks.at(-1)); }
});

select('animal').finally(async () => { for (const c of CELLS) await load(c).catch(() => {}); });
