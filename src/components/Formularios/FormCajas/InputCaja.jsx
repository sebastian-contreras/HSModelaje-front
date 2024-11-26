import { EstadosOptions } from "../../../Fixes/fixes"
import GenerateInputs from "../../GenerateInputs/GenerateInputs"

function InputCaja({control,errors={}, onlyView=false}) {
//     'NumeroCaja'
// 'Tamaño'
// 'Ubicacion'
// 'Fila'
// 'Columna'
// 'Observaciones'
// 'EstadoCaja'
    const inputsTest = [
      {name: 'NumeroCaja',control:control,label:'Numero de caja',type:'number',estilos:'col-3',error:errors.NumeroCaja,readOnly:onlyView},
      {name: 'Tamaño',control:control,label:'Tamaño',type:'text',estilos:'col-9',error:errors.Tamaño,readOnly:onlyView},
      {name: 'Fila',control:control,label:'Fila',type:'text',estilos:'col-6',error:errors.Fila,readOnly:onlyView},
      {name: 'Columna',control:control,label:'Columna',type:'text',estilos:'col-6',error:errors.Columna,readOnly:onlyView},
      {name: 'Ubicacion',control:control,label:'Ubicacion',type:'text',error:errors.Ubicacion,readOnly:onlyView},
      {name: 'Observaciones',control:control,label:'Observaciones',type:'text',error:errors.Observaciones,readOnly:onlyView},
      {name:'EstadoCaja', control:control, label:'Estado', type:'select', error:errors.select,estilos:'col-3',options:EstadosOptions, defaultValue:'A' , readOnly:onlyView},
      ]
  return (
    <GenerateInputs inputs={inputsTest}/>
  )
}

export default InputCaja