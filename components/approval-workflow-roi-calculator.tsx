'use client'

import Link from 'next/link'
import { useState } from 'react'
import DemoCta from '@/components/demo-cta'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

type CalculatorInputs = {
  monthlyApprovals: number
  handlingMinutes: number
  hourlyRate: number
  automationRate: number
  escalationRate: number
}

const defaultInputs: CalculatorInputs = {
  monthlyApprovals: 1800,
  handlingMinutes: 12,
  hourlyRate: 55,
  automationRate: 45,
  escalationRate: 18,
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export default function ApprovalWorkflowRoiCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs)
  const [hasCalculated, setHasCalculated] = useState(false)

  const monthlyHoursToday = (inputs.monthlyApprovals * inputs.handlingMinutes) / 60
  const monthlyHoursSaved = monthlyHoursToday * (inputs.automationRate / 100)
  const monthlyLaborSavings = monthlyHoursSaved * inputs.hourlyRate
  const annualLaborSavings = monthlyLaborSavings * 12
  const monthlyEscalations = inputs.monthlyApprovals * (inputs.escalationRate / 100)
  const cycleTimeReduction = clamp(Math.round(inputs.automationRate * 0.9), 10, 80)

  const updateInput = (field: keyof CalculatorInputs, rawValue: string) => {
    const nextValue = Number(rawValue)
    setInputs((current) => ({
      ...current,
      [field]: Number.isFinite(nextValue) ? nextValue : 0,
    }))
  }

  const handleCalculate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setHasCalculated(true)

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'roi_calculation_complete', {
        event_category: 'engagement',
        event_label: 'approval_workflow_roi',
        value: Math.round(annualLaborSavings),
      })
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={handleCalculate} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Estimate the ROI of governed approval automation</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Use conservative assumptions. This is meant to size the opportunity, not inflate it.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Monthly approvals</span>
            <input
              type="number"
              min="0"
              value={inputs.monthlyApprovals}
              onChange={(event) => updateInput('monthlyApprovals', event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Minutes per approval</span>
            <input
              type="number"
              min="0"
              value={inputs.handlingMinutes}
              onChange={(event) => updateInput('handlingMinutes', event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Loaded hourly rate</span>
            <input
              type="number"
              min="0"
              value={inputs.hourlyRate}
              onChange={(event) => updateInput('hourlyRate', event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Automation rate (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={inputs.automationRate}
              onChange={(event) => updateInput('automationRate', event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-200">Escalation rate after automation (%)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={inputs.escalationRate}
              onChange={(event) => updateInput('escalationRate', event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#093E8F] to-[#1C74BC] px-6 py-3 font-semibold text-white transition hover:from-[#0A3F8F] hover:to-[#26AAE3]"
        >
          Calculate ROI
        </button>
      </form>

      <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 p-6 md:p-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#26AAE3]">Estimated impact</p>
          <h3 className="mt-3 text-3xl font-bold text-white">What a governed approval model could save</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <div className="text-sm text-slate-400">Hours spent today / month</div>
            <div className="mt-2 text-3xl font-bold text-white">{monthlyHoursToday.toFixed(0)}</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <div className="text-sm text-slate-400">Hours saved / month</div>
            <div className="mt-2 text-3xl font-bold text-white">{monthlyHoursSaved.toFixed(0)}</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <div className="text-sm text-slate-400">Labor savings / month</div>
            <div className="mt-2 text-3xl font-bold text-white">${monthlyLaborSavings.toFixed(0)}</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <div className="text-sm text-slate-400">Labor savings / year</div>
            <div className="mt-2 text-3xl font-bold text-white">${annualLaborSavings.toFixed(0)}</div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <div className="text-sm text-slate-400">Escalations / month</div>
            <div className="mt-2 text-3xl font-bold text-white">{monthlyEscalations.toFixed(0)}</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <div className="text-sm text-slate-400">Cycle-time reduction</div>
            <div className="mt-2 text-3xl font-bold text-white">{cycleTimeReduction}%</div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-sm leading-relaxed text-slate-300">
          {hasCalculated ? (
            <p>
              If these numbers are directionally right, the next step is to map one approval workflow, define risk tiers, and identify where auto-approval
              is safe versus where human review must stay in place.
            </p>
          ) : (
            <p>
              Run the calculator first, then pressure-test the result against your real approval volume and exception profile. Conservative estimates are more
              credible than optimistic ones.
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <DemoCta
            source="approval_workflow_roi_tool"
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Request Workflow Review
          </DemoCta>
          <Link
            href="/blog/ai-approval-workflow"
            className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-5 py-3 font-semibold text-white transition hover:border-cyan-400"
          >
            Read the Approval Guide
          </Link>
        </div>
      </div>
    </div>
  )
}
