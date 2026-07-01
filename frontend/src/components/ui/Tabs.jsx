function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div role="tablist" className="flex gap-1 rounded-xl bg-gray-100 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={activeTab === tab.value}
          onClick={() => onChange(tab.value)}
          className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            activeTab === tab.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default Tabs
