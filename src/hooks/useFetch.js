import { useEffect, useState } from 'react'
import axios from '../config/AxiosConfig.js';


export const useFetch = (
  endpoint,
  method = 'get',
  initialParams = {},
  post = {}
) => {
  const [data, setData] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [params, setParams] = useState(initialParams)
  const [body, setBody] = useState(post)
  const [columnFilters, setColumnFilters] = useState([])
  const [sorting, setSorting] = useState([])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10 //customize the default page size
  })
  const refresh = async () => {
    setLoading(true)
    try {
      const response = await axios({
        method: method,
        url: `${endpoint}`,
        data: body,
        params: {
          pagina: pagination.pageIndex + 1,
          cantidad: pagination.pageSize,
          sort_by: sorting.length ? sorting[0].id : '',
          sort_direction:sorting.length ?  (sorting[0].desc ? 'desc' : 'asc') : '',
          ...columnFilters.reduce((acc, current) => {
            acc[current.id] = current.value // Asignamos la propiedad usando el id como clave
            return acc // Retornamos el acumulador
          }, {})
        }
      })
      const json = await response.data
      setData(json.data)

      return response.data
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    console.log(sorting)
    const controller = new AbortController()
    setLoading(true)
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axios({
          method: method,
          url: `${endpoint}`,
          data: body,
          params: {
            pagina: pagination.pageIndex + 1,
            cantidad: pagination.pageSize,
            sort_by: sorting.length ? sorting[0].id : '',
            sort_direction:sorting.length ?  (sorting[0].desc ? 'desc' : 'asc') : '',
            ...columnFilters.reduce((acc, current) => {
              acc[current.id] = current.value // Asignamos la propiedad usando el id como clave
              return acc // Retornamos el acumulador
            }, {})
          }
        })
        const json = await response.data
        setData(json.data)

        return response.data
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      controller.abort()
    }
  }, [endpoint, method, body, params, pagination, columnFilters,sorting])

  const handleFilterParams = filter => {
    setParams(old => ({ ...filter, pagina: 1, cantidad: old.cantidad }))
  }

  const handleBody = filter => {
    setBody(filter)
  }

  return {
    data,
    loading,
    error,
    params,
    body,
    handleBody,
    handleFilterParams,
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
    refresh
  }
}
