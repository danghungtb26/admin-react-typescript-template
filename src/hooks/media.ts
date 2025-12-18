import { useMediaQuery } from 'react-responsive'

import { break_points_value } from '@/themes/styled/globalStyle'

export const useMobile = () =>
  useMediaQuery({
    query: `(max-width: ${break_points_value.xs}px)`,
  })
