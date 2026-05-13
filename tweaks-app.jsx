// tweaks-app.jsx
// Tweaks panel + DOM application for the invitation.

const THEMES = {
  beet: {
    label: 'Beet',
    accent: '#A82158',
    accentStrong: '#821A42',
    accent500: '#E2477F',
    accent400: '#F07AA1',
    accent300: '#F7AFC6',
    accent200: '#FBD0DD',
    accent100: '#FDE7EE',
    bg: '#FBF6EE',
    cream: '#FBF6EE',
    swatch: ['#A82158', '#FBF6EE', '#6E8C4A'],
  },
  wine: {
    label: 'Wine',
    accent: '#6D1A36',
    accentStrong: '#4A0F22',
    accent500: '#9B3251',
    accent400: '#C45E7B',
    accent300: '#E396AC',
    accent200: '#F1C3D0',
    accent100: '#F8E2E8',
    bg: '#F7EFE3',
    cream: '#F7EFE3',
    swatch: ['#6D1A36', '#F7EFE3', '#C8965C'],
  },
  olive: {
    label: 'Olive',
    accent: '#5C7A2E',
    accentStrong: '#3F551E',
    accent500: '#7CA047',
    accent400: '#9DB875',
    accent300: '#C3D2A4',
    accent200: '#DDE4C8',
    accent100: '#EEF1E0',
    bg: '#F5F1E6',
    cream: '#F5F1E6',
    swatch: ['#5C7A2E', '#F5F1E6', '#A82158'],
  },
  ink: {
    label: 'Ink',
    accent: '#2E1721',
    accentStrong: '#0F0709',
    accent500: '#5C3A48',
    accent400: '#8E6F7A',
    accent300: '#B8A4AC',
    accent200: '#D9C9CF',
    accent100: '#EDE5E8',
    bg: '#F6F2EE',
    cream: '#F6F2EE',
    swatch: ['#2E1721', '#F6F2EE', '#A82158'],
  },
};

const SPARKLES = ['✦', '✧', '✺', '❀', '✱', '◆'];

function applyTweaks(t) {
  const root = document.documentElement;
  const theme = THEMES[t.theme] || THEMES.beet;

  // Color overrides via CSS custom properties on :root
  root.style.setProperty('--beet-700', theme.accent);
  root.style.setProperty('--beet-800', theme.accentStrong);
  root.style.setProperty('--beet-600', theme.accent);
  root.style.setProperty('--beet-500', theme.accent500);
  root.style.setProperty('--beet-400', theme.accent400);
  root.style.setProperty('--beet-300', theme.accent300);
  root.style.setProperty('--beet-200', theme.accent200);
  root.style.setProperty('--beet-100', theme.accent100);
  root.style.setProperty('--cream', theme.bg);
  root.style.setProperty('--bg', theme.bg);

  // Sparkles visibility + glyph
  document.querySelectorAll('[data-sparkle]').forEach((el) => {
    el.style.display = t.showSparkles ? '' : 'none';
    el.textContent = t.sparkleStyle || '✦';
  });

  // Floating tag visibility
  const tag = document.querySelector('.cover-tag');
  if (tag) tag.style.display = t.showFloatingTag ? '' : 'none';

  // Photo side swap (left / right)
  const cover = document.querySelector('.cover');
  if (cover) {
    if (t.photoSide === 'left') {
      cover.style.gridTemplateColumns = '0.95fr 1.05fr';
      cover.style.direction = 'rtl';
    } else {
      cover.style.gridTemplateColumns = '1.05fr 0.95fr';
      cover.style.direction = 'ltr';
    }
    // ensure inner content reads ltr regardless
    cover.querySelectorAll('.cover-left, .cover-right').forEach((el) => {
      el.style.direction = 'ltr';
    });
  }

  // Photo zoom
  const photo = document.querySelector('.cover-photo');
  if (photo) photo.style.transform = `scale(${t.photoZoom})`;

  // Title font size
  const title = document.querySelector('.cover-title');
  if (title) title.style.fontSize = `${t.titleSize}px`;

  // Hide curved seam if photo flipped (it's positioned for right-photo only)
  const seam = document.querySelector('.cover-seam');
  if (seam) seam.style.display = t.photoSide === 'left' ? 'none' : '';
}

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply on every change
  React.useEffect(() => { applyTweaks(t); }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme" />
      <TweakColor
        label="Palette"
        value={THEMES[t.theme]?.swatch || THEMES.beet.swatch}
        options={Object.values(THEMES).map((th) => th.swatch)}
        onChange={(v) => {
          const key = Object.keys(THEMES).find(
            (k) => THEMES[k].swatch.join() === (v || []).join()
          );
          if (key) setTweak('theme', key);
        }}
      />

      <TweakSection label="Cover decor" />
      <TweakToggle
        label="Sparkles"
        value={t.showSparkles}
        onChange={(v) => setTweak('showSparkles', v)}
      />
      <TweakSelect
        label="Sparkle glyph"
        value={t.sparkleStyle}
        options={SPARKLES}
        onChange={(v) => setTweak('sparkleStyle', v)}
      />
      <TweakToggle
        label="Floating tag"
        value={t.showFloatingTag}
        onChange={(v) => setTweak('showFloatingTag', v)}
      />

      <TweakSection label="Cover layout" />
      <TweakRadio
        label="Photo side"
        value={t.photoSide}
        options={['left', 'right']}
        onChange={(v) => setTweak('photoSide', v)}
      />
      <TweakSlider
        label="Photo zoom"
        value={t.photoZoom}
        min={1}
        max={1.6}
        step={0.05}
        onChange={(v) => setTweak('photoZoom', v)}
      />
      <TweakSlider
        label="Title size"
        value={t.titleSize}
        min={64}
        max={128}
        step={2}
        unit="px"
        onChange={(v) => setTweak('titleSize', v)}
      />
    </TweaksPanel>
  );
}

// Apply defaults immediately on load so the cover reflects saved tweaks
// even before the user opens the panel.
applyTweaks(TWEAK_DEFAULTS);

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<TweaksApp />);
