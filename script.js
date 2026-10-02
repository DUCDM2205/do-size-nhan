const CARD_SHORT_MM = 53.98;
const DEFAULT_CARD_PX = 280;
const MIN_DIAMETER = 12;
const MAX_DIAMETER = 25;

const $ = (id) => document.getElementById(id);

const panels = [...document.querySelectorAll('.step-panel')];
const stepButtons = [...document.querySelectorAll('.step-btn')];
const cardEdge = $('cardEdge');
const calibrationSlider = $('calibrationSlider');
const calibrationPx = $('calibrationPx');
const diameterSlider = $('diameterSlider');
const ringCircle = $('ringCircle');
const diameterValue = $('diameterValue');
const diameterInside = $('diameterInside');
const circumferenceValue = $('circumferenceValue');
const toast = $('toast');

let pxPerMm = Number(localStorage.getItem('ringfit_px_per_mm')) || (DEFAULT_CARD_PX / CARD_SHORT_MM);
let currentDiameter = 17;
let toastTimer;

const usSizes = [
  [12.37, 1], [12.78, 1.5], [13.21, 2], [13.61, 2.5], [14.05, 3],
  [14.45, 3.5], [14.86, 4], [15.27, 4.5], [15.70, 5], [16.10, 5.5],
  [16.51, 6], [16.92, 6.5], [17.35, 7], [17.75, 7.5], [18.19, 8],
  [18.59, 8.5], [18.89, 9], [19.41, 9.5], [19.84, 10], [20.24, 10.5],
  [20.68, 11], [21.08, 11.5], [21.49, 12], [21.89, 12.5], [22.33, 13],
  [22.73, 13.5], [23.14, 14], [23.55, 14.5], [23.96, 15]
];

function setStep(step) {
  panels.forEach((panel) => panel.classList.toggle('active', panel.id === `step-${step}`));
  stepButtons.forEach((btn) => btn.classList.toggle('active', Number(btn.dataset.step) === step));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function circumferenceFromDiameter(diameter) {
  return diameter * Math.PI;
}

function nearestUsSize(diameter) {
  return usSizes.reduce((best, item) => {
    return Math.abs(item[0] - diameter) < Math.abs(best[0] - diameter) ? item : best;
  }, usSizes[0])[1];
}

function vnSizeFromCircumference(circumference) {
  return Math.max(1, Math.round(circumference - 40));
}

function applyCalibrationPreview(px) {
  const safePx = Math.min(px, Math.max(180, window.innerWidth - 76));
  cardEdge.style.width = `${safePx}px`;
  calibrationPx.textContent = `${Math.round(px)} px`;
}

function updateRing() {
  currentDiameter = Number(diameterSlider.value);
  const circumference = circumferenceFromDiameter(currentDiameter);
  const circlePx = currentDiameter * pxPerMm;

  ringCircle.style.width = `${circlePx}px`;
  ringCircle.style.height = `${circlePx}px`;
  diameterValue.textContent = currentDiameter.toFixed(1);
  diameterInside.textContent = currentDiameter.toFixed(1);
  circumferenceValue.textContent = circumference.toFixed(1);
}

function populateResult(diameter = currentDiameter) {
  const circumference = circumferenceFromDiameter(diameter);
  $('vnSize').textContent = vnSizeFromCircumference(circumference);
  $('usSize').textContent = nearestUsSize(diameter);
  $('resultDiameter').textContent = diameter.toFixed(1);
  $('resultCircumference').textContent = circumference.toFixed(1);
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2100);
}

calibrationSlider.addEventListener('input', (e) => applyCalibrationPreview(Number(e.target.value)));

$('saveCalibration').addEventListener('click', () => {
  const cardPx = Number(calibrationSlider.value);
  pxPerMm = cardPx / CARD_SHORT_MM;
  localStorage.setItem('ringfit_px_per_mm', String(pxPerMm));
  localStorage.setItem('ringfit_card_px', String(cardPx));
  updateRing();
  setStep(2);
  showToast('Đã lưu hiệu chỉnh màn hình');
});

diameterSlider.addEventListener('input', updateRing);

$('minusBtn').addEventListener('click', () => {
  diameterSlider.value = clamp(Number(diameterSlider.value) - 0.1, MIN_DIAMETER, MAX_DIAMETER).toFixed(1);
  updateRing();
});

$('plusBtn').addEventListener('click', () => {
  diameterSlider.value = clamp(Number(diameterSlider.value) + 0.1, MIN_DIAMETER, MAX_DIAMETER).toFixed(1);
  updateRing();
});

$('showResult').addEventListener('click', () => {
  populateResult();
  setStep(3);
});

$('recalibrate').addEventListener('click', () => setStep(1));
$('measureAgain').addEventListener('click', () => setStep(2));

$('copyResult').addEventListener('click', async () => {
  const diameter = Number($('resultDiameter').textContent);
  const circumference = Number($('resultCircumference').textContent);
  const text = `Kết quả đo nhẫn: Size VN ~${$('vnSize').textContent}, US ${$('usSize').textContent}, đường kính ${diameter.toFixed(1)} mm, chu vi ${circumference.toFixed(1)} mm.`;
  try {
    await navigator.clipboard.writeText(text);
    showToast('Đã sao chép kết quả');
  } catch {
    showToast('Không thể sao chép tự động');
  }
});

$('manualCalc').addEventListener('click', () => {
  const circumference = Number($('manualCircumference').value);
  if (!circumference || circumference < 40 || circumference > 80) {
    $('manualResult').textContent = 'Vui lòng nhập chu vi từ 40–80 mm.';
    return;
  }
  const diameter = circumference / Math.PI;
  const vn = vnSizeFromCircumference(circumference);
  const us = nearestUsSize(diameter);
  $('manualResult').textContent = `Ước tính: Size VN ~${vn} • US ${us} • Đường kính ${diameter.toFixed(1)} mm`;
});

stepButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const step = Number(btn.dataset.step);
    if (step === 1) return setStep(1);
    if (!localStorage.getItem('ringfit_px_per_mm') && step > 1) {
      showToast('Hãy hiệu chỉnh màn hình trước');
      return;
    }
    if (step === 3) populateResult();
    setStep(step);
  });
});

window.addEventListener('resize', () => {
  applyCalibrationPreview(Number(calibrationSlider.value));
  updateRing();
});

(function init() {
  const savedCardPx = Number(localStorage.getItem('ringfit_card_px')) || DEFAULT_CARD_PX;
  calibrationSlider.value = clamp(savedCardPx, 180, 360);
  applyCalibrationPreview(Number(calibrationSlider.value));
  updateRing();
})();
