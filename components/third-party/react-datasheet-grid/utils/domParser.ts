const parser =
  typeof DOMParser !== 'undefined'
    ? new DOMParser()
    : { parseFromString: () => null as unknown as Document }

export const parseDom = (html: string): Document => parser.parseFromString(html, 'text/html')
