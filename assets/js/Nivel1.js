class Nivel1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Nivel1' });
        this.saltando = false;
        this.tiempoSalto = 0;
        this.MAX_SALTO = 300;
        this.jumpBuffer = 0;
        this.JUMP_BUFFER_MAX = 150;   
    }

    preload() {
        this.load.image('fondo', 'assets/img/fondo_samurai.png');
        this.load.image('player', 'assets/img/player.png');
        this.load.image('plataforma', 'assets/img/plataforma.png');
        this.load.image('plataforma2', 'assets/img/plataformaflo.png');
        this.load.image('pared', 'assets/img/paredcesped.png');
    }

    create() {
        this.add.image(350, 250, 'fondo');
        this.player = this.physics.add.sprite(350, 250, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(1);
        this.ground = this.physics.add.staticGroup();
        this.ground.create(350, 480, 'plataforma');
        this.ground.create(150, 370, 'plataforma2');
        this.ground.create(550, 350, 'plataforma2');
        this.ground.create(350, 200, 'plataforma2');

        this.ground.create(670, 250, 'pared');
        const paredGirada = this.ground.create(100, 250, 'pared');
        paredGirada.setFlipX(true);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        this.physics.add.collider(this.player, this.ground);
    }

    update(time, delta) {
        // Movimiento horizontal
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
            this.player.flipX = true;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
            this.player.flipX = false;
        } else {
            this.player.setVelocityX(0);
        }

        // Guarda el input del salto en el buffer
        if (this.cursors.up.isDown) {
            this.jumpBuffer = this.JUMP_BUFFER_MAX;
        } else {
            this.jumpBuffer -= delta; // va bajando si no presionas
        }

        // Salta si hay buffer guardado y está en el suelo
        if (this.jumpBuffer > 0 && this.player.body.blocked.down) {
            this.saltando = true;
            this.alturaSalto = this.player.y; // guarda Y inicial
            this.jumpBuffer = 0;
            this.corteSalto = false;
            this.player.setVelocityY(-300);
        }

        // Mantiene el salto
        if (this.cursors.up.isDown && this.saltando && !this.player.body.blocked.down) {
            const subida = this.alturaSalto - this.player.y; // cuánto subió
            if (subida < this.MAX_ALTURA) {
                this.player.setVelocityY(-300);
            }
        }

        // Suelta o llegó al límite
        if ((this.cursors.up.isUp || (this.alturaSalto - this.player.y) >= this.MAX_ALTURA) && this.saltando && !this.corteSalto) {
            if (this.player.body.velocity.y < 0) {
                this.player.setVelocityY(this.player.body.velocity.y * 0.5);
            }
            this.corteSalto = true;
            this.saltando = false;
        }
    };
};