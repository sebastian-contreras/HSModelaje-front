import GenerateInputs from "../../GenerateInputs/GenerateInputs"

function InputCaja({control,errors={}, onlyView=true}) {
    const inputsTest = [
        { name:'CUIT', control:control, label:'CUIT', type:'text', error:errors.CUIT,estilos:'col-2' , readOnly:onlyView},
        { name:'Apellido', control:control, label:'Apellidos', type:'text', error:errors.Apellidos,estilos:'col-2' , readOnly:onlyView},
        { name:'Nombre', control:control, label:'Nombres', type:'text', error:errors.Nombres,estilos:'col-2' , readOnly:onlyView},
        { name:'Email', control:control, label:'Email', type:'text', error:errors.Email,estilos:'col-2' , readOnly:onlyView},
        { name:'Telefono', control:control, label:'Telefono', type:'text', error:errors.Telefonos,estilos:'col-2' , readOnly:onlyView},
        { name:'Movil', control:control, label:'Movil', type:'text', error:errors.Movil,estilos:'col-2' , readOnly:onlyView},
        { name:'FNacimiento', control:control, label:'Fecha de nacimiento', type:'date', error:errors.Direccion,estilos:'col-3' , readOnly:onlyView},
        { name:'Alias', control:control, label:'Alias', type:'text', error:errors.Direccion,estilos:'col-2' , readOnly:onlyView},
        { name:'IdPersona', control:control, label:'Id', type:'text', error:errors.Direccion,estilos:'col-1' , readOnly:onlyView},
       
      ]
  return (
    <GenerateInputs inputs={inputsTest}/>
  )
}

export default InputCaja