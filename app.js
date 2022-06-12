import {
    Particle
} from './Particle.js'

class App {

    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')
        this.particles = []

        document.body.appendChild(this.canvas);

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();

        this.mouse = {
            x: 0,
            y: 0
        }

        window.addEventListener('mousemove', event => {
            this.mouse.x = event.clientX
            this.mouse.y = event.clientY
        })

        for (let i = 0; i < 50; i++) {
            const radius = 15;
            const color = 'red'
            let x = this.randomIntFromRange(radius, this.stageWidth - radius)
            let y = this.randomIntFromRange(radius, this.stageHeight - radius)

            if (i !== 0) {
                for (let j = 0; j < this.particles.length; j++) {
                    if (this.distance(x, y, this.particles[j].x, this.particles[j].y) - radius * 2 < 0) {
                        x = this.randomIntFromRange(radius, this.stageWidth - radius)
                        y = this.randomIntFromRange(radius, this.stageHeight - radius)

                        j = -1;
                    }
                }
            }
            this.particles.push(new Particle(this.ctx, this.stageWidth, this.stageHeight, this.mouse, x, y, radius, color))
        }
        window.requestAnimationFrame(this.animate.bind(this));
    }

    randomIntFromRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    distance(x1, y1, x2, y2) {
        const xDist = x2 - x1;
        const yDist = y2 - y1;

        return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
    }

    getMousePosition(canvas, event) {
        let rect = canvas.getBoundingClientRect()
        let x = event.clientX - rect.left
        let y = event.clientY - rect.getMousePosition
        console.log("Coordinate x: " + x,  
        "Coordinate y: " + y)
    }

    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        this.canvas.width = this.stageWidth * 2
        this.canvas.height = this.stageHeight * 2
        this.ctx.scale(2, 2)
    }

    animate(t) {
        window.requestAnimationFrame(this.animate.bind(this))

        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight)

        this.particles.forEach(particle => {
            particle.update(this.particles)
        })
    }
}

window.onload = () => {
    new App()
}