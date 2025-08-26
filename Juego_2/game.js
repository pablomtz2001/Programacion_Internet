class MazeGame {
  constructor() {
    this.gameState = 'waiting'; // waiting, running, win, lose
    this.startTime = 0;
    this.elapsedTime = 0;
    this.timerInterval = null;
    this.currentLevel = 0;
    
    // Elementos del DOM
    this.maze = document.getElementById('maze');
    this.player = document.getElementById('player');
    this.startZone = document.getElementById('start');
    this.goalZone = document.getElementById('goal');
    this.timer = document.getElementById('timer');
    this.status = document.getElementById('status');
    this.winMessage = document.getElementById('winMessage');
    this.loseMessage = document.getElementById('loseMessage');
    this.winTime = document.getElementById('winTime');
    
    // Niveles del laberinto
    this.levels = this.createLevels();
    
    this.init();
  }
  
  init() {
    this.loadLevel(this.currentLevel);
    this.setupEventListeners();
    this.updateStatus('Posiciona el mouse en START y haz clic para comenzar');
  }
  
  createLevels() {
    return [
      // Nivel 1 - Básico
      {
        walls: [
          { top: 20, left: 20, width: 760, height: 20 },
          { top: 500, left: 20, width: 760, height: 20 },
          { top: 20, left: 20, width: 20, height: 500 },
          { top: 20, left: 760, width: 20, height: 500 },
          { top: 120, left: 120, width: 200, height: 15 },
          { top: 200, left: 300, width: 200, height: 15 },
          { top: 120, left: 300, width: 15, height: 200 },
          { top: 200, left: 120, width: 15, height: 200 },
          { top: 300, left: 120, width: 200, height: 15 },
          { top: 380, left: 300, width: 200, height: 15 },
          { top: 300, left: 300, width: 15, height: 200 },
          { top: 380, left: 120, width: 15, height: 200 }
        ]
      },
      // Nivel 2 - Intermedio
      {
        walls: [
          { top: 20, left: 20, width: 760, height: 20 },
          { top: 500, left: 20, width: 760, height: 20 },
          { top: 20, left: 20, width: 20, height: 500 },
          { top: 20, left: 760, width: 20, height: 500 },
          { top: 100, left: 100, width: 300, height: 15 },
          { top: 100, left: 500, width: 200, height: 15 },
          { top: 200, left: 100, width: 200, height: 15 },
          { top: 200, left: 400, width: 300, height: 15 },
          { top: 300, left: 100, width: 200, height: 15 },
          { top: 300, left: 400, width: 300, height: 15 },
          { top: 400, left: 100, width: 300, height: 15 },
          { top: 400, left: 500, width: 200, height: 15 },
          { top: 100, left: 100, width: 15, height: 300 },
          { top: 100, left: 400, width: 15, height: 300 },
          { top: 100, left: 600, width: 15, height: 300 },
          { top: 200, left: 200, width: 15, height: 200 },
          { top: 200, left: 500, width: 15, height: 200 }
        ]
      },
      // Nivel 3 - Avanzado
      {
        walls: [
          { top: 20, left: 20, width: 760, height: 20 },
          { top: 500, left: 20, width: 760, height: 20 },
          { top: 20, left: 20, width: 20, height: 500 },
          { top: 20, left: 760, width: 20, height: 500 },
          { top: 80, left: 80, width: 640, height: 15 },
          { top: 80, left: 80, width: 15, height: 360 },
          { top: 80, left: 705, width: 15, height: 360 },
          { top: 440, left: 80, width: 640, height: 15 },
          { top: 160, left: 160, width: 480, height: 15 },
          { top: 160, left: 160, width: 15, height: 240 },
          { top: 160, left: 625, width: 15, height: 240 },
          { top: 400, left: 160, width: 480, height: 15 },
          { top: 240, left: 240, width: 320, height: 15 },
          { top: 240, left: 240, width: 15, height: 120 },
          { top: 240, left: 545, width: 15, height: 120 },
          { top: 360, left: 240, width: 320, height: 15 }
        ]
      }
    ];
  }
  
  loadLevel(levelIndex) {
    this.currentLevel = levelIndex % this.levels.length;
    const level = this.levels[this.currentLevel];
    
    // Limpiar paredes existentes
    const existingWalls = this.maze.querySelectorAll('.wall:not(.wall-horizontal):not(.wall-vertical)');
    existingWalls.forEach(wall => wall.remove());
    
    // Crear nuevas paredes
    level.walls.forEach((wallData, index) => {
      const wall = document.createElement('div');
      wall.className = 'wall';
      wall.style.top = wallData.top + 'px';
      wall.style.left = wallData.left + 'px';
      wall.style.width = wallData.width + 'px';
      wall.style.height = wallData.height + 'px';
      this.maze.appendChild(wall);
    });
    
         // Posicionar jugador en el centro de START (sin colisionar)
     // START está en top: 480px, left: 50px, width: 120px, height: 40px
     // Centramos el jugador (16x16) en esa zona
     this.player.style.top = '502px'; // 480 + 40/2 - 16/2
     this.player.style.left = '102px'; // 50 + 120/2 - 16/2
    
    // Resetear estado del juego
    this.gameState = 'waiting';
    this.stopTimer();
    this.updateTimer('00:00.000');
    this.hideMessages();
    
    this.updateStatus(`Nivel ${this.currentLevel + 1}: Posiciona el mouse en START y haz clic para comenzar`);
  }
  
  setupEventListeners() {
    // Mouse move - el jugador sigue al cursor
    this.maze.addEventListener('mousemove', (e) => {
      if (this.gameState === 'running') {
        const rect = this.maze.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Mantener el jugador dentro del laberinto
        const playerSize = 16;
        const maxX = 800 - playerSize;
        const maxY = 540 - playerSize;
        
        this.player.style.left = Math.max(0, Math.min(x - playerSize/2, maxX)) + 'px';
        this.player.style.top = Math.max(0, Math.min(y - playerSize/2, maxY)) + 'px';
        
        // Verificar colisiones
        this.checkCollisions();
      }
    });
    
    // Click en START para comenzar
    this.startZone.addEventListener('click', () => {
      if (this.gameState === 'waiting') {
        this.startGame();
      }
    });
    
    // Click en GOAL para verificar victoria
    this.goalZone.addEventListener('click', () => {
      if (this.gameState === 'running') {
        this.checkWin();
      }
    });
  }
  
  startGame() {
    this.gameState = 'running';
    this.startTime = Date.now();
    this.startTimer();
    this.updateStatus('¡Juego en progreso! Llega a GOAL sin tocar las paredes');
  }
  
  startTimer() {
    this.timerInterval = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
      this.updateTimer(this.formatTime(this.elapsedTime));
    }, 10);
  }
  
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
  
     checkCollisions() {
     // Solo verificar colisiones si el juego está corriendo
     if (this.gameState !== 'running') return;
     
     const playerRect = this.player.getBoundingClientRect();
     const mazeRect = this.maze.getBoundingClientRect();
     
     // Convertir coordenadas del jugador a coordenadas relativas del laberinto
     const playerX = playerRect.left - mazeRect.left + 8; // +8 para centrar
     const playerY = playerRect.top - mazeRect.top + 8;
     
     // Verificar colisión con paredes
     const walls = this.maze.querySelectorAll('.wall');
     walls.forEach(wall => {
       const wallRect = wall.getBoundingClientRect();
       const wallX = wallRect.left - mazeRect.left;
       const wallY = wallRect.top - mazeRect.top;
       const wallWidth = wall.offsetWidth;
       const wallHeight = wall.offsetHeight;
       
       if (this.isColliding(
         playerX, playerY, 16, 16,
         wallX, wallY, wallWidth, wallHeight
       )) {
         this.gameOver();
         return;
       }
     });
   }
  
     isColliding(x1, y1, w1, h1, x2, y2, w2, h2) {
     // Agregar un pequeño margen de seguridad para evitar falsas colisiones
     const margin = 2;
     return x1 + margin < x2 + w2 - margin && 
            x1 + w1 - margin > x2 + margin && 
            y1 + margin < y2 + h2 - margin && 
            y1 + h1 - margin > y2 + margin;
   }
  
  checkWin() {
    const playerRect = this.player.getBoundingClientRect();
    const goalRect = this.goalZone.getBoundingClientRect();
    
    if (this.isColliding(
      playerRect.left, playerRect.top, 16, 16,
      goalRect.left, goalRect.top, goalRect.width, goalRect.height
    )) {
      this.win();
    }
  }
  
  gameOver() {
    this.gameState = 'lose';
    this.stopTimer();
    this.updateStatus('¡Colisión! Has tocado una pared');
    this.showMessage(this.loseMessage);
  }
  
  win() {
    this.gameState = 'win';
    this.stopTimer();
    const timeString = this.formatTime(this.elapsedTime);
    this.winTime.textContent = timeString;
    this.updateStatus(`¡Victoria! Tiempo: ${timeString}`);
    this.showMessage(this.winMessage);
  }
  
  restartGame() {
    this.loadLevel(this.currentLevel);
  }
  
  nextLevel() {
    this.loadLevel(this.currentLevel + 1);
  }
  
  showMessage(messageElement) {
    messageElement.style.display = 'block';
  }
  
  hideMessages() {
    this.winMessage.style.display = 'none';
    this.loseMessage.style.display = 'none';
  }
  
  updateStatus(text) {
    this.status.textContent = text;
  }
  
  updateTimer(timeString) {
    this.timer.textContent = timeString;
  }
  
  formatTime(ms) {
    const totalMs = Math.max(0, Math.floor(ms));
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const millis = totalMs % 1000;
    
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    const mmm = String(millis).padStart(3, '0');
    
    return `${mm}:${ss}.${mmm}`;
  }
}

// Funciones globales para los botones
function restartGame() {
  game.restartGame();
}

function nextLevel() {
  game.nextLevel();
}

// Inicializar el juego cuando se carga la página
let game;
window.addEventListener('load', () => {
  game = new MazeGame();
});


