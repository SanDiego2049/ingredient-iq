import VerdictBadge from './VerdictBadge'

function SummaryCard({ verdict, summary }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 text-center">
      <VerdictBadge verdict={verdict} size="lg" />
      <p className="text-gray-700 text-base leading-relaxed">{summary}</p>
    </div>
  )
}

export default SummaryCard
