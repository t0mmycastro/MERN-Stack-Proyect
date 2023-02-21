import { useState, useEffect } from "react"

const usePersist = () => {
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);
    // acá basicamente estamos haciendo un usestate de persist, en el que guardemos como inicial state un JSON.parse y buscaremos en el almacenamiento local si existe un item que se llame persist, de lo contrario será false

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist)) // crearemos una variable persist en el localstorage y será cambiada cuando el token sea distinto
    }, [persist])

    return [persist, setPersist] // retornamos las variables de estado
}
export default usePersist
