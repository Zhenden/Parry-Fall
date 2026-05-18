class gameOver extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }
    create() {
        const { width, height } = this.scale;

        /* =========================
           FONDO
        ========================== */
        this.bg = this.add.image(width / 2, height / 2, "bg_gameover")
            .setDepth(2)
            .setDisplaySize(width, height)
            .setAlpha(1);

        //menu boton

        this.restart = this.add.zone(width / 2, height * 0.67, 225, 50)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            this.scene.start('Nivel1');
        });



    }

}