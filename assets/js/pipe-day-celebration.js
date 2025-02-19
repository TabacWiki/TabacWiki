const pipeDayCelebration = {
    init() {
        const today = new Date();
        const month = today.getMonth();
        const day = today.getDate();
        const celebrationKey = `pipe-day-celebrated-${today.getFullYear()}`;
        
        if (month === 1 && day === 20 && !localStorage.getItem(celebrationKey)) {
            this.startEffects();
            localStorage.setItem(celebrationKey, 'true');
        }
    },

    startEffects() {
        this.createFirework();
    },

    createFirework() {
        const fireworkContainer = document.createElement('div');
        fireworkContainer.id = 'firework-container';
        document.body.appendChild(fireworkContainer);

        const initialParticle = document.createElement('div');
        initialParticle.className = 'initial-firework';
        fireworkContainer.appendChild(initialParticle);

        // When the initial particle reaches its destination, create the burst
        initialParticle.addEventListener('animationend', () => {
            initialParticle.remove();
            this.createFireworkBurst();
            this.createCloudEffect();
            this.createConfetti();
            this.showMessage();
        });
    },

    createFireworkBurst() {
        const burstContainer = document.createElement('div');
        burstContainer.id = 'burst-container';
        document.body.appendChild(burstContainer);

        const particleCount = 30;
        const colors = ['#FF9999', '#85A5FF', '#90EE90', '#FFB366', '#FFD700', '#FF69B4'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'burst-particle';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Calculate angle for circular burst
            const angle = (i * 360) / particleCount;
            particle.style.transform = `rotate(${angle}deg)`;
            
            burstContainer.appendChild(particle);
        }

        setTimeout(() => {
            burstContainer.remove();
        }, 2000);
    },

    createCloudEffect() {
        const cloudOverlay = document.createElement('div');
        cloudOverlay.id = 'cloud-overlay';
        document.body.appendChild(cloudOverlay);

        const cloudCount = 20;
        for (let i = 0; i < cloudCount; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cartoon-cloud';
            cloud.style.left = `${Math.random() * 120 - 10}vw`;
            cloud.style.bottom = `-${Math.random() * 40 + 20}vh`;
            const scale = Math.random() * 1.2 + 0.3;
            cloud.style.transform = `scale(${scale})`;
            const duration = Math.random() * 2 + 3;
            cloud.style.animationDuration = `${duration}s`;
            cloud.style.animationDelay = `${Math.random() * 1.5}s`;
            cloudOverlay.appendChild(cloud);
        }
        
        setTimeout(() => {
            cloudOverlay.remove();
        }, 6000);
    },

    createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.id = 'confetti-container';
        document.body.appendChild(confettiContainer);

        const colors = ['#FF9999', '#85A5FF', '#90EE90', '#FFB366', '#FFD700', '#FF69B4'];
        const particleCount = 75;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'pipe-day-particle';
            const size = Math.random() * 8 + 4;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = `-${Math.random() * 20}vh`;
            const duration = Math.random() * 2 + 3;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${Math.random()}s`;
            confettiContainer.appendChild(particle);
            
            particle.addEventListener('animationend', () => particle.remove());
        }
        
        setTimeout(() => {
            confettiContainer.remove();
        }, 6000);
    },

    showMessage() {
        // Create particle burst container
        const particleContainer = document.createElement('div');
        particleContainer.className = 'message-particles';
        document.body.appendChild(particleContainer);

        // Create particles with random properties
        const particleCount = 40;
        const colors = ['#E6D5C9', '#C89F65', '#7D6A55', '#FFD700'];
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'message-particle';
            
            // Random color with golden spark emphasis
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Random size for each particle
            const size = 4 + Math.random() * 4;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random trajectory and speed
            const angle = Math.random() * 360;
            const distance = 80 + Math.random() * 60;
            const duration = 0.6 + Math.random() * 0.4;
            
            particle.style.setProperty('--angle', `${angle}deg`);
            particle.style.setProperty('--distance', `${distance}px`);
            particle.style.setProperty('--duration', `${duration}s`);
            
            particleContainer.appendChild(particle);
        }

        // Create message
        const message = document.createElement('div');
        message.className = 'pipe-day-message';
        
        const subtext = document.createElement('div');
        subtext.className = 'message-subtext';
        subtext.innerText = 'With a warm welcome from the Tabac Wiki team,';
        
        const mainText = document.createElement('div');
        mainText.className = 'message-main-text';
        mainText.innerText = 'Happy International Pipe Smoking Day!';
        
        message.appendChild(subtext);
        message.appendChild(mainText);
        document.body.appendChild(message);

        // Remove message after delay
        setTimeout(() => {
            message.classList.add('fade-out');
        }, 3500);

        // Cleanup
        message.addEventListener('animationend', (e) => {
            if (e.animationName === 'message-popup-out') {
                message.remove();
            }
        });

        // Remove particle container after explosion animation
        setTimeout(() => {
            particleContainer.remove();
        }, 2000);
    }
};

document.addEventListener('DOMContentLoaded', () => pipeDayCelebration.init());

const style = document.createElement('style');
style.textContent = `
    #cloud-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        pointer-events: none;
        overflow: hidden;
    }
    
    .cartoon-cloud {
        position: absolute;
        background: #fff;
        border-radius: 50%;
        width: 120px;
        height: 70px;
        opacity: 0.9;
        animation: cloud-puff-up cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    .cartoon-cloud::before,
    .cartoon-cloud::after {
        content: '';
        position: absolute;
        background: #fff;
        border-radius: 50%;
    }

    .cartoon-cloud::before {
        width: 80px;
        height: 80px;
        top: -40px;
        left: 10px;
    }

    .cartoon-cloud::after {
        width: 60px;
        height: 60px;
        top: -30px;
        right: 10px;
    }

    #firework-container {
        position: fixed;
        bottom: 0;
        left: 50%;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 10001;
    }

    .initial-firework {
        position: absolute;
        width: 6px;
        height: 6px;
        background: #FFD700;
        border-radius: 50%;
        bottom: 0;
        left: 0;
        transform: translateX(-50%);
        animation: shoot-up 1s cubic-bezier(0.2, 0, 0.2, 1) forwards;
    }

    #burst-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 2px;
        height: 2px;
        pointer-events: none;
        z-index: 10001;
    }

    .burst-particle {
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        transform-origin: center;
        animation: burst 0.8s cubic-bezier(0.2, 0, 0.2, 1) forwards;
    }

    @keyframes shoot-up {
        0% {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateX(-50%) translateY(-50vh);
            opacity: 0;
        }
    }

    @keyframes burst {
        0% {
            transform: rotate(var(--angle)) translateY(0px);
            opacity: 1;
        }
        100% {
            transform: rotate(var(--angle)) translateY(100px);
            opacity: 0;
        }
    }
    
    @keyframes cloud-puff-up {
        0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
        }
        30% {
            opacity: 0.8;
        }
        60% {
            opacity: 0.6;
        }
        100% {
            transform: translateY(-25vh) scale(1.1);
            opacity: 0;
        }
    }
    
    #confetti-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
        z-index: 9999;
    }
    
    .pipe-day-particle {
        position: absolute;
        opacity: 0.8;
        border-radius: 50%;
        animation: confetti-fall ease-in forwards;
    }
    
    @keyframes confetti-fall {
        0% {
            transform: translateY(0) rotate(0);
            opacity: 0.8;
        }
        100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    .pipe-day-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        font-family: system-ui, -apple-system, sans-serif;
        color: #E6D5C9;
        background: rgba(53, 44, 38, 0.95);
        padding: 20px;
        border-radius: 8px;
        border: 1px solid #4b3f38;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        z-index: 10002;
        opacity: 0;
        text-align: center;
        animation: message-popup 0.5s cubic-bezier(0.17, 0.89, 0.32, 1.49) forwards;
        transition: opacity 1s ease-out, transform 1s ease-out;
        max-width: 90vw;
        width: 500px;
        margin: 0 auto;
    }

    .message-subtext {
        font-size: clamp(0.875rem, 2.5vw, 1rem);
        color: #BFB0A3;
        margin-bottom: 8px;
        padding: 0 10px;
        line-height: 1.4;
    }

    .message-main-text {
        font-size: clamp(1.25rem, 5vw, 2rem);
        line-height: 1.3;
        padding: 0 10px;
    }

    @media (max-width: 480px) {
        .pipe-day-message {
            padding: 16px;
        }
        .message-subtext {
            margin-bottom: 12px;
        }
    }

    .pipe-day-message.fade-out {
        animation: message-popup-out 0.5s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards;
    }

    @keyframes message-popup-out {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
        }
    }

    .message-particles {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        pointer-events: none;
    }

    .message-particle {
        position: absolute;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        opacity: 0;
        transform-origin: center;
        animation: particle-burst var(--duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }

    @keyframes particle-burst {
        0% {
            opacity: 1;
            transform: rotate(var(--angle)) translateY(0);
        }
        15% {
            opacity: 1;
        }
        60% {
            opacity: 0.4;
        }
        100% {
            opacity: 0;
            transform: rotate(var(--angle)) translateY(var(--distance));
        }
    }

    @keyframes message-popup {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
        }
        70% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;
document.head.appendChild(style);