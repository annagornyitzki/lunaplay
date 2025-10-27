import { useState } from 'react'
import './App.css'

// Import screenshots (you'll need to add these files)
import tictactoeImg from './assets/screenshots/tictactoe-gameplay.png'
import snakeImg from './assets/screenshots/snake-gameplay.png'
import connect4Img from './assets/screenshots/connect4-gameplay.png'

function App() {
  const [selectedGame, setSelectedGame] = useState(null)

  const games = [
    {
      id: 'tictactoe',
      title: 'Tic Tac Toe',
      description: 'Classic 3x3 grid game with AI opponent',
      url: '/games/tictactoe/index.html',
      image: tictactoeImg,
      placeholder: '🎯'
    },
    {
      id: 'snake',
      title: 'Snake',
      description: 'Eat food and grow while avoiding walls and yourself',
      url: '/games/snake/index.html',
      image: snakeImg,
      placeholder: '🐍'
    },
    {
      id: 'connect4',
      title: 'Connect 4',
      description: 'Drop pieces to connect four in a row',
      url: '/games/connect4/index.html',
      image: connect4Img,
      placeholder: '🔴'
    }
  ]

  if (selectedGame) {
    return (
      <div className="game-container">
        <div className="game-header">
          <button 
            className="back-button"
            onClick={() => setSelectedGame(null)}
          >
            ← Back to Games
          </button>
          <h2>{selectedGame.title}</h2>
        </div>
        <iframe
          src={selectedGame.url}
          className="game-frame"
          title={selectedGame.title}
        />
      </div>
    )
  }

  return (
    <div className="games-portal">
      <header className="portal-header">
        <h1>LunaPlay</h1>
        <p>Choose your game!</p>
      </header>
      
      <div className="games-grid">
        {games.map(game => (
          <div key={game.id} className="game-card">
            <div className="game-image">
              {game.image ? (
                <img src={game.image} alt={`${game.title} gameplay`} />
              ) : (
                <div className="game-placeholder">
                  <span className="game-emoji">{game.placeholder}</span>
                </div>
              )}
            </div>
            <div className="game-info">
              <h3>{game.title}</h3>
              <p>{game.description}</p>
              <button 
                className="play-button"
                onClick={() => setSelectedGame(game)}
              >
                Play Game
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
