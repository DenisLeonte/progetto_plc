import { useState, useEffect, useRef, useCallback } from 'react';

const LS_KEY  = 'plc-tweaks';
const DEFAULTS = { atmosfera: 'Asfalto', carattere: 'Geometrico', energia: 'Medio' };

/* ── Panel CSS (injected once into <head>) ── */
const PANEL_CSS = `
  .twk-fab{position:fixed;right:16px;bottom:16px;z-index:2147483646;
    width:40px;height:40px;border-radius:50%;border:0;
    background:rgba(219,98,2,.9);color:#fff;font-size:17px;
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 4px 16px rgba(0,0,0,.4);cursor:pointer;
    transition:background .15s,transform .15s;}
  .twk-fab:hover{background:#f07d24;transform:scale(1.07);}

  .twk-panel{position:fixed;right:16px;bottom:64px;z-index:2147483645;width:274px;
    max-height:calc(100vh - 100px);display:flex;flex-direction:column;
    background:rgba(250,249,247,.82);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.2);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden;
    animation:twk-in .18s ease;}
  @keyframes twk-in{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}

  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;}
  .twk-hd b{font-size:12px;font-weight:600;}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:pointer;font-size:13px;}
  .twk-x:hover{background:rgba(0,0,0,.07);color:#29261b;}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;}
  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:8px 0 0;}
  .twk-sect:first-child{padding-top:0;}
  .twk-row{display:flex;flex-direction:column;gap:5px;}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72);font-weight:500;}
  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none;}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s;}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:pointer;padding:4px 6px;line-height:1.2;}
`;

/* ── TweakRadio ── */
function TweakRadio({ label, value, options, onChange }) {
  const trackRef = useRef(null);
  const opts = options.map(o => (typeof o === 'object' ? o : { value: o, label: o }));
  const idx  = Math.max(0, opts.findIndex(o => o.value === value));
  const n    = opts.length;

  return (
    <div className="twk-row">
      <div className="twk-lbl"><span>{label}</span></div>
      <div ref={trackRef} role="radiogroup" className="twk-seg">
        <div
          className="twk-seg-thumb"
          style={{ left: `calc(2px + ${idx} * (100% - 4px) / ${n})`, width: `calc((100% - 4px) / ${n})` }}
        />
        {opts.map(o => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={o.value === value}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Main PLCTweaks component ── */
export default function PLCTweaks({ logoLight, logoDark }) {
  const saved   = (() => { try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch { return null; } })();
  const [vals, setVals]   = useState({ ...DEFAULTS, ...saved });
  const [open, setOpen]   = useState(false);

  const setTweak = useCallback((key, val) => {
    setVals(prev => {
      const next = { ...prev, [key]: val };
      try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  /* Apply body classes + logo swap whenever values change */
  useEffect(() => {
    const b   = document.body;
    const low = s => s.toLowerCase();

    b.classList.remove('mood-notte', 'mood-asfalto', 'mood-cemento');
    b.classList.add('mood-' + low(vals.atmosfera));

    b.classList.remove('char-schizzo', 'char-industriale', 'char-geometrico');
    b.classList.add('char-' + low(vals.carattere));

    b.classList.remove('acc-sobrio', 'acc-medio', 'acc-acceso');
    b.classList.add('acc-' + low(vals.energia));

    const src = low(vals.atmosfera) === 'cemento' ? logoDark : logoLight;
    document.getElementById('nav-logo')?.setAttribute('src', src);
    document.getElementById('footer-logo')?.setAttribute('src', src);
  }, [vals, logoLight, logoDark]);

  return (
    <>
      <style>{PANEL_CSS}</style>

      {/* Floating toggle button */}
      <button
        className="twk-fab"
        aria-label="Apri pannello tweaks"
        title="Tweaks"
        onClick={() => setOpen(v => !v)}
      >
        ⚙
      </button>

      {open && (
        <div className="twk-panel" role="dialog" aria-label="Tweaks">
          <div className="twk-hd">
            <b>Tweaks</b>
            <button className="twk-x" aria-label="Chiudi" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="twk-body">
            <div className="twk-sect">Atmosfera</div>
            <TweakRadio
              label="Palette"
              value={vals.atmosfera}
              options={['Notte', 'Asfalto', 'Cemento']}
              onChange={v => setTweak('atmosfera', v)}
            />

            <div className="twk-sect">Carattere</div>
            <TweakRadio
              label="Tipografia"
              value={vals.carattere}
              options={['Schizzo', 'Industriale', 'Geometrico']}
              onChange={v => setTweak('carattere', v)}
            />

            <div className="twk-sect">Energia arancione</div>
            <TweakRadio
              label="Intensità"
              value={vals.energia}
              options={['Sobrio', 'Medio', 'Acceso']}
              onChange={v => setTweak('energia', v)}
            />
          </div>
        </div>
      )}
    </>
  );
}
