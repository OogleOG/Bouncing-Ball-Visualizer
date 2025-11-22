const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let animationId;
let isRunning = false;
let currentShape = 'circle';
let bounceCount = 0;
let bpm = 60;

// Settings
let settings = {
    speed: 5,
    ballSize: 20,
    tempoIncrease: 5,
    trails: true,
    glow: true,
    particles: true
};

// Ball properties
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 5,
    vy: 5,
    radius: 20,
    hue: 0
};

// Particles
let particles = [];

// Audio context for beep
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Shape definitions
const shapes = {
    circle: {
        draw: (ctx, size) => {
            ctx.beginPath();
            ctx.arc(canvas.width/2, canvas.height/2, size, 0, Math.PI * 2);
            ctx.stroke();
        },
        checkCollision: (x, y, size) => {
            const dx = x - canvas.width/2;
            const dy = y - canvas.height/2;
            return Math.sqrt(dx*dx + dy*dy) >= size - ball.radius;
        },
        reflect: (x, y, size) => {
            const dx = x - canvas.width/2;
            const dy = y - canvas.height/2;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const nx = dx / dist;
            const ny = dy / dist;
            const dot = ball.vx * nx + ball.vy * ny;
            ball.vx -= 2 * dot * nx;
            ball.vy -= 2 * dot * ny;
            const overlap = (dist + ball.radius) - size;
            ball.x -= nx * overlap;
            ball.y -= ny * overlap;
        }
    },
    square: {
        draw: (ctx, size) => {
            ctx.strokeRect(canvas.width/2 - size, canvas.height/2 - size, size*2, size*2);
        },
        checkCollision: (x, y, size) => {
            return x - ball.radius <= canvas.width/2 - size ||
                   x + ball.radius >= canvas.width/2 + size ||
                   y - ball.radius <= canvas.height/2 - size ||
                   y + ball.radius >= canvas.height/2 + size;
        },
        reflect: (x, y, size) => {
            const left = canvas.width/2 - size;
            const right = canvas.width/2 + size;
            const top = canvas.height/2 - size;
            const bottom = canvas.height/2 + size;
            
            if (x - ball.radius <= left) {
                ball.vx = Math.abs(ball.vx);
                ball.x = left + ball.radius;
            }
            if (x + ball.radius >= right) {
                ball.vx = -Math.abs(ball.vx);
                ball.x = right - ball.radius;
            }
            if (y - ball.radius <= top) {
                ball.vy = Math.abs(ball.vy);
                ball.y = top + ball.radius;
            }
            if (y + ball.radius >= bottom) {
                ball.vy = -Math.abs(ball.vy);
                ball.y = bottom - ball.radius;
            }
        }
    },
    triangle: {
        draw: (ctx, size) => {
            ctx.beginPath();
            ctx.moveTo(canvas.width/2, canvas.height/2 - size);
            ctx.lineTo(canvas.width/2 - size * 0.866, canvas.height/2 + size * 0.5);
            ctx.lineTo(canvas.width/2 + size * 0.866, canvas.height/2 + size * 0.5);
            ctx.closePath();
            ctx.stroke();
        },
        checkCollision: (x, y, size) => {
            const centerX = canvas.width/2;
            const centerY = canvas.height/2;
            const p1 = {x: centerX, y: centerY - size};
            const p2 = {x: centerX - size * 0.866, y: centerY + size * 0.5};
            const p3 = {x: centerX + size * 0.866, y: centerY + size * 0.5};
            
            return distToSegment(x, y, p1, p2) < ball.radius ||
                   distToSegment(x, y, p2, p3) < ball.radius ||
                   distToSegment(x, y, p3, p1) < ball.radius;
        },
        reflect: (x, y, size) => {
            const centerX = canvas.width/2;
            const centerY = canvas.height/2;
            const edges = [
                [{x: centerX, y: centerY - size}, {x: centerX - size * 0.866, y: centerY + size * 0.5}],
                [{x: centerX - size * 0.866, y: centerY + size * 0.5}, {x: centerX + size * 0.866, y: centerY + size * 0.5}],
                [{x: centerX + size * 0.866, y: centerY + size * 0.5}, {x: centerX, y: centerY - size}]
            ];
            
            let minDist = Infinity;
            let closestEdge = null;
            
            edges.forEach(edge => {
                const dist = distToSegment(x, y, edge[0], edge[1]);
                if (dist < minDist) {
                    minDist = dist;
                    closestEdge = edge;
                }
            });
            
            if (closestEdge) {
                const dx = closestEdge[1].x - closestEdge[0].x;
                const dy = closestEdge[1].y - closestEdge[0].y;
                const len = Math.sqrt(dx*dx + dy*dy);
                const nx = -dy / len;
                const ny = dx / len;
                const dot = ball.vx * nx + ball.vy * ny;
                ball.vx -= 2 * dot * nx;
                ball.vy -= 2 * dot * ny;
            }
        }
    },
    hexagon: {
        draw: (ctx, size) => {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const x = canvas.width/2 + size * Math.cos(angle);
                const y = canvas.height/2 + size * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        },
        checkCollision: (x, y, size) => {
            const centerX = canvas.width/2;
            const centerY = canvas.height/2;
            for (let i = 0; i < 6; i++) {
                const angle1 = (Math.PI / 3) * i;
                const angle2 = (Math.PI / 3) * ((i + 1) % 6);
                const p1 = {x: centerX + size * Math.cos(angle1), y: centerY + size * Math.sin(angle1)};
                const p2 = {x: centerX + size * Math.cos(angle2), y: centerY + size * Math.sin(angle2)};
                if (distToSegment(x, y, p1, p2) < ball.radius) return true;
            }
            return false;
        },
        reflect: (x, y, size) => {
            const centerX = canvas.width/2;
            const centerY = canvas.height/2;
            let minDist = Infinity;
            let closestEdge = null;
            
            for (let i = 0; i < 6; i++) {
                const angle1 = (Math.PI / 3) * i;
                const angle2 = (Math.PI / 3) * ((i + 1) % 6);
                const p1 = {x: centerX + size * Math.cos(angle1), y: centerY + size * Math.sin(angle1)};
                const p2 = {x: centerX + size * Math.cos(angle2), y: centerY + size * Math.sin(angle2)};
                const dist = distToSegment(x, y, p1, p2);
                if (dist < minDist) {
                    minDist = dist;
                    closestEdge = [p1, p2];
                }
            }
            
            if (closestEdge) {
                const dx = closestEdge[1].x - closestEdge[0].x;
                const dy = closestEdge[1].y - closestEdge[0].y;
                const len = Math.sqrt(dx*dx + dy*dy);
                const nx = -dy / len;
                const ny = dx / len;
                const dot = ball.vx * nx + ball.vy * ny;
                ball.vx -= 2 * dot * nx;
                ball.vy -= 2 * dot * ny;
            }
        }
    }
};

function distToSegment(px, py, p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len2 = dx*dx + dy*dy;
    let t = ((px - p1.x) * dx + (py - p1.y) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    const closestX = p1.x + t * dx;
    const closestY = p1.y + t * dy;
    return Math.sqrt((px - closestX)**2 + (py - closestY)**2);
}

function playBeep() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const frequency = 200 + (ball.hue / 360) * 600;
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function createParticles(x, y) {
    if (!settings.particles) return;
    
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i;
        const speed = 2 + Math.random() * 3;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            hue: ball.hue
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        p.vx *= 0.98;
        p.vy *= 0.98;
        
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.life * 0.8;
        ctx.fillStyle = `hsl(${p.hue}, 100%, 50%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

function update() {
    if (!isRunning) return;

    const shapeSize = Math.min(canvas.width, canvas.height) * 0.5;
    const shape = shapes[currentShape];

    // Update ball position
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Check collision and bounce
    if (shape.checkCollision(ball.x, ball.y, shapeSize)) {
        shape.reflect(ball.x, ball.y, shapeSize);
        
        // Update color
        ball.hue = (ball.hue + 30) % 360;
        
        // Increase speed
        const speedMultiplier = 1 + (settings.tempoIncrease / 100);
        ball.vx *= speedMultiplier;
        ball.vy *= speedMultiplier;
        
        // Update stats
        bounceCount++;
        bpm = Math.round(60 / (Math.sqrt(ball.vx*ball.vx + ball.vy*ball.vy) / 10));
        document.getElementById('bounceCount').textContent = bounceCount;
        document.getElementById('bpmValue').textContent = bpm;
        document.getElementById('currentSpeed').textContent = 
            Math.sqrt(ball.vx*ball.vx + ball.vy*ball.vy).toFixed(1);
        
        // Play sound
        playBeep();
        
        // Create particles
        createParticles(ball.x, ball.y);
    }

    updateParticles();
    draw();
    animationId = requestAnimationFrame(update);
}

function draw() {
    // Trail effect
    if (settings.trails) {
        ctx.fillStyle = 'rgba(30, 60, 114, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = 'rgba(30, 60, 114, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw shape
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 3;
    const shapeSize = Math.min(canvas.width, canvas.height) * 0.5;
    shapes[currentShape].draw(ctx, shapeSize);

    // Draw particles
    drawParticles();

    // Draw ball with glow
    if (settings.glow) {
        ctx.shadowBlur = 30;
        ctx.shadowColor = `hsl(${ball.hue}, 100%, 50%)`;
    }
    
    ctx.fillStyle = `hsl(${ball.hue}, 100%, 50%)`;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw ball outline
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function reset() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    const angle = Math.random() * Math.PI * 2;
    ball.vx = Math.cos(angle) * settings.speed;
    ball.vy = Math.sin(angle) * settings.speed;
    ball.radius = settings.ballSize;
    ball.hue = 0;
    bounceCount = 0;
    bpm = 60;
    particles = [];
    document.getElementById('bounceCount').textContent = '0';
    document.getElementById('bpmValue').textContent = '60';
    document.getElementById('currentSpeed').textContent = settings.speed;
}

function toggleStart() {
    const btn = document.getElementById('startBtn');
    if (!isRunning) {
        isRunning = true;
        btn.textContent = 'Stop';
        btn.classList.add('active');
        reset();
        update();
    } else {
        isRunning = false;
        btn.textContent = 'Start';
        btn.classList.remove('active');
        cancelAnimationFrame(animationId);
    }
}

// Event listeners
document.querySelectorAll('.shape-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (isRunning) return;
        document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentShape = btn.dataset.shape;
        reset();
        draw();
    });
});

document.getElementById('speedSlider').addEventListener('input', (e) => {
    settings.speed = parseFloat(e.target.value);
    document.getElementById('speedValue').textContent = settings.speed;
    if (!isRunning) reset();
});

document.getElementById('sizeSlider').addEventListener('input', (e) => {
    settings.ballSize = parseInt(e.target.value);
    document.getElementById('sizeValue').textContent = settings.ballSize;
    if (!isRunning) {
        ball.radius = settings.ballSize;
        draw();
    }
});

document.getElementById('tempoSlider').addEventListener('input', (e) => {
    settings.tempoIncrease = parseInt(e.target.value);
    document.getElementById('tempoValue').textContent = settings.tempoIncrease + '%';
});

document.getElementById('trailToggle').addEventListener('click', (e) => {
    settings.trails = !settings.trails;
    e.target.classList.toggle('active');
});

document.getElementById('glowToggle').addEventListener('click', (e) => {
    settings.glow = !settings.glow;
    e.target.classList.toggle('active');
});

document.getElementById('particleToggle').addEventListener('click', (e) => {
    settings.particles = !settings.particles;
    e.target.classList.toggle('active');
});

document.getElementById('startBtn').addEventListener('click', toggleStart);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        toggleStart();
    } else if (e.code === 'KeyR' && !isRunning) {
        reset();
        draw();
    } else if (e.code === 'Digit1' && !isRunning) {
        document.querySelector('[data-shape="circle"]').click();
    } else if (e.code === 'Digit2' && !isRunning) {
        document.querySelector('[data-shape="square"]').click();
    } else if (e.code === 'Digit3' && !isRunning) {
        document.querySelector('[data-shape="triangle"]').click();
    } else if (e.code === 'Digit4' && !isRunning) {
        document.querySelector('[data-shape="hexagon"]').click();
    }
});

// Canvas click to toggle
canvas.addEventListener('click', toggleStart);

// Initial draw
reset();
draw();
