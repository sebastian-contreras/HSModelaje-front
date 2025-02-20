
import { useMemo } from "react"
import GenerateInputs from "../../GenerateInputs/GenerateInputs"

function InputPersonas({control,errors={}, onlyView=false, indexMulti=false,multi=false}) {
  
  const inputsTest = useMemo(()=>[
],[control,errors,indexMulti,multi,onlyView])
   
  return (
    <GenerateInputs inputs={inputsTest}/>
  )
}

export default InputPersonas