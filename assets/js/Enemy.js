const DEBUG = typeof window !== 'undefined' && window.GAME_DEBUG === true;

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, textura, player, velocidad = 50, minX = 0, maxX = 0) {
        super(scene, x, y, textura);

        // Validación temprana de parámetros obligatorios
        if (!player) {
            throw new Error('Enemy: el parámetro "player" es requerido y no puede ser null.');
        }

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.player = player;
        this.textura = textura;

        // Configuración
        this.velocidad = velocidad;
        this.rangoDetect = 80;
        this.detectaPlayer = false;
        this.rangoAtaque = 40;
        this.daño = 3;
        this.setScale(2);

        // Patrulla — si minX == maxX el enemigo se queda quieto
        this.minX = minX;
        this.maxX = maxX;
        this.direccion = 1;
        this.puedePatrullar = minX !== maxX;

        this.tiempoUltimoGolpe = 0;
        this.cooldown = 1000; // ms

        this.animsAdd();
    }

    animsAdd() {
        // Verificar que la textura existe en el caché antes de crear la animación
        if (!this.scene.textures.exists(this.textura)) {
            console.warn(`Enemy: la textura "${this.textura}" no está cargada en el caché de Phaser.`);
            return;
        }

        if (!this.scene.anims.exists('enemy_idle')) {
            this.scene.anims.create({
                key: 'enemy_idle',
                frames: this.scene.anims.generateFrameNumbers(
                    this.textura, { start: 0, end: 3 }
                ),
                frameRate: 6,
                repeat: -1
            });
        }

        this.play('enemy_idle');
    }

    detectarPlayer() {
        const distancia = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.player.x,
            this.player.y
        );

        return distancia < this.rangoDetect;
    }

    perseguirPlayer() {
        if (this.player.x < this.x) {
            this.setVelocityX(-this.velocidad);
            this.setFlipX(true);
        } else {
            this.setVelocityX(this.velocidad);
            this.setFlipX(false);
        }
    }

    patrullar() {
        this.setVelocityX(this.velocidad * this.direccion);

        if (this.x >= this.maxX) {
            this.direccion = -1;
            this.setFlipX(true);
        }

        if (this.x <= this.minX) {
            this.direccion = 1;
            this.setFlipX(false);
        }
    }

    atacar() {
        // No atacar si el player ya está muerto
        if (this.player.vida <= 0) return;

        const distancia = Phaser.Math.Distance.Between(
            this.x,
            this.y,
            this.player.x,
            this.player.y
        );

        const tiempoActual = this.scene.time.now;

        if (distancia < this.rangoAtaque && tiempoActual > this.tiempoUltimoGolpe + this.cooldown) {
            this.tiempoUltimoGolpe = tiempoActual;

            // Llamar damage() para que el player maneje vida, efecto visual y muerte
            if (typeof this.player.damage === 'function') {
                this.player.damage(this.daño);
            } else {
                console.warn('Enemy: player.damage() no está definido.');
            }
        }
    }

    update() {
        // Guard: detenerse si el sprite o la escena ya no son válidos
        if (!this.active || !this.scene) return;

        // Guard: detenerse si el player ya no existe o fue destruido
        if (!this.player || !this.player.active) {
            this.setVelocityX(0);
            return;
        }

        const detectado = this.detectarPlayer();

        if (detectado) {
            this.perseguirPlayer();
            this.atacar();
        } else if (this.puedePatrullar) {
            this.patrullar();
        } else {
            // Sin rango de patrulla definido: quedarse quieto
            this.setVelocityX(0);
        }
    }

    // Limpieza al destruir el enemigo
    destroy(fromScene) {
        this.player = null;
        super.destroy(fromScene);
    }
}