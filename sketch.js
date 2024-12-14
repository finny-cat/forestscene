let trees = [];
const NUM_TREES = 5;
let stars = [];  // Array to hold star data

function setup() {
    createCanvas(1202, 742, WEBGL);
    colorMode(HSB);
    frameRate(60); // Ensure consistent frame rate
    
    // Create initial trees
    for (let i = 0; i < NUM_TREES; i++) {
        trees.push(new Tree(
            random(-600, 600), // x position
            0, // y position (ground level)
            random(-500, 500), // z position
            random(400, 800) // height - made 4x taller
        ));
    }

    // Create stars
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: random(-2000, 2000),
            y: random(-500, -100),
            z: random(-1000, 0),
            twinkle: random(0, TWO_PI)  // For twinkling effect
        });
    }
}

function draw() {
    background(240, 80, 10); // Dark blue night sky
    
    // Calculate camera Y position
    // 10 seconds = 600 frames at 60fps
    // Map from 500 to 4000 over the cycle
    let cameraY = 2000 + sin(frameCount * (TWO_PI/600)) * 1750;
    
    // Calculate camera rotation
    // As we go up, rotate more downward
    let cameraRotation = PI * 0.2 + map(cameraY, 500, 4000, 0, PI * 0.3);
    
    // Set up camera - with animated Y position and rotation
    rotateX(cameraRotation);
    rotateY(PI);
    translate(0, cameraY, 0);
    
    // Draw stars
    push();
    for (let star of stars) {
        push();
        translate(star.x, star.y, star.z);
        // Twinkling effect
        let brightness = map(sin(star.twinkle + frameCount * 0.05), -1, 1, 40, 100);
        fill(0, 0, brightness);
        noStroke();
        sphere(1);
        star.twinkle += random(0.01, 0.05);  // Randomize twinkling speed
        pop();
    }
    pop();
    
    // Draw ground - now white
    push();
    fill(0, 0, 100); // White in HSB
    translate(0, 0, 0);
    rotateX(HALF_PI);
    rect(-601, -500, 1202, 1000);
    pop();
    
    // Draw trees
    for (let tree of trees) {
        tree.display();
    }
}

class Tree {
    constructor(x, y, z, h) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.height = h;
        this.layers = floor(random(3, 6));
        this.green = 120; // Fixed dark green color
    }
    
    display() {
        push();
        translate(this.x, this.y, this.z);
        
        // Draw trunk
        fill(120, 70, 20); // Dark green trunk
        push();
        translate(0, -this.height/4, 0);
        box(this.height/10, this.height/2, this.height/10);
        pop();
        
        // Draw tree layers
        fill(120, 70, 20); // Dark green for all trees
        noStroke();
        for (let i = 0; i < this.layers; i++) {
            push();
            translate(0, -this.height/2 - i * (this.height/4), 0);
            rotateY(frameCount * 0.001);
            cone(
                map(i, 0, this.layers, this.height/2, this.height/4),
                map(i, 0, this.layers, this.height/2, this.height/4),
                8
            );
            pop();
        }
        pop();
    }
}

function windowResized() {
    resizeCanvas(1202, 742);
}
