import { EstadosOptions, NacionalidadesOptions, PepOptions, SituacionFiscalOptions } from "../../../Fixes/fixes"
import GenerateInputs from "../../GenerateInputs/GenerateInputs"

function InputPersonas({control,errors={}, onlyView=false}) {
    const inputsTest = [
        { name:'CUIT', control:control, label:'CUIT', type:'text', error:errors.CUIT,estilos:'col-2' , readOnly:onlyView},
        { name:'Apellido', control:control, label:'Apellidos', type:'text', error:errors.Apellidos,estilos:'col-2' , readOnly:onlyView},
        { name:'Nombre', control:control, label:'Nombres', type:'text', error:errors.Nombres,estilos:'col-2' , readOnly:onlyView},
        { name:'FNacimiento', control:control, label:'Fecha de nacimiento', type:'date', error:errors.Direccion,estilos:'col-2' , readOnly:onlyView},
        { name:'Alias', control:control, label:'Alias', type:'text', error:errors.Direccion,estilos:'col-3' , readOnly:onlyView},
        { name:'IdPersona', control:control, label:'Id', type:'text', error:errors.Direccion,estilos:'col-1' , readOnly:onlyView},
        { name:'Email', control:control, label:'Email', type:'text', error:errors.Email,estilos:'col-3' , readOnly:onlyView},
        { name:'Telefono', control:control, label:'Telefono', type:'text', error:errors.Telefonos,estilos:'col-2' , readOnly:onlyView},
        { name:'Movil', control:control, label:'Movil', type:'text', error:errors.Movil,estilos:'col-2' , readOnly:onlyView},
        { name:'SituacionFiscal', control:control, label:'Situacion Fiscal', type:'select', error:errors.select,estilos:'col-2',options:SituacionFiscalOptions,readOnly:onlyView},
        { name:'PEP', control:control, label:'Persona expuesta politicamente', type:'select', error:errors.select,estilos:'col-3',options:PepOptions , defaultValue:'No',readOnly:onlyView},
        { name:'Actividad', control:control, label:'Actividad', type:'text', error:errors.Direccion,estilos:'col-12' , readOnly:onlyView},
          { name:'Nacionalidad', control:control, label:'Nacionalidad', type:'select', error:errors.select,estilos:'col-2',options:NacionalidadesOptions, defaultValue:'Argentina' , readOnly:onlyView},
        { name:'Domicilio', control:control, label:'Domicilio', type:'text', error:errors.Direccion,estilos:'col-8' , readOnly:onlyView},
        { name:'CodPostal', control:control, label:'Codigo postal', type:'text', error:errors.Direccion,estilos:'col-2' , readOnly:onlyView},
          { name:'EstadoPersona', control:control, label:'Estado', type:'select', error:errors.select,estilos:'col-3',options:EstadosOptions, defaultValue:'A' , readOnly:onlyView},
      ]
  return (
    <GenerateInputs inputs={inputsTest}/>
  )
}

export default InputPersonas