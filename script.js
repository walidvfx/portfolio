// Video Slider JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const sliderTrack = document.querySelector('.slider-track');
    const leftBtn = document.querySelector('.slider-btn.left');
    const rightBtn = document.querySelector('.slider-btn.right');
    const workCards = document.querySelectorAll('.work-card');
    const indicatorsContainer = document.getElementById('indicators');
    
    let currentSlide = 0;
    const totalSlides = workCards.length;
    
    // Créer les indicateurs dynamiquement
    function createIndicators() {
        indicatorsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(dot);
        }
    }
    
    // Initialize: Hide left button, show right button
    function initializeSlider() {
        createIndicators();
        leftBtn.style.display = 'none';
        if (totalSlides <= 1) {
            rightBtn.style.display = 'none';
        } else {
            rightBtn.style.display = 'flex';
        }
        updateSliderPosition();
        pauseAllVideos();
        playCurrentVideo();
    }
    
    // Update slider position
    function updateSliderPosition() {
        const translateX = -currentSlide * 100;
        sliderTrack.style.transform = `translateX(${translateX}%)`;
    }
    
    // Update button visibility
    function updateButtonVisibility() {
        leftBtn.style.display = currentSlide === 0 ? 'none' : 'flex';
        rightBtn.style.display = currentSlide === totalSlides - 1 ? 'none' : 'flex';
    }
    
    // Update indicators
    function updateIndicators() {
        const dots = indicatorsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Pause all videos
    function pauseAllVideos() {
        workCards.forEach(card => {
            const video = card.querySelector('video');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
    }
    
    // Play current video
    function playCurrentVideo() {
        const currentCard = workCards[currentSlide];
        const video = currentCard.querySelector('video');
        if (video) {
            video.play().catch(e => {
                console.log('Video autoplay prevented:', e);
            });
        }
    }
    
    // Move to next slide
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSliderPosition();
            updateButtonVisibility();
            updateIndicators();
            pauseAllVideos();
            playCurrentVideo();
        }
    }
    
    // Move to previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSliderPosition();
            updateButtonVisibility();
            updateIndicators();
            pauseAllVideos();
            playCurrentVideo();
        }
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < totalSlides) {
            currentSlide = slideIndex;
            updateSliderPosition();
            updateButtonVisibility();
            updateIndicators();
            pauseAllVideos();
            playCurrentVideo();
        }
    }
    
    // Event listeners for arrow buttons
    rightBtn.addEventListener('click', nextSlide);
    leftBtn.addEventListener('click', prevSlide);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });
    
    // Touch/swipe support for mobile
    let startX = null;
    
    sliderTrack.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    sliderTrack.addEventListener('touchend', function(e) {
        if (!startX) return;
        
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        const threshold = 50; // minimum swipe distance
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
        }
        
        startX = null;
    });
    
    // Auto-pause videos when they're not visible
    const observerOptions = {
        threshold: 0.5
    };
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (!entry.isIntersecting) {
                video.pause();
            }
        });
    }, observerOptions);
    
    // Observe all videos
    workCards.forEach(card => {
        const video = card.querySelector('video');
        if (video) {
            videoObserver.observe(video);
        }
    });
    
    // Initialize the slider
    initializeSlider();
    
    // Optional: Auto-advance slides (uncomment to enable)
    /*
    setInterval(() => {
        if (currentSlide < totalSlides - 1) {
            nextSlide();
        } else {
            currentSlide = -1; // Will be incremented to 0
            nextSlide();
        }
    }, 5000); // Change slide every 5 seconds
    */
});
