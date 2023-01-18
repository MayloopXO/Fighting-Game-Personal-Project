window.onload = function() {
  swatch()
  console.log('gameloop')
}

starter = false

clearTimeout(timerId)
clearTimeout(counterId)

let gameloop = new GameLoop();

gameloop.render = function() {       
    gameloop.ctx.fillRect(0,0, gameloop.cnv.width, gameloop.cnv.height);
}

window.onresize = function() {
    gameloop.onresize();
}

function startGame() {
    starter = true
    gameloop.start();
    decreaseCounter()
    setTimeout(() => {
      decreaseTimer()
    }, 4000); 
}


const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1016
canvas.height = 571

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

isJumping1 = false
isJumping2 = false

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.jpeg'
})

const player = new Fighter({
  position: {
    x: 200,
    y: 309
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './img/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: './img/samuraiMack/Death.png',
      framesMax: 6
    },
    block: {
      imageSrc: './img/samuraiMack/block.png',
      framesMax: 4
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 170,
    height: 50
  }
})

const enemy = new Fighter({
  position: {
    x: 742,
    y: 309
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: './img/kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167
  },
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './img/kenji/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      framesMax: 7
    },
    block: {
      imageSrc: './img/kenji/blockenemy.png',
      framesMax: 4
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50
  }
})

console.log(player)

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  l: {
    pressed: false
  },
  j: {
    pressed: false
  }
}

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  // player movement

  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  // jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
   // isjumping1 = true
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  // Enemy movement
  if (keys.j.pressed && enemy.lastKey === 'j') {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  } else if (keys.l.pressed && enemy.lastKey === 'l') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  // jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
   // isjumping2 = true
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  // detect for collision & enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 2
  ) {
    enemy.takeHit()
    player.isAttacking = false

    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  }

  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isBlocking &&
    player.framesCurrent === 1
  ) {
    enemy.isAttacking = false
    player.isBlocking = false
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  if (player.isBlocking && player.framesCurrent === 4) {
    player.isBlocking = false
  }

  // this is where our player gets hit
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit()
    enemy.isAttacking = false

    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isBlocking &&
    enemy.framesCurrent === 1
  ) {
    player.isAttacking = false
    enemy.isBlocking = false
    }

  // if player misses
  if (enemy.isAttacking && enemy.framesCurrent === 4) {
    enemy.isAttacking = false
  }

  if (enemy.isBlocking && enemy.framesCurrent === 4) {
    enemy.isBlocking = false
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        if (isJumping1) return
        isJumping1 = true
        player.velocity.y -= 15 
        setTimeout(() => {
            isJumping1 = false
          }, 800);
          break
      case 's':
        player.attack()
        break
      case 'q':
          player.block()
          break
    }
  }

    if (!enemy.dead) {
      switch (event.key) {
        case 'l':
          keys.l.pressed = true
          enemy.lastKey = 'l'
          break
        case 'j':
          keys.j.pressed = true
          enemy.lastKey = 'j'
          break
        case 'i':
          if (isJumping2) return
          isJumping2 = true
          enemy.velocity.y -= 15 
          setTimeout(() => {
              isJumping2 = false
            }, 800);
            break
        case 'k':
          enemy.attack()
          break
        case 'u':
          enemy.block()
          break
      }
    }
}),

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  // enemy keys
  switch (event.key) {
    case 'l':
      keys.l.pressed = false
      break
    case 'j':
      keys.j.pressed = false
      break
  }
})
