/* eslint-disable @typescript-eslint/ban-ts-comment */
import ReactSelect from 'react-select'
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { CellComponent, CellProps, Column } from '../types'

type SelectOption = { value: string | number; label: string; }

const SelectComponent = React.memo<CellProps<SelectOption | null, any>>(({
  focus,
  rowData,
  setRowData,
  active,
  columnData: {
    options,
    parseUserInput,
    // onChange,
  },
}) => {
  const ref = useRef<any>(null)

  const asyncRef = useRef({
    rowData,
    setRowData,
    options,
    // formatInputOnFocus,
    // formatBlurredInput,
    parseUserInput,
    // continuousUpdates,
    // This allows us to keep track of whether or not the user blurred the input using the Esc key
    // If the Esc key is used we do not update the row's value (only relevant when continuousUpdates is false)
    escPressed: false,
  })
  asyncRef.current = {
    rowData,
    setRowData,
    options,
    // formatInputOnFocus,
    // formatBlurredInput,
    parseUserInput,
    // continuousUpdates,
    // Keep the same value across renders
    escPressed: asyncRef.current.escPressed,
  }

  useLayoutEffect(() => {
    // When the cell gains focus we make sure to immediately select the text in the input:
    // - If the user gains focus by typing, it will replace the existing text, as expected
    // - If the user gains focus by clicking or pressing Enter, the text will be preserved and selected
    if (focus) {
      if (ref.current) {
        // Make sure to first format the input
        // ref.current.value = asyncRef.current.formatInputOnFocus(
        //   asyncRef.current.rowData,
        // )
        ref.current.focus()
      }

      // We immediately reset the escPressed
      asyncRef.current.escPressed = false
    } // eslint-disable-line brace-style
    // When the cell looses focus (by pressing Esc, Enter, clicking away...) we make sure to blur the input
    // Otherwise the user would still see the cursor blinking
    else if (ref.current) {
      // Update the row's value on blur only if the user did not press escape (only relevant when continuousUpdates is false)
      if (
        !asyncRef.current.escPressed
        // && !asyncRef.current.continuousUpdates
      ) {
        // asyncRef.current.setRowData(
        //   asyncRef.current.parseUserInput(ref.current.value),
        // )
      }
      ref.current.blur()
    }
  }, [focus])

  // useEffect(() => {
  //   onChange(rowData)
  // }, [rowData])

  useEffect(() => {
    const asyncSetSearchGeojsonResult = async () => {
      if (
        rowData?.value !== undefined
        && typeof rowData?.value === 'object'
        && Object.keys(rowData?.value).length === 0
      ) {
        // const result = await searchGeojsonOption(rowData?.label)
        const result = options?.find((x: SelectOption) => x.value === rowData?.value)
        setRowData(result || rowData)
      }
    }

    // onChange(rowData)
    asyncSetSearchGeojsonResult()
  }, [rowData])

  return (
    <ReactSelect
      ref={ref}
      value={rowData}
      styles={{
        container: (provided) => ({
          ...provided,
          flex: 1, // full width
          alignSelf: 'stretch', // full height
          pointerEvents: focus ? undefined : 'none',
        }),
        control: (provided) => ({
          ...provided,
          height: '100%',
          border: 'none',
          boxShadow: 'none',
          background: 'none',
          // opacity: active ? 1 : 0,
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          opacity: active ? 1 : 0,
        }),
      }}
      onChange={(e: any) => {
        setRowData(parseUserInput(e))
      }}
      options={options}
      menuIsOpen={focus}
      menuPortalTarget={document.body}
    />
  )
})

SelectComponent.displayName = 'SelectComponent'

export function createSelectColumn<T = SelectOption | null>({
  options = [] as T[],
  deletedValue = null as unknown as T,
  formatForCopy = (value: any | null) => (value ? JSON.stringify(value) : value),
  parsePastedValue = (value: any) => {
    if (typeof value !== 'string') return { value: '', label: '#INVALID!' }
    if (value) {
      try {
        return (value ? JSON.parse(value) : { value, label: value.trim() })
      } catch (e) {
        return { value: {}, label: value.trim() }
      }
    }
    return { value: '', label: '' }
  },
  parseUserInput = (value: any) => value,
  // onChange = (e: { value: string, label: string }) => e,
} = {}): Partial<Column<T, any>> {
  return {
    component: SelectComponent as CellComponent<any, any>,
    columnData: {
      options,
      // onChange,
      parseUserInput,
    },
    deleteValue: () => deletedValue,
    copyValue: ({ rowData }) => formatForCopy(rowData),
    pasteValue: ({ value }) => parsePastedValue(value),
    isCellEmpty: ({ rowData }) => !rowData,
  }
}

export const selectColumn = createSelectColumn<string | null>({ options: [] })
