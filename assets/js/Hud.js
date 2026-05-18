class Hud {
    constructor(scene) {
        this.scene = scene;
        this.monedas = 0;
        this.vida = 10;

        this.monedastxt = this.scene.add.text(16, 16, 'Monedas: 0', { fontSize: '16px', fill: '#fff' });
        this.vidatxt = this.scene.add.text(16, 50, 'Vida: ' + this.vida, { fontSize: '16px', fill: '#fff' });

        this.monedastxt.setScrollFactor(0);
        this.vidatxt.setScrollFactor(0);

        this.scene.events.on('get-items', this.itemColectado, this);
        this.scene.events.on('player-damaged', this.playerDamage, this);

        // Limpiar listeners cuando la escena se apaga para evitar llamadas sobre objetos destruidos
        this.scene.events.once('shutdown', this.destruir, this);
        this.scene.events.once('destroy', this.destruir, this);
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

    playerDamage(vida) {
        // Guard: el texto puede haber sido destruido si la escena ya cambió
        if (!this.vidatxt || !this.vidatxt.active) return;

        this.vida = vida;
        this.vidatxt.setText('Vida: ' + this.vida);
        this.efecto(this.vidatxt);
    }

    efecto(texto) {
        // Guard: no animar si el texto ya no existe
        if (!texto || !texto.active) return;

        this.scene.tweens.add({
            targets: texto,
            duration: 100,
            scale: 1.2,
            yoyo: true,
            ease: 'Quad.easeOut',        // <-- ease va aquí, fuera del onComplete
            onComplete: () => {
                if (texto && texto.active) {
                    texto.setScale(1);   // solo si el texto sigue vivo
                }
            }
        });
    }

    // Remover listeners al destruir para evitar memory leaks y callbacks sobre null
    destruir() {
        this.scene.events.off('get-items', this.itemColectado, this);
        this.scene.events.off('player-damaged', this.playerDamage, this);
        this.monedastxt = null;
        this.vidatxt = null;
    }
}