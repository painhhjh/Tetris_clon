const apiUrl = "https://tetris-backend.azurewebsites.net/leaderboard/api/usuarios/"


document.addEventListener("DOMContentLoaded", () => {
    const leaderboardBody = document.getElementById("leaderboard-body")

    // Cargar usuarios
    const loadUsers = async () => {
        try {
            const response = await fetch(apiUrl)
            if (!response.ok) {
                throw new Error("Error al obtener los datos de la API")
            }
            const users = await response.json()

            const topUsers = users.slice(0,5)

            renderLeaderboard(topUsers)

        } catch (error) {
            console.error("Error:", error)
        }
    }

    //Renderizar tabla
    const renderLeaderboard = (users) => {
       leaderboardBody.innerHTML = ""
       users.forEach((user,index) => {
        const row = document.createElement("tr")
        row.innerHTML = `
        <td>${index + 1}</td>  <!-- Ranking -->
        <td>${user.nombre}</td> <!-- Nombre -->
        <td>${user.max_score}</td> <!-- Puntaje Máximo -->
      `
      leaderboardBody.appendChild(row)
       })
    }

    loadUsers()
})

// Enviar usuario
export async function enviarPuntaje(user, score) {
    try {
        // Verificar si el usuario ya existe
        const response = await fetch(apiUrl)
        if (!response.ok) {
            throw new Error('Error al consultar la API')
        }
        const users = await response.json()

        const existingUser = users.find(u => u.nombre === user)

        if (existingUser) {
            // Actualizar el puntaje si el nuevo es mayor
            if (score > existingUser.max_score) {
                const updateResponse = await fetch(`${apiUrl}${existingUser.id}/`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ max_score: score }),
                })

                if (!updateResponse.ok) {
                    throw new Error('Error al actualizar el puntaje')
                }

                console.log('Puntaje actualizado exitosamente')
            } else {
                console.log('El puntaje actual no supera el máximo registrado')
            }
        } else {
            // Crear un nuevo usuario
            const createResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre: user, max_score: score }),
            })

            if (!createResponse.ok) {
                throw new Error('Error al crear el usuario')
            }

            console.log('Usuario creado exitosamente con puntaje')
        }
    } catch (error) {
        console.error('Error al enviar el puntaje:', error)
    }
}