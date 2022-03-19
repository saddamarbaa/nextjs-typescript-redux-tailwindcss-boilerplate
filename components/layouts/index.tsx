import React from 'react'

type Props = { children: React.ReactNode };

const index: React.FC<Props> = ({ children }) => (
  <>
    {/* <Navbar /> */}
    <main>{children}</main>
    {/* <Footer /> */}
  </>
)

export default index
