const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set the initial background color to white
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Center point of the canvas
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// Function to generate motifs
function generateMotifs(numMotifs, maxRadius) {
    const motifs = [];
    for (let i = 0; i < numMotifs; i++) {
        const angle = (i / numMotifs) * 2 * Math.PI;
        const radius = maxRadius;
        const endX = centerX + radius * Math.cos(angle);
        const endY = centerY + radius * Math.sin(angle);
        motifs.push({ startX: centerX, startY: centerY, endX, endY, progress: 0, angle: angle });
    }
    return motifs;
}

// Function to draw a fractal motif
function drawFractal(motif, depth, maxDepth, angle) {
    if (depth > maxDepth) return;

    const { startX, startY, endX, endY, progress } = motif;
    const currentX = startX + progress * (endX - startX);
    const currentY = startY + progress * (endY - startY);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    // Calculate new branches only if we are still within max depth
    if (depth < maxDepth) {
        const newLength = Math.hypot(endX - startX, endY - startY) * 0.7;
        const leftAngle = angle + Math.PI / 6;
        const rightAngle = angle - Math.PI / 6;

        const leftEndX = currentX + newLength * Math.cos(leftAngle);
        const leftEndY = currentY + newLength * Math.sin(leftAngle);
        const rightEndX = currentX + newLength * Math.cos(rightAngle);
        const rightEndY = currentY + newLength * Math.sin(rightAngle);

        // Ensure branches do not go out of bounds
        if (leftEndX >= 0 && leftEndX <= canvas.width && leftEndY >= 0 && leftEndY <= canvas.height) {
            drawFractal({ startX: currentX, startY: currentY, endX: leftEndX, endY: leftEndY, progress: motif.progress }, depth + 1, maxDepth, leftAngle);
        }
        if (rightEndX >= 0 && rightEndX <= canvas.width && rightEndY >= 0 && rightEndY <= canvas.height) {
            drawFractal({ startX: currentX, startY: currentY, endX: rightEndX, endY: rightEndY, progress: motif.progress }, depth + 1, maxDepth, rightAngle);
        }
    }
}

// Generate motifs
const numMotifs = 8;
const maxRadius = Math.min(canvas.width, canvas.height) / 6;
const motifs = generateMotifs(numMotifs, maxRadius);

// Main drawing function
function draw() {
    // Clear the canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw each motif progressively
    let allComplete = true;
    for (const motif of motifs) {
        if (motif.progress < 1) {
            allComplete = false;
            motif.progress += 0.01; // Adjust this value to change the drawing speed
        }
        drawFractal(motif, 0, 5, motif.angle); // Change maxDepth as needed
    }

    // Request the next frame if not all motifs are complete
    if (!allComplete) {
        requestAnimationFrame(draw);
    }
}

// Start the drawing process
draw();