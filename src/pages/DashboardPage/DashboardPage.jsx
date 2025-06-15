'use client'
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button as MUIButton,
  CircularProgress
} from '@mui/material'
import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer
} from 'recharts'
import {
  dashboardApi,
  downloadInformeEvento
} from '../../services/InformesService'
import { useEvento } from '../../context/SidebarContext/EventoContext'
import { Alerta } from '../../functions/alerts'
import ModalModificado from '../../components/Modal/ModalModificado'
import InputPersonas from '../../components/Formularios/FormPersonas/InputPersonas'
import HeaderPageComponent from '../../components/HeaderPageComponent/HeaderPageComponent'
import SectionPage from '../../components/SectionPage/SectionPage'
import { useParams } from 'react-router-dom'
import Button from '../../components/Button/Button'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

function DashboardPage () {
  const { evento } = useEvento()
  const [Data, setData] = useState(null)
  const [Loading, setLoading] = useState(false)
  const [Modal, setModal] = useState(false)
  const { id } = useParams()

  useEffect(() => {
    dashboardApi(id)
      .then(res => setData(res.data))
      .catch(console.log)
  }, [id])

  const downloadInforme = () => {
    setLoading(true)
    downloadInformeEvento(evento.IdEvento)
      .then(() => {
        Alerta()
          .withTipo('success')
          .withTitulo('Informe descargado')
          .withMensaje('El informe se ha descargado correctamente')
          .withMini(true)
          .build()
      })
      .catch(() => {
        Alerta()
          .withTipo('error')
          .withTitulo('Error al descargar el informe')
          .withMensaje('No se pudo descargar el informe')
          .withMini(true)
          .build()
      })
      .finally(() => setLoading(false))
  }

  const totalGananciaReal =
    Data?.zona?.reduce((acc, z) => acc + parseFloat(z.GananciaReal || 0), 0) ||
    0
  const totalGananciaEsperada =
    Data?.zona?.reduce(
      (acc, z) => acc + parseFloat(z.GananciaEsperada || 0),
      0
    ) || 0
  const totalGastos =
    Data?.gastos?.reduce((acc, g) => acc + parseFloat(g.Monto || 0), 0) || 0
  const totalVendidas =
    Data?.zona?.reduce((acc, z) => acc + parseInt(z.Vendidas || 0), 0) || 0
  const gananciaNeta = totalGananciaReal - totalGastos

  return (
    <>
      <HeaderPageComponent
        title='Dashboard'
        items={[{ name: 'Dashboard', link: '/' }]}
      />

      <SectionPage header='Dashboard'>
        <Grid container spacing={2}>
          {/* Botón descarga */}
          <Grid item xs={12} className='text-end'>
            <Button lg loading={Loading} onClick={downloadInforme}>
              {Loading ? 'Descargando...' : 'Descargar Informe'}
            </Button>
          </Grid>

          {/* Indicadores */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant='h6'>Total Vendidas</Typography>
                <Typography variant='h5'>{totalVendidas}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant='h6'>Ganancia Real</Typography>
                <Typography variant='h5'>
                  ${totalGananciaReal.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant='h6'>Gastos</Typography>
                <Typography variant='h5'>${totalGastos.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant='h6'>Ganancia Neta</Typography>
                <Typography variant='h5'>${gananciaNeta.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico: Ganancia por Zona */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title='Ganancias por Zona' />
              <CardContent style={{ height: 300 }}>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={Data?.zona?.filter(z => z.Zona !== 'TOTAL')}>
                    <XAxis dataKey='Zona' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey='GananciaEsperada'
                      fill='#8884d8'
                      name='Esperada'
                    />
                    <Bar dataKey='GananciaReal' fill='#82ca9d' name='Real' />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico: Estado del Evento */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title='Estado de Entradas' />
              <CardContent style={{ height: 300 }}>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={Data?.estado?.filter(
                        e => e.EstadoEvento !== 'Total'
                      )}
                      dataKey='Cantidad'
                      nameKey='EstadoEvento'
                      cx='50%'
                      cy='50%'
                      outerRadius={80}
                      label
                    >
                      {Data?.estado?.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Tabla de Gastos */}
          <Grid item xs={12}>
            <Card>
              <CardHeader title='Gastos del Evento' />
              <CardContent>
                <TableContainer component={Paper}>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Gasto</TableCell>
                        <TableCell>Personal</TableCell>
                        <TableCell>Monto</TableCell>
                        <TableCell>Comprobante</TableCell>
                        <TableCell>Fecha</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Data?.gastos?.map((g, i) => (
                        <TableRow key={i}>
                          <TableCell>{g.Gasto}</TableCell>
                          <TableCell>{g.Personal ?? '-'}</TableCell>
                          <TableCell>${g.Monto}</TableCell>
                          <TableCell>{g.Comprobante ?? '-'}</TableCell>
                          <TableCell>{g.FechaCreado ?? '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </SectionPage>

      {/* Modal de detalle */}
      <ModalModificado show={Modal} handleClose={() => setModal(false)}>
        <InputPersonas onlyView={true} />
      </ModalModificado>
    </>
  )
}

export default DashboardPage
