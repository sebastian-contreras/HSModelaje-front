import { useEffect, useState } from 'react'
import { Accordion } from 'react-bootstrap'
import { useFieldArray, useForm } from 'react-hook-form'
import Button from '../../../components/Button/Button.jsx'
import InputPersonas from '../../../components/Formularios/FormPersonas/InputPersonas.jsx'
import HeaderPageComponent from '../../../components/HeaderPageComponent/HeaderPageComponent'
import SectionPage from '../../../components/SectionPage/SectionPage'
import TablaCajas from '../../../components/TablaCajas/TablaCajas.jsx'
import DatosContratoInputs from '../../../components/Formularios/DatosContratoInputs/DatosContratoInputs.jsx'
import GenerateInputs from '../../../components/GenerateInputs/GenerateInputs.jsx'
import {
  TIPO_FORMAS_PAGO_CHOICES,
  TIPO_MARCAS_TARJETAS_CHOICES
} from '../../../Fixes/fixes.js'
import { Collapse } from '@mui/material'

function NuevoContratoPage ({ onlyView = false }) {
  const { control, errors, reset, watch, handleSubmit } = useForm({
    defaultValues: {
      Titulares: [{}]
    }
  })
  const [cajasSeleccionadas, setCajasSeleccionadas] = useState({})
  const {
    fields: Titulares,
    append,
    remove
  } = useFieldArray({
    control,
    name: 'Titulares', // Nombre del campo que se manejará como array
    shouldUnregister: false
  })

  const agregarTitulares = event => {
    event.stopPropagation()
    append({})
  }
  const eliminarTitular = (event, index) => {
    event.stopPropagation()
    remove(index) // Elimina el titular en el índice especificado
  }

  function CrearContratoSubmit (data) {
    console.log(data)
  }

  const inputsFormaPago = [
    {
      name: `TipoFormaPago`,
      control: control,
      label: 'Forma de pago',
      type: 'select',
      error: errors?.TipoFormaPago,
      options: TIPO_FORMAS_PAGO_CHOICES,
      defaultValue: '-',
      estilos: 'col-6',
      readOnly: onlyView
    },
    {
      name: `PagoAdelantado`,
      control: control,
      label: 'Periodo de pago adelantado (aplica CPI) * MESES',
      type: 'number',
      error: errors?.PagoAdelantado,
      estilos: 'col-6',
      readOnly: onlyView
    }
  ]

  const inputsDebitoAutomatico = [
    {
      name: `MarcaTarjeta`,
      control: control,
      label: 'Marca tarjera',
      type: 'select',
      error: errors?.MarcaTarjeta,
      options: TIPO_MARCAS_TARJETAS_CHOICES,
      defaultValue: '-',
      estilos: 'col-6',
      readOnly: onlyView
    },
    {
      name: `NumeroTarjeta`,
      control: control,
      label: 'Numero de tarjeta',
      type: 'string',
      error: errors?.NumeroTarjeta,
      estilos: 'col-6',
      readOnly: onlyView
    },
    {
      name: `BancoEmisor`,
      control: control,
      label: 'Banco emisor',
      type: 'string',
      error: errors?.BancoEmisor,
      estilos: 'col-6',
      readOnly: onlyView
    },
    {
      name: `FVencimiento`,
      control: control,
      label: 'Fecha de vencimiento',
      type: 'date',
      error: errors?.FVencimiento,
      estilos: 'col-2',
      readOnly: onlyView
    },
    {
      name: `Titular`,
      control: control,
      label: 'Titular',
      type: 'date',
      error: errors?.Titular,
      estilos: 'col-6',
      readOnly: onlyView
    },
    {
      name: `CodSeguridad`,
      control: control,
      label: 'Codigo de seguridad',
      type: 'date',
      error: errors?.CodSeguridad,
      estilos: 'col-6',
      readOnly: onlyView
    }
  ]

  const inputsDebitoAutomaticoAhorro = [
    {
      name: `BancoEmisor`,
      control: control,
      label: 'Banco',
      type: 'string',
      error: errors?.BancoEmisor,
      estilos: 'col-6',
      readOnly: onlyView
    },
    {
      name: `CBU`,
      control: control,
      label: 'CBU',
      type: 'string',
      error: errors?.CBU,
      estilos: 'col-6',
      readOnly: onlyView
    }
  ]

  return (
    <div>
      <HeaderPageComponent
        title='Contratos'
        items={[{ name: 'Contratos', link: '/contratos' }]}
      />
      <SectionPage header={'Nuevo contrato'}>
        <form onSubmit={handleSubmit(CrearContratoSubmit)}>
          <div>
            <Accordion alwaysOpen>
              <Accordion.Item eventKey='caja'>
                <Accordion.Header>
                  <b>Caja</b>
                </Accordion.Header>
                <Accordion.Body>
                  <TablaCajas
                    select
                    rowSelection={cajasSeleccionadas}
                    setRowSelection={setCajasSeleccionadas}
                  />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='titulares'>
                <Accordion.Header>
                  <b className='me-3'>Titulares</b>
                  <Button sm estilo='primary' onClick={agregarTitulares}>
                    +
                  </Button>
                </Accordion.Header>
                <Accordion.Body>
                  <Accordion alwaysOpen>
                    {Titulares.map((Titulares, index) => (
                      <Accordion.Item
                        eventKey={`Titulares-${index}`}
                        key={Titulares.id}
                      >
                        <Accordion.Header>
                          <b className='me-3'>Titular #{index + 1}</b>
                          <Button
                            sm
                            estilo='danger'
                            onClick={e => eliminarTitular(e, index)}
                          >
                            -
                          </Button>
                        </Accordion.Header>
                        <Accordion.Body>
                          <InputPersonas
                            control={control}
                            errors={errors}
                            indexMulti={index}
                            multi='Titulares'
                          />
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='cuenta'>
                <Accordion.Header>
                  <b>Datos varios del contrato</b>
                </Accordion.Header>
                <Accordion.Body>
                  <DatosContratoInputs control={control} errors={errors} />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='pago'>
                <Accordion.Header>
                  <b>Forma de pago</b>
                </Accordion.Header>
                <Accordion.Body>
                  <div className='mb-2'>
                    <GenerateInputs
                      control={control}
                      errors={errors}
                      inputs={inputsFormaPago}
                    />
                  </div>
                  <Collapse
                    in={[
                      'Deb automatico Tarj/Credito',
                      'Deb automatico Tarj/Debito'
                    ].includes(watch('TipoFormaPago'))}
                  >
                    <h5>Debito Automatico</h5>
                    <GenerateInputs
                      control={control}
                      errors={errors}
                      inputs={inputsDebitoAutomatico}
                    />
                  </Collapse>
                  <Collapse
                    in={[
                      'Deb automatico Cta Cte',
                      'Deb automatico Cuenta de ahorro'
                    ].includes(watch('TipoFormaPago'))}
                  >
                    <h5>Debito Automatico</h5>
                    <GenerateInputs
                      control={control}
                      errors={errors}
                      inputs={inputsDebitoAutomaticoAhorro}
                    />
                  </Collapse>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='roxbox'>
                <Accordion.Header>
                  <b>Responsable Roxbox</b>
                </Accordion.Header>
                <Accordion.Body></Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey='autorizados'>
                <Accordion.Header>
                  <b>Autorizados/Acompañantes</b>
                </Accordion.Header>
                <Accordion.Body></Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          <div className='d-flex justify-content-end mt-4'>
            <Button type='submit'>Crear contrato</Button>
          </div>
        </form>
      </SectionPage>
    </div>
  )
}

export default NuevoContratoPage
