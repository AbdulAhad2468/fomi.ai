'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownToLine, ArrowLeft, ArrowRight, Check, ChevronDown, CircleHelp, Clock3, Command, Columns2, Film, FolderClosed, Heart, Image as ImageIcon, Layers2, Maximize2, Menu, MoreHorizontal, Pause, Play, Plus, Send, Settings2, SlidersHorizontal, Sparkles, WandSparkles, X } from 'lucide-react';
import { assets, directions, starterWorks } from '../lib/data';
import styles from './page.module.css';

const shortPrompt = 'A solitary traveler crossing a volcanic ridge at first light. A sense of scale, quiet, and possibility.';

function IconButton({ label, children, onClick, active = false, className = '' }) {
  return <button type="button" aria-label={label} title={label} onClick={onClick} className={`${styles.iconButton} ${active ? styles.iconActive : ''} ${className}`}>{children}</button>;
}

function ResultCard({ work, active, saved, compared, onOpen, onSave, onCompare }) {
  return <article className={`${styles.resultCard} ${active ? styles.resultActive : ''}`}>
    <button className={styles.cardImageButton} onClick={onOpen} aria-label={`Open ${work.title}`}>
      <Image src={work.image} alt={work.prompt} fill sizes="(max-width: 700px) 80vw, 320px" className={styles.cardImage} />
      {work.type === 'video' && <span className={styles.cardType}><Play size={12} fill="currentColor" /> Motion preview</span>}
    </button>
    <div className={styles.cardBottom}><div><strong>{work.title}</strong><span>{work.direction} · {work.ratio}</span></div><div className={styles.cardActions}>
      <IconButton label={compared ? 'Remove from comparison' : 'Add to comparison'} active={compared} onClick={onCompare}><Columns2 size={16} /></IconButton>
      <IconButton label={saved ? 'Remove from saved' : 'Save result'} active={saved} onClick={onSave}><Heart size={16} fill={saved ? 'currentColor' : 'none'} /></IconButton>
    </div></div>
  </article>;
}

export default function StudioPage() {
  const [works, setWorks] = useState(starterWorks);
  const [activeId, setActiveId] = useState('work-1');
  const [prompt, setPrompt] = useState(shortPrompt);
  const [direction, setDirection] = useState('Atmosphere');
  const [ratio, setRatio] = useState('Landscape');
  const [type, setType] = useState('image');
  const [savedIds, setSavedIds] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [reference, setReference] = useState(null);
  const [mobilePanel, setMobilePanel] = useState(false);
  const [playing, setPlaying] = useState(false);
  const fileInput = useRef(null);
  const active = works.find(work => work.id === activeId) || works[0];
  const compared = compareIds.map(id => works.find(work => work.id === id)).filter(Boolean);

  useEffect(() => {
    try { const saved = JSON.parse(localStorage.getItem('fomi-saved') || '[]'); if (Array.isArray(saved)) setSavedIds(saved); } catch {}
  }, []);
  useEffect(() => { localStorage.setItem('fomi-saved', JSON.stringify(savedIds)); }, [savedIds]);
  useEffect(() => {
    if (!showCompare) return;
    const close = event => { if (event.key === 'Escape') setShowCompare(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [showCompare]);

  function openWork(work) {
    setActiveId(work.id); setPlaying(false); setMobilePanel(false);
  }
  function toggleSaved(id) { setSavedIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]); }
  function toggleCompare(id) {
    setCompareIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current.slice(-1), id]);
  }
  function showNotice(message) { setNotice(message); window.setTimeout(() => setNotice(''), 4500); }
  async function generate() {
    if (isGenerating) return;
    setError(''); setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, direction, ratio, type }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not create the preview.');
      setWorks(current => [data.result, ...current]); setActiveId(data.result.id); setPlaying(false); setMobilePanel(false);
      showNotice(type === 'video' ? 'Motion study added to the decision trail.' : 'Exploration added to the decision trail.');
    } catch (caught) { setError(caught.message); } finally { setIsGenerating(false); }
  }
  async function download() {
    const response = await fetch(active.image);
    const blob = await response.blob();
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `fomi-${active.id}.png`; link.click();
    URL.revokeObjectURL(link.href);
  }
  function addReference(event) {
    const file = event.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Choose an image reference.'); return; }
    if (file.size > 8 * 1024 * 1024) { setError('Reference images must be under 8 MB.'); return; }
    setReference({ name: file.name, url: URL.createObjectURL(file) }); setError('');
  }
  function useAsStartingPoint(work) {
    setPrompt(work.prompt); setDirection(work.direction); setRatio(work.ratio); setType(work.type); setMobilePanel(true);
    showNotice('Settings copied into the composer.');
  }

  return <div className={styles.shell}>
    <aside className={styles.rail} aria-label="Workspace navigation">
      <Link href="/" className={styles.brand} aria-label="Fomi home"><span className={styles.brandMark}>f</span><span className={styles.brandName}>fomi<span className={styles.brandDot}>.</span></span></Link>
      <div className={styles.railNav}><span className={styles.railLabel}>WORKSPACE</span>
        <Link href="/" className={`${styles.railItem} ${styles.railSelected}`}><Layers2 size={18} /><span>Studio</span></Link>
        <a href="#decision-trail" className={styles.railItem}><Clock3 size={18} /><span>Decision trail</span></a>
        <Link href="/reference" className={styles.railItem}><ImageIcon size={18} /><span>Reference build</span></Link>
      </div>
      <div className={styles.railFooter}><div className={styles.avatar}>AM</div><div><strong>Alex Morgan</strong><span>Personal workspace</span></div><MoreHorizontal size={17} /></div>
    </aside>

    <main className={styles.main}>
      <header className={styles.topbar}><div className={styles.projectPath}><span className={styles.mobileLogo}>fomi.</span><span>Projects</span><span className={styles.slash}>/</span><strong>Atlas campaign</strong><ChevronDown size={14} /></div><div className={styles.topActions}><span className={styles.demoPill}>INTERACTIVE CONCEPT</span><Link href="/reference" className={styles.referenceLink}>View Part A <ArrowRight size={14} /></Link></div></header>
      <div className={styles.content}>
        <div className={styles.heading}><div><div className={styles.eyebrow}><span className={styles.liveDot} /> PROJECT 04 <span className={styles.eyebrowDivider}>/</span> IMAGE WORKSPACE</div><h1>Give every idea a direction.</h1><p>Create, compare, and keep the reasoning behind each visual choice.</p></div><button className={styles.mobileComposerToggle} onClick={() => setMobilePanel(!mobilePanel)}><SlidersHorizontal size={17} /> {mobilePanel ? 'Hide controls' : 'Open composer'}</button></div>
        <div className={styles.workspace}>
          <section className={`${styles.composer} ${mobilePanel ? styles.composerOpen : ''}`} aria-label="Create a new exploration">
            <div className={styles.panelHeader}><div><span className={styles.panelKicker}>01 / CREATE</span><h2>New exploration</h2></div><WandSparkles size={19} /></div>
            <div className={styles.modeSwitch} role="group" aria-label="Output type"><button className={type === 'image' ? styles.modeActive : ''} aria-pressed={type === 'image'} onClick={() => setType('image')}><ImageIcon size={16} /> Image</button><button className={type === 'video' ? styles.modeActive : ''} aria-pressed={type === 'video'} onClick={() => setType('video')}><Film size={16} /> Motion</button></div>
            <label className={styles.fieldLabel} htmlFor="prompt">Your idea <span>⌘ + Enter</span></label>
            <textarea id="prompt" value={prompt} onChange={event => setPrompt(event.target.value)} onKeyDown={event => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') generate(); }} placeholder="Describe the scene, subject, or feeling…" rows={7} />
            <p className={styles.promptHint}>Describe what matters. Fine tune the rest below.</p>
            <div className={styles.fieldDivider} />
            <div className={styles.fieldLabel}>Direction <span>Choose one</span></div>
            <div className={styles.directionList}>{directions.map(option => <button key={option.id} onClick={() => setDirection(option.id)} className={`${styles.direction} ${direction === option.id ? styles.directionActive : ''}`} aria-pressed={direction === option.id}><span className={styles.directionRadio}>{direction === option.id && <span />}</span><span><strong>{option.id}</strong><small>{option.description}</small></span></button>)}</div>
            <div className={styles.fieldLabel}>Frame</div><div className={styles.ratioList}>{['Portrait', 'Square', 'Landscape'].map(item => <button key={item} onClick={() => setRatio(item)} className={ratio === item ? styles.ratioActive : ''} aria-pressed={ratio === item}><span className={`${styles.ratioIcon} ${styles[`ratio${item}`]}`} />{item}</button>)}</div>
            <input ref={fileInput} type="file" accept="image/*" className={styles.hiddenInput} onChange={addReference} aria-label="Upload reference image" />
            <button className={styles.referenceUpload} onClick={() => fileInput.current?.click()}><Plus size={16} /><span>{reference ? reference.name : 'Add visual reference'}<small>{reference ? 'Reference attached to this session' : 'Optional · PNG or JPG, up to 8 MB'}</small></span>{reference && <Check size={16} />}</button>
            {reference && <button className={styles.removeReference} onClick={() => { URL.revokeObjectURL(reference.url); setReference(null); if (fileInput.current) fileInput.current.value = ''; }}>Remove reference</button>}
            {error && <p className={styles.error} role="alert">{error}</p>}
            <button className={styles.generate} onClick={generate} disabled={isGenerating}><Sparkles size={17} />{isGenerating ? 'Creating preview…' : `Create ${type === 'video' ? 'motion study' : 'exploration'}`}<ArrowRight size={17} /></button>
            <p className={styles.mockNote}>Demo API · results use curated sample media</p>
          </section>

          <section className={styles.gallery} aria-label="Project outputs">
            <div className={styles.galleryHeader}><div><span className={styles.panelKicker}>02 / REVIEW</span><h2>Current frame</h2></div><div className={styles.galleryTools}><span>{works.length} explorations</span><IconButton label="Download current image" onClick={download}><ArrowDownToLine size={17} /></IconButton></div></div>
            <div className={`${styles.heroImageWrap} ${playing ? styles.heroPlaying : ''}`}>
              <Image src={active.image} alt={active.prompt} fill priority sizes="(max-width: 700px) 100vw, (max-width: 1200px) 60vw, 800px" className={styles.heroImage} />
              <div className={styles.imageOverlayTop}><span><span className={styles.overlayDot} /> {active.type === 'video' ? 'MOTION STUDY' : 'SELECTED FRAME'}</span><span>{active.ratio.toUpperCase()}</span></div>
              {active.type === 'video' && <button className={styles.playButton} onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause motion preview' : 'Play motion preview'}>{playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}</button>}
              <div className={styles.imageOverlayBottom}><span>{active.title}</span><span>{active.type === 'video' ? active.duration : '01 / 01'}</span></div>
            </div>
            <div className={styles.activeDetails}><div><div className={styles.activeMeta}><span>{active.direction}</span><span>·</span><span>{active.date}</span></div><p>{active.prompt}</p></div><button onClick={() => useAsStartingPoint(active)}><WandSparkles size={15} /> Use as starting point</button></div>
            <div className={styles.sectionTitle}><div><span className={styles.panelKicker}>EXPLORE</span><h3>Related directions</h3></div>{compareIds.length === 2 && <button className={styles.compareTrigger} onClick={() => setShowCompare(true)}><Columns2 size={15} /> Compare selected <span>2</span></button>}</div>
            <div className={styles.results}>{works.filter(work => work.id !== active.id).slice(0, 4).map(work => <ResultCard key={work.id} work={work} active={false} saved={savedIds.includes(work.id)} compared={compareIds.includes(work.id)} onOpen={() => openWork(work)} onSave={() => toggleSaved(work.id)} onCompare={() => toggleCompare(work.id)} />)}</div>
          </section>

          <aside className={styles.trail} id="decision-trail" aria-label="Decision trail"><div className={styles.trailHeader}><div><span className={styles.panelKicker}>03 / REMEMBER</span><h2>Decision trail</h2></div><span className={styles.trailCount}>{works.length}</span></div><p className={styles.trailIntro}>Keep the context, not just the pixels. Reopen any direction to continue from it.</p><div className={styles.timeline}>{works.map((work, index) => <button key={work.id} className={`${styles.timelineItem} ${work.id === active.id ? styles.timelineActive : ''}`} onClick={() => openWork(work)}><span className={styles.timelineMarker} /><span className={styles.timelineBody}><span className={styles.timelineDate}>{work.date}</span><strong>{work.title}</strong><span>{work.direction} · {work.type === 'video' ? 'Motion' : work.ratio}</span><span className={styles.timelineThumb}><Image src={work.image} alt="" fill sizes="88px" /></span></span></button>)}</div><div className={styles.trailFoot}><CircleHelp size={16} /><span>Every creation keeps its prompt and settings together.</span></div></aside>
        </div>
      </div>
    </main>
    {notice && <div className={styles.toast} role="status"><Check size={16} />{notice}</div>}
    {showCompare && <div className={styles.modalBackdrop} onMouseDown={event => { if (event.target === event.currentTarget) setShowCompare(false); }}><div className={styles.compareModal} role="dialog" aria-modal="true" aria-label="Compare two explorations"><div className={styles.modalHeader}><div><span className={styles.panelKicker}>SIDE BY SIDE</span><h2>Compare directions</h2></div><IconButton label="Close comparison" onClick={() => setShowCompare(false)}><X size={20} /></IconButton></div><div className={styles.compareGrid}>{compared.map(work => <div key={work.id}><div className={styles.compareImage}><Image src={work.image} alt={work.prompt} fill sizes="45vw" /></div><h3>{work.title}</h3><p>{work.prompt}</p><span>{work.direction} · {work.ratio}</span></div>)}</div></div></div>}
  </div>;
}
