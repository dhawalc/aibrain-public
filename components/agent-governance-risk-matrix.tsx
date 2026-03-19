'use client'

import { useState } from 'react'
import DemoCta from '@/components/demo-cta'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

type RiskInputs = {
  workflowType: string
  systemTouched: string
  financialExposure: string
  customerImpact: string
  reversibility: string
  dataSensitivity: string
  regulatoryScope: string[]
}

const defaultInputs: RiskInputs = {
  workflowType: '',
  systemTouched: '',
  financialExposure: '',
  customerImpact: '',
  reversibility: '',
  dataSensitivity: '',
  regulatoryScope: [],
}

type RiskTier = 'Low' | 'Medium' | 'High' | 'Critical'

type RiskResult = {
  score: number
  tier: RiskTier
  approvalPattern: string
  auditLevel: string
  controls: string[]
}

const workflowTypes = [
  { label: 'Select workflow type', value: '' },
  { label: 'Financial', value: 'financial' },
  { label: 'Customer-facing', value: 'customer-facing' },
  { label: 'Internal operations', value: 'internal-operations' },
  { label: 'Security / compliance', value: 'security-compliance' },
  { label: 'Data management', value: 'data-management' },
]

const systemsTouched = [
  { label: 'Select system', value: '' },
  { label: 'ERP', value: 'erp' },
  { label: 'CRM', value: 'crm' },
  { label: 'ITSM', value: 'itsm' },
  { label: 'HR / Payroll', value: 'hr-payroll' },
  { label: 'Email / Communication', value: 'email-communication' },
  { label: 'Database', value: 'database' },
  { label: 'External API', value: 'external-api' },
]

const financialExposures = [
  { label: 'Select financial exposure', value: '', score: 0 },
  { label: 'None', value: 'none', score: 1 },
  { label: 'Under $1K', value: 'under-1k', score: 2 },
  { label: '$1K - $10K', value: '1k-10k', score: 3 },
  { label: '$10K - $100K', value: '10k-100k', score: 4 },
  { label: 'Over $100K', value: 'over-100k', score: 5 },
]

const customerImpacts = [
  { label: 'Select customer impact', value: '', score: 0 },
  { label: 'None', value: 'none', score: 1 },
  { label: 'Internal only', value: 'internal-only', score: 2 },
  { label: 'Indirect', value: 'indirect', score: 3 },
  { label: 'Direct - single customer', value: 'direct-single', score: 4 },
  { label: 'Direct - multiple customers', value: 'direct-multiple', score: 5 },
]

const reversibilities = [
  { label: 'Select reversibility', value: '', score: 0 },
  { label: 'Fully reversible', value: 'fully-reversible', score: 1 },
  { label: 'Partially reversible', value: 'partially-reversible', score: 3 },
  { label: 'Irreversible', value: 'irreversible', score: 5 },
]

const dataSensitivities = [
  { label: 'Select data sensitivity', value: '', score: 0 },
  { label: 'Public', value: 'public', score: 1 },
  { label: 'Internal', value: 'internal', score: 2 },
  { label: 'Confidential', value: 'confidential', score: 4 },
  { label: 'Regulated / PII', value: 'regulated-pii', score: 5 },
]

const regulatoryOptions = [
  { label: 'SOC 2', value: 'soc2', score: 2 },
  { label: 'SOX', value: 'sox', score: 3 },
  { label: 'GDPR', value: 'gdpr', score: 2 },
  { label: 'HIPAA', value: 'hipaa', score: 3 },
  { label: 'None', value: 'none', score: 0 },
]

function getScore(options: { value: string; score: number }[], selected: string): number {
  return options.find((o) => o.value === selected)?.score ?? 0
}

function getRegulatoryScore(selected: string[]): number {
  if (selected.includes('none') || selected.length === 0) return 1
  const total = selected.reduce((sum, val) => {
    const opt = regulatoryOptions.find((o) => o.value === val)
    return sum + (opt?.score ?? 0)
  }, 0)
  return Math.min(total, 5)
}

function calculateRisk(inputs: RiskInputs): RiskResult {
  const finScore = getScore(financialExposures, inputs.financialExposure)
  const custScore = getScore(customerImpacts, inputs.customerImpact)
  const revScore = getScore(reversibilities, inputs.reversibility)
  const dataScore = getScore(dataSensitivities, inputs.dataSensitivity)
  const regScore = getRegulatoryScore(inputs.regulatoryScope)

  const score =
    finScore * 2 +
    custScore * 2 +
    revScore * 1.5 +
    dataScore * 1.5 +
    regScore * 1

  let tier: RiskTier
  if (score < 8) tier = 'Low'
  else if (score < 14) tier = 'Medium'
  else if (score < 20) tier = 'High'
  else tier = 'Critical'

  const approvalPatterns: Record<RiskTier, string> = {
    Low: 'Auto-execute',
    Medium: 'Auto-execute + log',
    High: 'Review-then-execute',
    Critical: 'Named-approver required',
  }

  const auditLevels: Record<RiskTier, string> = {
    Low: 'Minimal',
    Medium: 'Standard',
    High: 'Enhanced',
    Critical: 'Full',
  }

  const controls = generateControls(inputs, tier)

  return {
    score: Math.round(score * 10) / 10,
    tier,
    approvalPattern: approvalPatterns[tier],
    auditLevel: auditLevels[tier],
    controls,
  }
}

function generateControls(inputs: RiskInputs, tier: RiskTier): string[] {
  const controls: string[] = []

  if (tier === 'Critical' || tier === 'High') {
    controls.push('Require named human approver before execution')
  }

  if (inputs.financialExposure === 'over-100k' || inputs.financialExposure === '10k-100k') {
    controls.push('Enforce dual-approval for transactions above threshold')
  }

  if (inputs.dataSensitivity === 'regulated-pii' || inputs.dataSensitivity === 'confidential') {
    controls.push('Apply data masking and field-level encryption in transit')
  }

  if (inputs.reversibility === 'irreversible') {
    controls.push('Create pre-execution snapshot and rollback plan')
  }

  if (inputs.regulatoryScope.includes('sox') || inputs.regulatoryScope.includes('soc2')) {
    controls.push('Maintain immutable audit log with segregation-of-duties evidence')
  }

  if (inputs.regulatoryScope.includes('gdpr') || inputs.regulatoryScope.includes('hipaa')) {
    controls.push('Log data-access events with purpose-limitation tags')
  }

  if (inputs.customerImpact === 'direct-multiple' || inputs.customerImpact === 'direct-single') {
    controls.push('Stage in sandbox environment and validate output before release')
  }

  if (inputs.systemTouched === 'erp' || inputs.systemTouched === 'hr-payroll') {
    controls.push('Restrict agent to least-privilege API scopes on target system')
  }

  if (inputs.systemTouched === 'external-api') {
    controls.push('Rate-limit outbound calls and monitor for anomalous patterns')
  }

  if (tier === 'Low') {
    controls.push('Log action metadata for periodic review')
    controls.push('Set automated alerts on volume anomalies')
  }

  if (tier === 'Medium' && controls.length < 3) {
    controls.push('Implement time-bounded auto-approval with periodic review')
  }

  return controls.slice(0, 5)
}

const tierColors: Record<RiskTier, { bg: string; border: string; text: string; dot: string }> = {
  Low: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
  },
  Medium: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    dot: 'bg-yellow-400',
  },
  High: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    dot: 'bg-orange-400',
  },
  Critical: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    dot: 'bg-red-400',
  },
}

const selectClass =
  'w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400 appearance-none'

export default function AgentGovernanceRiskMatrix() {
  const [inputs, setInputs] = useState<RiskInputs>(defaultInputs)
  const [result, setResult] = useState<RiskResult | null>(null)

  const updateSelect = (field: keyof RiskInputs, value: string) => {
    setInputs((current) => ({ ...current, [field]: value }))
  }

  const toggleRegulatory = (value: string) => {
    setInputs((current) => {
      let next: string[]
      if (value === 'none') {
        next = current.regulatoryScope.includes('none') ? [] : ['none']
      } else {
        const without = current.regulatoryScope.filter((v) => v !== 'none')
        next = without.includes(value) ? without.filter((v) => v !== value) : [...without, value]
      }
      return { ...current, regulatoryScope: next }
    })
  }

  const isFormComplete =
    inputs.workflowType !== '' &&
    inputs.systemTouched !== '' &&
    inputs.financialExposure !== '' &&
    inputs.customerImpact !== '' &&
    inputs.reversibility !== '' &&
    inputs.dataSensitivity !== '' &&
    inputs.regulatoryScope.length > 0

  const handleAssess = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isFormComplete) return
    const assessment = calculateRisk(inputs)
    setResult(assessment)

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'risk_assessment_complete', {
        event_category: 'engagement',
        event_label: assessment.tier,
      })
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={handleAssess} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Classify an AI agent action by risk</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Select the attributes of the workflow your agent will perform. The tool will output a risk tier, recommended approval pattern, and governance controls.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Workflow type</span>
            <select
              value={inputs.workflowType}
              onChange={(e) => updateSelect('workflowType', e.target.value)}
              className={selectClass}
            >
              {workflowTypes.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">System touched</span>
            <select
              value={inputs.systemTouched}
              onChange={(e) => updateSelect('systemTouched', e.target.value)}
              className={selectClass}
            >
              {systemsTouched.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Financial exposure</span>
            <select
              value={inputs.financialExposure}
              onChange={(e) => updateSelect('financialExposure', e.target.value)}
              className={selectClass}
            >
              {financialExposures.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Customer impact</span>
            <select
              value={inputs.customerImpact}
              onChange={(e) => updateSelect('customerImpact', e.target.value)}
              className={selectClass}
            >
              {customerImpacts.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Reversibility</span>
            <select
              value={inputs.reversibility}
              onChange={(e) => updateSelect('reversibility', e.target.value)}
              className={selectClass}
            >
              {reversibilities.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Data sensitivity</span>
            <select
              value={inputs.dataSensitivity}
              onChange={(e) => updateSelect('dataSensitivity', e.target.value)}
              className={selectClass}
            >
              {dataSensitivities.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <fieldset className="block md:col-span-2">
            <legend className="mb-3 block text-sm font-medium text-slate-200">Regulatory scope</legend>
            <div className="flex flex-wrap gap-3">
              {regulatoryOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                    inputs.regulatoryScope.includes(opt.value)
                      ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300'
                      : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={inputs.regulatoryScope.includes(opt.value)}
                    onChange={() => toggleRegulatory(opt.value)}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <button
          type="submit"
          disabled={!isFormComplete}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#093E8F] to-[#1C74BC] px-6 py-3 font-semibold text-white transition hover:from-[#0A3F8F] hover:to-[#26AAE3] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Assess Risk
        </button>
      </form>

      <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 p-6 md:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#26AAE3]">Risk assessment</p>
          <h3 className="mt-3 text-3xl font-bold text-white">Governance recommendation</h3>
        </div>

        {result ? (
          <>
            <div className={`rounded-2xl border ${tierColors[result.tier].border} ${tierColors[result.tier].bg} p-5`}>
              <div className="flex items-center gap-3">
                <span className={`h-3 w-3 rounded-full ${tierColors[result.tier].dot}`} />
                <span className={`text-sm font-semibold uppercase tracking-wide ${tierColors[result.tier].text}`}>
                  {result.tier} Risk
                </span>
                <span className="ml-auto text-sm text-slate-400">Score: {result.score}</span>
              </div>
              <div className={`mt-3 text-3xl font-bold ${tierColors[result.tier].text}`}>{result.tier}</div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-sm text-slate-400">Approval pattern</div>
                <div className="mt-2 text-lg font-bold text-white">{result.approvalPattern}</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="text-sm text-slate-400">Required audit level</div>
                <div className="mt-2 text-lg font-bold text-white">{result.auditLevel}</div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <div className="mb-3 text-sm font-semibold text-slate-200">Recommended controls</div>
              <ul className="space-y-2">
                {result.controls.map((control, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-slate-300">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {control}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-sm leading-relaxed text-slate-300">
              <p>
                This assessment provides a starting framework. Validate it against your organization&apos;s specific risk appetite, existing control environment, and operational context before deploying agent automation.
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/40 p-12 text-center">
            <svg className="mb-4 h-12 w-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-sm text-slate-500">
              Fill out the form and click Assess Risk to see the governance recommendation for your agent action.
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <DemoCta
            source="governance_risk_matrix_tool"
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Request Governance Review
          </DemoCta>
          <a
            href="/blog/ai-agent-risk-tiering-framework"
            className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-5 py-3 font-semibold text-white transition hover:border-cyan-400"
          >
            Read the Risk Framework
          </a>
        </div>
      </div>
    </div>
  )
}
