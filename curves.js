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
function generateMotifs(numMotifs, maxRadius, curvatureFactor) {
    const motifs = [];
    for (let i = 0; i < numMotifs; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * maxRadius;

        // Calculate the end point
        const endX = centerX + radius * Math.cos(angle);
        const endY = centerY + radius * Math.sin(angle);

        // Calculate the control point for the Bezier curve
        const controlAngle = angle + (Math.random() - 0.5) * Math.PI / 4 * curvatureFactor;
        const controlRadius = radius / 2;
        const controlX = centerX + controlRadius * Math.cos(controlAngle);
        const controlY = centerY + controlRadius * Math.sin(controlAngle);

        motifs.push({ startX: centerX, startY: centerY, controlX, controlY, endX, endY, progress: 0 });
    }
    return motifs;
}

// Function to draw a motif
function drawMotif(motif) {
    const { startX, startY, controlX, controlY, endX, endY, progress } = motif;

    const currentX = (1 - progress) * ((1 - progress) * startX + progress * controlX) + progress * ((1 - progress) * controlX + progress * endX);
    const currentY = (1 - progress) * ((1 - progress) * startY + progress * controlY) + progress * ((1 - progress) * controlY + progress * endY);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(controlX, controlY, currentX, currentY);
    ctx.stroke();
}

// Generate motifs
const numMotifs = 100;
const maxRadius = Math.min(canvas.width, canvas.height) / 2;
const curvatureFactor = 2; // Adjust this value to change the curvature of the branches
const motifs = generateMotifs(numMotifs, maxRadius, curvatureFactor);

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
