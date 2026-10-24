'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDownToLine, ChevronDown, Clapperboard, Clock3, FolderClosed, Heart, Home, Image as ImageIcon, Menu, Moon, MoreHorizontal, Play, Settings2, Sparkles, WandSparkles, X } from 'lucide-react';
import { assets } from '../../lib/data';
import styles from './page.module.css';

const initialPrompt = 'A professional portrait photograph of a smiling 31-year-old red-haired woman with warm hazel eyes and softly tousled auburn hair, framed from the chest up. She is turned slightly toward the viewer, offering a genuine and approachable expression. She is wearing a cream-colored cashmere sweater and delicate gold earrings. The background is a softly blurred expanse of muted gray and beige tones, suggesting a modern art gallery. There is subtle directional lighting.';
const strip = [assets.portraitA,assets.ridge,assets.house,assets.portraitB,assets.glass,assets.portraitA,assets.portraitB,assets.house,assets.ridge,assets.glass,assets.portraitB,assets.house,assets.portraitA];
const starterResults = Array.from({ length: 8 }, (_, index) => ({ id: `portrait-${index}`, image: index % 2 ? assets.portraitB : assets.portraitA, prompt: initialPrompt }));

export default function ReferencePage() {
  const [mode, setMode] = useState('image');
  const [prompt, setPrompt] = useState('');
  const [count, setCount] = useState('4');
  const [ratio, setRatio] = useState('1:1');
  const [model, setModel] = useState('Model: Name');
  const [advanced, setAdvanced] = useState(false);
  const [stylesOpen, setStylesOpen] = useState(false);
  const [style, setStyle] = useState('Natural');
  const [results, setResults] = useState(starterResults);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(true);

  async function generate() {
    setError(''); setLoading(true);
    try {
      const response = await fetch('/api/generate', { method:'POST', headers:{ 'Content-Type':'application/json' }, body:JSON.stringify({ surface:'reference', prompt, count, type:mode, direction:'Atmosphere', ratio }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not create preview.');
      setResults(current => [...data.results, ...current]);
    } catch (caught) { setError(caught.message); } finally { setLoading(false); }
  }
  async function download(item) {
    const response = await fetch(item.image); const blob = await response.blob();
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `fomi-${item.id}.png`; link.click(); URL.revokeObjectURL(link.href);
  }
  function toggleFavorite(id) { setFavoriteIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]); }

  return <div className={styles.page}>
    <header className={styles.header}><Link href="/" className={styles.logo} aria-label="Fomi studio">F</Link><div className={styles.mainNav}><div className={styles.progress}><span /></div><nav aria-label="Main"><Link href="/" title="Home"><Home size={15} fill="currentColor" /></Link><button className={styles.navActive} title="Images" aria-label="Images"><ImageIcon size={15} /></button><button onClick={() => setMode('video')} title="Video" aria-label="Video"><Clapperboard size={15} fill="currentColor" /></button><button onClick={() => setAdvanced(!advanced)} title="Tools" aria-label="Tools"><WandSparkles size={15} /></button><button onClick={() => setHistoryOpen(!historyOpen)} title="History" aria-label="History"><FolderClosed size={15} fill="currentColor" /></button></nav></div><div className={styles.headerRight}><button title="Gallery" onClick={() => setHistoryOpen(!historyOpen)}>◉ Gallery</button><button title="Support" onClick={() => setError('This demo is a frontend assessment. Use the Studio link for the original workspace.')}>ⓘ Support</button><Moon size={14} /><span className={styles.avatar}>A</span></div></header>
    <div className={styles.historyBar}><button className={styles.historyTile} onClick={() => setHistoryOpen(!historyOpen)}><strong>History</strong><span>View all</span></button>{historyOpen && <div className={styles.historyScroll}>{strip.map((src,index) => <button key={index} onClick={() => setActive({ id:`history-${index}`,image:src,prompt:initialPrompt })} aria-label={`Open history image ${index + 1}`}><Image src={src} alt="" fill sizes="55px" /></button>)}</div>}</div>
    <div className={styles.body}><aside className={styles.controls}><div className={styles.modeToggle} role="group" aria-label="Generation mode"><button className={mode === 'image' ? styles.selected : ''} onClick={() => setMode('image')}>Image</button><button className={mode === 'video' ? styles.selected : ''} onClick={() => setMode('video')}>Video</button></div><div className={styles.promptBox}><textarea value={prompt} onChange={event => setPrompt(event.target.value)} placeholder="Describe your imaginations to be converted to piece of art ..." aria-label="Generation prompt" /><button onClick={generate} disabled={loading}><Sparkles size={16} /> {loading ? 'Creating…' : 'Generate'}</button></div><div className={styles.selectRow}><label><span className={styles.srOnly}>Number of results</span><select value={count} onChange={event => setCount(event.target.value)}><option value="1">1 image</option><option value="2">2 images</option><option value="4">4 images</option></select></label><label><span className={styles.srOnly}>Aspect ratio</span><select value={ratio} onChange={event => setRatio(event.target.value)}><option>1:1</option><option>4:5</option><option>16:9</option></select></label><label><span className={styles.srOnly}>Model</span><select value={model} onChange={event => setModel(event.target.value)}><option>Model: Name</option><option>Model: Studio</option><option>Model: Portrait</option></select></label></div><button className={styles.accordion} aria-expanded={advanced} onClick={() => setAdvanced(!advanced)}>Advance <ChevronDown size={14} className={advanced ? styles.turn : ''} /></button>{advanced && <div className={styles.accordionBody}><label>Guidance <input type="range" min="1" max="10" defaultValue="6" /></label><p>Higher guidance follows your prompt more closely.</p></div>}<button className={styles.accordion} aria-expanded={stylesOpen} onClick={() => setStylesOpen(!stylesOpen)}>Styles <ChevronDown size={14} className={stylesOpen ? styles.turn : ''} /></button>{stylesOpen && <div className={styles.styleChoices}>{['Natural','Editorial','Cinematic'].map(item => <button key={item} className={style === item ? styles.styleSelected : ''} onClick={() => setStyle(item)}>{item}</button>)}</div>}{error && <p className={styles.error} role="alert">{error}</p>}<Link href="/" className={styles.partBLink}>Explore original workspace <span>→</span></Link></aside>
      <main className={styles.canvas}><div className={styles.canvasHeader}><div><span>GENERATIONS</span><h1>Portrait explorations</h1></div><div className={styles.canvasActions}><span>{results.length} results</span><Link href="/">Part B · Original workspace →</Link></div></div><div className={styles.feed}><div className={styles.promptSummary}><span className={styles.promptTag}><Sparkles size={11} /> Prompt</span><p>{initialPrompt}</p><button onClick={() => setPrompt(initialPrompt)}>Use prompt</button></div><div className={styles.grid}>{results.map((item,index) => <button key={item.id} className={styles.result} onClick={() => setActive(item)} aria-label={`View generated portrait ${index + 1}`}><Image src={item.image} alt={`Generated red-haired portrait variation ${index + 1}`} fill sizes="(max-width: 640px) 44vw, (max-width: 1020px) 28vw, 220px" className={index % 4 === 2 ? styles.cropRight : ''} /><span className={styles.resultHover}><span>View result</span><span><Heart size={15} fill={favoriteIds.includes(item.id) ? 'currentColor' : 'none'} /></span></span></button>)}</div></div></main></div>
    {active && <div className={styles.modalBackdrop} onMouseDown={event => { if (event.target === event.currentTarget) setActive(null); }}><div className={styles.modal} role="dialog" aria-modal="true" aria-label="Generated image details"><div className={styles.modalImage}><Image src={active.image} alt={active.prompt} fill sizes="75vw" /></div><div className={styles.modalDetails}><button className={styles.close} onClick={() => setActive(null)} aria-label="Close"><X size={19} /></button><span>GENERATION DETAIL</span><h2>Portrait exploration</h2><p>{active.prompt}</p><div className={styles.modalButtons}><button onClick={() => toggleFavorite(active.id)}><Heart size={16} fill={favoriteIds.includes(active.id) ? 'currentColor' : 'none'} /> {favoriteIds.includes(active.id) ? 'Saved' : 'Save'}</button><button onClick={() => download(active)}><ArrowDownToLine size={16} /> Download</button></div></div></div></div>}
  </div>;
}
