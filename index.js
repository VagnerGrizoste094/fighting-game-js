const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
let timer = 60;
let timerId;

const height = 564;
const width = 1024;

canvas.height = height;
canvas.width = width;

const gravity = 0.7;

c.fillRect(0, 0, width, height);

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './sprites/backgrounds/_PNG/4/background.png',
    scale: 0.535
})

const player1 = new Fighter({
    position: {
        x: 150,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    lifeBarElement: "#player1-health",
    imageSrc: './sprites/warriors/samuraiMack/Idle.png',
    framesMax: 8,
    framesHold: 5,
    scale: 2.5,
    offset: {
        x: 215,
        y: 150
    },
    sprites: {
        idle: {
            imageSrc: './sprites/warriors/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './sprites/warriors/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './sprites/warriors/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './sprites/warriors/samuraiMack/Fall.png',
            framesMax: 2
        },
        death: {
            imageSrc: './sprites/warriors/samuraiMack/Death.png',
            framesMax: 6
        },
        attack: {
            imageSrc: './sprites/warriors/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './sprites/warriors/samuraiMack/TakeHit.png',
            framesMax: 4
        },
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
});

const player2 = new Fighter({
    position: {
        x: width - 220,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    lifeBarElement: "#player2-health",
    imageSrc: './sprites/warriors/kenji/Idle.png',
    framesMax: 8,
    framesHold: 9,
    scale: 2.5,
    offset: {
        x: 215,
        y: 165
    },
    sprites: {
        idle: {
            imageSrc: './sprites/warriors/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './sprites/warriors/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './sprites/warriors/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './sprites/warriors/kenji/Fall.png',
            framesMax: 2
        },
        death: {
            imageSrc: './sprites/warriors/kenji/Death.png',
            framesMax: 7
        },
        attack: {
            imageSrc: './sprites/warriors/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './sprites/warriors/kenji/Takehit.png',
            framesMax: 3
        },
    },
    attackBox: {
        offset: {
            x: -173,
            y: 50
        },
        width: 150,
        height: 50
    }
})

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, width, height);
    background.update();
    c.fillStyle = 'rgba(255, 255, 255, 0.15)';
    c.fillRect(0, 0, width, height);
    player1.update();
    player2.update();

    player1.velocity.x = 0;
    player2.velocity.x = 0;

    if (
        rectangularCollision({
            rectangle1: player1,
            rectangle2: player2
        }) &&
        player1.isAttacking && player1.framesCurrent === 4
    ) {
        player1.isAttacking = false;
        player2.takeHit();
    }

    if (player1.isAttacking && player1.framesCurrent === 4) {
        player1.isAttacking = false;
    }

    if (rectangularCollision({
        rectangle1: player2,
        rectangle2: player1
    }) && player2.isAttacking && player2.framesCurrent === 2
    ) {
        player1.takeHit();
        player2.isAttacking = false;
    }

    if (
        player2.isAttacking && player2.framesCurrent === 2
    ) {
        player2.isAttacking = false;
    }

    if (player1.health <= 0) {
        determineWinner({ player1, player2, timerId });
        player1.switchSprite('death');
    }

    if (player2.health <= 0) {
        determineWinner({ player1, player2, timerId });
        player2.switchSprite('death');
    }

    if (keys.a.pressed) {
        player1.velocity.x = -5;
        player1.switchSprite('run');
    } else if (keys.d.pressed) {
        player1.velocity.x = 5;
        player1.switchSprite('run');
    } else {
        player1.switchSprite('idle');
    }

    if (player1.velocity.y < 0) {
        player1.switchSprite('jump');
    } else if (player1.velocity.y > 0) {
        player1.switchSprite('fall');
    }

    if (keys.ArrowLeft.pressed) {
        player2.velocity.x = -5;
        player2.switchSprite('run');
    } else if (keys.ArrowRight.pressed) {
        player2.velocity.x = 5;
        player2.switchSprite('run');
    } else {
        player2.switchSprite('idle');
    }

    if (player2.velocity.y < 0) {
        player2.switchSprite('jump');
    } else if (player2.velocity.y > 0) {
        player2.switchSprite('fall');
    }
}

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

window.addEventListener('keydown', (event) => {
    if (player1.health <= 0 || player2.health <= 0 || timer === 0) {
        return;
    }
    switch (event.key) {
        case 'a':
            keys.a.pressed = true;
            break;
        case 'd':
            keys.d.pressed = true;
            break;
        case 'w':
            if (!player1.jumping) {
                player1.velocity.y = -20;
                player1.jumping = true;
            }
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            break;
        case 'ArrowUp':
            if (!player2.jumping) {
                player2.velocity.y = -20;
                player2.jumping = true;
            }
            break;
        case ' ':
            player1.attack();
            break;
        case 'Shift':
            player2.attack();
            break;
    }
});
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'a':
            keys.a.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
    }
});

animate();
decreaseTimer();