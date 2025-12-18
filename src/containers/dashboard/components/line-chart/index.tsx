import { useSetting } from '@contexts/setting/context'
import * as echarts from 'echarts'
import { debounce } from 'lodash'
import React, { HTMLProps, useEffect, useRef } from 'react'
import styled from 'styled-components'

type LineChartProps = {} & HTMLProps<HTMLDivElement>

const ChartDiv = styled.div`
  width: 100%;
  height: 35rem;
`

const LineChart: React.FC<React.PropsWithChildren<LineChartProps>> = ({ ...p }) => {
  const ref = useRef<HTMLDivElement>(null)
  const chart = useRef<echarts.ECharts>()

  useEffect(() => {
    const data = {
      expectedData: [100, 120, 161, 134, 105, 160, 165],
      actualData: [120, 82, 91, 154, 162, 140, 145],
    }

    const initChart = () => {
      chart.current = echarts.init(ref.current, 'macarons')
      chart.current.setOption({
        backgroundColor: '#fff',
        xAxis: {
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          boundaryGap: false,
          axisTick: {
            show: false,
          },
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 10,
          top: 30,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          padding: [5, 10],
        },
        yAxis: {
          axisTick: {
            show: false,
          },
        },
        legend: {
          data: ['expected', 'actual'],
        },
        series: [
          {
            name: 'expected',
            itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2,
                },
              },
            },
            smooth: true,
            type: 'line',
            data: data.expectedData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut',
          },
          {
            name: 'actual',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#3888fa',
                  width: 2,
                },
                areaStyle: {
                  color: '#f3f8ff',
                },
              },
            },
            data: data.actualData,
            animationDuration: 2800,
            animationEasing: 'quadraticOut',
          },
        ],
      })
    }

    debounce(initChart, 300)()

    return () => {
      chart.current?.dispose()
    }
  }, [])

  const { sidebarCollapsed } = useSetting()

  useEffect(() => {
    const resize = debounce(() => chart.current?.resize(), 300)
    resize()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [sidebarCollapsed])

  return <ChartDiv {...p} ref={ref} />
}

export default LineChart
