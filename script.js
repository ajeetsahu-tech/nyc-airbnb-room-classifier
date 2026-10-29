// ===== Settings =====
// If your API returns "Classes" (see README note in the chat) they are used automatically.
const DEFAULT_CLASSES = ["Entire home/apt", "Private room", "Shared room"];
const ROOM_INFO = {
  "Entire home/apt": { icon: "🏠", note: "The guest gets the whole place to themselves." },
  "Private room":    { icon: "🛏️", note: "A private bedroom inside a home shared with others." },
  "Shared room":     { icon: "👥", note: "A shared sleeping space, usually the lowest price." }
};
const BOROUGH_CENTER = {
  "Manhattan": [40.7831, -73.9712], "Brooklyn": [40.6782, -73.9442], "Queens": [40.7282, -73.7949],
  "Bronx": [40.8448, -73.8648], "Staten Island": [40.5795, -74.1502]
};
const HOODS = {
  "Manhattan": ["Midtown", "Harlem", "East Village", "Upper West Side", "Upper East Side", "Hell's Kitchen", "Chelsea", "Lower East Side", "Greenwich Village", "East Harlem", "Washington Heights", "Financial District", "SoHo"],
  "Brooklyn": ["Williamsburg", "Bedford-Stuyvesant", "Bushwick", "Crown Heights", "Greenpoint", "Park Slope", "Flatbush", "Clinton Hill", "East Flatbush", "Prospect-Lefferts Gardens"],
  "Queens": ["Astoria", "Long Island City", "Flushing", "Ridgewood", "Sunnyside", "Jamaica", "Woodside", "Forest Hills"],
  "Bronx": ["Mott Haven", "Fordham", "Concourse", "Kingsbridge", "Riverdale", "Longwood"],
  "Staten Island": ["St. George", "Tompkinsville", "Stapleton", "New Brighton", "Great Kills"]
};
const PRESETS = {
  midtown:  { borough: "Manhattan", neighbourhood: "Midtown", latitude: 40.7549, longitude: -73.984, price: 220, minimum_nights: 3, number_of_reviews: 45, reviews_per_month: 1.2, calculated_host_listings_count: 2, availability_365: 200 },
  brooklyn: { borough: "Brooklyn", neighbourhood: "Bedford-Stuyvesant", latitude: 40.6872, longitude: -73.9418, price: 65, minimum_nights: 2, number_of_reviews: 30, reviews_per_month: 0.8, calculated_host_listings_count: 1, availability_365: 120 },
  queens:   { borough: "Queens", neighbourhood: "Jamaica", latitude: 40.702, longitude: -73.789, price: 35, minimum_nights: 1, number_of_reviews: 12, reviews_per_month: 0.5, calculated_host_listings_count: 3, availability_365: 300 }
};

const $ = id => document.getElementById(id);
let borough = "Manhattan";

// ===== Skyline background =====
(function skyline() {
  const el = $("skyline");
  for (let i = 0; i < 38; i++) {
    const b = document.createElement("div");
    b.className = "b";
    b.style.height = 30 + Math.random() * 110 + "px";
    for (let w = 0; w < 6; w++) {
      const d = document.createElement("span");
      d.className = "w";
      d.style.left = 4 + Math.random() * 60 + "%";
      d.style.top = 6 + Math.random() * 85 + "%";
      d.style.animationDelay = Math.random() * 6 + "s";
      b.appendChild(d);
    }
    el.appendChild(b);
  }
})();

// ===== Form helpers =====
const sliders = {
  price: v => `$${v}`,
  minimum_nights: v => `${v} night${v == 1 ? "" : "s"}`,
  availability_365: v => `${v} days`
};
function updateSlider(id) {
  const s = $(id), pct = (s.value - s.min) / (s.max - s.min) * 100;
  s.style.setProperty("--p", pct + "%");
  $(id + "Out").textContent = sliders[id](s.value);
}
Object.keys(sliders).forEach(id => { $(id).addEventListener("input", () => updateSlider(id)); updateSlider(id); });

function fillHoods() {
  $("hoods").innerHTML = HOODS[borough].map(h => `<option value="${h}">`).join("");
}
function setBorough(name, moveMap = true) {
  borough = name;
  document.querySelectorAll("#boroughs button").forEach(b => {
    const on = b.dataset.v === name;
    b.classList.toggle("on", on);
    b.setAttribute("aria-checked", on);
  });
  fillHoods();
  if (moveMap) {
    $("neighbourhood").value = HOODS[name][0];
    $("latitude").value = BOROUGH_CENTER[name][0];
    $("longitude").value = BOROUGH_CENTER[name][1];
  }
}
$("boroughs").addEventListener("click", e => { if (e.target.dataset.v) setBorough(e.target.dataset.v); });

function applyPreset(p) {
  setBorough(p.borough, false);
  ["neighbourhood", "latitude", "longitude", "price", "minimum_nights", "number_of_reviews", "reviews_per_month", "calculated_host_listings_count", "availability_365"]
    .forEach(k => $(k).value = p[k]);
  Object.keys(sliders).forEach(updateSlider);
  $("error").hidden = true;
}
document.querySelectorAll("[data-preset]").forEach(b => b.addEventListener("click", () => applyPreset(PRESETS[b.dataset.preset])));

// start with Midtown preset
applyPreset(PRESETS.midtown);

// ===== API status =====
const apiBase = () => $("apiUrl").value.trim().replace(/\/+$/, "") || window.location.origin;
async function checkApi() {
  const dot = $("statusDot"), txt = $("statusText");
  dot.className = "dot"; txt.textContent = "Checking API…";
  try {
    const r = await fetch(apiBase() + "/health");
    if (!r.ok) throw 0;
    dot.className = "dot ok"; txt.textContent = "API online";
  } catch {
    dot.className = "dot bad"; txt.textContent = "API offline";
  }
}
$("apiUrl").addEventListener("change", checkApi);
checkApi();

// ===== Predict =====
const INT_FIELDS = ["minimum_nights", "number_of_reviews", "calculated_host_listings_count", "availability_365"];
const FLOAT_FIELDS = ["latitude", "longitude", "price", "reviews_per_month"];

function buildPayload() {
  const body = { neighbourhood_group: borough, neighbourhood: $("neighbourhood").value.trim() };
  FLOAT_FIELDS.forEach(k => body[k] = parseFloat($(k).value));
  INT_FIELDS.forEach(k => body[k] = parseInt($(k).value, 10));
  return body;
}
function showError(msg) {
  const e = $("error");
  e.textContent = msg; e.hidden = false;
  e.style.animation = "none"; e.offsetHeight; e.style.animation = "";
}

$("form").addEventListener("submit", async ev => {
  ev.preventDefault();
  $("error").hidden = true;
  document.querySelectorAll("input.invalid").forEach(i => i.classList.remove("invalid"));

  const bad = [...document.querySelectorAll(".grid input")].filter(i => !i.value.trim() || !i.checkValidity());
  if (bad.length) {
    bad.forEach(i => i.classList.add("invalid"));
    return showError("Check the highlighted fields. Each one needs a value in the allowed range.");
  }

  const btn = $("submit");
  btn.classList.add("loading"); btn.disabled = true;
  try {
    const res = await fetch(apiBase() + "/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload())
    });
    const data = await res.json();
    if (!res.ok) {
      const detail = Array.isArray(data.detail)
        ? data.detail.map(d => `${d.loc.slice(-1)[0]}: ${d.msg}`).join(" · ")
        : (data.detail || "The server rejected the request.");
      throw new Error(detail);
    }
    checkApi();
    showResult(data);
  } catch (err) {
    const offline = err instanceof TypeError;
    showError(offline
      ? `Can't reach the API at ${apiBase()}. Start it with: uvicorn main:app --reload`
      : err.message);
  } finally {
    btn.classList.remove("loading"); btn.disabled = false;
  }
});

// ===== Result =====
function countUp(el, to, ms = 1100) {
  const start = performance.now();
  (function tick(t) {
    const p = Math.min((t - start) / ms, 1), eased = 1 - Math.pow(1 - p, 3);
    el.textContent = (to * eased).toFixed(1);
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

function showResult(data) {
  const label = data.Predicted_room_type;
  const probs = data.Probability;
  const classes = (data.Classes && data.Classes.length === probs.length) ? data.Classes
    : (probs.length === DEFAULT_CLASSES.length ? DEFAULT_CLASSES : probs.map((_, i) => `Class ${i + 1}`));

  const info = ROOM_INFO[label] || { icon: "🔑", note: "" };
  $("empty").hidden = true;
  $("filled").hidden = false;

  $("roomIcon").textContent = info.icon;
  $("roomName").textContent = label;
  $("note").textContent = info.note;

  const hang = document.querySelector(".hang");
  hang.classList.remove("swing"); hang.offsetHeight; hang.classList.add("swing");
  const name = $("roomName"); name.classList.remove("pop"); name.offsetHeight; name.classList.add("pop");

  const top = Math.max(...probs);
  $("bars").innerHTML = classes.map((c, i) => `
    <div class="bar ${probs[i] === top ? "top" : ""}">
      <div class="row"><span>${c}</span><span>${(probs[i] * 100).toFixed(1)}%</span></div>
      <div class="track"><div class="fill" data-w="${probs[i] * 100}"></div></div>
    </div>`).join("");

  requestAnimationFrame(() => requestAnimationFrame(() =>
    document.querySelectorAll(".fill").forEach(f => f.style.width = f.dataset.w + "%")));
  countUp($("confNum"), top * 100);

  if (window.innerWidth <= 860) $("result").scrollIntoView({ behavior: "smooth", block: "start" });
}
