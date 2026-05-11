class Hud {
    constructor(scene) {
        this.scene = scene;
        this.monedas = 0;
        this.vida = 3;
        this.monedastxt = this.scene.add.text(16, 16, 'Monedas: 0', { fontSize: '16px', fill: '#fff' });
        this.vidatxt = this.scene.add.text(16, 50, 'Vida: ' + this.vida, { fontSize: '16px', fill: '#fff' });
        this.scene.events.on('get-items',this.itemColectado,this);
        this.monedastxt.setScrollFactor(0);
        this.vidatxt.setScrollFactor(0);
    }

    itemColectado(item) {
        if (item.tipo === 'moneda') {
            this.monedas += item.valor;
            this.monedastxt.setText('Monedas: ' + this.monedas);
            this.efecto(this.monedastxt);
        } else if (item.tipo === 'vida') {
            this.vida += item.valor;
            this.vidatxt.setText('Vida: ' + this.vida);
            this.efecto(this.vidatxt);
        }
    }

    efecto(texto) {
        this.scene.tweens.add({
            targets:texto,
            duration:100,
            scale:1.2,
            yoyo:true,
            ease: 'Quad.easeOut',
            onComplete: () => {                
                texto.setScale(1);
                ease: 'Quad.easeOut'
            }
        });
    }
}