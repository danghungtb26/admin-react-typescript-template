import React from 'react'
import CountUp from 'react-countup'

const chartList = [
  {
    type: 'New Visits',
    icon: 'user',
    num: 102400,
    color: '#40c9c6',
  },
  {
    type: 'Messages',
    icon: 'message',
    num: 81212,
    color: '#36a3f7',
  },
  {
    type: 'Purchases',
    icon: 'pay-circle',
    num: 9280,
    color: '#f4516c',
  },
  {
    type: 'Shoppings',
    icon: 'shopping-cart',
    num: 13600,
    color: '#f6ab40',
  },
]

type PanelGroupProps = {}

const PanelGroup: React.FC<React.PropsWithChildren<PanelGroupProps>> = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mt-7">
      {chartList.map(chart => (
        <div key={chart.type} className="card-panel-col mb-8">
          <div className="h-28 cursor-pointer text-xs relative overflow-hidden text-gray-500 bg-white shadow-xl border-gray-100">
            <div className="float-left mt-3.5 ml-3.5 p-4 transition-all duration-380 ease-out rounded-md">
              <div className={chart.type} style={{ fontSize: 55, color: chart.color }} />
            </div>
            <div className="float-right font-bold mt-6 mr-6 mb-6">
              <p className="leading-5 text-gray-400 text-base mb-3">{chart.type}</p>
              <CountUp end={chart.num} start={0} className="card-panel-num text-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PanelGroup
