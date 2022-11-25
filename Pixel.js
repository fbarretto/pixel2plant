class Pixel {
    constructor(x,y, size, xoff) {
        this.x = x/4 * width;
        this.y = y/4 * height;
        // if (j % 2 == 0) {
        //     this.x = width * 0.75;
        // } else {
        //     this.x = width * 0.25;
        // }

        // if (j < 3) {
        //     this.y = height * 0.25;
        // } else {
        //     this.y = height * 0.75;
        // }

        // this.speed = random(0.02);
        this.speed = 0.01;
        this.size = size;
        this.color = color(255, 255, 255);
        this.xoff = xoff+random(0.5);
    }

    update() {
        this.y += map(noise(this.xoff + 10), 0, 1, -6, 6);
        this.xoff += this.speed;
        this.x += map(noise(this.xoff), 0, 1, -6, 6);
        this.borders();
    }

    show(pixels) {

        if (pixels) {
            let index = 4 * (int(this.y / this.size) * img.width + int(this.x / this.size));
            this.color = color(pixels[index], pixels[index + 1], pixels[index + 2], pixels[index + 3]);
        }
        fill(this.color);
        ellipse(this.x, this.y, this.size, this.size);
    }

    borders() {
        if (this.x < -this.size) this.x = width + this.size;
        if (this.y < -this.size) this.y = height + this.size;
        if (this.x > width + this.size) this.x = -this.size;
        if (this.y > height + this.size) this.y = -this.size;
    }
}