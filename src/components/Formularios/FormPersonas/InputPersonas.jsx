import { useMemo } from "react"
import { ESTADO_PERSONA_CHOICE, EstadosOptions, NacionalidadesOptions, PEP_CHOICES, SITUACION_FISCAL_CHOICE } from "../../../Fixes/fixes"
import GenerateInputs from "../../GenerateInputs/GenerateInputs"

function InputPersonas({control,errors={}, onlyView=false, indexMulti=false,multi=false}) {
  
  const inputsTest = useMemo(()=>[
    { name:`${multi ? `${multi}.${indexMulti}.`:''} CUIT`, control:control, label:'CUIT', type:'text', error:errors.CUIT,estilos:'col-2' , readOnly:onlyView},
    { name:`${multi ? `${multi}.${indexMulti}.`:''} Apellido`, control:control, label:'Apellidos', type:'text', error:errors.Apellidos,estilos:'col-2' , readOnly:onlyView},
    { name:`${multi ? `${multi}.${indexMulti}.`:''} Nombre`, control:control, label:'Nombres', type:'text', error:errors.Nombres,estilos:'col-2' , readOnly:onlyView},
    { name:`${multi ? `${multi}.${indexMulti}.`:''} FNacimiento`, control:control, label:'Fecha de nacimiento', type:'date', error:errors.Direccion,estilos:'col-2' , readOnly:onlyView},
    { name:`${multi ? `${multi}.${indexMulti}.`:''} Alias`, control:control, label:'Alias', type:'text', error:errors.Direccion,estilos:'col-3' , readOnly:onlyView},
    { name:`${multi ? `${multi}.${indexMulti}.`:''} IdPersona`, control:control, label:'Id', type:'text', error:errors.Direccion,estilos:'col-1' , readOnly:true},
    { name:`${multi ? `${multi}.${indexMulti}.`:''} Email`, control:control, label:'Email', type:'text', error:errors.Email,estilos:'col-3' , readOnly:onlyView},
    { name:`${multi ? `${multi}.${indexMulti}.`:''} Telefono`, control:control, label:'Telefono', type:'text', error:errors.Telefonos,estilos:'col-2' , readOnly:onlyView},
    { name:`${multi ? `${multi}.${indexMulti}.`:''} Movil`, control:control, label:'Movil', type:'text', error:errors.Movil,estilos:'col-2' , readOnly:onlyView},
    { name:`${multi ? `${multi}.${indexMulti}.`:''} SituacionFiscal`, control:control, label:'Situacion Fiscal', type:'select', error:errors.select,estilos:'col-2',options:SITUACION_FISCAL_CHOICE,readOnly:onlyView},
    { name:`${multi ? `${multi}.${indexMulti}.`:''} PEP`, control:control, label:'Persona expuesta politicamente', type:'select', error:errors.select,estilos:'col-3',options:PEP_CHOICES , defaultValue:'No',readOnly:onlyView},
    { name:`${multi ? `${multi}.${indexMulti}.`:''} Actividad`, control:control, label:'Actividad', type:'text', error:errors.Direccion,estilos:'col-12' , readOnly:onlyView},
    { name:`${multi ? `${multi}.${indexMulti}.`:''} Nacionalidad`, control:control, label:'Nacionalidad', type:'select', error:errors.select,estilos:'col-2',options:NacionalidadesOptions, defaultValue:'Argentina' , readOnly:onlyView},
    { name:`${multi ? `${multi}.${indexMulti}.`:''} Domicilio`, control:control, label:'Domicilio', type:'text', error:errors.Direccion,estilos:'col-8' , readOnly:onlyView},
    { name:`${multi ? `${multi}.${indexMulti}.`:''} CodPostal`, control:control, label:'Codigo postal', type:'text', error:errors.Direccion,estilos:'col-2' , readOnly:onlyView},
    { name:`${multi ? `${multi}.${indexMulti}.`:''} EstadoPersona`, control:control, label:'Estado', type:'select', error:errors.select,estilos:'col-3',options:ESTADO_PERSONA_CHOICE, defaultValue:'A' , readOnly:onlyView},
  ],[control,errors,indexMulti,multi,onlyView])
   
  return (
    <GenerateInputs inputs={inputsTest}/>
  )
}

export default InputPersonas