const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = 'black';

class Branch {
    constructor(startX, startY, endX, endY, depth) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.depth = depth;
        this.progress = 0;
        this.subBranches = [];
        this.hasCreatedSubBranches = false;
    }

    grow() {
        if (this.progress < 1) {
            this.progress += 0.02;
            if (this.progress > 0.5 && !this.hasCreatedSubBranches && this.depth < 5) {
                this.createSubBranches();
                this.hasCreatedSubBranches = true;
            }
            return true;
        }
        return this.subBranches.some(branch => branch.grow());
    }

    createSubBranches() {
        const dx = this.endX - this.startX;
        const dy = this.endY - this.startY;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        for (let side of [-1, 1]) {
            const newAngle = angle + side * (Math.PI / 9 + Math.random() * Math.PI / 4.5);
            const newLength = length * (0.6 + Math.random() * 0.2);
            const newStartX = this.startX + dx * 0.7;
            const newStartY = this.startY + dy * 0.7;
            const newEndX = newStartX + Math.cos(newAngle) * newLength;
            const newEndY = newStartY + Math.sin(newAngle) * newLength;

            if (newEndX >= 0 && newEndX <= canvas.width && newEndY >= 0 && newEndY <= canvas.height) {
                this.subBranches.push(new Branch(newStartX, newStartY, newEndX, newEndY, this.depth + 1));
            }
        }
    }

    draw() {
        const currentX = this.startX + (this.endX - this.startX) * this.progress;
        const currentY = this.startY + (this.endY - this.startY) * this.progress;

        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        this.subBranches.forEach(branch => branch.draw());
    }
}

let mainBranches = [];

function initBranches() {
    const numMainBranches = 6;
    const initialLength = Math.min(canvas.width, canvas.height) * 0.25;

    for (let i = 0; i < numMainBranches; i++) {
        const angle = (Math.PI * 2 / numMainBranches) * i;
        const endX = centerX + initialLength * Math.cos(angle);
        const endY = centerY + initialLength * Math.sin(angle);
        mainBranches.push(new Branch(centerX, centerY, endX, endY, 0));
    }
}

function animate() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    let growing = false;
    mainBranches.forEach(branch => {
        if (branch.grow()) growing = true;
        branch.draw();
    });

    if (growing) {
        requestAnimationFrame(animate);
    }
}

initBranches();
animate();