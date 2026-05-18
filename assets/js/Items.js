class Items extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, tipo, valor){

        super(scene, x, y, texture)
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.moves = false;
        this.tipo = tipo;
        this.valor = valor;
        this.body.allowGravity = false;
        this.body.setSize(20,20);
        this.consumir = false;
        
    }

    collect(player){
        if (this.consumir) return;
        this.consumir = true;
        this.scene.tweens.add({
            targets:player,
            scale: 0.8,
            duration:25,
            yoyo:true,
            ease:'Quad.easeOut',
            onComplete: () => {
            player.setScale(0.7); // Asegura que vuelva a su tamaño original
            }
        });
                // ✅ el evento solo le dice al HUD qué pasó
        this.scene.events.emit('get-items', {
            tipo: this.tipo,
            valor: this.valor
        });
        console.log('Item colectado:', this.tipo, 'Valor:', this.valor);

        this.destroy();

        
    }

    
    
}