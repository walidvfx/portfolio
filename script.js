// Video Slider JavaScript - Version corrigée
document.addEventListener('DOMContentLoaded', function() {
    const sliderTrack = document.querySelector('.slider-track');
    const leftBtn = document.querySelector('.slider-btn.left');
    const rightBtn = document.querySelector('.slider-btn.right');
    const videos = document.querySelectorAll('.work-card video');
    const indicators = document.querySelectorAll('.dot');
    
    let currentSlide = 0;
    const totalSlides = videos.length;
    
    // Vérifier si les éléments existent avant d'initialiser
    if (!sliderTrack || totalSlides === 0) {
        console.warn('Slider elements not found or no videos available');
        return;
    }
    
    // Initialiser le slider
    function initializeSlider() {
        updateButtonVisibility();
        updateSliderPosition();
        updateIndicators();
        pauseAllVideos();
        playCurrentVideo();
    }
    
    // Mettre à jour la position du slider
    function updateSliderPosition() {
        const translateX = -currentSlide * 100;
        sliderTrack.style.transform = `translateX(${translateX}%)`;
    }
    
    // Mettre à jour la visibilité des boutons
    function updateButtonVisibility() {
        if (leftBtn) {
            leftBtn.style.display = currentSlide === 0 ? 'none' : 'flex';
        }
        
        if (rightBtn) {
            rightBtn.style.display = currentSlide === totalSlides - 1 ? 'none' : 'flex';
        }
    }
    
    // Mettre à jour les indicateurs
    function updateIndicators() {
        indicators.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Mettre en pause toutes les vidéos
    function pauseAllVideos() {
        videos.forEach(video => {
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
    }
    
    // Lire la vidéo actuelle
    function playCurrentVideo() {
        const currentVideo = videos[currentSlide];
        if (currentVideo) {
            currentVideo.play().catch(e => {
                console.log('Video autoplay prevented:', e);
            });
        }
    }
    
    // Aller au slide suivant
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlide();
        }
    }
    
    // Aller au slide précédent
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlide();
        }
    }
    
    // Aller à un slide spécifique
    function goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < totalSlides && slideIndex !== currentSlide) {
            currentSlide = slideIndex;
            updateSlide();
        }
    }
    
    // Fonction centralisée pour mettre à jour le slide
    function updateSlide() {
        updateSliderPosition();
        updateButtonVisibility();
        updateIndicators();
        pauseAllVideos();
        playCurrentVideo();
    }
    
    // Event listeners pour les boutons de navigation
    if (rightBtn) {
        rightBtn.addEventListener('click', nextSlide);
    }
    
    if (leftBtn) {
        leftBtn.addEventListener('click', prevSlide);
    }
    
    // Event listeners pour les indicateurs
    indicators.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Navigation au clavier
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowRight':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                prevSlide();
                break;
        }
    });
    
    // Support tactile/swipe pour mobile
    let startX = null;
    let startY = null;
    let isScrolling = false;
    
    sliderTrack.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isScrolling = false;
    }, { passive: true });
    
    sliderTrack.addEventListener('touchmove', function(e) {
        if (!startX || !startY) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = Math.abs(startX - currentX);
        const diffY = Math.abs(startY - currentY);
        
        // Déterminer si c'est un scroll vertical
        if (diffY > diffX) {
            isScrolling = true;
        }
        
        // Empêcher le scroll horizontal si c'est un swipe
        if (!isScrolling && diffX > 10) {
            e.preventDefault();
        }
    });
    
    sliderTrack.addEventListener('touchend', function(e) {
        if (!startX || isScrolling) {
            resetTouch();
            return;
        }
        
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        const threshold = 50; // Distance minimale pour un swipe
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Swipe vers la gauche - slide suivant
                nextSlide();
            } else {
                // Swipe vers la droite - slide précédent
                prevSlide();
            }
        }
        
        resetTouch();
    }, { passive: true });
    
    function resetTouch() {
        startX = null;
        startY = null;
        isScrolling = false;
    }
    
    // Observer d'intersection pour les vidéos
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (!entry.isIntersecting) {
                video.pause();
            }
        });
    }, observerOptions);
    
    // Observer toutes les vidéos
    videos.forEach(video => {
        if (video) {
            videoObserver.observe(video);
        }
    });
    
    // Fonction de nettoyage
    function cleanup() {
        videoObserver.disconnect();
        pauseAllVideos();
    }
    
    // Nettoyage lors du déchargement de la page
    window.addEventListener('beforeunload', cleanup);
    
    // Initialiser le slider
    initializeSlider();
    
    // Auto-advance optionnel (décommentez pour activer)
    /*
    let autoAdvanceInterval;
    
    function startAutoAdvance() {
        autoAdvanceInterval = setInterval(() => {
            if (currentSlide < totalSlides - 1) {
                nextSlide();
            } else {
                goToSlide(0); // Retour au début
            }
        }, 5000); // Changer de slide toutes les 5 secondes
    }
    
    function stopAutoAdvance() {
        if (autoAdvanceInterval) {
            clearInterval(autoAdvanceInterval);
            autoAdvanceInterval = null;
        }
    }
    
    // Démarrer l'auto-advance
    startAutoAdvance();
    
    // Arrêter l'auto-advance sur interaction utilisateur
    [leftBtn, rightBtn, ...indicators].forEach(element => {
        if (element) {
            element.addEventListener('click', () => {
                stopAutoAdvance();
                // Optionnel : redémarrer après un délai
                setTimeout(startAutoAdvance, 10000);
            });
        }
    });
    */
});

// CSS pour les flèches orange (à ajouter dans votre fichier CSS)
const orangeArrowStyles = `
.slider-btn {
    background-color: rgba(255, 165, 0, 0.8) !important;
    color: white !important;
    border: 2px solid #ff8c00 !important;
    transition: all 0.3s ease !important;
    cursor: pointer !important;
}

.slider-btn:hover {
    background-color: rgba(255, 140, 0, 0.9) !important;
    transform: translateY(-50%) scale(1.1) !important;
}

.slider-btn:active {
    transform: translateY(-50%) scale(0.95) !important;
}

.slider-btn:disabled {
    opacity: 0.5 !important;
    cursor: not-allowed !important;
}

.dot {
    cursor: pointer !important;
    transition: all 0.3s ease !important;
}

.dot.active {
    background-color: #ff8c00 !important;
}
`;

// Injecter les styles des flèches orange
if (!document.querySelector('#slider-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'slider-styles';
    styleSheet.textContent = orangeArrowStyles;
    document.head.appendChild(styleSheet);
}
