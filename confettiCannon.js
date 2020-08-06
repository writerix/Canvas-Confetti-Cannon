let canvas = document.getElementById("confetti_area");
let ctx = canvas.getContext("2d");
let allowAnimation = false;

const GRAVITY = 0.5;
const MAX_PIECES = 200;
const DURATION = 2500;
const COLORS = ["253, 15, 126", "0, 204, 227", "251, 183, 35", "251, 183, 35", "251, 183, 35",
                "69, 171, 141", "239, 153, 211", "191, 238, 170", "79, 43, 87", "160, 228, 115"];

let allConfetti = [];


class Confetti{
    constructor(color, xpos, ypos, deltaX, deltaY){
        this.color = color;
        this.xpos = xpos;
        this.ypos = ypos;
        this.deltaX = deltaX;
        this.deltaY = deltaY;
        this.alpha = 1;
        this.width = 10;
        this.height = randInt(this.width, 3 * this.width);
        this.rotation = randFloat(0, 2 * Math.PI);
    }

    update(timeDiff){
        this.deltaY = this.deltaY + (timeDiff/1000) * GRAVITY;
        this.alpha = 1 - Math.min(1, timeDiff/DURATION);
        
        this.xpos += this.deltaX - this.deltaX * (timeDiff/DURATION);
        this.ypos += this.deltaY;
    }

    draw(){
        ctx.fillStyle = "rgb(" + this.color + ", " + this.alpha + ")";
        ctx.beginPath();
        ctx.moveTo(this.xpos, this.ypos);

        let topRight = rotatePoint(this.xpos, this.ypos, this.rotation, this.xpos + this.width, this.ypos);
        ctx.lineTo(topRight.px, topRight.py);

        let bottomRight = rotatePoint(this.xpos, this.ypos, this.rotation, this.xpos + this.width, this.ypos + this.height);
        ctx.lineTo(bottomRight.px, bottomRight.py);

        let bottomLeft = rotatePoint(this.xpos, this.ypos, this.rotation, this.xpos, this.ypos + this.height);
        ctx.lineTo(bottomLeft.px, bottomLeft.py);

        ctx.closePath();
        ctx.fill();
    }
}

function randFloat(min, max){
    return (Math.random() * (max - min)) + min;
}

function randInt(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

/* recall: rotation about the origin
    x' = xcosθ - ysinθ
    y' = xsinθ + ycosθ
*/
function rotatePoint(centerX, centerY, angle, x, y){
    return {
        px: Math.cos(angle) * (x - centerX) - Math.sin(angle) * (y - centerY) + centerX,
        py: Math.sin(angle) * (x - centerX) + Math.cos(angle) * (y - centerY) + centerY
    };
}

function animateConfetti(startTime, timeStamp){
    let elapsedTime = timeStamp - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < allConfetti.length; i++){
        allConfetti[i].update(elapsedTime);
        allConfetti[i].draw();
    }

    if(elapsedTime < DURATION && allowAnimation){
        requestAnimationFrame(function(timestamp){
            animateConfetti(startTime, timestamp);
        });
    }else{
        stopAnimation();
    }
}

function fireCannon(initX, initY){
    allowAnimation = true;
    canvas.style.zIndex = 1;
    for(let i = 0; i < MAX_PIECES; i++){
        allConfetti.push(new Confetti(COLORS[Math.floor(Math.random() * COLORS.length)], initX, initY, randFloat(-10, 10), randFloat(-12, -1)));
        allConfetti[i].draw();
    }
    requestAnimationFrame(function(timestamp){
        animateConfetti(timestamp, timestamp);
    });
    
}

function stopAnimation(){
    allowAnimation = false;
    canvas.style.zIndex = -1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    allConfetti = [];
}

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
document.getElementById("cannon").addEventListener("click", () => {fireCannon(canvas.width/2, canvas.height/2)});
canvas.addEventListener("click", stopAnimation);

resizeCanvas();
