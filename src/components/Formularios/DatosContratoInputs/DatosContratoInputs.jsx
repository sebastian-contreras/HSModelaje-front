import { useMemo } from "react"
import GenerateInputs from "../../GenerateInputs/GenerateInputs"
import { AVISO_INGRESO_CHOICES, TIPO_APERTURA_CHOICES, TIPO_TITULARIDAD_CHOICES, TIPO_USO_CHOICES, UPGRADE_SEGURO_CHOICES } from "../../../Fixes/fixes"

function DatosContratoInputs({control,errors={}, onlyView=false, indexMulti=false,multi=false}) {

    const inputsTest = useMemo(()=>[
        { name:`${multi ? `${multi}.${indexMulti}.`:''} Titularidad`, control:control, label:'Titularidad', type:'select', error:errors.Titularidad,options:TIPO_TITULARIDAD_CHOICES, defaultValue:'-',estilos:'col-6' , readOnly:onlyView},
        { name:`${multi ? `${multi}.${indexMulti}.`:''} TipoApertura`, control:control, label:'Apertura de caja', type:'select', error:errors.TipoApertura,options:TIPO_APERTURA_CHOICES, defaultValue:'-',estilos:'col-6' , readOnly:onlyView},
        { name:`${multi ? `${multi}.${indexMulti}.`:''} TipoUso`, control:control, label:'Uso', type:'select', error:errors.TipoUso,options:TIPO_USO_CHOICES, defaultValue:'-',estilos:'col-6' , readOnly:onlyView},
        { name:`${multi ? `${multi}.${indexMulti}.`:''} AvisoIngreso`, control:control, label:'Aviso de ingreso', type:'select', error:errors.AvisoIngreso,options:AVISO_INGRESO_CHOICES, defaultValue:'-',estilos:'col-6' , readOnly:onlyView},
        { name:`${multi ? `${multi}.${indexMulti}.`:''} UpgradeSeguro`, control:control, label:'Upgrade de seguro', type:'select', error:errors.UpgradeSeguro,options:UPGRADE_SEGURO_CHOICES, defaultValue:'-',estilos:'col-6' , readOnly:onlyView},
        { name:`${multi ? `${multi}.${indexMulti}.`:''} PeriodoContratacion`, control:control, label:'Periodo de alquiler/meses', type:'number', error:errors.PeriodoContratacion,estilos:'col-6' , readOnly:onlyView},
        { name:`${multi ? `${multi}.${indexMulti}.`:''} FrecuenciaUso`, control:control, label:'Frecuencia de uso', type:'number', error:errors.FrecuenciaUso,estilos:'col-6' , readOnly:onlyView},
      ],[control,errors,indexMulti,multi,onlyView])
  return (
    <GenerateInputs inputs={inputsTest}/>

  )
}

export default DatosContratoInputs