// Video Slider JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const sliderTrack = document.querySelector('.slider-track');
    const leftBtn = document.querySelector('.slider-btn.left');
    const rightBtn = document.querySelector('.slider-btn.right');
    const videos = document.querySelectorAll('.work-card video');
    const indicators = document.querySelectorAll('.dot');
    
    let currentSlide = 0;
    const totalSlides = videos.length;
    
    // Initialize: Hide left button, show right button
    function initializeSlider() {
        leftBtn.style.display = 'none';
        rightBtn.style.display = 'flex';
        updateSliderPosition();
        updateIndicators();
        pauseAllVideos();
        playCurrentVideo();
    }
    
    // Update slider position
    function updateSliderPosition() {
        const translateX = -currentSlide * (100 / totalSlides);
        sliderTrack.style.transform = `translateX(${translateX}%)`;
    }
    
    // Update button visibility
    function updateButtonVisibility() {
        // Show/hide left button
        if (currentSlide === 0) {
            leftBtn.style.display = 'none';
        } else {
            leftBtn.style.display = 'flex';
        }
        
        // Show/hide right button
        if (currentSlide === totalSlides - 1) {
            rightBtn.style.display = 'none';
        } else {
            rightBtn.style.display = 'flex';
        }
    }
    
    // Update indicators
    function updateIndicators() {
        indicators.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Pause all videos
    function pauseAllVideos() {
        videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
    }
    
    // Play current video
    function playCurrentVideo() {
        if (videos[currentSlide]) {
            videos[currentSlide].play().catch(e => {
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
    if (rightBtn) {
        rightBtn.addEventListener('click', nextSlide);
    }
    
    if (leftBtn) {
        leftBtn.addEventListener('click', prevSlide);
    }
    
    // Event listeners for indicators
    indicators.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
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
    let currentX = null;
    
    sliderTrack.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    });
    
    sliderTrack.addEventListener('touchmove', function(e) {
        currentX = e.touches[0].clientX;
    });
    
    sliderTrack.addEventListener('touchend', function(e) {
        if (!startX || !currentX) return;
        
        const diffX = startX - currentX;
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
        currentX = null;
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
    videos.forEach(video => {
        videoObserver.observe(video);
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

// CSS for orange arrows (add this to your CSS file)
const orangeArrowStyles = `
.slider-btn {
    background-color: rgba(255, 165, 0, 0.8) !important;
    color: white !important;
    border: 2px solid #ff8c00 !important;
}

.slider-btn:hover {
    background-color: rgba(255, 140, 0, 0.9) !important;
    transform: translateY(-50%) scale(1.1) !important;
}

.slider-btn.left {
    display: none;
}

.slider-btn.right {
    display: flex;
}
`;

// Inject orange arrow styles
const styleSheet = document.createElement('style');
styleSheet.textContent = orangeArrowStyles;
document.head.appendChild(styleSheet);