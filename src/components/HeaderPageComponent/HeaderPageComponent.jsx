import { Link } from 'react-router-dom'

function HeaderPageComponent ({ title = '', items = [] }) {
  console.log(items.length)
  return (
    <div className='page-header'>
      <h3 className='fw-bold mb-3'>{title}</h3>
      <ul className='breadcrumbs ms-3 mb-2'>
        {items.map((item, index) => (
          <li key={index} className='ms-2 nav-item'>
            <Link to={item.link || ''}>{item.name || ''}</Link>
            {index+1 != items.length ? (
              <i className='ms-2 fa-solid fa-arrow-right' />
            ) : (
              ''
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default HeaderPageComponent
