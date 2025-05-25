import React, { useState } from 'react'
import './AdminPage.scss'
import Header from '../../Header'
import UserService from '../../../api/UserService'
import BattleService from '../../../api/BattleService'
import ChallengeService from '../../../api/ChallengeService'
import env from '../../../env'

function AdminPage({ themeColors, updateTheme }) {
  const [selectedSection, setSelectedSection] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)

  const [response, setResponse] = useState(null);

  const handleGetAllUsersSubmit = async (e) => {
    e.preventDefault();
    const allUsers = await UserService.getAllUsers();

    if (allUsers.length === 0) {
      setResponse(<p>No hay usuarios cargados.</p>);
    } else {
      setResponse(
        <ul>
          {allUsers.map(user => (
            <li key={user.id}>
              <strong>{user.username}</strong><br />
              ID: {user.id}<br />
              Email: {user.email}<br />
              Liga: {user.league}<br />
              Puntos: {user.points}<br />
              Rol: {user.role}<br />
              Activado: {user.enabled ? 'Sí' : 'No'}
            </li>
          ))}
        </ul>
      );
    }
  }

  const handleGetUserByIdSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get('id');

    try {
      const userData = await UserService.getUserById(id);
      if (!userData) {
        setResponse(<p>No se encontró usuario con ID {id}.</p>);
      } else {
        setResponse(
          <ul>
            <li key={userData.id}>
              <strong>{userData.username}</strong><br />
              ID: {userData.id}<br />
              Email: {userData.email}<br />
              Liga: {userData.league}<br />
              Puntos: {userData.points}<br />
              Rol: {userData.role}<br />
              Activado: {userData.enabled ? 'Sí' : 'No'}
            </li>
          </ul>
        );
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      setResponse(<p>Error al obtener usuario con ID {id}.</p>);
    }
  };

  const handleUpdateUserByIdSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get('id');
    const newUsername = formData.get('username');

    if (!id || !newUsername) {
      setResponse(<p>Por favor, completa todos los campos.</p>);
      return;
    }

    try {
      const updatedUser = await UserService.updateUserById(id, { username: newUsername });
      setResponse(
        <ul>
          <li key={updatedUser.id}>
            <strong>{updatedUser.username}</strong><br />
            ID: {updatedUser.id}<br />
            Email: {updatedUser.email}<br />
            Liga: {updatedUser.league}<br />
            Puntos: {updatedUser.points}<br />
            Rol: {updatedUser.role}<br />
            Activado: {updatedUser.enabled ? 'Sí' : 'No'}
          </li>
        </ul>
      );
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      setResponse(<p>Error al actualizar usuario con ID {id}.</p>);
    }
  };

  const handleDeleteUserByIdSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get('id');

    if (!id) {
      setResponse(<p>Por favor, ingresa el ID del usuario.</p>);
      return;
    }

    try {
      await UserService.deleteUserById(id);
      setResponse(<p>Usuario con ID {id} eliminado correctamente.</p>);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      setResponse(<p>Error al eliminar usuario con ID {id}.</p>);
    }
  };

  const handleBanUserById = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get('id');

    if (!id) {
      setResponse(<p>Por favor, ingresa el ID del usuario.</p>);
      return;
    }

    try {
      const bannedUser = await UserService.banUserById(id);
      setResponse(
        <ul>
          <li key={bannedUser.id}>
            <strong>{bannedUser.username}</strong><br />
            ID: {bannedUser.id}<br />
            Email: {bannedUser.email}<br />
            Liga: {bannedUser.league}<br />
            Puntos: {bannedUser.points}<br />
            Rol: {bannedUser.role}<br />
            Activado: {bannedUser.enabled ? 'Sí' : 'No'}
          </li>
        </ul>
      );
    } catch (error) {
      console.error("Error al desactivar usuario:", error);
      setResponse(<p>Error al desactivar usuario con ID {id}.</p>);
    }
  };

  const handleUnbanUserById = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get('id');

    if (!id) {
      setResponse(<p>Por favor, ingresa el ID del usuario.</p>);
      return;
    }

    try {
      const unbannedUser = await UserService.unbanUserById(id);
      setResponse(
        <ul>
          <li key={unbannedUser.id}>
            <strong>{unbannedUser.username}</strong><br />
            ID: {unbannedUser.id}<br />
            Email: {unbannedUser.email}<br />
            Liga: {unbannedUser.league}<br />
            Puntos: {unbannedUser.points}<br />
            Rol: {unbannedUser.role}<br />
            Activado: {unbannedUser.enabled ? 'Sí' : 'No'}
          </li>
        </ul>
      );
    } catch (error) {
      console.error("Error al activar usuario:", error);
      setResponse(<p>Error al activar usuario con ID {id}.</p>);
    }
  };

  const handleGetAllBattlesSubmit = async (e) => {
    e.preventDefault();
    try {
      const battles = await BattleService.getAllBattles();
      if (battles.length === 0) {
        setResponse(<p>No hay batallas registradas.</p>);
      } else {
        setResponse(
          <ul>
            {battles.map((battle) => (
              <li key={battle.id}>
                <strong>ID Batalla:</strong> {battle.id}
                <ul>
                  <li>
                    <strong>Jugador 1:</strong><br />
                    ID: {battle.player1Id}<br />
                    Nombre de usuario: {battle.player1Username}<br />
                    Puntos: {battle.points1}<br />
                    Solución: {battle.solution1}
                  </li>
                  <li>
                    <strong>Jugador 2:</strong><br />
                    ID: {battle.player2Id}<br />
                    Nombre de usuario: {battle.player2Username}<br />
                    Puntos: {battle.points2}<br />
                    Solución: {battle.solution2}
                  </li>
                  <li>
                    <strong>Ganador ID:</strong> {battle.winnerId}
                  </li>
                  <li>
                    <strong>Reto:</strong><br />
                    ID: {battle.challengeId}<br />
                    Nombre: {battle.challengeName}
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        );
      }
    } catch (error) {
      console.error("Error al obtener batallas:", error);
      setResponse(<p>Error al obtener las batallas.</p>);
    }
  };

  const handleGetBattleByIdSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get("id");

    if (!id) {
      setResponse(<p>Por favor, ingresa el ID de la batalla.</p>);
      return;
    }

    try {
      const battle = await BattleService.getBattleById(id);
      if (!battle) {
        setResponse(<p>No se encontró una batalla con ID {id}.</p>);
      } else {
        setResponse(
          <ul>
            <li key={battle.id}>
              <strong>ID Batalla:</strong> {battle.id}<br />
              Jugador 1: {battle.player1Username} (ID: {battle.player1Id}) - Puntos: {battle.points1}<br />
              Jugador 2: {battle.player2Username} (ID: {battle.player2Id}) - Puntos: {battle.points2}<br />
              Ganador ID: {battle.winnerId}<br />
              Reto: {battle.challengeName} (ID: {battle.challengeId})<br />
              Solución 1: {battle.solution1}<br />
              Solución 2: {battle.solution2}
            </li>
          </ul>
        );
      }
    } catch (error) {
      console.error("Error al obtener batalla:", error);
      setResponse(<p>Error al obtener la batalla con ID {id}.</p>);
    }
  };

  const handleGetBattlesByUserIdSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userId = formData.get("id");

    if (!userId) {
      setResponse(<p>Por favor, ingresa el ID del usuario.</p>);
      return;
    }

    try {
      const battles = await BattleService.getBattlesByUserId(userId);
      if (battles.length === 0) {
        setResponse(<p>No se encontraron batallas para el usuario con ID {userId}.</p>);
      } else {
        setResponse(
          <ul>
            {battles.map(battle => (
              <li key={battle.id}>
                <strong>ID Batalla:</strong> {battle.id}<br />
                Jugador 1: {battle.player1Username} (ID: {battle.player1Id}) - Puntos: {battle.points1}<br />
                Jugador 2: {battle.player2Username} (ID: {battle.player2Id}) - Puntos: {battle.points2}<br />
                Ganador ID: {battle.winnerId}<br />
                Reto: {battle.challengeName} (ID: {battle.challengeId})<br />
                Solución 1: {battle.solution1}<br />
                Solución 2: {battle.solution2}
              </li>
            ))}
          </ul>
        );
      }
    } catch (error) {
      console.error("Error al obtener batallas del usuario:", error);
      setResponse(<p>Error al obtener batallas del usuario con ID {userId}.</p>);
    }
  };

  const handleGetAllChallengesSubmit = async (e) => {
    e.preventDefault();
    try {
      const challenges = await ChallengeService.getAllChallenges();
      if (challenges.length === 0) {
        setResponse(<p>No hay retos registrados.</p>);
      } else {
        setResponse(
          <ul>
            {challenges.map((challenge) => (
              <li key={challenge.id}>
                <strong>ID Reto:</strong> {challenge.id}<br />
                Nombre: {challenge.name}<br />
                Duración: {challenge.duration} segundos<br />
                Solución: {challenge.solution}<br />
                Imagen: <br /><img src={`${env.BACKEND_URL}/api/challenges/image/${challenge.id}`} alt={`Imagen reto ${challenge.id}`} />
              </li>
            ))}
          </ul>
        );
      }
    } catch (error) {
      console.error("Error al obtener retos:", error);
      setResponse(<p>Error al obtener los retos.</p>);
    }
  };

  const handleGetChallengeByIdSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get("id");

    if (!id) {
      setResponse(<p>Por favor, ingresa el ID del reto.</p>);
      return;
    }

    try {
      const challenge = await ChallengeService.getChallengeById(id);
      if (!challenge) {
        setResponse(<p>No se encontró un reto con ID {id}.</p>);
      } else {
        setResponse(
          <ul>
            <li key={challenge.id}>
              <strong>ID Reto:</strong> {challenge.id}<br />
              Nombre: {challenge.name}<br />
              Duración: {challenge.duration} segundos<br />
              Solución: {challenge.solution}<br />
              Imagen: <br /><img src={`${env.BACKEND_URL}/api/challenges/image/${challenge.id}`} alt={`Imagen reto ${challenge.id}`} />
            </li>
          </ul>
        );
      }
    } catch (error) {
      console.error("Error al obtener reto:", error);
      setResponse(<p>Error al obtener el reto con ID {id}.</p>);
    }
  };

  const handleCreateChallengeSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const name = formData.get("name");
    const duration = formData.get("duration");
    const solution = formData.get("solution");

    if (!name || !duration || !solution) {
      setResponse(<p>Por favor, completa todos los campos.</p>);
      return;
    }

    try {
      // Llamamos al servicio pasándole directamente el FormData con la imagen
      const newChallenge = await ChallengeService.createChallenge(formData);

      if (newChallenge) {
        setResponse(<p>Reto creado correctamente con ID {newChallenge.id}.</p>);
      } else {
        setResponse(<p>Error al crear el reto.</p>);
      }
    } catch (error) {
      console.error("Error al crear reto:", error);
      setResponse(<p>Error al crear el reto.</p>);
    }
  };

  const handleUpdateChallengeSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const id = formData.get("id");
    const name = formData.get("name");
    const duration = formData.get("duration");
    const solution = formData.get("solution");

    if (!id || !name || !duration || !solution) {
      setResponse(<p>Por favor, completa todos los campos.</p>);
      return;
    }

    try {
      // Llamamos al servicio pasándole directamente el FormData con la imagen
      const updatedChallenge = await ChallengeService.updateChallenge(id, formData);

      if (updatedChallenge) {
        setResponse(<p>Reto actualizado correctamente (ID {id}).</p>);
      } else {
        setResponse(<p>Error al actualizar el reto.</p>);
      }
    } catch (error) {
      console.error("Error al actualizar reto:", error);
      setResponse(<p>Error al actualizar el reto con ID {id}.</p>);
    }
  };

  const handleDeleteChallengeSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get("id");

    if (!id) {
      setResponse(<p>Por favor, ingresa el ID del reto.</p>);
      return;
    }

    try {
      await ChallengeService.deleteChallenge(id);
      setResponse(<p>Reto eliminado correctamente (ID {id}).</p>);
    } catch (error) {
      console.error("Error al eliminar reto:", error);
      setResponse(<p>Error al eliminar el reto con ID {id}.</p>);
    }
  };

  const renderSectionOptions = () => {
    if (!selectedSection) return <p>Selecciona una opción para ver acciones disponibles.</p>

    const optionsMap = {
      usuarios: [
        'Obtener todos los usuarios',
        'Obtener usuario por id',
        'Editar Usuario',
        'Eliminar Usuario',
        'Desactivar cuenta',
        'Activar cuenta'
      ],
      batallas: [
        'Obtener todas las batallas',
        'Obtener batalla por id',
        'Obtener batallas por id de usuario'
      ],
      retos: [
        'Obtener todos los retos',
        'Obtener reto por id',
        'Crear reto',
        'Editar reto',
        'Eliminar reto'
      ]
    }

    return (
      <div className="section-options">
        {optionsMap[selectedSection].map(option => (
          <div
            key={option}
            className={`button ${selectedOption === option ? 'active' : ''}`}
            onClick={() => setSelectedOption(option)}
          >
            <p>{option}</p>
          </div>
        ))}
      </div>
    )
  }

  const renderRightPanelContent = () => {
    switch (selectedOption) {
      /// Usuarios
      case 'Obtener todos los usuarios':
        return (
          <form onSubmit={handleGetAllUsersSubmit}>
            <p className="title">Todos los usuarios</p>
            <button type="submit"> Obtener</button>
          </form>
        )
      case 'Obtener usuario por id':
        return (
          <form onSubmit={handleGetUserByIdSubmit}>
            <p className="title">Obtener usuario por id</p>
            <label>ID Usuario:</label>
            <input type="number" name='id' placeholder="ID del usuario" />
            <button type="submit">Obtener</button>
          </form>
        )
      case 'Editar Usuario':
        return (
          <form onSubmit={handleUpdateUserByIdSubmit}>
            <p className="title">Editar Usuario</p>
            <label>ID de usuario:</label>
            <input type="text" name='id' placeholder="ID del usuario" />
            <label>Nuevo nombre de usuario:</label>
            <input type="text" name='username' placeholder="Nuevo nombre" />
            <button type="submit">Editar</button>
          </form>
        )
      case 'Eliminar Usuario':
        return (
          <form onSubmit={handleDeleteUserByIdSubmit}>
            <p className="title">Eliminar usuario</p>
            <label>ID de usuario:</label>
            <input type="number" name='id' placeholder="ID del usuario" />
            <button type="submit">Eliminar</button>
          </form>
        )
      case 'Desactivar cuenta':
        return (
          <form onSubmit={handleBanUserById}>
            <p className="title">Desactivar usuario</p>
            <label>ID de usuario:</label>
            <input type="number" name='id' placeholder="ID del usuario" />
            <button type="submit">Desactivar</button>
          </form>
        )
      case 'Activar cuenta':
        return (
          <form onSubmit={handleUnbanUserById}>
            <p className="title">Activar Usuario</p>
            <label>ID usuario:</label>
            <input type="number" name='id' placeholder="ID del usuario" />
            <button type="submit">Activar</button>
          </form>
        )
      /// Batallas
      case 'Obtener todas las batallas':
        return (
          <form onSubmit={handleGetAllBattlesSubmit}>
            <p className="title">Obtener todas las batallas</p>
            <button type="submit">Obtener</button>
          </form>
        )
      case 'Obtener batalla por id':
        return (
          <form onSubmit={handleGetBattleByIdSubmit}>
            <p className="title">Obtener batalla por id</p>
            <label>ID de batalla:</label>
            <input type="number" name='id' placeholder="ID de batalla" />
            <button type="submit">Obtener</button>
          </form>
        )
      case 'Obtener batallas por id de usuario':
        return (
          <form onSubmit={handleGetBattlesByUserIdSubmit}>
            <p className="title">Obtener batallas por id de usuario</p>
            <label>ID de usuario:</label>
            <input type="number" name='id' placeholder="ID de usuario" />
            <button type="submit">Obtener</button>
          </form>
        )
      /// Retos
      case 'Obtener todos los retos':
        return (
          <form onSubmit={handleGetAllChallengesSubmit}>
            <p className="title">Obtener todos los retos</p>
            <button type="submit">Obtener</button>
          </form>
        )
      case 'Obtener reto por id':
        return (
          <form onSubmit={handleGetChallengeByIdSubmit}>
            <p className="title">Obtener reto por id</p>
            <label>ID de reto:</label>
            <input type="text" name='id' placeholder="ID de reto" />
            <button type="submit">Obtener</button>
          </form>
        )
      case 'Crear reto':
        return (
          <form onSubmit={handleCreateChallengeSubmit} encType="multipart/form-data">
            <p className="title">Crear reto</p>
            <label>Nombre de reto:</label>
            <input type="text" name='name' placeholder="Nombre del reto" />

            <label>Duración del reto (en segundos):</label>
            <input type="number" name='duration' placeholder="Duración en segundos" />

            <label>Solución del reto:</label>
            <input type="text" name='solution' defaultValue={"<body></body>"} placeholder="Solución del reto" />

            <label>Imagen del reto:</label>
            <input
              type="file"
              name="imageFile"
              accept="image/*"
            />

            <button type="submit">Crear</button>
          </form>
        )

      case 'Editar reto':
        return (
          <form onSubmit={handleUpdateChallengeSubmit} encType="multipart/form-data">
            <p className="title">Editar reto</p>
            <label>ID del reto:</label>
            <input type="number" name='id' placeholder="ID del reto" />

            <label>Nombre de reto:</label>
            <input type="text" name='name' placeholder="Nombre del reto" />

            <label>Duración del reto (en segundos):</label>
            <input type="number" name='duration' placeholder="Duración en segundos" />

            <label>Solución del reto:</label>
            <input type="text" name='solution' defaultValue={"<body></body>"} placeholder="Solución del reto" />

            <label>Imagen del reto:</label>
            <input
              type="file"
              name="imageFile"
              accept="image/*"
            />
            <button type="submit">Editar</button>
          </form>
        )

      case 'Eliminar reto':
        return (
          <form onSubmit={handleDeleteChallengeSubmit}>
            <p className="title">Eliminar reto</p>
            <label>ID del reto:</label>
            <input type="number" name='id' placeholder="ID del reto" />
            <button type="submit">Eliminar</button>
          </form>
        )

      default:
        return <p>Selecciona una acción para ver detalles aquí.</p>
    }
  }

  return (
    <div className='admin-page'>
      <Header themeColors={themeColors} updateTheme={updateTheme} dynamicButtonScene="play" />

      <div className='admin-content'>
        <p className='title'>Panel de administración</p>

        <div className='panels-container'>
          <div className='panel left-panel'>
            <div
              className={`button option user ${selectedSection === 'usuarios' ? 'active' : ''}`}
              onClick={() => {
                setSelectedSection('usuarios')
                setSelectedOption(null)
              }}
            >
              <p>Usuarios</p>
            </div>

            <div
              className={`button option user ${selectedSection === 'batallas' ? 'active' : ''}`}
              onClick={() => {
                setSelectedSection('batallas')
                setSelectedOption(null)
              }}
            >
              <p>Batallas</p>
            </div>

            <div
              className={`button option user ${selectedSection === 'retos' ? 'active' : ''}`}
              onClick={() => {
                setSelectedSection('retos')
                setSelectedOption(null)
              }}
            >
              <p>Retos</p>
            </div>

          </div>

          <div className='panel center-panel'>{renderSectionOptions()}</div>

          <div className='panel right-panel'>
            <div className='content'>
              {renderRightPanelContent()}
            </div>
            <div className='response'>
              {response ? response : (<p>Aquí verás la respuesta de la operación</p>)}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AdminPage