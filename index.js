const safeStorage = {
    get(key) {
        try { return localStorage.getItem(key); } catch (e) { return null; }
    },
    set(key, value) {
        try { localStorage.setItem(key, value); } catch (e) {}
    },
    remove(key) {
        try { localStorage.removeItem(key); } catch (e) {}
    }
};

const clamp = (a, m, n) => {
    const max = Math.max(m, n);
    const min = Math.min(m, n);
    return Math.max(min, Math.min(max, a));
};

const namedColorCache = new Map();

function parseColor(color) {
    if (typeof color !== 'string') return { r: 0, g: 0, b: 0, a: 1 };
    const value = color.trim();
    if (!value || value === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };

    let m = value.match(/^#([0-9a-f]{3,8})$/i);
    if (m) {
        let hex = m[1];
        if (hex.length === 3 || hex.length === 4) {
            hex = hex.split('').map((c) => c + c).join('');
        }
        return {
            r: parseInt(hex.slice(0, 2), 16),
            g: parseInt(hex.slice(2, 4), 16),
            b: parseInt(hex.slice(4, 6), 16),
            a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1
        };
    }

    m = value.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+))?\s*\)$/i);
    if (m) {
        return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
    }

    if (namedColorCache.has(value)) return namedColorCache.get(value);
    const probe = document.createElement('div');
    probe.style.color = value;
    probe.style.display = 'none';
    document.body.appendChild(probe);
    const computed = window.getComputedStyle(probe).color;
    probe.remove();
    const parsed = computed && computed.startsWith('rgb') ? parseColor(computed) : { r: 0, g: 0, b: 0, a: 1 };
    namedColorCache.set(value, parsed);
    return parsed;
}

const toHex = (color) => {
    const { r, g, b } = parseColor(color);
    return '#' + [r, g, b].map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');
};

const withAlpha = (color, alpha) => {
    const { r, g, b, a } = parseColor(color);
    return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${clamp(a * alpha, 0, 1)})`;
};

const applyIntensity = (color, intensity, opacity = 1) => withAlpha(color, intensity * opacity);

function toArbitrary(value) {
    return String(value).trim().replace(/\s+/g, '_');
}

function setOutput(container, copyHtml, noteText) {
    container.textContent = '';
    const copyable = document.createElement('span');
    copyable.setAttribute('data-copy', '');
    copyable.innerHTML = copyHtml;
    container.appendChild(copyable);
    if (noteText) {
        const note = document.createElement('span');
        note.className = 'outputNote';
        note.textContent = noteText;
        container.appendChild(note);
    }
}

function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
        const helper = document.createElement('textarea');
        helper.value = text;
        helper.setAttribute('readonly', '');
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        document.body.appendChild(helper);
        helper.select();
        try {
            document.execCommand('copy') ? resolve() : reject(new Error('copy command failed'));
        } catch (err) {
            reject(err);
        } finally {
            helper.remove();
        }
    });
}

function openExternal(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
}

document.querySelectorAll('[data-external]').forEach((el) => {
    el.addEventListener('click', () => openExternal(el.dataset.external));
    if (el.getAttribute('role') === 'link') {
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openExternal(el.dataset.external);
            }
        });
    }
});

/* -------------------------------- elemnts ------------------------------- */

const shadowDiv = document.querySelector('.shadow-div');
const someBox = document.getElementById('someBox');
const mover = document.querySelector('.mover');
const radiusSlider = document.getElementById('radius-slider');
const distanceSlider = document.getElementById('distance-slider');
const intensitySlider = document.getElementById('intensity-slider');
const blurSlider = document.getElementById('blur-slider');
const insetSlider = document.getElementById('inset-slider');
const insetCheckbox = document.getElementById('inset-checkbox');
const sizeSlider = document.getElementById('size-slider');
const radios = document.querySelectorAll('input[name="background-options"]');
const resetButtonBox = document.getElementById('resetButtonBox');
const boxOutput = document.getElementById('textarea');

const backgroundColorPicker = document.getElementById('background-color-picker');
const someDivColorPicker = document.getElementById('some-div-color-picker');
const shadowXColorPicker = document.getElementById('shadow-x-color-picker');
const shadowYColorPicker = document.getElementById('shadow-y-color-picker');
const shadowInsetColorPicker = document.getElementById('shadow-inset-color-picker');
const gradientColor1Picker = document.getElementById('gradient-color1-picker');
const gradientColor2Picker = document.getElementById('gradient-color2-picker');

const text = document.querySelector('.textShadow');
const someText = document.querySelector('.some');
const movable = document.querySelector('.movable');
const radios1 = document.querySelectorAll('input[name="style"]');
const sizeSlider1 = document.getElementById('sizeSlider');
const distanceSlider1 = document.getElementById('distanceSlider');
const intensitySlider1 = document.getElementById('intensitySlider');
const blurSlider1 = document.getElementById('blurSlider');
const textOutput = document.getElementById('textareaS');
const textColorPicker = document.getElementById('textColorPicker');
const shadowColorPicker = document.getElementById('shadowColorPicker');
const secondShadowColorPicker = document.getElementById('secondShadowColorPicker');
const secondShadowColorPickerLabel = document.querySelector('label[for="secondShadowColorPicker"]');
const textColorPickerLabel = document.querySelector('label[for="textColorPicker"]');
const someBackgroundColorPicker = document.getElementById('someBackgroundColorPicker');
const someBackgroundColorPickerLabel = document.querySelector('label[for="someBackgroundColorPicker"]');
const resetButton = document.getElementById('resetButton');
const copyStatus = document.getElementById('copyStatus');

const colorPairingButtons14 = document.getElementById('colorPairingButtons14');
const colorPairingButtons2 = document.getElementById('colorPairingButtons2');
const colorPairingButtons3 = document.getElementById('colorPairingButtons3');
const colorPairingButtons5 = document.getElementById('colorPairingButtons5');
const colorPairingButtons67 = document.getElementById('colorPairingButtons67');

const toggleSwitchsecond = document.querySelector('.theme-switch-second input[type="checkbox"]');

const getTheme = () => document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

/* ---------------------------- orbiting light dot -------------------------- */

const OFFSET_DISTANCE_DEFAULT = 150;
let OFFSET_DISTANCE = OFFSET_DISTANCE_DEFAULT;

function updateOffsetDistance() {
    OFFSET_DISTANCE = window.innerWidth < 884 ? 70 : OFFSET_DISTANCE_DEFAULT;
}
updateOffsetDistance();

function createOrbitDrag({ referenceEl, dotEl, onMove }) {
    let lastAngle = Math.PI / 4;
    let rafPending = false;
    let pendingX = 0;
    let pendingY = 0;

    function place(x, y, angle) {
        const parent = dotEl.offsetParent;
        const pr = parent ? parent.getBoundingClientRect() : { left: 0, top: 0 };
        dotEl.style.left = `${x - pr.left - dotEl.offsetWidth / 2}px`;
        dotEl.style.top = `${y - pr.top - dotEl.offsetHeight / 2}px`;

        const deg = Math.round(((angle * 180) / Math.PI + 360) % 360);
        dotEl.setAttribute('aria-valuenow', deg);
        dotEl.setAttribute('aria-valuetext', `${deg} degrees`);

        onMove(x, y);
    }

    function moveToAngle(angle) {
        lastAngle = angle;
        const r = referenceEl.getBoundingClientRect();
        if (!r.width && !r.height) return false;
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const radius = Math.max(r.width, r.height) / 2 + OFFSET_DISTANCE;
        place(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle), angle);
        return true;
    }

    function flush() {
        rafPending = false;
        const r = referenceEl.getBoundingClientRect();
        if (!r.width && !r.height) return;
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        moveToAngle(Math.atan2(pendingY - cy, pendingX - cx));
    }

    function handlePointer(clientX, clientY) {
        pendingX = clientX;
        pendingY = clientY;
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(flush);
    }

    dotEl.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        dotEl.setPointerCapture(e.pointerId);
    });
    dotEl.addEventListener('pointermove', (e) => {
        if (!dotEl.hasPointerCapture || !dotEl.hasPointerCapture(e.pointerId)) return;
        handlePointer(e.clientX, e.clientY);
    });
    const release = (e) => {
        if (dotEl.hasPointerCapture && dotEl.hasPointerCapture(e.pointerId)) {
            dotEl.releasePointerCapture(e.pointerId);
        }
    };
    dotEl.addEventListener('pointerup', release);
    dotEl.addEventListener('pointercancel', release);

    dotEl.addEventListener('keydown', (e) => {
        const step = (Math.PI / 180) * 5;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            moveToAngle(lastAngle + step);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            moveToAngle(lastAngle - step);
        }
    });

    return {
        moveToAngle,
        refresh: () => moveToAngle(lastAngle)
    };
}

/* ============================== BOX SHADOW =============================== */

let maxShadowOffset = parseInt(distanceSlider.value, 10);
let shadowIntensity = parseInt(intensitySlider.value, 10);
let blurRadius = parseInt(blurSlider.value, 10);
let insetShadowValue = parseInt(insetSlider.value, 10);
let boxOutputFormat = 'css';
let boxLight = null;
let boxSizeTouched = false;

const INSET_ALPHA = 0.2;

const boxColors = {
    gradient1: null,
    gradient2: null,
    background: null,
    someDiv: null,
    shadowX: null,
    shadowY: null,
    shadowInset: null
};

const calculateColor = (intensity) => {
    if (getTheme() === 'light') {
        const value = Math.round(90 + (218 - 90) * (intensity / 100));
        return `rgb(${value}, ${value}, ${value})`;
    }
    const value = Math.round(120 + (0 - 120) * (intensity / 100));
    return `rgb(${value}, ${value}, ${value})`;
};

function adjustColorIntensity(color, intensity) {
    const { r, g, b } = parseColor(color);
    const factor = intensity / 100;
    return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`;
}

const selectedBoxStyle = () => document.querySelector('input[name="background-options"]:checked').value;

const paint = (x, y) => {
    boxLight = { x, y };

    const r = shadowDiv.getBoundingClientRect();
    const o = Math.min(r.width, r.height, maxShadowOffset);

    const mx = clamp(x, r.left - o, r.right + o);
    const my = clamp(y, r.top - o, r.bottom + o);
    const px = r.left + r.width / 2;
    const py = r.top + r.height / 2;
    const nx = r.width ? (mx - px) / (r.width / 1.5) : 0;
    const ny = r.height ? (my - py) / (r.height / 1.5) : 0;

    const angle = Math.atan2(ny, nx) * (180 / Math.PI) + 280;

    const shadowOffsetX = nx * maxShadowOffset;
    const shadowOffsetY = ny * maxShadowOffset;
    blurRadius = parseInt(blurSlider.value, 10);
    shadowIntensity = parseInt(intensitySlider.value, 10);

    const theme = getTheme();
    someBox.style.backgroundColor = someDivColorPicker.value;

    const style = selectedBoxStyle();
    const shadowXColor = boxColors.shadowX
        ? adjustColorIntensity(boxColors.shadowX, shadowIntensity)
        : calculateColor(shadowIntensity);

    const bgColor = boxColors.background || (theme === 'light' ? '#e0e0e0' : '#303030');
    const yColor = boxColors.shadowY || (theme === 'light' ? '#ffffff' : '#101010');
    const gradientColor1 = boxColors.gradient1 || (theme === 'light' ? '#cacaca' : '#181818');
    const gradientColor2 = boxColors.gradient2 || (theme === 'light' ? '#f0f0f0' : '#353535');
    const insetColor = withAlpha(boxColors.shadowInset || '#000000', INSET_ALPHA);

    let insetShadow = '';
    if (insetCheckbox.checked) {
        const ix = shadowOffsetX * (insetShadowValue / 100);
        const iy = shadowOffsetY * (insetShadowValue / 100);
        insetShadow = `, inset ${ix}px ${iy}px ${insetColor}`;
    }

    const outer = theme === 'light'
        ? `${-shadowOffsetX}px ${-shadowOffsetY}px ${blurRadius}px ${shadowXColor}, ${shadowOffsetX}px ${shadowOffsetY}px ${blurRadius}px ${yColor}`
        : `${shadowOffsetX}px ${shadowOffsetY}px ${blurRadius}px ${shadowXColor}, ${-shadowOffsetX}px ${-shadowOffsetY}px ${blurRadius}px ${yColor}`;

    const pressed = theme === 'light'
        ? `inset ${-shadowOffsetX}px ${-shadowOffsetY}px ${blurRadius}px ${shadowXColor}, inset ${shadowOffsetX}px ${shadowOffsetY}px ${blurRadius}px ${yColor}`
        : `inset ${shadowOffsetX}px ${shadowOffsetY}px ${blurRadius}px ${shadowXColor}, inset ${-shadowOffsetX}px ${-shadowOffsetY}px ${blurRadius}px ${yColor}`;

    switch (style) {
        case '1':
            shadowDiv.style.background = bgColor;
            shadowDiv.style.boxShadow = outer + insetShadow;
            break;
        case '2':
            shadowDiv.style.background = `linear-gradient(${angle}deg, ${gradientColor1}, ${gradientColor2})`;
            shadowDiv.style.boxShadow = outer + insetShadow;
            break;
        case '3':
            shadowDiv.style.background = `linear-gradient(${angle}deg, ${gradientColor2}, ${gradientColor1})`;
            shadowDiv.style.boxShadow = outer + insetShadow;
            break;
        case '4':
            shadowDiv.style.background = bgColor;
            shadowDiv.style.boxShadow = pressed + insetShadow;
            break;
    }

    updateBoxOutput();
};

function repaintBox() {
    if (boxLight) paint(boxLight.x, boxLight.y);
}

function updateBoxOutput() {
    const shadow = shadowDiv.style.boxShadow;
    const background = shadowDiv.style.background;
    const radius = shadowDiv.style.borderRadius || `${radiusSlider.value}px`;
    const wrapperColor = someBox.style.backgroundColor;
    const defaultWrapper = getTheme() === 'light' ? 'rgb(224, 224, 224)' : 'rgb(48, 48, 48)';
    const hasWrapper = wrapperColor && wrapperColor !== defaultWrapper;

    if (boxOutputFormat === 'tailwind') {
        const bgClass = background.includes('gradient')
            ? `bg-[image:${toArbitrary(background)}]`
            : `bg-[${toArbitrary(background)}]`;
        setOutput(
            boxOutput,
            `rounded-[${toArbitrary(radius)}] ${bgClass} shadow-[${toArbitrary(shadow)}]`,
            hasWrapper ? `Outer wrapper: bg-[${toArbitrary(wrapperColor)}]` : ''
        );
    } else {
        let css = `border-radius: ${radius};<br>background: ${background};<br>box-shadow: ${shadow};`;
        if (hasWrapper) {
            css += `<br><br>.Div_Background_Color {<br>  background-color: ${wrapperColor};<br>}`;
        }
        setOutput(boxOutput, css, '');
    }
}

function updateColorPickerValues() {
    const theme = getTheme();
    const style = selectedBoxStyle();

    someDivColorPicker.value = toHex(boxColors.someDiv || (theme === 'light' ? '#e0e0e0' : '#303030'));
    shadowXColorPicker.value = toHex(boxColors.shadowX || calculateColor(shadowIntensity));
    shadowYColorPicker.value = toHex(boxColors.shadowY || (theme === 'light' ? '#ffffff' : '#101010'));
    shadowInsetColorPicker.value = toHex(boxColors.shadowInset || '#000000');

    if (style === '1' || style === '4') {
        backgroundColorPicker.value = toHex(boxColors.background || (theme === 'light' ? '#e0e0e0' : '#303030'));
    } else {
        gradientColor1Picker.value = toHex(boxColors.gradient1 || (theme === 'light' ? '#cacaca' : '#181818'));
        gradientColor2Picker.value = toHex(boxColors.gradient2 || (theme === 'light' ? '#f0f0f0' : '#353535'));
    }

    someBox.style.backgroundColor = someDivColorPicker.value;
}

function resetColors() {
    const theme = getTheme();
    const style = selectedBoxStyle();

    boxColors.someDiv = theme === 'light' ? '#e0e0e0' : '#303030';
    boxColors.shadowX = null;
    boxColors.shadowY = theme === 'light' ? '#ffffff' : '#101010';
    boxColors.shadowInset = '#000000';

    if (style === '1' || style === '4') {
        boxColors.background = theme === 'light' ? '#e0e0e0' : '#303030';
        boxColors.gradient1 = null;
        boxColors.gradient2 = null;
    } else {
        boxColors.background = null;
        boxColors.gradient1 = theme === 'light' ? '#cacaca' : '#181818';
        boxColors.gradient2 = theme === 'light' ? '#f0f0f0' : '#353535';
    }

    document.querySelectorAll('.colorPairBox').forEach((b) => b.classList.remove('is-selected'));
    updateColorPickerValues();
    repaintBox();
}

resetButtonBox.addEventListener('click', resetColors);

function updateColorPairingButtonsVisibility() {
    const style = selectedBoxStyle();
    const isFlatOrPressed = style === '1' || style === '4';
    document.getElementById('colorPairingButtonsStyle1and4').style.display = isFlatOrPressed ? 'block' : 'none';
    document.getElementById('colorPairingButtonsStyle2and3').style.display = isFlatOrPressed ? 'none' : 'block';
}

function updateGradientColorPickersState() {
    const style = selectedBoxStyle();
    const show = style === '2' || style === '3';
    document.getElementById('wrapB').style.display = show ? 'block' : 'none';
    document.getElementById('wrapB1').style.display = show ? 'block' : 'none';
}

radios.forEach((radio) => {
    radio.addEventListener('change', () => {
        updateGradientColorPickersState();
        updateColorPairingButtonsVisibility();
        resetColors();
    });
});

document.querySelectorAll('.colorPairBox').forEach((button) => {
    button.addEventListener('click', () => {
        if (button.dataset.pairStyle === '1and4') {
            boxColors.someDiv = button.getAttribute('data-someBox');
            boxColors.background = button.getAttribute('data-shadowDiv');
        } else {
            boxColors.someDiv = button.getAttribute('data-someBox');
            boxColors.gradient1 = button.getAttribute('data-gradientStart');
            boxColors.gradient2 = button.getAttribute('data-gradientEnd');
        }
        boxColors.shadowX = button.getAttribute('data-shadowX');
        boxColors.shadowY = button.getAttribute('data-shadowY');

        document.querySelectorAll('.colorPairBox').forEach((b) => b.classList.remove('is-selected'));
        button.classList.add('is-selected');

        updateColorPickerValues();
        repaintBox();
    });
});

function wireColorPicker(pickerEl, stateObj, key, repaintFn) {
    pickerEl.addEventListener('input', () => {
        stateObj[key] = pickerEl.value;
        repaintFn();
    });
}

wireColorPicker(backgroundColorPicker, boxColors, 'background', repaintBox);
wireColorPicker(someDivColorPicker, boxColors, 'someDiv', repaintBox);
wireColorPicker(shadowXColorPicker, boxColors, 'shadowX', repaintBox);
wireColorPicker(shadowYColorPicker, boxColors, 'shadowY', repaintBox);
wireColorPicker(gradientColor1Picker, boxColors, 'gradient1', repaintBox);
wireColorPicker(gradientColor2Picker, boxColors, 'gradient2', repaintBox);
wireColorPicker(shadowInsetColorPicker, boxColors, 'shadowInset', repaintBox);

radiusSlider.addEventListener('input', (e) => {
    shadowDiv.style.borderRadius = `${e.target.value}px`;
    repaintBox();
});
distanceSlider.addEventListener('input', (e) => {
    maxShadowOffset = parseInt(e.target.value, 10);
    repaintBox();
});
intensitySlider.addEventListener('input', (e) => {
    shadowIntensity = parseInt(e.target.value, 10);
    if (!boxColors.shadowX) shadowXColorPicker.value = toHex(calculateColor(shadowIntensity));
    repaintBox();
});
blurSlider.addEventListener('input', (e) => {
    blurRadius = parseInt(e.target.value, 10);
    repaintBox();
});
insetSlider.addEventListener('input', (e) => {
    insetShadowValue = parseInt(e.target.value, 10);
    repaintBox();
});
insetCheckbox.addEventListener('change', repaintBox);

sizeSlider.addEventListener('input', (e) => {
    boxSizeTouched = true;
    applyBoxSize(parseInt(e.target.value, 10));
});

function applyBoxSize(requested) {
    const available = someBox.clientWidth || requested;
    const newSize = Math.round(clamp(requested, 20, Math.min(300, available || 300)));

    shadowDiv.style.width = `${newSize}px`;
    shadowDiv.style.height = `${newSize}px`;

    maxShadowOffset = Math.round(newSize / 10);
    blurRadius = Math.round(newSize / 15);
    distanceSlider.value = maxShadowOffset;
    blurSlider.value = blurRadius;

    boxOrbit.refresh();
    repaintBox();
}

function syncBoxSizeSlider() {
    if (boxSizeTouched) return;
    const width = Math.round(shadowDiv.getBoundingClientRect().width);
    if (width) sizeSlider.value = clamp(width, 20, 300);
}

document.getElementById('formatToggleBox').addEventListener('change', (e) => {
    boxOutputFormat = e.target.checked ? 'tailwind' : 'css';
    updateBoxOutput();
});

const boxOrbit = createOrbitDrag({
    referenceEl: shadowDiv,
    dotEl: mover,
    onMove: (x, y) => paint(x, y)
});

/* ============================== TEXT SHaDOW ============================== */

let currentStyle = 'style1';
let textOutputFormat = 'css';
let textLight = null;
let secondShadowColorPickerEnabled = true;
let textSizeTouched = false;

const MAX_SHADOW_OFFSET = 56;
let currentShadowDistance = parseInt(distanceSlider1.value, 10);
let SHADOW_INTENSITY = parseFloat(intensitySlider1.value);
let SHADOW_BLUR = parseInt(blurSlider1.value, 10);

const textColors = {
    text: null,
    shadow: null,
    secondShadow: null,
    someBackground: null
};

function getTextDefaults(style, theme) {
    const light = theme === 'light';
    const background = light ? '#e0e0e0' : '#303030';
    switch (style) {
        case 'style1':
            return { text: light ? '#e0dfdc' : '#1f2023', shadow: light ? 'rgba(0, 0, 0, 0.9)' : 'rgba(200, 200, 200, 0.9)', secondShadow: null, background };
        case 'style2':
            return { text: light ? '#dfdfdf' : '#202020', shadow: light ? 'rgba(17, 17, 17, 1)' : 'rgba(238, 238, 238, 1)', secondShadow: light ? 'rgba(54, 54, 54, 1)' : 'rgba(201, 201, 201, 1)', background };
        case 'style3':
            return { text: light ? '#2c2c2c' : '#d3d3d3', shadow: light ? '#d5d5d5' : '#2a2a2a', secondShadow: light ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)', background };
        case 'style4':
            return { text: light ? '#131313' : '#ececec', shadow: light ? 'rgba(118, 118, 118, 1)' : 'rgba(137, 137, 137, 1)', secondShadow: null, background };
        case 'style5':
            return { text: light ? '#8B7355' : '#b0b0b0', shadow: light ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)', secondShadow: null, background };
        default:
            return { text: light ? '#2c2c2c' : '#d3d3d3', shadow: light ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)', secondShadow: null, background };
    }
}

const createShadowLayers = (x, y, maxOffset, intensity, blur, style, theme) => {
    const defaults = getTextDefaults(style, theme);
    const shadowColor = textColors.shadow || defaults.shadow;
    const secondShadowColor = textColors.secondShadow || defaults.secondShadow;
    const shadows = [];
    let textColor = textColors.text || defaults.text;

    someText.style.backgroundColor = textColors.someBackground || 'transparent';

    switch (style) {
        case 'style1':
            for (let i = 0; i <= 15; i++) {
                const offsetX = i * (-x / maxOffset);
                const offsetY = i * (-y / maxOffset);
                shadows.push(`${offsetX * 2}px ${offsetY * 2}px ${blur}px ${applyIntensity(shadowColor, intensity, 1 - i * 0.05)}`);
            }
            break;

        case 'style2':
            shadows.push(`${-1 * (-x / maxOffset)}px ${-1 * (-y / maxOffset)}px ${blur}px ${applyIntensity(shadowColor, intensity)}`);
            shadows.push(`${2 * (-x / maxOffset)}px ${2 * (-y / maxOffset)}px ${blur}px ${applyIntensity(secondShadowColor, intensity)}`);
            break;

        case 'style3':
            shadows.push(`${4 * (-x / maxOffset)}px ${4 * (-y / maxOffset)}px ${blur}px ${applyIntensity(shadowColor, intensity)}`);
            shadows.push(`${7 * (-x / maxOffset)}px ${7 * (-y / maxOffset)}px ${blur}px ${applyIntensity(secondShadowColor, intensity)}`);
            break;

        case 'style4':
            for (let i = 1; i <= 28; i++) {
                shadows.push(`${i * (-x / maxOffset)}px ${i * (-y / maxOffset)}px ${blur}px ${applyIntensity(shadowColor, intensity)}`);
            }
            break;

        case 'style5':
            textColor = 'transparent';
            shadows.push(`${-1 * (x / maxOffset)}px ${-1 * (y / maxOffset)}px ${blur}px ${applyIntensity(shadowColor, intensity)}`);
            break;

        case 'style6':
            shadows.push(`${0.1 * (-x / maxOffset)}em ${0.1 * (-y / maxOffset)}em ${blur}px ${applyIntensity(shadowColor, intensity)}`);
            break;

        case 'style7': {
            const divBgColor = textColors.someBackground || defaults.background;
            shadows.push(`${-1 * (-x / maxOffset)}px ${-1 * (-y / maxOffset)}px 0px ${divBgColor}`);
            shadows.push(`${3 * (-x / maxOffset)}px ${3 * (-y / maxOffset)}px ${blur}px ${divBgColor}`);
            shadows.push(`${6 * (-x / maxOffset)}px ${6 * (-y / maxOffset)}px ${blur}px ${applyIntensity(shadowColor, intensity)}`);
            break;
        }
    }

    text.style.color = textColor;
    return shadows.join(', ');
};

const updateShadow = (x, y) => {
    textLight = { x, y };

    const rect = text.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = x - centerX;
    let dy = y - centerY;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (!distance) {
        dx = 1;
        dy = 1;
        distance = Math.SQRT2;
    }

    const offsetX = (dx / distance) * currentShadowDistance;
    const offsetY = (dy / distance) * currentShadowDistance;

    text.style.textShadow = createShadowLayers(offsetX, offsetY, MAX_SHADOW_OFFSET, SHADOW_INTENSITY, SHADOW_BLUR, currentStyle, getTheme());
    updateTextArea();
};

function repaintText() {
    if (textLight) {
        updateShadow(textLight.x, textLight.y);
    } else {
        updateTextArea();
    }
}

function updateTextArea() {
    const computed = window.getComputedStyle(text);
    const fontSize = computed.fontSize;
    const textShadow = computed.textShadow;
    const color = computed.color;
    const backgroundColor = computed.backgroundColor;
    const wrapperColor = someText.style.backgroundColor || 'transparent';
    const hasWrapper = wrapperColor !== 'transparent' && wrapperColor !== '';

    if (textOutputFormat === 'tailwind') {
        const classes = currentStyle === 'style5'
            ? `text-transparent text-[${toArbitrary(fontSize)}] bg-[${toArbitrary(backgroundColor)}] bg-clip-text [text-shadow:${toArbitrary(textShadow)}]`
            : `text-[${toArbitrary(color)}] text-[${toArbitrary(fontSize)}] [text-shadow:${toArbitrary(textShadow)}]`;
        setOutput(textOutput, classes, hasWrapper ? `Outer wrapper: bg-[${toArbitrary(wrapperColor)}]` : '');
        return;
    }

    let css = currentStyle === 'style5'
        ? `color: transparent;<br>font-size: ${fontSize};<br>background-color: ${backgroundColor};<br>background-clip: text;<br>-webkit-background-clip: text;<br>text-shadow: ${textShadow};`
        : `color: ${color};<br>font-size: ${fontSize};<br>text-shadow: ${textShadow};`;

    if (hasWrapper) {
        css += `<br><br>.Div_background_Color {<br>  background-color: ${wrapperColor};<br>}`;
    }
    setOutput(textOutput, css, '');
}

function syncTextPickers() {
    const defaults = getTextDefaults(currentStyle, getTheme());

    if (currentStyle === 'style5') {
        const bg = text.style.backgroundColor || window.getComputedStyle(text).backgroundColor;
        textColorPicker.value = toHex(bg);
    } else {
        textColorPicker.value = toHex(textColors.text || defaults.text);
    }
    shadowColorPicker.value = toHex(textColors.shadow || defaults.shadow);
    if (defaults.secondShadow) {
        secondShadowColorPicker.value = toHex(textColors.secondShadow || defaults.secondShadow);
    }
    someBackgroundColorPicker.value = toHex(textColors.someBackground || defaults.background);
}

const textOrbit = createOrbitDrag({
    referenceEl: text,
    dotEl: movable,
    onMove: (x, y) => updateShadow(x, y)
});

const switchStyle = (value) => {
    currentStyle = value;

    text.style.backgroundClip = 'text';
    text.style.webkitBackgroundClip = 'text';

    textColors.text = null;
    textColors.shadow = null;
    textColors.secondShadow = null;
    textColors.someBackground = null;
    text.style.backgroundColor = '';
    someText.style.backgroundColor = '';

    document.querySelectorAll('.colorPair').forEach((b) => b.classList.remove('is-selected'));

    colorPairingButtons14.style.display = currentStyle === 'style1' || currentStyle === 'style4' ? 'block' : 'none';
    colorPairingButtons2.style.display = currentStyle === 'style2' ? 'block' : 'none';
    colorPairingButtons3.style.display = currentStyle === 'style3' ? 'block' : 'none';
    colorPairingButtons5.style.display = currentStyle === 'style5' ? 'block' : 'none';
    colorPairingButtons67.style.display = currentStyle === 'style6' || currentStyle === 'style7' ? 'block' : 'none';

    const hasSecondShadow = currentStyle === 'style2' || currentStyle === 'style3';
    secondShadowColorPicker.disabled = !hasSecondShadow;
    secondShadowColorPickerEnabled = hasSecondShadow;
    document.getElementById('wrapT').style.display = hasSecondShadow ? 'inline-block' : 'none';
    if (secondShadowColorPickerLabel) {
        secondShadowColorPickerLabel.style.display = hasSecondShadow ? 'inline-block' : 'none';
    }

    textColorPickerLabel.textContent = currentStyle === 'style5' ? 'Background Color :' : 'Text Color :';
    if (currentStyle === 'style5') text.style.color = 'transparent';

    someBackgroundColorPicker.style.display = 'inline-block';
    someBackgroundColorPickerLabel.style.display = 'inline-block';
    someBackgroundColorPickerLabel.textContent = 'Div Background Color :';

    syncTextPickers();
    repaintText();
};

radios1.forEach((radio) => radio.addEventListener('change', (e) => switchStyle(e.target.value)));

distanceSlider1.addEventListener('input', (e) => {
    currentShadowDistance = parseInt(e.target.value, 10);
    repaintText();
});
intensitySlider1.addEventListener('input', (e) => {
    SHADOW_INTENSITY = parseFloat(e.target.value);
    repaintText();
});
blurSlider1.addEventListener('input', (e) => {
    SHADOW_BLUR = parseInt(e.target.value, 10);
    repaintText();
});
sizeSlider1.addEventListener('input', (e) => {
    textSizeTouched = true;
    text.style.fontSize = `${parseFloat(e.target.value)}em`;
    textOrbit.refresh();
    repaintText();
});

function syncTextSizeSlider() {
    if (textSizeTouched) return;
    const px = parseFloat(window.getComputedStyle(text).fontSize);
    const parentPx = parseFloat(window.getComputedStyle(text.parentElement).fontSize) || 16;
    if (px && parentPx) sizeSlider1.value = clamp(px / parentPx, 1, 7);
}

textColorPicker.addEventListener('input', (e) => {
    if (currentStyle === 'style5') {
        text.style.backgroundColor = e.target.value;
    } else {
        textColors.text = e.target.value;
    }
    repaintText();
});

shadowColorPicker.addEventListener('input', (e) => {
    textColors.shadow = e.target.value;
    repaintText();
});

secondShadowColorPicker.addEventListener('input', (e) => {
    if (!secondShadowColorPickerEnabled) return;
    textColors.secondShadow = e.target.value;
    repaintText();
});

someBackgroundColorPicker.addEventListener('input', (e) => {
    textColors.someBackground = e.target.value;
    someText.style.backgroundColor = textColors.someBackground;
    repaintText();
});

document.querySelectorAll('.colorPair').forEach((button) => {
    button.addEventListener('click', () => {
        const pairText = button.dataset.text;
        const pairShadow = button.dataset.shadow;
        const pairShadow2 = button.dataset.shadow2;
        const pairSome = button.dataset.some;

        switch (currentStyle) {
            case 'style1':
            case 'style4':
                textColors.text = pairText;
                textColors.shadow = pairShadow;
                break;
            case 'style2':
            case 'style3':
                textColors.text = pairText;
                textColors.shadow = pairShadow;
                textColors.secondShadow = pairShadow2;
                break;
            case 'style5':
                textColors.someBackground = pairSome;
                textColors.shadow = pairShadow;
                text.style.backgroundColor = pairText;
                break;
            case 'style6':
            case 'style7':
                textColors.someBackground = pairSome;
                textColors.text = pairText;
                textColors.shadow = pairShadow;
                break;
            default:
                return;
        }

        document.querySelectorAll('.colorPair').forEach((b) => b.classList.remove('is-selected'));
        button.classList.add('is-selected');

        syncTextPickers();
        repaintText();
    });
});

resetButton.addEventListener('click', () => switchStyle(currentStyle));

document.getElementById('formatToggleText').addEventListener('change', (e) => {
    textOutputFormat = e.target.checked ? 'tailwind' : 'css';
    updateTextArea();
});

/* ------------------------------ copy buttons ----------------------------- */

function wireCopyButton({ buttonEl, textareaEl, copySvgSelector, doneSvgSelector }) {
    let resetTimer = null;
    buttonEl.addEventListener('click', () => {
        const source = textareaEl.querySelector('[data-copy]') || textareaEl;
        copyText(source.innerText).then(() => {
            const copySVG = document.querySelector(copySvgSelector);
            const doneSVG = document.querySelector(doneSvgSelector);
            copySVG.style.scale = 0;
            doneSVG.style.scale = 1;
            buttonEl.classList.add('firework-animation');
            if (copyStatus) copyStatus.textContent = 'Copied to clipboard';

            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                copySVG.style.scale = 1;
                doneSVG.style.scale = 0;
                buttonEl.classList.remove('firework-animation');
                if (copyStatus) copyStatus.textContent = '';
            }, 3000);
        }).catch((err) => {
            console.error('Failed to copy text: ', err);
            if (copyStatus) copyStatus.textContent = 'Copy failed — select the code and copy manually';
        });
    });
}

wireCopyButton({
    buttonEl: document.getElementById('copyButton'),
    textareaEl: boxOutput,
    copySvgSelector: '.copysvg',
    doneSvgSelector: '.donesvg'
});

wireCopyButton({
    buttonEl: document.getElementById('copyButtonS'),
    textareaEl: textOutput,
    copySvgSelector: '.copysvgS',
    doneSvgSelector: '.donesvgS'
});

/* ---------------------------- customization panels ----------------------- */

function wireCustomizationsToggle(checkboxId, panelId, outputEl) {
    const checkbox = document.getElementById(checkboxId);
    const panel = document.getElementById(panelId);
    let timer = null;

    checkbox.addEventListener('change', () => {
        clearTimeout(timer);
        if (checkbox.checked) {
            panel.style.height = 'auto';
            panel.style.padding = '1em';
            panel.style.zIndex = 5;
            panel.style.overflow = 'visible';
            outputEl.style.height = '6em';
            timer = setTimeout(() => { panel.style.opacity = 1; }, 200);
        } else {
            panel.style.opacity = 0;
            timer = setTimeout(() => {
                panel.style.height = 0;
                panel.style.padding = 0;
                panel.style.zIndex = -5;
                panel.style.overflow = 'hidden';
                outputEl.style.height = '11em';
            }, 400);
        }
    });
}

wireCustomizationsToggle('customizations-checkboxBox', 'customizationsBox', boxOutput);
wireCustomizationsToggle('customizations-checkbox', 'customizations', textOutput);

/* -------------------------------- font list ------------------------------ */

const fontSearch = document.getElementById('fontSearch');
const fontList = document.getElementById('fontList');
const FONTS_PER_LOAD = 100;
const FONT_CACHE_KEY = 'googleFontsList:v2';
const loadedFontLinks = new Set();
let fonts = [];
let allFonts = [];
let currentFocus = -1;

[
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
].forEach(({ rel, href, crossorigin }) => {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (crossorigin !== undefined) link.crossOrigin = crossorigin;
    document.head.appendChild(link);
});

function openFontList() {
    fontList.classList.add('is-open');
    fontSearch.setAttribute('aria-expanded', 'true');
}
function closeFontList() {
    fontList.classList.remove('is-open');
    fontSearch.setAttribute('aria-expanded', 'false');
    currentFocus = -1;
}

async function loadGoogleFonts() {
    try {
        const cached = safeStorage.get(FONT_CACHE_KEY);
        if (cached) {
            allFonts = JSON.parse(cached);
        } else {
            const response = await fetch('fonts.json', { priority: 'low' });
            if (!response.ok) throw new Error(`fonts.json request failed: ${response.status}`);
            allFonts = await response.json();
            safeStorage.set(FONT_CACHE_KEY, JSON.stringify(allFonts));
        }
        if (!Array.isArray(allFonts) || !allFonts.length) throw new Error('empty font list');
    } catch (error) {
        console.error('Error loading font list:', error);
        safeStorage.remove(FONT_CACHE_KEY);
        allFonts = ['Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Space Mono'];
    }
    fonts = allFonts.slice(0, FONTS_PER_LOAD);
    updateFontList(fonts);
}

function updateFontList(fontArray) {
    fontList.textContent = '';
    fontArray.forEach((font) => {
        const li = document.createElement('li');
        li.textContent = font;
        li.setAttribute('role', 'option');
        li.addEventListener('click', () => selectFont(font));
        fontList.appendChild(li);
    });
    if (fontArray === fonts && fonts.length < allFonts.length) {
        const loadMore = document.createElement('li');
        loadMore.textContent = 'Load more..';
        loadMore.classList.add('load-more');
        loadMore.addEventListener('click', (e) => {
            e.stopPropagation();
            fonts = allFonts.slice(0, fonts.length + FONTS_PER_LOAD);
            updateFontList(fonts);
            openFontList();
        });
        fontList.appendChild(loadMore);
    }
}

function selectFont(fontFamily) {
    fontSearch.value = fontFamily;
    loadAndApplyFont(fontFamily);
    closeFontList();
}

function loadAndApplyFont(fontFamily) {
    if (!loadedFontLinks.has(fontFamily)) {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css?family=${encodeURIComponent(fontFamily).replace(/%20/g, '+')}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        loadedFontLinks.add(fontFamily);
    }
    text.style.fontFamily = `'${fontFamily}', sans-serif`;
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            textOrbit.refresh();
            repaintText();
        });
    }
}

function addActive(items) {
    if (!items || !items.length) return;
    removeActive(items);
    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = items.length - 1;
    const active = items[currentFocus];
    active.classList.add('active');

    const top = active.offsetTop;
    if (top < fontList.scrollTop) {
        fontList.scrollTop = top;
    } else if (top + active.offsetHeight > fontList.scrollTop + fontList.offsetHeight) {
        fontList.scrollTop = top + active.offsetHeight - fontList.offsetHeight;
    }
}

function removeActive(items) {
    for (let i = 0; i < items.length; i++) items[i].classList.remove('active');
}

fontSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    updateFontList(allFonts.filter((font) => font.toLowerCase().includes(searchTerm)).slice(0, FONTS_PER_LOAD));
    openFontList();
    currentFocus = -1;
});

fontSearch.addEventListener('focus', openFontList);

fontSearch.addEventListener('keydown', (e) => {
    const items = fontList.getElementsByTagName('li');
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        currentFocus++;
        addActive(items);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        currentFocus--;
        addActive(items);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentFocus > -1 && items[currentFocus]) items[currentFocus].click();
    } else if (e.key === 'Escape') {
        closeFontList();
    }
});

document.addEventListener('click', (e) => {
    if (!fontSearch.contains(e.target) && !fontList.contains(e.target)) closeFontList();
});

/* ------------------------------ view switching --------------------------- */

const mainEl = document.getElementById('main');
const mainBEl = document.getElementById('mainB');
const mainCheckbox = document.querySelector('.main .switch input');
const mainBCheckbox = document.querySelector('.mainB .switch input');
let activeView = 'box';
let viewTimer = null;

function showView(view, animate = true) {
    activeView = view;
    const showEl = view === 'box' ? mainEl : mainBEl;
    const hideEl = view === 'box' ? mainBEl : mainEl;

    clearTimeout(viewTimer);

    showEl.style.display = 'flex';
    showEl.style.position = 'relative';
    showEl.style.zIndex = '2';
    showEl.removeAttribute('inert');
    hideEl.style.position = 'absolute';
    hideEl.style.zIndex = '1';
    hideEl.style.opacity = '0';
    hideEl.setAttribute('inert', '');

    if (animate) {
        requestAnimationFrame(() => { showEl.style.opacity = '1'; });
        viewTimer = setTimeout(() => { hideEl.style.display = 'none'; }, 400);
    } else {
        showEl.style.opacity = '1';
        hideEl.style.display = 'none';
    }

    mainCheckbox.checked = view !== 'box';
    mainBCheckbox.checked = view !== 'box';

    if (view === 'box') {
        syncBoxSizeSlider();
        boxOrbit.refresh();
        repaintBox();
    } else {
        syncTextSizeSlider();
        textOrbit.refresh();
        repaintText();
    }
    scheduleScrollbarCheck();
}

mainCheckbox.addEventListener('change', function () {
    showView(this.checked ? 'text' : 'box');
});
mainBCheckbox.addEventListener('change', function () {
    showView(this.checked ? 'text' : 'box');
});

/* --------------------------------- theme --------------------------------- */

function applyCurrentTheme() {
    repaintBox();
    repaintText();
}

function switchTheme(e) {
    const theme = e.target.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    safeStorage.set('theme', theme);
    resetColors();
    switchStyle(currentStyle);
    applyCurrentTheme();
}

toggleSwitchsecond.checked = getTheme() === 'dark';
toggleSwitchsecond.addEventListener('change', switchTheme);

/* ------------------------------- info popup ------------------------------ */

let lastFocusedBeforePopup = null;

function openPop(id) {
    const popup = document.getElementById(id);
    if (!popup) return;
    lastFocusedBeforePopup = document.activeElement;
    popup.classList.add('is-open');
    popup.classList.remove('is-close');
    popup.removeAttribute('aria-hidden');
    mainEl.setAttribute('inert', '');
    mainBEl.setAttribute('inert', '');
    document.body.style.overflow = 'hidden';
    const closeBtn = popup.querySelector('[data-close-popup]');
    if (closeBtn) closeBtn.focus();
}

function closePop(id) {
    const popup = document.getElementById(id);
    if (!popup) return;
    popup.classList.add('is-close');
    setTimeout(() =>{
        popup.classList.remove('is-open');
    }, 400)
    popup.setAttribute('aria-hidden', 'true');
    mainEl.removeAttribute('inert');
    mainBEl.removeAttribute('inert');
    if (activeView === 'box') {
        mainBEl.setAttribute('inert', '');
    } else {
        mainEl.setAttribute('inert', '');
    }
    document.body.style.overflow = 'auto';
    if (lastFocusedBeforePopup && lastFocusedBeforePopup.focus) lastFocusedBeforePopup.focus();
}

document.querySelectorAll('[data-open-popup]').forEach((el) => {
    el.addEventListener('click', () => openPop(el.dataset.openPopup));
});
document.querySelectorAll('[data-close-popup]').forEach((el) => {
    el.addEventListener('click', () => closePop(el.dataset.closePopup));
});
document.getElementById('info').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closePop('info');
});
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = document.querySelector('.info_popup.is-open');
    if (open) closePop(open.id);
});

let scrollbarFrame = null;
function scheduleScrollbarCheck() {
    if (scrollbarFrame) return;
    scrollbarFrame = requestAnimationFrame(() => {
        scrollbarFrame = null;
        checkScrollbar();
    });
}

function checkScrollbar() {
    const wide = window.innerWidth > 650;
    [
        { data: mainEl.querySelector('.data'), button: document.getElementById('info_button') },
        { data: mainBEl.querySelector('.data'), button: document.getElementById('info_button1') }
    ].forEach(({ data, button }) => {
        if (!data || !button) return;
        const overflowing = data.scrollHeight > data.clientHeight && wide;
        data.classList.toggle('data-with-scrollbar', overflowing);
        button.style.opacity = overflowing ? 0 : 1;
    });
}

let resizeFrame = null;
window.addEventListener('resize', () => {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
        resizeFrame = null;
        updateOffsetDistance();

        if (window.innerWidth < 280) {
            mainEl.style.display = 'none';
            mainBEl.style.display = 'none';
            return;
        }

        if (activeView === 'box') {
            syncBoxSizeSlider();
            boxOrbit.refresh();
        } else {
            syncTextSizeSlider();
            textOrbit.refresh();
        }
        checkScrollbar();
    });
});

if ('ResizeObserver' in window) {
    const scrollbarObserver = new ResizeObserver(scheduleScrollbarCheck);
    document.querySelectorAll('.data').forEach((el) => scrollbarObserver.observe(el));
} else {
    setInterval(scheduleScrollbarCheck, 500);
}

/* --------------------------------- start --------------------------------- */

document.getElementById('year').textContent = new Date().getFullYear();

updateGradientColorPickersState();
updateColorPairingButtonsVisibility();
resetColors();
syncBoxSizeSlider();
boxOrbit.moveToAngle(Math.PI / 4);

switchStyle('style1');
showView('box', false);
loadGoogleFonts();
window.addEventListener('load', () => {
    syncBoxSizeSlider();
    boxOrbit.refresh();
    checkScrollbar();
});