import React from 'react'

function SectionPage ({ header, children }) {
  return (
    <div className='card'>
      {header ? (
        <div className='card-header'>
          <h4 className='card-title'>{header}</h4>
        </div>
      ) : (
        ''
      )}
      <div className='card-body'>{children}</div>
    </div>
  )
}

export default SectionPage
