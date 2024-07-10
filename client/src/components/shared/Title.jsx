import React from 'react'
import { Helmet } from 'react-helmet-async'

const Title = ({
  title="Chit_Chat", description=""
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
    </Helmet>
  )
}

export default Title

//React Helmet- reusable React component will manage all of your changes to the document head