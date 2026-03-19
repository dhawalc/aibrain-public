'use client'

import { useState } from 'react'
import DemoCta from '@/components/demo-cta'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

type Question = {
  id: string
  text: string
}

type StepConfig = {
  title: string
  description: string
  questions: Question[]
}

const steps: StepConfig[] = [
  {
    title: 'Process Maturity',
    description: 'How structured and repeatable are your current workflows?',
    questions: [
      { id: 'pm1', text: 'How well documented are your current workflows?' },
      { id: 'pm2', text: 'How standardized are your processes across teams?' },
      { id: 'pm3', text: 'How often do processes change or get exceptions?' },
      { id: 'pm4', text: 'Do you have defined SLAs for key workflows?' },
    ],
  },
  {
    title: 'Data & Systems',
    description: 'How connected and reliable is your technology foundation?',
    questions: [
      { id: 'ds1', text: 'How well integrated are your core systems (ERP, CRM, ITSM)?' },
      { id: 'ds2', text: 'How clean and consistent is your master data?' },
      { id: 'ds3', text: 'Do you have API access to your critical systems?' },
      { id: 'ds4', text: 'How mature is your data governance?' },
    ],
  },
  {
    title: 'Organization & Governance',
    description: 'Is your organization set up to adopt and govern automation?',
    questions: [
      { id: 'og1', text: 'Is there executive sponsorship for automation initiatives?' },
      { id: 'og2', text: 'Do you have a clear ownership model for automated workflows?' },
      { id: 'og3', text: 'Are risk and compliance teams involved in automation decisions?' },
      { id: 'og4', text: 'Do your teams have experience with process improvement or automation?' },
    ],
  },
]

const scaleLabels = [
  { value: 1, label: 'Not at all' },
  { value: 2, label: 'Minimal' },
  { value: 3, label: 'Moderate' },
  { value: 4, label: 'Strong' },
  { value: 5, label: 'Excellent' },
]

type Answers = Record<string, number>

function getCategoryScore(answers: Answers, stepIndex: number): number {
  return steps[stepIndex].questions.reduce((sum, q) => sum + (answers[q.id] || 0), 0)
}

function getCategoryLabel(stepIndex: number): string {
  return steps[stepIndex].title
}

function getWeakestArea(answers: Answers): string {
  let minScore = Infinity
  let weakest = ''
  for (let i = 0; i < steps.length; i++) {
    const score = getCategoryScore(answers, i)
    if (score < minScore) {
      minScore = score
      weakest = getCategoryLabel(i)
    }
  }
  return weakest
}

type TierInfo = {
  tier: string
  color: string
  borderColor: string
  bgColor: string
  summary: string
  nextSteps: string[]
  articles: { href: string; title: string }[]
}

function getTierInfo(total: number, weakestArea: string): TierInfo {
  if (total >= 45) {
    return {
      tier: 'Ready',
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      bgColor: 'from-emerald-500/10 to-emerald-600/5',
      summary: 'Your organization is well positioned to start with a pilot workflow automation.',
      nextSteps: [
        'Identify one high-volume, low-risk approval workflow for a pilot',
        'Define success metrics and set up monitoring before launch',
        'Build a governance model with clear escalation paths for the pilot',
      ],
      articles: [
        { href: '/blog/ai-approval-workflow', title: 'AI Approval Workflow Design Guide' },
        { href: '/blog/multi-agent-execution-playbook', title: 'Multi-Agent Execution Playbook' },
        { href: '/blog/human-in-the-loop-governance-model', title: 'Human-in-the-Loop Governance Model' },
      ],
    }
  }
  if (total >= 30) {
    return {
      tier: 'Almost Ready',
      color: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      bgColor: 'from-amber-500/10 to-amber-600/5',
      summary: `You are close. Address gaps in ${weakestArea} to unlock automation potential.`,
      nextSteps: [
        `Run a focused improvement sprint on your ${weakestArea} gaps`,
        'Map your top 5 workflows end-to-end before selecting an automation candidate',
        'Engage stakeholders from IT, operations, and compliance in a readiness workshop',
      ],
      articles: [
        { href: '/blog/erp-crm-integration-automation', title: 'ERP/CRM Integration Automation Guide' },
        { href: '/blog/ai-approval-workflow', title: 'AI Approval Workflow Design Guide' },
        { href: '/blog/multi-agent-execution-playbook', title: 'Multi-Agent Execution Playbook' },
      ],
    }
  }
  if (total >= 15) {
    return {
      tier: 'Foundation Needed',
      color: 'text-orange-400',
      borderColor: 'border-orange-500/30',
      bgColor: 'from-orange-500/10 to-orange-600/5',
      summary: `Focus on strengthening ${weakestArea} before investing in automation tooling.`,
      nextSteps: [
        'Document your top 10 workflows with clear inputs, outputs, and decision points',
        'Audit system integrations and data quality across your core platforms',
        'Assign process owners and build a lightweight governance committee',
      ],
      articles: [
        { href: '/blog/multi-agent-execution-playbook', title: 'Multi-Agent Execution Playbook' },
        { href: '/blog/erp-crm-integration-automation', title: 'ERP/CRM Integration Automation Guide' },
        { href: '/blog/human-in-the-loop-governance-model', title: 'Human-in-the-Loop Governance Model' },
      ],
    }
  }
  return {
    tier: 'Early Stage',
    color: 'text-red-400',
    borderColor: 'border-red-500/30',
    bgColor: 'from-red-500/10 to-red-600/5',
    summary: 'Start with process documentation and a system inventory before considering automation.',
    nextSteps: [
      'Create a process catalog that lists every workflow, its owner, and its frequency',
      'Inventory all systems and identify which have API or integration capabilities',
      'Secure executive sponsorship and define a clear automation vision',
    ],
    articles: [
      { href: '/blog/multi-agent-execution-playbook', title: 'Multi-Agent Execution Playbook' },
      { href: '/blog/human-in-the-loop-governance-model', title: 'Human-in-the-Loop Governance Model' },
      { href: '/blog/ai-approval-workflow', title: 'AI Approval Workflow Design Guide' },
    ],
  }
}

function ScoreBar({ label, score, max }: { label: string; score: number; max: number }) {
  const pct = Math.round((score / max) * 100)
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-200">{label}</span>
        <span className="text-sm font-bold text-white">
          {score}/{max}
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#093E8F] to-[#26AAE3] transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function RadarChart({ scores }: { scores: { label: string; value: number; max: number }[] }) {
  const size = 240
  const cx = size / 2
  const cy = size / 2
  const radius = 90
  const n = scores.length
  const angleStep = (2 * Math.PI) / n

  function polarToXY(angle: number, r: number): [number, number] {
    return [cx + r * Math.cos(angle - Math.PI / 2), cy + r * Math.sin(angle - Math.PI / 2)]
  }

  const gridLevels = [0.25, 0.5, 0.75, 1]

  const dataPoints = scores.map((s, i) => {
    const pct = s.value / s.max
    const [x, y] = polarToXY(i * angleStep, radius * pct)
    return { x, y }
  })

  const polygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <div className="flex justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-lg">
        {gridLevels.map((level) => {
          const points = Array.from({ length: n }, (_, i) => {
            const [x, y] = polarToXY(i * angleStep, radius * level)
            return `${x},${y}`
          }).join(' ')
          return <polygon key={level} points={points} fill="none" stroke="rgb(51,65,85)" strokeWidth={1} />
        })}

        {scores.map((_, i) => {
          const [x, y] = polarToXY(i * angleStep, radius)
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgb(51,65,85)" strokeWidth={1} />
        })}

        <polygon points={polygon} fill="rgba(38,170,227,0.15)" stroke="#26AAE3" strokeWidth={2} />

        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill="#26AAE3" />
        ))}

        {scores.map((s, i) => {
          const [x, y] = polarToXY(i * angleStep, radius + 22)
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-300 text-[11px] font-medium"
            >
              {s.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

export default function AutomationReadinessAssessment() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const totalSteps = steps.length + 1

  const allCurrentStepAnswered =
    currentStep < steps.length && steps[currentStep].questions.every((q) => answers[q.id] !== undefined)

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const goNext = () => {
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)

      if (nextStep === steps.length) {
        const total = steps.reduce((sum, _, i) => sum + getCategoryScore(answers, i), 0)
        const tierInfo = getTierInfo(total, getWeakestArea(answers))

        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
          window.gtag('event', 'readiness_assessment_complete', {
            event_category: 'engagement',
            event_label: tierInfo.tier,
            value: total,
          })
        }
      }
    }
  }

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetAssessment = () => {
    setCurrentStep(0)
    setAnswers({})
  }

  const totalScore = steps.reduce((sum, _, i) => sum + getCategoryScore(answers, i), 0)
  const weakestArea = getWeakestArea(answers)
  const tierInfo = getTierInfo(totalScore, weakestArea)

  const isResultsStep = currentStep === steps.length

  return (
    <div>
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-400">
            Step {Math.min(currentStep + 1, totalSteps)} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-slate-400">
            {isResultsStep ? 'Results' : steps[currentStep].title}
          </span>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                i <= currentStep ? 'bg-gradient-to-r from-[#093E8F] to-[#26AAE3]' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {!isResultsStep ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#26AAE3]">
              {steps[currentStep].title}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">{steps[currentStep].description}</h2>
          </div>

          <div className="space-y-8">
            {steps[currentStep].questions.map((question, qi) => (
              <div key={question.id}>
                <p className="mb-4 text-base font-medium text-slate-200">
                  {qi + 1}. {question.text}
                </p>
                <div className="flex flex-wrap gap-3">
                  {scaleLabels.map((option) => {
                    const selected = answers[question.id] === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleAnswer(question.id, option.value)}
                        className={`flex min-w-[100px] flex-col items-center gap-1 rounded-xl border px-4 py-3 transition ${
                          selected
                            ? 'border-[#26AAE3] bg-[#26AAE3]/10 text-white'
                            : 'border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-lg font-bold">{option.value}</span>
                        <span className="text-[11px]">{option.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={currentStep === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-semibold text-white transition hover:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-slate-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!allCurrentStepAnswered}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#093E8F] to-[#1C74BC] px-6 py-3 font-semibold text-white transition hover:from-[#0A3F8F] hover:to-[#26AAE3] disabled:cursor-not-allowed disabled:opacity-30"
            >
              {currentStep === steps.length - 1 ? 'See Results' : 'Next'}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className={`rounded-3xl border ${tierInfo.borderColor} bg-gradient-to-br ${tierInfo.bgColor} p-6 md:p-8`}>
            <div className="mb-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#26AAE3]">Your Readiness Score</p>
              <div className="mt-4 flex items-baseline justify-center gap-2">
                <span className="text-6xl font-bold text-white">{totalScore}</span>
                <span className="text-2xl text-slate-400">/60</span>
              </div>
              <p className={`mt-3 text-xl font-bold ${tierInfo.color}`}>{tierInfo.tier}</p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-300">{tierInfo.summary}</p>
            </div>

            <RadarChart
              scores={steps.map((s, i) => ({
                label: s.title.replace('Organization & Governance', 'Organization'),
                value: getCategoryScore(answers, i),
                max: 20,
              }))}
            />

            <div className="mt-8 grid gap-4">
              {steps.map((step, i) => (
                <ScoreBar key={i} label={step.title} score={getCategoryScore(answers, i)} max={20} />
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
            <h3 className="text-xl font-bold text-white">Recommended Next Steps</h3>
            <div className="mt-5 space-y-4">
              {tierInfo.nextSteps.map((step, i) => (
                <div key={i} className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#093E8F] to-[#1C74BC] text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
            <h3 className="text-xl font-bold text-white">Related Resources</h3>
            <div className="mt-5 grid gap-3">
              {tierInfo.articles.map((article) => (
                <a
                  key={article.href}
                  href={article.href}
                  className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-cyan-500/50"
                >
                  <span className="text-sm font-medium text-slate-200 transition group-hover:text-cyan-300">
                    {article.title}
                  </span>
                  <svg className="h-4 w-4 text-slate-500 transition group-hover:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <DemoCta
              source="automation_readiness_assessment"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Get a Workflow Review
            </DemoCta>
            <button
              type="button"
              onClick={resetAssessment}
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-5 py-3 font-semibold text-white transition hover:border-cyan-400"
            >
              Retake Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
