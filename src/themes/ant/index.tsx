import { StyleProvider, px2remTransformer } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'
import React from 'react'
import { useTheme } from 'styled-components'

type AntDesignProviderProps = {
  children?: React.ReactNode
}

const px2rem = px2remTransformer({
  rootValue: 10,
})

const AntDesignProvider: React.FC<AntDesignProviderProps> = ({ children }) => {
  // const [cache] = useState(() => createCache())

  // useEffect(() => {
  //   document.head.insertAdjacentHTML('beforeend', `</script>${extractStyle(cache)}<script>`)
  // }, [cache])

  const theme = useTheme()

  return (
    <StyleProvider transformers={[px2rem]}>
      {/* <App> */}

      {children}
      {/* </App> */}
    </StyleProvider>
  )
}

export default AntDesignProvider
