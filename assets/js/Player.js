class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, velocidad, impulso) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.velocidadBase = velocidad;  // propiedad del objeto, no const local
        this.velocidad     = velocidad;
        this.impulso       = impulso;
        this.setScale(0.7);
        
        // Variables de salto
        this.JUMP_BUFFER_MAX = 10;
        this.jumpBuffer      = 0;
        this.MAX_ALTURA      = 150;
        this.saltando        = false;
        this.corteSalto      = false;
        this.alturaSalto     = 0;
        this.tiempoSalto     = 0;
        this.tiempoSaltoMAX  = 0.45;

        // Variables de power up
        this.powerUpActivo = false;

        // Variables de animación
        this.estabaEnAire = false;

        this.scene.events.on('get-items', this.velocidadCristal, this);
        this.initControls();
        this.initAnimations();
    }

    initControls() {
        if (this.scene.input && this.scene.input.keyboard) {
            this.cursors = this.scene.input.keyboard.createCursorKeys();
            this.wasd = {
                up:    this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
                down:  this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
                left:  this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
                right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
            };
        } else {
            this.scene.time.delayedCall(100, () => this.initControls());
        }
    }

    initAnimations() {
        if (!this.scene.anims.exists('idle')) {
            this.scene.anims.create({
                key: 'idle',
                frames: [
                    { key: this.texture.key, frame: 'Personaje principal IDLE1' },
                    { key: this.texture.key, frame: 'Personaje principal IDLE2' },
                    { key: this.texture.key, frame: 'Personaje principal IDLE3' },
                    { key: this.texture.key, frame: 'Personaje principal IDLE4' }
                ],
                frameRate: 6,
                repeat: -1
            });
        }

        if (!this.scene.anims.exists('walk')) {
            this.scene.anims.create({
                key: 'walk',
                frames: [
                    { key: this.texture.key, frame: 'Personaje principal CAMINANDO1' },
                    { key: this.texture.key, frame: 'Personaje principal CAMINANDO2' },
                    { key: this.texture.key, frame: 'Personaje principal CAMINANDO3' },
                    { key: this.texture.key, frame: 'Personaje principal CAMINANDO4' }
                ],
                frameRate: 8,
                repeat: -1
            });
        }

        if (!this.scene.anims.exists('jump')) {
            this.scene.anims.create({
                key: 'jump',
                frames: [
                    { key: this.texture.key, frame: 'Personaje principal saltando2' }
                ],
                frameRate: 1,
                repeat: -1
            });
        }

        if (!this.scene.anims.exists('fall')) {
            this.scene.anims.create({
                key: 'fall',
                frames: [
                    { key: this.texture.key, frame: 'Personaje principal saltando1' }
                ],
                frameRate: 1,
                repeat: -1
            });
        }

        if (!this.scene.anims.exists('land')) {
            this.scene.anims.create({
                key: 'land',
                frames: [
                    { key: this.texture.key, frame: 'Personaje principal IDLE1' }
                ],
                frameRate: 8,
                repeat: 0
            });
        }
    }

    playAnimation() {
        const enSuelo    = this.body.blocked.down;
        const subiendo   = this.body.velocity.y < 0;
        const moviendose = this.body.velocity.x !== 0;
        const animActual = this.anims.currentAnim?.key;
        const animActiva = this.anims.isPlaying;

        if (this.saltando && subiendo) {
            this.anims.play('jump', true);

        } else if (!enSuelo && !this.saltando) {
            this.anims.play('fall', true);

        } else if (enSuelo && this.estabaEnAire) {
            this.anims.play('land', true);

        } else if (enSuelo && moviendose) {
            if (animActual !== 'land' || !animActiva) {
                this.anims.play('walk', true);
            }

        } else if (enSuelo && !moviendose) {
            if (animActual !== 'land' || !animActiva) {
                this.anims.play('idle', true);
            }
        }

        this.estabaEnAire = !enSuelo;
    }

    velocidadCristal(item) {
        if (item.tipo !== 'cristal') return;
        if (this.powerUpActivo) return; // evita doble activación

        this.powerUpActivo = true;
        this.velocidad = this.velocidadBase * 1.5;
        console.log('Velocidad aumentada:', this.velocidad);

        this.scene.time.delayedCall(5000, () => {
            this.velocidad     = this.velocidadBase;
            this.powerUpActivo = false;
            console.log('Velocidad restaurada:', this.velocidad);
        });
    }

    update(time, delta) {
        const dt = (typeof delta === 'number' && isFinite(delta)) ? delta : 16.6;

        // Movimiento horizontal
        if (this.cursors.left.isDown) {
            this.setVelocityX(-this.velocidad);
            this.flipX = true;
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(this.velocidad);
            this.flipX = false;
        } else {
            this.setVelocityX(0);
        }

        // Buffer de salto
        if (this.cursors.up.isDown) {
            this.jumpBuffer = this.JUMP_BUFFER_MAX;
        } else {
            this.jumpBuffer -= dt;
        }

        // Inicia salto
        if (this.jumpBuffer > 0 && this.body.blocked.down) {
            this.saltando    = true;
            this.alturaSalto = this.y;
            this.jumpBuffer  = 0;
            this.corteSalto  = false;
            this.tiempoSalto = 0;
            this.setVelocityY(-300);
        }

        // Mantiene el salto
        if (this.cursors.up.isDown && this.saltando && !this.body.blocked.down) {
            const subida = this.alturaSalto - this.y;
            this.tiempoSalto += dt / 1000;
            if (subida < this.MAX_ALTURA) {
                this.setVelocityY(-300);
            }
        }

        // Corta el salto
        if (this.cursors.up.isUp || this.tiempoSalto >= this.tiempoSaltoMAX) {
            if (this.body.velocity.y < 0) {
                this.setVelocityY(this.body.velocity.y * 0.7);
            }
            this.corteSalto  = true;
            this.saltando    = false;
            this.tiempoSalto = 0;
        }

        // Animaciones — siempre al final
        this.playAnimation();
    }
}