import {
  ArrowDownToLine,
  BarChart3,
  Download,
  FileText,
  Globe2,
  Menu,
  ShieldAlert,
  X,
} from 'lucide-react'
import React from 'react'
import { Fragment, useMemo, useState } from 'react'
import reportHtml from './report-source.html?raw'

const navItems = [
  ['cover', 'Cover'],
  ['exec-summary', 'Executive'],
  ['global-overview', 'Context'],
  ['vulnerability-framework', 'Framework'],
  ['country-analysis', 'Economies'],
  ['sector-risk', 'Sectors'],
  ['semiconductor', 'Semiconductors'],
  ['china-plus-one', 'China+1'],
  ['india-analysis', 'India'],
  ['scorecard', 'Scorecard'],
  ['risk-matrix', 'Risk Matrix'],
  ['policy', 'Policy'],
  ['enterprise', 'Enterprise'],
  ['methodology', 'Methodology'],
  ['limitations', 'Notes'],
  ['references', 'Sources'],
]

const dimensions = [
  'Mfg. Depth',
  'Strat. Dependency',
  'Logistics',
  'Energy Stability',
  'Semiconductor Exp.',
  'Workforce',
  'Digital Readiness',
  'Trade Diversif.',
  'SC Redundancy',
  'Critical Resources',
]

const scorecards = [
  {
    economy: 'United States',
    score: 7.4,
    strongest: 'Digital Readiness',
    vulnerability: 'Critical minerals access',
    trajectory: 'Improving',
    values: [7.5, 6.5, 8.0, 8.2, 6.2, 7.5, 8.8, 7.2, 7.0, 5.8],
  },
  {
    economy: 'China',
    score: 7.1,
    strongest: 'Manufacturing Depth',
    vulnerability: 'Advanced semiconductor access',
    trajectory: 'Constrained',
    values: [9.6, 4.2, 8.2, 6.8, 3.0, 8.5, 8.2, 6.2, 8.8, 9.0],
  },
  {
    economy: 'Germany',
    score: 7.0,
    strongest: 'Logistics + Workforce',
    vulnerability: 'Energy cost/stability',
    trajectory: 'Stabilizing',
    values: [8.8, 5.8, 9.0, 5.2, 5.5, 8.5, 7.5, 6.8, 7.2, 5.5],
  },
  {
    economy: 'Japan',
    score: 6.8,
    strongest: 'Manufacturing Depth',
    vulnerability: 'Energy + resource import dep.',
    trajectory: 'Improving',
    values: [8.8, 5.2, 8.2, 4.8, 7.0, 6.5, 7.2, 6.2, 6.8, 4.5],
  },
  {
    economy: 'South Korea',
    score: 6.7,
    strongest: 'Semiconductor position',
    vulnerability: 'China trade concentration',
    trajectory: 'Stable',
    values: [8.5, 4.8, 7.8, 5.2, 8.0, 7.2, 8.2, 5.0, 6.2, 4.2],
  },
  {
    economy: 'Taiwan',
    score: 6.2,
    scoreLabel: '6.2*',
    strongest: 'Foundry capability',
    vulnerability: 'Geopolitical / energy / imports',
    trajectory: 'Vulnerable',
    values: [9.5, 3.5, 7.2, 4.0, 9.8, 7.8, 8.5, 4.5, 3.8, 3.5],
    footnote: 'Foundry-specific strength is not an economy-wide resilience condition.',
  },
  {
    economy: 'India',
    score: 5.3,
    strongest: 'Workforce capacity',
    vulnerability: 'Logistics + semiconductor',
    trajectory: 'Improving',
    values: [5.5, 6.2, 4.8, 5.2, 2.5, 7.8, 6.2, 6.5, 4.2, 6.0],
  },
  {
    economy: 'Mexico',
    score: 4.8,
    strongest: 'USMCA access',
    vulnerability: 'Security + trade concentration',
    trajectory: 'Stable',
    values: [5.5, 5.0, 6.0, 5.5, 1.8, 6.0, 5.0, 4.2, 4.8, 5.5],
  },
  {
    economy: 'Vietnam',
    score: 4.6,
    strongest: 'Cost position',
    vulnerability: 'China input dependency',
    trajectory: 'Improving',
    values: [4.5, 3.8, 5.5, 5.2, 2.0, 6.2, 5.2, 5.8, 3.2, 5.0],
  },
]

const sectorRisks = [
  ['Semiconductors', 'Advanced node foundry (Taiwan)', 'TSMC / ASML', 'Critical', '10-15 yr'],
  ['EV Manufacturing', 'Battery cell + minerals processing', 'China (CATL, minerals)', 'Critical', '8-12 yr'],
  ['Pharmaceuticals', 'API production', 'India / China', 'Elevated', '5-8 yr'],
  ['Electronics', 'Assembly + component supply', 'Greater China', 'Critical', '10+ yr'],
  ['Industrial Automation', 'PLC / servo systems', 'Japan / Germany / US', 'Moderate', '3-6 yr'],
  ['Logistics', 'Container carrier capacity', 'Alliance structures', 'Moderate', '2-5 yr'],
  ['Critical Minerals', 'Processing (rare earth / lithium)', 'China', 'Critical', '10-20 yr'],
  ['Defense Mfg', 'Munitions + precision components', 'Commercial chip supply', 'Elevated', '4-7 yr'],
]

const riskMatrix = [
  ['Taiwan Strait disruption', 'Medium-High', 'Catastrophic', 'All assessed (global)', 'Semiconductors', 'Critical'],
  ['Advanced chip export restriction escalation', 'High', 'Severe', 'China; US allies', 'Semiconductors, Defense', 'Critical'],
  ['Critical mineral supply disruption', 'Medium', 'Severe', 'USA, EU, Japan, Korea', 'EV, Defense, Electronics', 'Critical'],
  ['Western demand fragmentation for China exports', 'High', 'Significant', 'China; Vietnam', 'Electronics, EV', 'Elevated'],
  ['Energy price shock (European mfg.)', 'Medium', 'Significant', 'Germany, EU', 'Chemicals, Automation', 'Elevated'],
  ['India infrastructure execution gap', 'High', 'Moderate', 'India', 'Electronics, Pharma', 'Elevated'],
  ['API supply concentration shock', 'Low-Medium', 'Severe', 'Global', 'Pharmaceuticals', 'Elevated'],
  ['Container shipping capacity concentration', 'Medium', 'Moderate', 'Global trade', 'Logistics', 'Managed'],
  ['Mexico security environment deterioration', 'Medium', 'Moderate', 'Mexico, USA', 'Automotive, Electronics', 'Managed'],
  ['Japan demographic workforce decline', 'Certain (structural)', 'Long-term', 'Japan', 'All sectors', 'Long-term'],
]

function extractPublication(html) {
  const match = html.match(/<div class="publication">([\s\S]*?)<\/div><!-- \.publication -->/)
  return match ? match[1] : ''
}

function riskClass(label) {
  const key = label.toLowerCase()
  if (key.includes('critical') || key.includes('vulnerable')) return 'risk-critical'
  if (key.includes('elevated') || key.includes('constrained')) return 'risk-elevated'
  if (key.includes('improving')) return 'risk-improving'
  return 'risk-managed'
}

function valueTone(value) {
  if (value >= 7.2) return 'strong'
  if (value >= 5.2) return 'mid'
  return 'weak'
}

function PlatformNav({ activeSection }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="platform-nav">
      <a className="brand-lockup" href="#top" aria-label="Go to top">
        <span>SSCRI</span>
        <small>2025 Analytical Platform</small>
      </a>
      <button className="nav-toggle" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>
      <nav className={open ? 'nav-list is-open' : 'nav-list'} aria-label="Publication sections">
        {navItems.map(([id, label]) => (
          <a 
            href={`#${id}`} 
            key={id} 
            onClick={() => setOpen(false)}
            className={activeSection === id ? 'active' : ''}
          >
            {label}
          </a>
        ))}
      </nav>
      <a className="download-link" href="/research.html" download>
        <Download size={16} />
        <span>Download HTML</span>
      </a>
    </header>
  )
}

function HeroDashboard() {
  return (
    <section className="platform-hero" id="top">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">Independent Analytical Framework Series · Publication Year 2025</div>
          <h1>
            Sovereign Supply Chain & <em>Industrial Resilience</em> Index
          </h1>
          <p>
            A geopolitical-industrial analytical platform built directly from the institutional research publication:
            nine economies, eight critical industries, and ten resilience dimensions.
          </p>
          <div className="hero-actions">
            <a href="#dashboard" className="primary-action">
              <BarChart3 size={17} />
              Analytical Dashboard
            </a>
            <a href="/research.html" download className="secondary-action">
              <ArrowDownToLine size={17} />
              Source HTML
            </a>
          </div>
        </div>
        <div className="hero-panel" aria-label="Report coverage">
          <Metric label="Economies" value="9" detail="Principal industrial economies" />
          <Metric label="Industries" value="8" detail="Critical vulnerability profiles" />
          <Metric label="Dimensions" value="10" detail="SSCRI resilience framework" />
          <Metric label="Version" value="1.0" detail="First publication" />
        </div>
      </div>
    </section>
  )
}

function Metric({ label, value, detail }) {
  return (
    <div className="metric-tile">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  )
}

function Dashboard() {
  const average = (scorecards.reduce((sum, row) => sum + row.score, 0) / scorecards.length).toFixed(1)
  const criticalSectors = sectorRisks.filter((row) => row[3] === 'Critical').length
  const topScore = scorecards[0]
  const weakestSemiconductor = [...scorecards].sort(
    (a, b) => a.values[dimensions.indexOf('Semiconductor Exp.')] - b.values[dimensions.indexOf('Semiconductor Exp.')],
  )[0]

  return (
    <section className="dashboard-shell" id="dashboard">
      <div className="section-kicker">Executive Dashboard</div>
      <div className="dashboard-head">
        <div>
          <h2>Comparative Resilience View</h2>
          <p>
            Charts below use only scores, rankings, sector horizons, and risk categories contained in the report.
          </p>
        </div>
        <div className="dashboard-badges">
          <span>
            <Globe2 size={15} /> RIS mean {average}
          </span>
          <span>
            <ShieldAlert size={15} /> {criticalSectors} critical sectors
          </span>
        </div>
      </div>

      <div className="insight-grid">
        <InsightCard icon={<BarChart3 />} label="Highest Composite RIS" value={`${topScore.economy} · ${topScore.score}`} />
        <InsightCard
          icon={<ShieldAlert />}
          label="Lowest Semiconductor Exposure Score"
          value={`${weakestSemiconductor.economy} · ${weakestSemiconductor.values[4]}`}
        />
        <InsightCard icon={<FileText />} label="Central Framework" value="10-dimension ordinal score" />
      </div>

      <div className="dashboard-grid">
        <article className="viz-card ranking-card">
          <div className="viz-heading">
            <h3>Composite Resilience Index Ranking</h3>
            <span>RIS Score</span>
          </div>
          <div className="ranking-bars">
            {scorecards.map((row, index) => (
              <div className="rank-row" key={row.economy}>
                <span className="rank-no">{String(index + 1).padStart(2, '0')}</span>
                <span className="rank-name">{row.economy}</span>
                <div className="rank-track">
                  <div className="rank-fill" style={{ width: `${row.score * 10}%` }} />
                </div>
                <strong>{row.scoreLabel || row.score.toFixed(1)}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="viz-card">
          <div className="viz-heading">
            <h3>Sector Risk Concentration</h3>
            <span>Report categories</span>
          </div>
          <div className="sector-risk-list">
            {sectorRisks.map(([sector, chokepoint, dependency, risk, horizon]) => (
              <div className="sector-risk-row" key={sector}>
                <div>
                  <strong>{sector}</strong>
                  <span>{chokepoint}</span>
                  <small>{dependency}</small>
                </div>
                <div className="sector-risk-meta">
                  <b className={riskClass(risk)}>{risk}</b>
                  <em>{horizon}</em>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="viz-card heatmap-card">
          <div className="viz-heading">
            <h3>SSCRI Dimension Heatmap</h3>
            <span>1-10 ordinal scores</span>
          </div>
          <div className="heatmap-wrap">
            <div className="heatmap">
              <div className="heatmap-corner" />
              {dimensions.map((dimension) => (
                <div className="heatmap-dimension" key={dimension}>
                  {dimension}
                </div>
              ))}
              {scorecards.map((row) => (
                <Fragment key={row.economy}>
                  <div className="heatmap-economy" key={`${row.economy}-label`}>
                    {row.economy}
                  </div>
                  {row.values.map((value, index) => (
                    <div className={`heat-cell ${valueTone(value)}`} key={`${row.economy}-${dimensions[index]}`}>
                      {value.toFixed(1)}
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
          <p className="viz-note">
            Taiwan’s 9.5 and 9.8 values are carried from the report’s semiconductor-domain footnote and should not be
            read as economy-wide insulation.
          </p>
        </article>

        <article className="viz-card">
          <div className="viz-heading">
            <h3>Strategic Risk Priority Matrix</h3>
            <span>5-year framing</span>
          </div>
          <div className="risk-table-wrap">
            <div className="risk-table">
              <div className="risk-table-header">
                <span>Risk Event</span>
                <span>Probability</span>
                <span>Impact</span>
                <span>Key Economies</span>
                <span>Sectors Impacted</span>
                <span>Priority</span>
              </div>
              <div className="risk-table-body">
                {riskMatrix.map(([risk, probability, impact, economies, sector, priority]) => (
                  <div className="risk-table-row" key={risk}>
                    <strong>{risk}</strong>
                    <span>{probability}</span>
                    <span>{impact}</span>
                    <span>{economies}</span>
                    <span>{sector}</span>
                    <b className={riskClass(priority)}>{priority}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

function InsightCard({ icon, label, value }) {
  return (
    <div className="insight-card">
      <span>{icon}</span>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  )
}

function Publication() {
  const publicationHtml = useMemo(() => extractPublication(reportHtml), [])
  return (
    <main className="publication-shell" id="publication">
      <div className="publication-toolbar">
        <span>Full Research Publication</span>
        <a href="/research.html" download>
          <Download size={15} />
          Download source HTML
        </a>
      </div>
      <div className="publication" dangerouslySetInnerHTML={{ __html: publicationHtml }} />
    </main>
  )
}

export default function App() {
  const [activeSection, setActiveSection] = useState('')

  React.useEffect(() => {
    // Add all navigable section IDs to track
    const sectionIds = ['dashboard', ...navItems.map(([id]) => id)]
    
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(callback, {
      rootMargin: '-86px 0px -65% 0px', // calibrated for sticky header height
      threshold: 0,
    })

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <PlatformNav activeSection={activeSection} />
      <HeroDashboard />
      <Dashboard />
      <Publication />
    </>
  )
}
