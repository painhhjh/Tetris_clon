import './style.css'

const campo = document.querySelector('campo') //selecciona el campo
const contexto = campo.getContext('2d') //contexto de dibujo
const escala = 20 // pixeles por cuadro
const ancho = 10 
const alto = 24

campo.ancho = ancho * escala //ancho de pixeles
campo.alto = alto * escala //alto de pixeles
contexto.scale(escala, escala) // escala de pixeles

// tablero de juego
const tablero = Array.from({length: alto}, (_, y) => 
    Array.from({length: ancho}, (_, x) => (y >= alto - 2 && x < ancho - 2) ? 1 : 0)
)

// bucle principal
function actualiza(){
    contexto.fillStyle = '#000'
    contexto.fillRect(0, 0, campo.ancho, campo.alto)
    tablero.forEach((fila, y) => {
        fila.forEach((valor, x) => {
            if(valor){
                contexto.fillStyle = 'blue'
                contexto.fillRect(x, y, 1, 1)
            }
        })
    })
    requestAnimationFrame(actualiza)
}

actualiza()
