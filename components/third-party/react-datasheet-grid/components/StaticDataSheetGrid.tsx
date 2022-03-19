import React, { useState } from 'react'
import { DataSheetGridProps, DataSheetGridRef } from '../types'
import { DataSheetGrid } from './DataSheetGrid'

export const StaticDataSheetGrid = React.forwardRef<
  DataSheetGridRef,
  DataSheetGridProps<any>
>(
  <T extends any>(
    {
      columns,
      gutterColumn,
      stickyRightColumn,
      addRowsComponent,
      createRow,
      duplicateRow,
      style,
      onFocus,
      onBlur,
      onActiveCellChange,
      onSelectionChange,
      ...rest
    }: DataSheetGridProps<T>,
    ref: React.ForwardedRef<DataSheetGridRef>,
  ) => {
    const [staticProps] = useState({
      columns,
      gutterColumn,
      stickyRightColumn,
      addRowsComponent,
      createRow,
      duplicateRow,
      style,
      onFocus,
      onBlur,
      onActiveCellChange,
      onSelectionChange,
    })

    return <DataSheetGrid {...staticProps} {...rest} ref={ref} />
  },
) as <T extends any>(
  props: DataSheetGridProps<T> & { ref?: React.ForwardedRef<DataSheetGridRef> }
) => JSX.Element
