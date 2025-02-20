import { useEffect, useState } from 'react';
import axios from '../config/AxiosConfig.js';

export const useFetch = (
  endpoint,
  method = 'get',
  initialParams = {},
  post = {}
) => {
  const [data, setData] = useState([]);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);
  const [body, setBody] = useState(post);
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, // Customize the default page size
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios({
        method,
        url: endpoint,
        data: body,
        params: {
          ...initialParams,
          pagina: pagination.pageIndex + 1,
          cantidad: pagination.pageSize,
          sort_by: sorting.length ? sorting[0].id : '',
          sort_direction: sorting.length ? (sorting[0].desc ? 'desc' : 'asc') : '',
          ...columnFilters.reduce((acc, current) => {
            acc[current.id] = current.value; // Assign property using id as key
            return acc; // Return accumulator
          }, {}),
        },
      });
      const json = response.data;
      console.log(json)

      setData(json.data);
      setResponse(json);
    } catch (error) {
      console.log(error)
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData();

    return () => {
      controller.abort();
    };
  }, [endpoint, method, body, params, pagination, columnFilters, sorting]);

  const handleFilterParams = (filter) => {
    setParams((old) => ({ ...filter, pagina: 1, cantidad: old.cantidad }));
  };

  const handleBody = (filter) => {
    setBody(filter);
  };

  const refresh = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    response,
    params,
    body,
    handleBody,
    handleFilterParams,
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
    setData,
    sorting,
    setSorting,
    refresh,
  };
};