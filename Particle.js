export class Particle {
    constructor(ctx, stageWidth, stageHeight, mouse, x, y, radius, color) {
        this.ctx = ctx
        this.stageWidth = stageWidth
        this.stageHeight = stageHeight
        this.mouse = mouse
        this.x = x
        this.y = y
        this.velocity = {
            x : (Math.random() - 0.5) * 5,
            y : (Math.random() - 0.5) * 5
        }
        this.radius = radius
        this.color = color
        this.mass = 1
        this.filled = false
        this.isCollided = false
    }

    update(particles) {
        this.draw()

        for (let i = 0; i < particles.length; i++) {
            if (this === particles[i]) continue;

            if (this.distance(this.x, this.y, particles[i].x, particles[i].y) - this.radius * 2 < 0) {
                // console.log('has collided!')
                this.isCollided = true
                this.filled = true
                particles[i].filled = true
                this.resolveCollision(this, particles[i])
            }
        }

        if (this.x - this.radius <= 0 || this.x + this.radius >= this.stageWidth) {
            this.velocity.x *= -1
        }
        if (this.y - this.radius <= 0 || this.y + this.radius >= this.stageHeight) {
            this.velocity.y *= -1
        }

        if (this.distance(this.mouse.x, this.mouse.y, this.x, this.y) < 30) {
            this.isCollided = true
        }

        if (this.isCollided) {
            this.x += this.velocity.x
            this.y += this.velocity.y
        }
        
    }

    draw() {
        this.ctx.strokeStyle = this.color
        this.ctx.fillStyle = this.color
        this.ctx.beginPath()
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        if(this.filled === true) this.ctx.fill()
        this.ctx.stroke()
    }

    distance(x1, y1, x2, y2) {
        const xDist = x2 - x1;
        const yDist = y2 - y1;

        return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
    }

    rotate(velocity, angle) {
        const rotatedVelocities = {
            x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
            y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
        }

        return rotatedVelocities;
    }

    resolveCollision(particle, otherParticle) {
        const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x
        const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y

        const xDist = otherParticle.x - particle.x
        const yDist = otherParticle.y - particle.y

        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

            const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x)

            const m1 = particle.mass
            const m2 = otherParticle.mass

            const u1 = this.rotate(particle.velocity, angle)
            const u2 = this.rotate(otherParticle.velocity, angle)

            const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y }
            const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y }

            const vFinal1 = this.rotate(v1, -angle)
            const vFinal2 = this.rotate(v2, -angle)

            particle.velocity.x = vFinal1.x
            particle.velocity.y = vFinal1.y

            otherParticle.velocity.x = vFinal2.x
            otherParticle.velocity.y = vFinal2.y
        } 
    }

}

