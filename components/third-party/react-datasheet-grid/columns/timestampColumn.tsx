import moment from 'moment'
import React, { useLayoutEffect, useRef } from 'react'
import { CellComponent, CellProps, Column } from '../types'

const TimestampComponent = React.memo<CellProps<number | null, any>>(
  ({
    focus, active, rowData, setRowData,
  }) => {
    const ref = useRef<HTMLInputElement>(null)

    // This is the same trick as in `textColumn`
    useLayoutEffect(() => {
      if (focus) {
        ref.current?.select()
      } else {
        ref.current?.blur()
      }
    }, [focus])

    return (
      <input
        className="dsg-input"
        type="datetime-local"
        // Important to prevent any undesired "tabbing"
        tabIndex={-1}
        ref={ref}
        // The `pointerEvents` trick is the same than in `textColumn`
        // Only show the calendar symbol on non-empty cells, or when cell is active, otherwise set opacity to 0
        style={{
          pointerEvents: focus ? 'auto' : 'none',
          opacity: rowData || active ? undefined : 0,
        }}
        // Because rowData is a Date object and we need a string, we use toISOString...
        value={rowData ? moment.unix(rowData).format('y-MM-DDThh:mm') : ''}
        // ...and the input returns a string that should be converted into a Date object
        onChange={(e) => {
          setRowData(moment(e.target.value).unix())
        }}
      />
    )
  },
)

TimestampComponent.displayName = 'TimestampComponent'

export const timestampColumn: Partial<Column<number | null, any>> = {
  component: TimestampComponent as CellComponent<number | null, any>,
  deleteValue: () => null,
  // We convert the date to a string for copying using toISOString
  copyValue: ({ rowData }) => (rowData ?? null),
  // Because the Date constructor works using iso format, we can use it to parse ISO string back to a Date object
  pasteValue: ({ value }) => {
    if (!Number.isNaN(parseInt(value, 10))) return parseInt(value, 10)
    if (Object.prototype.toString.call(new Date(value)) === '[object Date]') return moment(value).unix()
    return 0
  },
  minWidth: 170,
  isCellEmpty: ({ rowData }) => !rowData,
}
