import Tabs from '@/components/ui/Tabs'

const TABS = [
  { label: 'All', value: '' },
  { label: 'Safe', value: 'SAFE' },
  { label: 'Unsafe', value: 'UNSAFE' },
  { label: 'Caution', value: 'CAUTION' },
]

function HistoryTabs({ activeTab, onChange }) {
  return <Tabs tabs={TABS} activeTab={activeTab} onChange={onChange} />
}

export default HistoryTabs
