const canvas = document.getElementById("canvas")
const canvasContext = canvas.getContext("2d")

const pacmanFrames = document.getElementById("animations")
const ghostFrames = document.getElementById("ghosts")


const createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color
    canvasContext.fillRect(x, y, width, height)
}

let fps = 30
let pacman
let oneBlockSize = 20
let wallSpaceWidth = oneBlockSize / 1.5
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2
let wallColor = "#00B078" //342DCA 00B078 990092
let wallInnerColor = "#010203"
let backGroundColor = "#010203"
let foodColor = "#F20AA7" //#F20AA7 FEB897
let score = 0
let ghosts = []
let ghostCount = 4
let lives = 3
let foodCount = 0

const DIRECTION_RIGHT = 4
const DIRECTION_UP = 3
const DIRECTION_LEFT = 2
const DIRECTION_BOTTOM = 1

let ghostLocation = [
    { x: 0, y: 0 },
    { x: 176, y: 0 },
    { x: 0, y: 121 },
    { x: 176, y: 121 },
]


let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //L1
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], //L2
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1], //L3
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1], //L4
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], //L5
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1], //L6
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1], //L7
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1], //L8
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0], //L9
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1], //10
    [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2], //L11
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1], //L12
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0], //L13
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0], //L14
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1], //L15
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], //L16
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1], //L17
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1], //L18
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1], //L19
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1], //L20
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1], //L21
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], //L22
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //L23
]

for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
        if (map[i][j] == 2) foodCount++
    }
}

let randomTargetsForGhosts = [
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: (map.length - 2) * oneBlockSize },
]

let createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize / 5
    )
}

const gameLoop = () => {
    draw()
    update()
}

const update = () => {
    pacman.moveProcess()
    pacman.eat()
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].moveProcess()
    }

    if (pacman.checkGhostCollision()) {
        restartGame()
    }

    // if (score >= foodCount) {
    //     drawWin()
    //     clearInterval(gameInterval)
    // }

    if (score >= 20) {
        drawWin()
        clearInterval(gameInterval)
    }
}

const restartGame = () => {
    createNewPacman()
    createGhosts()
    lives--;
    if (!lives) {
        gameOver()
    }
}

const gameOver = () => {
    drawGameOver()
    clearInterval(gameInterval)
}

const drawGameOver = () => {
    canvasContext.font = "20px Emulogic"
    canvasContext.fillStyle = "white"
    canvasContext.fillText(
        "Game Over!",
        150,
        200
    )
}

const drawWin = () => {
    canvasContext.font = "60px Arial, Helvetica, sans-serif"
    canvasContext.fillStyle = "white"
    canvasContext.fillText(
        "You Win!",
        90,
        200
    )
}

const drawLives = () => {
    canvasContext.font = "20px Emulogic"
    canvasContext.fillStyle = "white"
    canvasContext.fillText(
        "Lives: " + lives,
        220,
        oneBlockSize * (map.length + 1) + 10
    )

    for (let i = 0; i < lives; i++) {
        canvasContext.drawImage(
            pacmanFrames,
            2 * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            350 + i * oneBlockSize,
            oneBlockSize * map.length + 10,
            oneBlockSize,
            oneBlockSize
        )

    }
}

const drawFoods = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] === 2) {
                createRect(
                    j * oneBlockSize + oneBlockSize / 3,
                    i * oneBlockSize + oneBlockSize / 3,
                    oneBlockSize / 3,
                    oneBlockSize / 3,
                    foodColor
                )
            }
        }

    }
}

const drawScore = () => {
    canvasContext.font = "20px Emulogic"
    canvasContext.fillStyle = "white"
    canvasContext.fillText(
        "Score: " + score,
        0,
        oneBlockSize * (map.length + 1) + 10
    )
}

const drawGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw()

    }
}

const draw = () => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    createRect(0, 0, canvas.width, canvas.height, backGroundColor)
    drawWalls()
    drawFoods()
    drawGhosts()
    pacman.draw()
    drawScore()
    drawLives()

}

let gameInterval = setInterval(gameLoop, 1000 / fps)

const drawWalls = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] === 1) { // then it is a wall
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    wallColor)

                if (j > 0 && map[i][j - 1] === 1) {
                    createRect(
                        j * oneBlockSize,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    )
                }

                if (j < map[0].length - 1 && map[i][j + 1] === 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    )
                }

                if (i > 0 && map[i - 1][j] === 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    )
                }

                if (i < map.length - 1 && map[i + 1][j] === 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    )
                }
            }

        }
    }
}


let createGhosts = () => {
    ghosts = []
    for (let i = 0; i < ghostCount * 2; i++) {
        let newGhost = new Ghost(
            9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            pacman.speed / 2,
            ghostLocation[i % 4].x,
            ghostLocation[i % 4].y,
            124,
            116,
            6 + i
        )
        ghosts.push(newGhost)

    }
}

createNewPacman()
createGhosts()
gameLoop()

window.addEventListener("keydown", event => {
    let k = event.keyCode

    setTimeout(() => {
        if (k == 37 || k == 65) { // left
            pacman.nextDirection = DIRECTION_LEFT
        } else if (k == 38 || k == 87) { // up
            pacman.nextDirection = DIRECTION_UP
        } else if (k == 39 || k == 68) { //right 
            pacman.nextDirection = DIRECTION_RIGHT
        } else if (k == 40 || k == 83) { //bottom
            pacman.nextDirection = DIRECTION_BOTTOM
        }
    }, 1);
})