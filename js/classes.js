class Sprite {
    constructor({
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        framesHold = 5
    }) {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale,
            this.framesMax = framesMax,
            this.framesCurrent = 0,
            this.framesElapsed = 0,
            this.framesHold = framesHold,
            this.offset = offset
    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * ((this.image.width) / this.framesMax),
            0,
            (this.image.width / this.framesMax),
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        );
    }

    animateFrames() {
        this.framesElapsed++;

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } else {
                this.framesCurrent = 0;
            }
        }
    }

    update() {
        this.draw();
        this.animateFrames();
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        sprites,
        framesHold = 5,
        attackBox = {
            offset: {},
            width: undefined,
            height: undefined
        },
        lifeBarElement
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset,
            framesHold
        })

        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.health = 100;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            height: attackBox.height,
            width: attackBox.width
        }
        this.isAttacking = false;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.sprites = sprites;
        this.dead = false;
        this.lifeBarElement = lifeBarElement;
        this.jumping = false;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    update() {
        this.draw();
        if (!this.dead) this.animateFrames();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        if (this.position.x < 45) {
            this.position.x = 45;
        } else if (this.position.x > 910) {
            this.position.x = 910;
        }
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 55) {
            this.velocity.y = 0;
            this.position.y = 359;
            this.jumping = false;
        } else this.velocity.y += gravity;
    }

    attack() {
        this.switchSprite('attack');
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 1000);
    }

    decreaseLifeBar() {
        gsap.to(this.lifeBarElement, {
            width: this.health + '%'
        });
    }

    takeHit() {
        this.health -= 20;
        this.decreaseLifeBar();
        this.switchSprite('takeHit');
    }

    updateImageAndFrames(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1) {
                this.dead = true;
            }
            return;
        }

        if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1) return;
        if (this.image === this.sprites.attack.image && this.framesCurrent < this.sprites.attack.framesMax - 1) return;

        if (this.image !== this.sprites[sprite].image) {
            this.image = this.sprites[sprite].image;
            this.framesMax = this.sprites[sprite].framesMax;
            this.framesCurrent = 0;
        }
    }

    switchSprite(sprite) {
        switch (sprite) {
            case 'death':
                this.updateImageAndFrames(sprite);
                break;
            case 'idle':
                this.updateImageAndFrames(sprite);
                break;
            case 'run':
                this.updateImageAndFrames(sprite);
                break;
            case 'jump':
                this.updateImageAndFrames(sprite);
                break;
            case 'fall':
                this.updateImageAndFrames(sprite);
                break;
            case 'attack':
                this.updateImageAndFrames(sprite);
                break;
            case 'takeHit':
                this.updateImageAndFrames(sprite);
                break;
        }
    }
}