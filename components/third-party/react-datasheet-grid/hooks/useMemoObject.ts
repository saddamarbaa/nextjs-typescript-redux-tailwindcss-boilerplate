import { useMemo } from 'react'

export const useMemoObject = <T>(object: T): T =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line implicit-arrow-linebreak
  useMemo<T>(() => object, Object.values(object))
