const campo = document.querySelector('canvas'); // Selecciona el elemento canvas
const contexto = campo.getContext('2d'); // Contexto de dibujo
const escala = 20; // Píxeles por cuadrado
const ancho = 10;
const alto = 24;

const $section = document.querySelector('section');
const audio = new window.Audio('./tetris.mp3');


campo.width = ancho * escala; // Ancho en píxeles
campo.height = alto * escala; // Alto en píxeles
contexto.scale(escala, escala); // Escala de píxeles

// Tablero del juego
const tablero = Array.from({ length: alto }, (_, y) =>
    Array.from({ length: ancho }, (_, x) => (y >= alto - 2 && x < ancho - 2) ? 1 : 0)
);

// Piezas
const piezas = [
    [[1, 1], [1, 1]], // O
    [[1, 1, 1, 1]], // I
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 1, 0], [0, 1, 1]], // Z
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 0], [1, 0], [1, 1]], // L
    [[0, 1], [0, 1], [1, 1]] // J
];

// Inicia una nueva pieza con una forma aleatoria y posición inicial
let pieza = {
    forma: piezas[Math.floor(Math.random() * piezas.length)],
    posicion: { x: Math.floor(ancho / 2 - 2), y: 0 }
};

let puntaje = 0;
let contadorCaida = 0;
let ultimoTiempo = 0;
let juegoIniciado = false; // Flag para controlar el inicio del juego

// Verifica si la pieza colisiona con el tablero o con otras piezas
function colisiona() {
    return pieza.forma.some((fila, y) =>
        fila.some((valor, x) =>
            valor === 1 && (tablero[y + pieza.posicion.y]?.[x + pieza.posicion.x] !== 0)
        )
    );
}

// Solidifica la pieza actual en el tablero y reinicia la pieza
function solidificarPieza() {
    pieza.forma.forEach((fila, y) => {
        fila.forEach((valor, x) => {
            if (valor === 1) {
                tablero[y + pieza.posicion.y][x + pieza.posicion.x] = 1;
            }
        });
    });
    reiniciarPieza();
}

// Reinicia la pieza con una nueva forma aleatoria y posición inicial
function reiniciarPieza() {
    pieza = {
        forma: piezas[Math.floor(Math.random() * piezas.length)],
        posicion: { x: Math.floor(ancho / 2 - 2), y: 0 }
    };
    
    // Si la nueva pieza colisiona al aparecer, el juego termina
    if (colisiona()) {
        alert('¡Juego terminado! Lo siento!');
        tablero.forEach(fila => fila.fill(0));
        puntaje = 0;
        document.getElementById('puntaje').innerText = puntaje; // Resetear puntaje visualmente
    }
}

// Elimina las filas completas del tablero y actualiza el puntaje
function eliminarFilas() {
    const filasAEliminar = [];
    tablero.forEach((fila, y) => {
        if (fila.every(valor => valor === 1)) {
            filasAEliminar.push(y);
        }
    });
    
    filasAEliminar.forEach(y => {
        tablero.splice(y, 1);
        tablero.unshift(Array(ancho).fill(0));
        puntaje += 10;
    });
}

// Dibuja el tablero y la pieza actual en el canvas
function dibujar() {
    contexto.fillStyle = '#000';
    contexto.fillRect(0, 0, campo.width, campo.height);

    tablero.forEach((fila) => {
        fila.forEach((valor, x) => {
            if (valor === 1) {
                contexto.fillStyle = 'yellow';
                contexto.fillRect(x, fila.indexOf(valor), 1, 1);
            }
        });
    });

    pieza.forma.forEach((fila, y) => {
        fila.forEach((valor, x) => {
            if (valor) {
                contexto.fillStyle = 'red';
                contexto.fillRect(x + pieza.posicion.x, y + pieza.posicion.y, 1, 1);
            }
        });
    });

    document.getElementById('puntaje').innerText = puntaje;
}

// Actualiza el estado del juego en cada frame
function actualizar(tiempo = 0) {
    const deltaTiempo = tiempo - ultimoTiempo;
    ultimoTiempo = tiempo;

    contadorCaida += deltaTiempo;

    // Mueve la pieza hacia abajo cada segundo
    if (contadorCaida > 1000) {
        pieza.posicion.y++;
        contadorCaida = 0;

        // Si la pieza colisiona, la solidifica y elimina filas completas
        if (colisiona()) {
            pieza.posicion.y--;
            solidificarPieza();
            eliminarFilas();
        }
    }

    dibujar();
    requestAnimationFrame(actualizar);
}

// Maneja los eventos de teclado para mover y rotar la pieza
document.addEventListener('keydown', evento => {
    if (!juegoIniciado) return; // Evita manejar eventos antes de iniciar el juego

    if (evento.key === 'ArrowLeft') {
        pieza.posicion.x--;
        if (colisiona()) {
            pieza.posicion.x++;
        }
    }

    if (evento.key === 'ArrowRight') {
        pieza.posicion.x++;
        if (colisiona()) {
            pieza.posicion.x--;
        }
    }

    if (evento.key === 'ArrowDown') {
        pieza.posicion.y++;
        if (colisiona()) {
            pieza.posicion.y--;
            solidificarPieza();
            eliminarFilas();
        }
    }

    if (evento.key === 'ArrowUp') {
        // Rota la pieza 90 grados en sentido horario
        const rotada = pieza.forma[0].map((_, i) => pieza.forma.map(row => row[i]).reverse());
        const formaAnterior = pieza.forma;
        pieza.forma = rotada;
        
        if (colisiona()) {
            pieza.forma = formaAnterior;
        }
    }
});

// Inicia el juego al hacer clic en la sección
$section.addEventListener('click', () => {
    if (!juegoIniciado) { // Inicia solo si no ha comenzado
        actualizar();
        $section.remove();
        audio.volume = 0.01;
        audio.play();
        juegoIniciado = true; // Marca que el juego ha comenzado
    }
});