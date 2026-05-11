
class Nivel1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Nivel1' }); 
    }

    preload() {
        this.load.image('fondo', 'assets/img/fondo_dia.png');
        this.load.atlas('player', 'assets/img/spritesheet.png', 'assets/js/spritesheet.json');
        this.load.image('plataforma', 'assets/img/plataforma.png');
        this.load.image('plataforma2', 'assets/img/plataformaflo.png');
        this.load.image('pared', 'assets/img/paredcesped.png');
        this.load.image('moneda_sprite', 'assets/img/moneda.png');
        this.load.image('corazon_sprite', 'assets/img/corazon.png');
        this.load.image('cristal_sprite', 'assets/img/cristal_energia.png');
    }

    create() {
        
        
        //this.add.image(350, 250, 'fondo');
        //hud
        this.hud = new Hud(this);
        //player
        this.player = new Player(this, 300, 300, 'player', 300, 300);
        //monedas
        this.items = this.physics.add.group();
        this.ground = this.physics.add.staticGroup();
        
        //crear monedas usando el método crearMonedas
        this.crearMonedas(200, 150, 5);
        this.crearMonedas(200, 150, 5);
        this.crearMonedas(600, 250, 3);
        this.crearMonedas(1000, 150, 4);
        this.crearMonedas(1200, 350, 6);

        //crear corazones usando el método crearCorazones
        this.crearCorazones(400, 350, 2);
        this.crearCorazones(800, 250, 1);
        this.crearCorazones(1300, 150, 3);


        //crear cristales usando el método crearCristales
        this.crearCristales(500, 200, 1);
        this.crearCristales(900, 300, 2);
        this.crearCristales(1400, 200, 1);
        
        //crear plataformas
        this.crearPlataformas(400, 400, 2, 120);
        this.crearPlataformas(700, 300, 3, 120);
        this.crearPlataformas(1100, 200, 3, 120);
        this.crearPlataformas(200, 200, 2, 120);

        this.crearMuros();


        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.items, this.ground);
        this.physics.add.overlap(this.player, this.items, (player, item) => {
            item.collect(this.player);
        });

        this.worldWidth = 1500;
        this.worldHeight = 500;
        this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
        this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
        this.cameras.main.startFollow(this.player);

        // En create()  
        this.fondo = this.add.tileSprite(
        750, 250,   // posición (centro de la pantalla)
        1500, 500,   // ancho y alto del área
        'fondo'     // clave de la textura cargada en preload
        );
        this.fondo.setDepth(-1); // Asegura que el fondo esté detrás de todo

    }

    update(time, delta) {
    this.player.update(time, delta)      
    }

    crearMuros(){
        //suelo
        for (let i = 0; i < 16; i++) {
            this.ground.create(i * 96, 500, 'plataforma').setScale(0.5).refreshBody();
        }

        //paredes
        for (let i = 0; i < 11; i++) {
            this.ground.create(0, i * 50, 'pared').setScale(0.5).refreshBody();
            this.ground.create(1500, i * 50, 'pared').setScale(0.5).refreshBody();
        }
    }

    crearMonedas(x, y, cantidad, separacion = 30){
        for (let i = 0; i < cantidad; i++) {
            const moneda = new Items(this, x + i * separacion, y, 'moneda_sprite', 'moneda', 1);
            this.items.add(moneda);
        }
    }

    crearCorazones(x, y, cantidad, separacion = 30){
        for (let i = 0; i < cantidad; i++) {
            const vida = new Items(this, x + i * separacion, y, 'corazon_sprite', 'vida', 1);
            this.items.add(vida);
        }
    }

    crearCristales(x, y, cantidad, separacion = 30){
        for (let i = 0; i < cantidad; i++) {
            const cristal = new Items(this, x + i * separacion, y, 'cristal_sprite', 'cristal', 1);
            this.items.add(cristal);
        }
    }

    crearPlataformas(x, y, cantidad, separacion = 100){
        for (let i = 0; i < cantidad; i++) {
            const plataforma = this.ground.create(x + i * separacion, y, 'plataforma2').setScale(0.5).refreshBody();
        }
    }

    

}