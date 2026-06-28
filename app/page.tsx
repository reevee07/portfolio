'use client'
import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { getGalleryImages } from '@/lib/supabase'
import Image from 'next/image'

const WHEEL_CIRCLES = [
  { w: 180, l: 45.1, t: 53.4 },
  { w: 170, l: 26.5, t: 31.7 },
  { w: 156, l: 79.6, t: 46.8 },
  { w: 148, l: 68.9, t: 70.4 },
  { w: 140, l: 58.2, t: 23.5 },
  { w: 136, l: 20.5, t: 62.2 },
  { w: 124, l: 46.4, t: 81.2 },
  { w: 88,  l: 77.5, t: 25.9 },
  { w: 84,  l: 41.7, t: 14.0 },
  { w: 80,  l: 29.0, t: 77.8 },
  { w: 72,  l: 12.5, t: 46.9 },
  { w: 68,  l: 61.4, t: 40.7 },
  { w: 64,  l: 61.0, t: 87.0 },
  { w: 60,  l: 86.2, t: 64.4 },
]

const PROJECTS = [
  { name: 'Labsbuzz',     url: 'https://labsuzz.com',     cat: 'AI Marketplace of Diagnostic Labs',    desc: 'Compare, book, and manage diagnostic tests across 500+ certified labs.',                                  stage: 'mvp'  },
  { name: 'Byebill',     url: 'https://byebill.in',      cat: 'Revolutionary Billing for Restaurants', desc: 'Smart billing system and live coupons to boost sales value.',                                           stage: 'idea' },
  { name: 'Markhub',     url: 'https://markhub.app',     cat: 'Unified Bookmark Manager',              desc: 'All your saved links from different apps, one calm space.',                                             stage: 'idea' },
  { name: 'Dosetracker', url: 'https://med-tracker-e3q4.vercel.app/', cat: 'Smart Medication Reminder',              desc: 'Never miss a dose — smart reminders, share logs with your doctor.',                                    stage: 'live' },
  { name: 'StudyClash',  url: 'https://study-logbook.vercel.app/',  cat: 'Competitive Study Tracker',              desc: 'Challenge friends, log sessions, climb leaderboards.',                                                  stage: 'live' },
  { name: 'Li-bro',      url: '#',                       cat: 'Student Management App for Libraries',  desc: 'Gamified study tracker for libraries — log hours, compete, climb leaderboards.', stage: 'live' },
]

function Pipeline({ stage }: { stage: string }) {
  const mvp  = stage === 'mvp'  || stage === 'live'
  const live = stage === 'live'
  return (
    <div className="pipeline">
      <div className="pstep"><div className={`dot ${mvp ? 'past' : 'active'}`} /><div className="plabel">Idea</div></div>
      <div className={`pline ${mvp ? 'blue' : ''}`} />
      <div className="pstep"><div className={`dot ${live ? 'past' : mvp ? 'active' : ''}`} /><div className="plabel">MVP</div></div>
      <div className={`pline ${live ? 'green' : ''}`} />
      <div className="pstep"><div className={`dot ${live ? 'live' : ''}`} /><div className="plabel">Live</div></div>
    </div>
  )
}

const Arrow = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SKILLS = [
  { name: 'React JS',     svg: <svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#20232a"/><g transform="translate(4,4) scale(.75)"><circle cx="16" cy="16" r="2.8" fill="#61dafb"/><ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61dafb" strokeWidth="1.5" fill="none"/><ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61dafb" strokeWidth="1.5" fill="none" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="14" ry="5.5" stroke="#61dafb" strokeWidth="1.5" fill="none" transform="rotate(120 16 16)"/></g></svg> },
  { name: 'Node JS',      svg: <svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#1a1a1a"/><path d="M16 5L26 11v10L16 27 6 21V11z" fill="#3c873a"/><path d="M16 5L6 11v10L16 27" fill="#68a063"/><text x="16" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="monospace">JS</text></svg> },
  { name: 'JavaScript',   svg: <svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#f7df1e"/><text x="4" y="26" fill="#000" fontSize="14" fontWeight="bold" fontFamily="monospace">JS</text></svg> },
  { name: 'HTML',         svg: <svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#e34c26"/><path d="M7 4l1.8 20.4L16 27l7.2-2.6L25 4H7z" fill="#e34c26"/><path d="M16 25.4V6.4H23.4L22 21.4 16 23.2" fill="#f06529"/><path d="M16 14h-4.6l-.3-3.4H16V7.4H7.8l.8 9H16v-2.4zm0 6.4l-3.8-1-.3-3H9.2l.5 6 6.3 1.8V20.4z" fill="white"/><path d="M16 14v2.4h4.2l-.4 4.4-3.8 1v2.8l6.3-1.8.5-6.8H16V14z" fill="#ebebeb"/></svg> },
  { name: 'CSS',          svg: <svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#264de4"/><path d="M7 4l1.8 20.4L16 27l7.2-2.6L25 4H7z" fill="#264de4"/><path d="M16 25.4V6.4H23.4L22 21.4 16 23.2" fill="#2965f1"/><path d="M16 14h-4.2l-.3-3.4H16V7.4H8l.8 9H16v-2.4zm0 6.4l-3.7-1-.2-2.8H9.2l.5 5.8 6.3 1.8V20.4z" fill="white"/><path d="M16 14v2.4h3.9l-.4 4.4-3.5 1v2.8l6.3-1.8.5-6.8H16V14z" fill="#ebebeb"/></svg> },
  { name: 'Solidity',     svg: <svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#1C1C1C"/><polygon points="16,4 23,10.5 16,17 9,10.5" fill="#8C8C8C"/><polygon points="9,10.5 16,17 16,4" fill="#C4C4C4"/><polygon points="23,10.5 16,17 16,4" fill="#8C8C8C"/><polygon points="16,15 23,21.5 16,28 9,21.5" fill="#444"/><polygon points="9,21.5 16,28 16,15" fill="#5C5C5C"/><polygon points="23,21.5 16,28 16,15" fill="#444"/></svg> },
  { name: 'Vercel',       svg: <svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#000"/><polygon points="16,8 28,24 4,24" fill="white"/></svg> },
]

const INTERESTS = [
  { name: 'Trading',      svg: <svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#0d2818"/><polyline points="4,24 10,16 15,20 21,10 27,13" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/><circle cx="27" cy="13" r="2" fill="#22c55e"/></svg> },
  { name: 'NFT Flipping', svg: <svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#1a0a2e"/><rect x="6" y="8" width="20" height="16" rx="3" fill="#9945ff" opacity=".3" stroke="#9945ff" strokeWidth="1.2"/><path d="M10 20l4-5 3 3 2-3 3 5" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/><circle cx="12" cy="14" r="1.5" fill="#f59e0b"/></svg> },
]

export default function Home() {
  const [images, setImages] = useState<string[]>([])

  useEffect(() => { getGalleryImages().then(setImages) }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <div className="orb orb1" />
      <div className="orb orb2" />

      {/* NAV */}
      <nav>
        <a href="#hero" className="nav-brand">
  <div
  style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: '1.8px solid #4f6ef7', transition: 'transform 0.2s ease' }}
  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(2)')}
  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
>
  <Image src="/profile.jpg" alt="Ravi Raj" width={44} height={44} style={{ objectFit: 'cover' }} />
</div>
  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
    <div className="nav-name">Ravi Raj</div>
    <span style={{ fontFamily:'var(--mono)', fontSize:10, fontWeight:500, color:'var(--t2)', background:'rgba(255,255,255,.06)', border:'1px solid var(--b)', borderRadius:100, padding:'3px 12px', letterSpacing:'1.5px', textTransform:'uppercase' }}>Builder</span>
  </div>
</a>
        {/* ═══ SOCIAL URLS — edit here ═══ */}
        <div className="social-pill">
          <a href="https://x.com/0xreevee" target="_blank" rel="noopener" title="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.743l7.73-8.835L1.254 2.25H8.08l4.26 5.638L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
          <a href="https://linkedin.com/in/ravi-raj-a02418231" target="_blank" rel="noopener" title="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
          <a href="https://github.com/reevee07" target="_blank" rel="noopener" title="GitHub"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg></a>
          <a href="https://instagram.com/_rajravi07" target="_blank" rel="noopener" title="Instagram"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
          <a href="mailto:rvraj5566@gmail.com" onClick={(e) => { if (!navigator.userAgent.match(/Mobile|Android|iPhone/i)) { e.preventDefault(); window.open('https://mail.google.com/mail/?view=cm&to=rvraj5566@gmail.com', '_blank'); }}} title="Gmail"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.908 1.528-1.147C21.69 2.28 24 3.434 24 5.457z"/></svg></a>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div style={{ position: 'relative' }}>
          <div className="pdeco pdeco1" />
          <div className="pdeco pdeco2" />
          <div className="wheel-wrap">
            <div className="wheel">
              <div className="wheel-ring" />
              <div className="wheel-ring-inner" />
              {WHEEL_CIRCLES.map((c, i) => (
                <div key={i} className="wimg" style={{ width: c.w, height: c.w, left: `${c.l}%`, top: `${c.t}%` }}>
                  {images[i] ? <img src={images[i]} alt="" /> : <div className="ph">img</div>}
                </div>
              ))}
            </div>
          </div>
          <h1 className="hero-title">
            <span className="word-plain">GOD</span> <span className="word-plain">is</span><br />
            <span className="word-accent">ultimate</span> <span className="word-plain">builder</span>
          </h1>
          <p className="hero-sub">Turning raw ideas into products that matter — at the intersection of AI, health, and human possibility.</p>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <div className="wrap">
          <div className="sec-label">Projects</div>
          <div className="projects">
            {PROJECTS.map(p => (
              <a key={p.name} href={p.url} target="_blank" rel="noopener" className="pcard fade-up">
                <div className="pname">{p.name}</div>
                <div className="pinfo"><div className="pcat">{p.cat}</div><div className="pdesc">{p.desc}</div></div>
                <Pipeline stage={p.stage} />
                <div className="parrow"><Arrow /></div>
              </a>
            ))}
          </div>
        </div>
      </section>

     {/* EDUCATION + SKILLS */}
<section id="education">
  <div className="wrap">
    <div className="edu-skills-row">
      <div className="edu-skills-col">
        <div className="sec-label">Education</div>
        <div className="edu-list">
          <div className="edu-card fade-up"><div className="edu-icon">🏛️</div><div className="edu-info"><div className="edu-name">Chandigarh University</div><div className="edu-meta">B.Tech, CSE · 2021–2025</div></div><div className="edu-badge badge-out">Dropped Out</div></div>
          <div className="edu-card fade-up"><div className="edu-icon">🏫</div><div className="edu-info"><div className="edu-name">Shiv Jyoti Sr. Sec. School</div><div className="edu-meta">12th · 2018–2020</div></div><div className="edu-badge badge-score">85.4%</div></div>
          <div className="edu-card fade-up"><div className="edu-icon">🏫</div><div className="edu-info"><div className="edu-name">BD Public School</div><div className="edu-meta">10th · 2013–2018</div></div><div className="edu-badge badge-score">87.2%</div></div>
        </div>
      </div>
      <div className="edu-skills-col">
        <div className="sec-label" id="skills">Tech Stack</div>
        <div className="skills-grid">
          {SKILLS.map(s => <div key={s.name} className="skill"><div className="slogo">{s.svg}</div>{s.name}</div>)}
        </div>
      </div>
    </div>

    {/* INTERESTS — full width below both columns */}
    <div style={{ marginTop: '48px' }}>
      <div className="sec-label">Interests</div>
      <div className="skills-grid">
        {INTERESTS.map(s => <div key={s.name} className="skill"><div className="slogo">{s.svg}</div>{s.name}</div>)}
      </div>
    </div>

    <Script async src="https://platform.twitter.com/widgets.js" strategy="lazyOnload" />
  </div>
</section>

      {/* REAL TALK */}
      <section id="realtalk">
        <div style={{maxWidth:'1100px',margin:'0 auto',padding:'100px 32px'}}>
          <div className="sec-label">Real Talk</div>
         <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',width:'100%'}}>
           <iframe src="https://platform.twitter.com/embed/Tweet.html?id=1961100354122305653&theme=dark" style={{width:'100%',height:'320px',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px'}} frameBorder="0" scrolling="no" />
           <iframe src="https://platform.twitter.com/embed/Tweet.html?id=2053458368652779866&theme=dark" style={{width:'100%',height:'320px',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px'}} frameBorder="0" scrolling="no" />
           <iframe src="https://platform.twitter.com/embed/Tweet.html?id=2053570955759571367&theme=dark" style={{width:'100%',height:'320px',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px'}} frameBorder="0" scrolling="no" />
           <iframe src="https://platform.twitter.com/embed/Tweet.html?id=1975556591882789021&theme=dark" style={{width:'100%',height:'320px',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px'}} frameBorder="0" scrolling="no" />
          </div>
        </div>
      </section>

      <footer><p>Built with intention by <span>GOD</span> · © 2025</p></footer>
    </>
  )
}