export function initSiteDirectory() {
    const siteLogos = document.querySelectorAll('.site-logo');
    const body = document.body;
    let directoryOverlay = null;

    function createDirectoryOverlay() {
        const directory = document.createElement('div');
        directory.id = 'siteDirectoryOverlay';

        // Determine initial state based on screen size
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            // Mobile: slide from top
            directory.className = 'fixed left-0 top-0 bg-[#241e1c] transform transition-transform duration-300 z-[61] overflow-y-auto custom-scrollbar hidden ' +
                                  'w-full -translate-y-full rounded-b-xl';
        } else {
            // Desktop: slide from left (no Y transform classes)
            directory.className = 'fixed left-0 top-0 bg-[#241e1c] transform transition-transform duration-300 z-[61] overflow-y-auto custom-scrollbar hidden ' +
                                  'w-64 h-screen rounded-none';
            directory.style.transform = 'translateX(-100%)';
        }

        directory.innerHTML = `
            <div class="px-4 py-8 flex-1 overflow-y-auto">
                <!-- Drag handle for mobile -->
                <div class="md:hidden absolute bottom-0 left-0 right-0 h-8 bg-[#241e1c] flex items-center justify-center cursor-grab active:cursor-grabbing">
                    <div class="h-1 w-12 bg-[#352c26] rounded-full"></div>
                </div>

                <!-- Header matching sidebar -->
                <div class="title-container flex items-center mb-4">
                    <img src="/favicon.ico" alt="Tabac Wiki Leaf" class="directory-logo mr-2 w-10 h-10 cursor-pointer hover:transform hover:scale-110 hover:brightness-110 transition-all duration-300 ease-in-out">
                    <a href="https://tabac.wiki" class="site-title-link hover:transform hover:scale-110 hover:brightness-110 transition-all duration-300 ease-in-out">
                        <img src="/assets/logo.png" alt="Tabac Wiki" class="h-8 w-auto max-w-full object-contain object-left">
                    </a>
                </div>

                <!-- Desktop buttons -->
                <div class="flex justify-center items-stretch gap-2 w-full md:max-w-[200px] mx-auto mb-8">
                    <button id="directoryDonationButton" class="flex-1 bg-[#352c26]/40 hover:bg-[#352c26]/60 text-[#BFB0A3] text-xs font-medium px-3 md:px-1.5 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D6A55] transition-all duration-200 whitespace-nowrap flex items-center justify-center">Support The Wiki</button>
                    <button id="directoryStatusButton" class="flex-1 bg-[#352c26]/40 hover:bg-[#352c26]/60 text-[#BFB0A3] text-xs font-medium px-3 md:px-1.5 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D6A55] transition-all duration-200 whitespace-nowrap flex items-center justify-center">Wiki Report</button>
                    <button id="directoryInfoButton" class="h-[32px] w-[32px] bg-[#352c26]/40 hover:bg-[#352c26]/60 text-[#BFB0A3] text-xs font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D6A55] transition-all duration-200 items-center justify-center flex-shrink-0 flex">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </button>
                </div>


                <nav class="space-y-2">
                    <a href="/" class="block px-3 py-2 rounded-lg hover:bg-[#352c26]/40 transition-colors duration-200">
                        Home (under development)
                    </a>
                    <a href="/main.html" class="block px-3 py-2 rounded-lg hover:bg-[#352c26]/40 transition-colors duration-200">
                        Blend Database
                    </a>
                    <a href="/graphs.html" class="block px-3 py-2 rounded-lg hover:bg-[#352c26]/40 transition-colors duration-200">
                        Blend Graphs
                    </a>
                    <a href="/ytpc.html" class="block px-3 py-2 rounded-lg hover:bg-[#352c26]/40 transition-colors duration-200">
                        YTPC Index
                    </a>
                </nav>
            </div>
        `;

        body.appendChild(directory);
        return directory;
    }

    function setupDirectoryButtons() {
        const donationButton = directoryOverlay.querySelector('#directoryDonationButton');
        const statusButton = directoryOverlay.querySelector('#directoryStatusButton');
        const infoButton = directoryOverlay.querySelector('#directoryInfoButton');
        const directoryLogo = directoryOverlay.querySelector('.directory-logo');

        // Mirror click events from main buttons
        donationButton.addEventListener('click', () => {
            const mainButton = document.querySelector('#donationButton');
            mainButton?.click();
        });

        statusButton.addEventListener('click', () => {
            const mainButton = document.querySelector('#statusButton');
            mainButton?.click();
        });

        infoButton.addEventListener('click', () => {
            const mainButton = document.querySelector('#infoButton');
            mainButton?.click();
        });

        // Make the directory logo close the directory
        directoryLogo.addEventListener('click', hideDirectory);

        // Setup mobile drag-to-close functionality
        setupMobileDrag();
    }

    function setupMobileDrag() {
        const dragHandle = directoryOverlay.querySelector('.md\\:hidden.cursor-grab');
        const scrollableContent = directoryOverlay.querySelector('.overflow-y-auto');

        if (!dragHandle || !scrollableContent) return;

        let startY = 0;
        let currentY = 0;
        let lastTouchTime = Date.now();
        let lastTouchY = 0;
        let touchVelocityY = 0;
        let isDragging = false;
        let isAtBottom = false;

        function checkIfAtBottom() {
            return scrollableContent.scrollHeight - scrollableContent.scrollTop <= scrollableContent.clientHeight + 1;
        }

        scrollableContent.addEventListener('scroll', () => {
            isAtBottom = checkIfAtBottom();
        });

        directoryOverlay.addEventListener('touchstart', (e) => {
            if (window.innerWidth >= 768) return; // Only on mobile

            const touch = e.touches[0];
            startY = touch.clientY;
            currentY = startY;
            lastTouchY = startY;
            lastTouchTime = Date.now();
            touchVelocityY = 0;
            isAtBottom = checkIfAtBottom();

            if (e.target === dragHandle || dragHandle.contains(e.target)) {
                isDragging = true;
                directoryOverlay.style.transition = 'none';
            }
        });

        directoryOverlay.addEventListener('touchmove', (e) => {
            if (window.innerWidth >= 768) return; // Only on mobile

            const touch = e.touches[0];
            currentY = touch.clientY;
            const now = Date.now();
            const timeDiff = now - lastTouchTime;
            const moveDiff = currentY - lastTouchY;

            if (timeDiff > 0) {
                touchVelocityY = moveDiff / timeDiff;
            }

            if (isDragging) {
                e.preventDefault();
                const deltaY = currentY - startY;
                if (deltaY <= 0) { // Drag up to close
                    directoryOverlay.style.transform = `translateY(${deltaY}px)`;
                }
            } else {
                // Handle scrolling at top
                if (scrollableContent.scrollTop === 0 && moveDiff > 0) {
                    e.preventDefault();
                }
            }

            lastTouchY = currentY;
            lastTouchTime = now;
        }, { passive: false });

        directoryOverlay.addEventListener('touchend', () => {
            if (window.innerWidth >= 768) return; // Only on mobile

            if (isDragging) {
                directoryOverlay.style.transition = 'transform 0.2s ease-out';

                const deltaY = currentY - startY;
                const velocityThreshold = 0.5;

                if (deltaY < -100 || touchVelocityY < -velocityThreshold) {
                    // Close the directory
                    const duration = Math.min(300, Math.max(150, Math.abs(1000 / touchVelocityY)));
                    directoryOverlay.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                    hideDirectory();
                } else {
                    // Snap back
                    directoryOverlay.style.transform = 'translateY(0)';
                }
            }

            isDragging = false;
        });
    }

    function toggleDirectory(event) {
        event.preventDefault();

        if (!directoryOverlay) {
            directoryOverlay = createDirectoryOverlay();
            setupDirectoryButtons();

            // Add click handler for the document to close when clicking outside
            document.addEventListener('click', (e) => {
                const isMobile = window.innerWidth < 768;
                const isOpen = isMobile ?
                    directoryOverlay.classList.contains('translate-y-0') :
                    directoryOverlay.classList.contains('translate-x-0');

                if (isOpen &&
                    !directoryOverlay.contains(e.target) &&
                    !e.target.classList.contains('site-logo') &&
                    !e.target.closest('#mobileHeader')) {
                    hideDirectory();
                }
            });
        }

        // Show directory
        directoryOverlay.classList.remove('hidden');

        // Force reflow to ensure transitions work properly
        directoryOverlay.offsetHeight;

        setTimeout(() => {
            const isMobile = window.innerWidth < 768;

            if (isMobile) {
                // Mobile: slide from top - use classes only
                directoryOverlay.style.transform = ''; // Clear any inline styles
                directoryOverlay.style.transition = 'transform 0.3s ease-out'; // Ensure transition is set
                directoryOverlay.classList.remove('-translate-y-full');
                directoryOverlay.classList.add('translate-y-0');
            } else {
                // Desktop: slide from left - use inline styles
                // Clear any mobile classes first
                directoryOverlay.classList.remove('-translate-y-full', 'translate-y-0');
                directoryOverlay.style.transition = 'transform 0.3s ease-out';
                directoryOverlay.style.transform = 'translateX(0)';
            }
        }, 10);
    }

    function hideDirectory() {
        if (directoryOverlay) {
            const isMobile = window.innerWidth < 768;

            if (isMobile) {
                // Mobile: slide to top
                directoryOverlay.style.transform = ''; // Clear any inline styles
                directoryOverlay.style.transition = 'transform 0.3s ease-out';
                directoryOverlay.classList.remove('translate-y-0');
                directoryOverlay.classList.add('-translate-y-full');
            } else {
                // Desktop: slide to left
                // Clear any mobile classes first
                directoryOverlay.classList.remove('-translate-y-full', 'translate-y-0');
                directoryOverlay.style.transition = 'transform 0.3s ease-out';
                directoryOverlay.style.transform = 'translateX(-100%)';
            }

            setTimeout(() => {
                directoryOverlay.classList.add('hidden');
            }, 300);
        }
    }

    // Add click handlers to all site logos
    siteLogos.forEach(logo => {
        logo.addEventListener('click', toggleDirectory);
    });
}
