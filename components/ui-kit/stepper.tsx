import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Step = {
  label: string
  hint?: string
  state: 'done' | 'current' | 'todo'
}

export function Stepper({ steps, className }: { steps: Step[]; className?: string }) {
  return (
    <ol className={cn('no-scrollbar flex items-start overflow-x-auto pb-1', className)}>
      {steps.map((step, index) => (
        <li key={step.label} className="flex items-start">
          <div className="flex w-[92px] shrink-0 flex-col items-center text-center sm:w-[108px]">
            <span
              className={cn(
                'grid size-7 place-items-center rounded-full text-[11px] font-semibold ring-4',
                step.state === 'done' && 'bg-[#16a34a] text-white ring-[#eef7f0]',
                step.state === 'current' && 'bg-brand text-white ring-mint',
                step.state === 'todo' && 'bg-white text-[#9aa79f] ring-[#f4f7f2] ring-1 ring-inset ring-line-strong',
              )}
            >
              {step.state === 'done' ? <Check className="size-3.5" /> : index + 1}
            </span>
            <span
              className={cn(
                'mt-2 text-[11px] leading-tight font-medium',
                step.state === 'todo' ? 'text-faint' : 'text-ink',
              )}
            >
              {step.label}
            </span>
            {step.hint ? <span className="mt-0.5 text-[10px] text-faint">{step.hint}</span> : null}
          </div>
          {index < steps.length - 1 ? (
            <span
              className={cn(
                'mt-3.5 h-px w-6 shrink-0 sm:w-10',
                step.state === 'done' ? 'bg-[#9fdcb4]' : 'bg-line-strong',
              )}
            />
          ) : null}
        </li>
      ))}
    </ol>
  )
}
