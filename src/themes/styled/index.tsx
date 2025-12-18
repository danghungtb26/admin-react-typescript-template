import React from 'react'

import { GlobalStyle } from './global'

type StyledProviderProps = {
  children?: React.ReactNode
}

const StyledProvider: React.FC<StyledProviderProps> = ({ children }) => {
  // const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())
  // useServerInsertedHTML(() => {
  //   const styles = styledComponentsStyleSheet.getStyleElement()
  //   styledComponentsStyleSheet.instance.clearTag()
  //   return styles
  // })

  // if (typeof window !== 'undefined') return children

  return (
    <>
      <GlobalStyle />
      {children}
    </>
  )
}

export default StyledProvider
