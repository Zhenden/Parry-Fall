class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    preload() {
        // Fondo (usa tu imagen)
        this.load.image("bg", "assets/img/fondo_dia.png");
        this.load.image('menuboton' , 'assets/img/menu_boton.png');

        // Sonido (opcional)
        // this.load.audio("slash", "slash.mp3");
    }

    create() {
        const { width, height } = this.scale;

        /* =========================
           FONDO
        ========================== */
        this.bg = this.add.image(width / 2, height / 2, "bg")
            .setDisplaySize(width, height)
            .setAlpha(1);

        //menu boton

        this.menuStart = this.add.image(width / 2, height * 0.7, 'menuboton').setScale(0.3).setInteractive({ useHandCursor: true }).setOrigin(0.5);
        


        this.menuStart.on('pointerover', () => {
            this.menuStart.setTint(0xff0000);
        });

        this.menuStart.on('pointerout', () => {
            this.menuStart.clearTint();
        });

        this.menuStart.on('pointerdown', () => {
            this.scene.start('Nivel1');
        });

        
    
        // Zoom suave
        this.tweens.add({
            targets: this.bg,
            scale: 1.1,
            duration: 20000,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });

        /* =========================
           OVERLAY OSCURO
        ========================== */
        this.add.rectangle(0, 0, width, height, 0x000000, 0.4).setOrigin(0);

        /* =========================
           TÍTULO
        ========================== */
        this.title = this.add.text(width / 2, height * 0.15, "PARRY & FALL", {
            fontFamily: "Arial",
            fontSize: "64px",
            color: "#ffffff",
            stroke: "#ff0000",
            strokeThickness: 6
        }).setOrigin(0.5);






    }

}