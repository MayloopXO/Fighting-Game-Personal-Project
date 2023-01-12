class GameLoop {

    constructor() {
        this.fps = 60;
        this.ctx = null;
        this.cnv = null;
        this.loop = null;
    }


    start() {
        this.toggleScreen('start-screen',false);
        this.toggleScreen('canvas',true);
        this.init();
        this.loop = setInterval(() => {
            this.update();
            this.render();
        }, 1000/this.fps);
    }

    toggleScreen(id,toggle) {
        let element = document.getElementById(id);
        let display = ( toggle ) ? 'block' : 'none';
        element.style.display = display;
    }

    init() {
    }

    resize() {
    }

    update() {
    }

    render() {
    }
}