import React from 'react'

import {
  CardPanel,
  CardPanelCol,
  CardPanelDescription,
  CardPanelIconWrapper,
  CardPanelNum,
  CardPanelText,
  PanelGroupRow,
} from './styles'

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
    <PanelGroupRow gutter={40}>
      {chartList.map(chart => (
        <CardPanelCol key={chart.type} lg={6} sm={12} xs={12} className="card-panel-col">
          <CardPanel>
            <CardPanelIconWrapper>
              <div className={chart.type} style={{ fontSize: 55, color: chart.color }} />
            </CardPanelIconWrapper>
            <CardPanelDescription>
              <CardPanelText>{chart.type}</CardPanelText>
              <CardPanelNum end={chart.num} start={0} className="card-panel-num" />
            </CardPanelDescription>
          </CardPanel>
        </CardPanelCol>
      ))}
    </PanelGroupRow>
  )
}

export default PanelGroup
