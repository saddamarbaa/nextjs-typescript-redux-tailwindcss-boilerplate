/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ActionMeta, SingleValue } from 'react-select'
import AsyncSelect from 'react-select/async'
import React, {
  useCallback, useEffect, useLayoutEffect, useRef, useState,
} from 'react'
import { FaPaste } from 'react-icons/fa'
import { MdError } from 'react-icons/md'

import { usePrevious } from 'components/custom-hooks'

import * as proto from 'global-states/job-milestone/_prototype'
import { postGeocodingOptions } from 'global-states/job-milestone'

import { Tooltip } from '@/components/design-system'
import { CellComponent, CellProps, Column } from '../types'

const AddressComponent = React.memo<CellProps<proto.AddressOption<proto.GeocodingResPlace> | null, any>>(({
  focus,
  rowData,
  setRowData,
  active,
  columnData: {
    parseUserInput,
    // onChange,
    ownerId,
  },
}) => {
  const ref = useRef<any>(null)

  const asyncRef = useRef({
    rowData,
    setRowData,
    // options,
    // formatInputOnFocus,
    // formatBlurredInput,
    parseUserInput,
    // continuousUpdates,
    // This allows us to keep track of whether or not the user blurred the input using the Esc key
    // If the Esc key is used we do not update the row's value (only relevant when continuousUpdates is false)
    escPressed: false,
    ownerId,
  })
  asyncRef.current = {
    rowData,
    setRowData,
    // options,
    // formatInputOnFocus,
    // formatBlurredInput,
    parseUserInput,
    // continuousUpdates,
    // Keep the same value across renders
    escPressed: asyncRef.current.escPressed,
    ownerId,
  }

  const [autoCompleteToken, setAutoCompleteToken] = useState('')

  const prevRowData = usePrevious(rowData)

  useLayoutEffect(() => {
    // When the cell gains focus we make sure to immediately address the text in the input:
    // - If the user gains focus by typing, it will replace the existing text, as expected
    // - If the user gains focus by clicking or pressing Enter, the text will be preserved and addressed
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

  const asyncSetSearchGeojsonResult = useCallback(async () => {
    if (rowData?.label === '#NOT_FOUND!' || rowData?.label === '#INVALID!') return

    const search_value = rowData?.label || ''

    if (rowData?.value && typeof rowData?.value === 'object') {
      if (Object.keys(rowData?.value || {})?.length === 0) {
        const { result } = await postGeocodingOptions(ownerId, {
          search_value,
          country: 'SG',
        })
        if (result?.[0]) {
          setRowData({ ...result?.[0], isPaste: true })
        } else {
          setRowData({ label: search_value, value: { source: 'google' }, isPaste: true })
        }
      } else if (rowData?.value?.source === 'google' && rowData?.value?.id !== '') {
        const { result, token: generatedToken } = await postGeocodingOptions(ownerId, {
          search_value,
          country: 'SG',
          is_auto_complete_done: true,
          is_auto_complete: true,
          id: rowData?.value?.id,
          token: autoCompleteToken,
        })
        if (result?.[0]) {
          setRowData({ ...result?.[0], isPaste: true })
        } else {
          setRowData({
            value: { address1: search_value }, label: '#NOT_FOUND!', isPaste: true, isNotFound: true,
          })
        }
        setAutoCompleteToken(generatedToken)
      }
    }
  }, [ownerId, rowData, autoCompleteToken])

  useEffect(() => {
    // console.info('>>>', prevRowData, rowData)
    if (JSON.stringify(prevRowData) === JSON.stringify(rowData)) return

    asyncSetSearchGeojsonResult()
  }, [rowData, asyncSetSearchGeojsonResult])

  const defaultOptions = () => [
    ...(rowData ? [rowData] : []),
  ]

  const loadGeocodingOptions = useCallback(async (text: string) => {
    if (text === '#NOT_FOUND!' || text === '#INVALID!') return []

    const { result, token: generatedToken } = await postGeocodingOptions(ownerId, {
      search_value: text,
      country: 'SG',
      token: autoCompleteToken,
      is_auto_complete: true,
    })
    setAutoCompleteToken(generatedToken)
    return result
  }, [ownerId, autoCompleteToken])

  return (
    <div style={{
      display: 'flex', flexDirection: 'row', height: '100%', width: '100%', border: rowData?.error ? '1px solid red' : 'inherit',
    }}
    >
      <AsyncSelect
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
          option: (provided) => ({
            ...provided,
            whiteSpace: 'pre-wrap',
          }),
        }}
        isClearable={focus}
        cacheOptions
        defaultOptions={defaultOptions()}
        loadOptions={loadGeocodingOptions}
      // @ts-ignore
        getOptionLabel={(option: proto.AddressOption<proto.GeocodingResPlace>) => {
          const {
            label, value, isInvalid, isNotFound,
          } = option
          // return `${label}\nAddress: ${value.address1}`
          return (
            <div className={`flex flex-1 content-between justify-between ${(isInvalid || isNotFound) ? 'text-red-500' : ''}`}>
              <span className="">
                <strong>{label}</strong>
                {value && Object.keys(value)?.length > 0 && value?.address1 && (
                <>
                  <span className="mx-2">|</span>
                  <span className={(isInvalid || isNotFound) ? 'text-red-500' : 'text-grey-700'}>
                    {value?.address1}
                  </span>
                </>
                )}
              </span>
            </div>
          )
        }}
        onChange={(newValue: SingleValue<proto.AddressOption<proto.GeocodingResPlace>>, actionMeta: ActionMeta<proto.AddressOption<proto.GeocodingResPlace>>) => {
          switch (actionMeta.action) {
            // case 'pop-value':
            // case 'create-option':
            case 'clear':
            case 'deselect-option':
            case 'remove-value':
            case 'select-option':
              setRowData(newValue ? { ...newValue, isPaste: false } : null)
              break
            default:
              break
          }
        }}
        components={{
          DropdownIndicator: (props) => {
            const { isPaste, isInvalid, isNotFound } = props.getValue()?.[0] || {}
            if (!props.isFocused) {
              return (
                <>
                  {(isInvalid || isNotFound) && (
                  <div className="mx-2">
                    <MdError size={16} className="stroke-current text-red-500" />
                  </div>
                  )}
                  {isPaste && (
                  <div className="mx-2">
                    <FaPaste size={16} className="stroke-current text-grey-500" />
                  </div>
                  )}
                </>
              )
            }
            return null
          },
          IndicatorSeparator: () => null,
          // SingleValue,
        }}
        placeholder="Type Address..."
        menuIsOpen={focus}
        menuPortalTarget={document.body}
      />
      {rowData?.error && (
      <Tooltip
        title="error"
        placement="top"
              // style={{ overflow: 'auto' }}
        content={rowData?.error}
      >
        ❗
      </Tooltip>
      )}
    </div>
  )
})

AddressComponent.displayName = 'AddressComponent'

export function createAddressColumn<T = proto.AddressOption<proto.GeocodingResPlace> | null>({
  ownerId = null as (number | null),
  deletedValue = null as unknown as T,
  formatForCopy = (value: T | any) => {
    const parsedValue: string = (value ? JSON.stringify(value.value) : '')
    return parsedValue
  },
  parsePastedValue = (value: any) => {
    if (typeof value !== 'string') {
      return {
        value: { address1: value }, label: '#INVALID!', isPaste: true, isInvalid: true,
      } as unknown as T
    }
    if (value) {
      try {
        const parsedValue: proto.GeocodingResPlace = JSON.parse(value)
        return (parsedValue?.name
          ? { value: parsedValue, label: parsedValue.name, isPaste: true }
          : {
            value: { address1: value }, label: '#INVALID!', isPaste: true, isInvalid: true,
          }
        ) as unknown as T
      } catch (e) {
        return { value: {}, label: value.trim(), isPaste: true } as unknown as T
      }
    }
    return { value: null, label: '' } as unknown as T
  },
  parseUserInput = (value: any) => value,
  // onChange = (e: { value: string, label: string }) => e,
} = {}): Partial<Column<T, any>> {
  return {
    component: AddressComponent as CellComponent<any, any>,
    columnData: {
      // options,
      // onChange,
      parseUserInput,
      ownerId,
    },
    deleteValue: () => deletedValue,
    copyValue: ({ rowData }) => formatForCopy(rowData),
    pasteValue: ({ value }) => parsePastedValue(value),
    isCellEmpty: ({ rowData }) => !rowData,
  }
}

export const addressColumn = createAddressColumn<string | null>()
