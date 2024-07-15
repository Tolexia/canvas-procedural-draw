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
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * maxRadius;
        const endX = centerX + radius * Math.cos(angle);
        const endY = centerY + radius * Math.sin(angle);
        motifs.push({ startX: centerX, startY: centerY, endX, endY, progress: 0 });
    }
    return motifs;
}

// Function to draw a motif
function drawMotif(motif) {
    const { startX, startY, endX, endY, progress } = motif;
    const currentX = startX + progress * (endX - startX);
    const currentY = startY + progress * (endY - startY);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
}

// Generate motifs
const numMotifs = 100;
const maxRadius = Math.min(canvas.width, canvas.height) / 2;
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
        drawMotif(motif);
    }

    // Request the next frame if not all motifs are complete
    if (!allComplete) {
        requestAnimationFrame(draw);
    }
}

// Start the drawing process
draw();
