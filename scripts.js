// JavaScript for Fade-In Effect on Scroll

document.addEventListener('DOMContentLoaded', () => {

    // Navigation Toggle for Mobile View
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
    });

    // Close the menu when a link is clicked (optional)
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('nav-active');
            }
        });
    });

    const cards = document.querySelectorAll('.card, .skill-card');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        observer.observe(card);
    });

    // Smooth Scroll for Navigation Links
    const navLinksSmooth = document.querySelectorAll('.nav-links a');

    navLinksSmooth.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Typewriter Effect for Subtitle
    const subtitle = document.querySelector('.subtitle');
    const words = ["Experienced Software Engineer", "Full Stack Developer", "Machine Learning Enthusiast"];
    let wordIndex = 0;
    let letterIndex = 0;
    let currentWord = '';
    let isDeleting = false;

    function type() {
        if (wordIndex < words.length) {
            if (!isDeleting && letterIndex <= words[wordIndex].length) {
                currentWord = words[wordIndex].substring(0, letterIndex);
                subtitle.textContent = currentWord;
                letterIndex++;
                setTimeout(type, 150);
            } else if (isDeleting && letterIndex >= 0) {
                currentWord = words[wordIndex].substring(0, letterIndex);
                subtitle.textContent = currentWord;
                letterIndex--;
                setTimeout(type, 100);
            } else {
                isDeleting = !isDeleting;
                if (!isDeleting) {
                    wordIndex++;
                }
                setTimeout(type, 500);
            }
        } else {
            wordIndex = 0;
            type();
        }
    }

    type();

    // Animate Skill Progress Bars
    const skillBars = document.querySelectorAll('.skill-card .progress-bar span');

    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.setProperty('--skill-width', width);
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });

    // Back-to-Top Button Functionality
    const backToTopButton = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'block';
            backToTopButton.style.opacity = '1';
        } else {
            backToTopButton.style.opacity = '0';
            setTimeout(() => {
                backToTopButton.style.display = 'none';
            }, 300);
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });




    // GAME Code
    // GAME Code
    let gameRunning = false;
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const gravity = 0.5;
    let ball;
    let obstacles = [];

    // Variables to track key presses
    let keys = {
        a: false,
        d: false,
        left: false,
        right: false
    };

    // Variables to track touch positions
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    // Add touch event listeners to the canvas
    canvas.addEventListener('touchstart', handleTouchStart, false);
    canvas.addEventListener('touchmove', handleTouchMove, false);
    canvas.addEventListener('touchend', handleTouchEnd, false);

    function handleTouchStart(e) {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;

        if (!gameRunning) {
            startGame();
        }
    }

    function handleTouchMove(e) {
        const touch = e.touches[0];
        touchEndX = touch.clientX;
        touchEndY = touch.clientY;

        const deltaX = touchEndX - touchStartX;

        // Adjust sensitivity threshold as needed
        if (Math.abs(deltaX) > 30) {
            if (deltaX > 0) {
                // Swipe Right
                keys.right = true;
                keys.left = false;
            } else {
                // Swipe Left
                keys.left = true;
                keys.right = false;
            }
        }
    }

    function handleTouchEnd(e) {
        // Stop movement when touch ends
        keys.left = false;
        keys.right = false;
    }

    // Listen for 'keydown' events (for desktop users)
    document.addEventListener('keydown', (e) => {
        if ((e.key === 'a' || e.key === 'd') && !gameRunning) {
            startGame();
        }

        if (gameRunning) {
            if (e.key === 'a') {
                keys.a = true;
            }
            if (e.key === 'd') {
                keys.d = true;
            }
        }
    });

    // Listen for 'keyup' events
    document.addEventListener('keyup', (e) => {
        if (gameRunning) {
            if (e.key === 'a') {
                keys.a = false;
            }
            if (e.key === 'd') {
                keys.d = false;
            }
        }
    });

    function startGame() {
        gameRunning = true;
        document.body.style.overflow = 'hidden';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.display = 'block';
        initializeGame();
        requestAnimationFrame(gameLoop);
    }

    function initializeGame() {
        // Initialize the ball at the top center of the canvas
        ball = {
            x: canvas.width / 2,
            y: 50,
            radius: 15,
            color: '#BB86FC',
            dx: 0,
            dy: 2
        };

        // Create obstacles based on the positions of the cards
        obstacles = [];
        updateObstacles();
    }

    function updateObstacles() {
        obstacles = [];
        const cards = document.querySelectorAll('.game-card');
        cards.forEach(card => {
            if (card.style.display !== "none") {
                const rect = card.getBoundingClientRect();
                obstacles.push({
                    x: rect.left + window.scrollX,
                    y: rect.top + window.scrollY,
                    width: rect.width,
                    height: rect.height,
                    element: card,
                    hit: false
                });
            }
        });
    }

    function gameLoop() {
        if (!gameRunning) return;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update ball movement based on key presses and swipe gestures
        if (keys.a || keys.left) {
            ball.dx = -5;
        } else if (keys.d || keys.right) {
            ball.dx = 5;
        } else {
            ball.dx = 0;
        }

        // Apply gravity to the ball
        ball.dy += gravity;
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Bounce off the walls
        if (ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width - ball.radius;
            ball.dx = -ball.dx * 0.8; // Reduce speed slightly
        }
        if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.dx = -ball.dx * 0.8;
        }

        // Bounce off the ceiling
        if (ball.y - ball.radius < 0) {
            ball.y = ball.radius;
            ball.dy = -ball.dy;
        }

        // Update obstacles if necessary
        if (Math.abs(ball.dy) <= 0.01) {
            updateObstacles();
        }

        // Collision with obstacles
        obstacles.forEach((obs) => {
            if (!obs.hit && isColliding(ball, obs)) {
                obs.hit = true;
                obs.element.style.visibility = 'hidden'; // Hide the card
                obs.element.style.display = 'none'; // Hide the card
                ball.dy = -Math.abs(ball.dy); // Reverse vertical speed
            }
        });

        // Draw the ball
        drawBall();

        // Check if the ball falls off the screen
        if (ball.y - ball.radius > canvas.height) {
            endGame();
        } else {
            requestAnimationFrame(gameLoop);
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
    }

    function isColliding(ball, obs) {
        const distX = Math.abs(ball.x - obs.x - obs.width / 2);
        const distY = Math.abs(ball.y - obs.y - obs.height / 2);

        if (distX > (obs.width / 2 + ball.radius)) { return false; }
        if (distY > (obs.height / 2 + ball.radius)) { return false; }

        if (distX <= (obs.width / 2)) { return true; }
        if (distY <= (obs.height / 2)) { return true; }

        const dx = distX - obs.width / 2;
        const dy = distY - obs.height / 2;
        return (dx * dx + dy * dy <= (ball.radius * ball.radius));
    }

    function endGame() {
        gameRunning = false;
        canvas.style.display = 'none';
        document.body.style.overflow = '';
        resetObstacles();
        // Show Game Over Message
        const gameOverMessage = document.getElementById('gameOverMessage');
        gameOverMessage.style.display = 'block';
        setTimeout(() => {
            gameOverMessage.style.display = 'none';
        }, 2000); // Hide after 2 seconds
    }

    function resetObstacles() {
        const cards = document.querySelectorAll('.game-card');
        cards.forEach(card => {
            if (card.style && card.style.display === "none") {
                card.style.visibility = 'visible';
                card.style.display = '';
            }
        });
    }
});