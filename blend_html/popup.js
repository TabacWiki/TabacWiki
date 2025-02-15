// Standard Rating Scales
const RATING_SCALES = {
    strength: {
        scale: [
            "Extremely Mild", "Very Mild", "Mild", "Mild to Medium", 
            "Medium", "Medium to Strong", "Strong", "Very Strong", 
            "Extremely Strong", "Overwhelming"
        ]
    },
    taste: {
        scale: [
            "Extremely Mild", "Very Mild", "Mild", "Mild to Medium", 
            "Medium", "Medium to Full", "Full", "Very Full", 
            "Extra Full", "Overwhelming"
        ]
    },
    flavoring: {
        scale: [
            "None Detected", "Extremely Mild", "Very Mild", "Mild", 
            "Mild to Medium", "Medium", "Medium to Strong", "Strong", 
            "Very Strong", "Overwhelming"
        ]
    },
    roomNote: {
        scale: [
            "Unnoticeable", "Pleasant", "Very Pleasant", "Pleasant to Tolerable", 
            "Tolerable", "Tolerable to Strong", "Strong", "Very Strong", 
            "Extra Strong", "Overwhelming"
        ]
    }
};

// Track current blend, available blends, and page info for navigation
let currentBlendIndex = -1;
let availableBlends = [];
let currentPage = 1;
let totalPages = 1;
let blendsPerPage = 12; // Assuming 12 blends per page

// Function to sync pagination state based on current blend index
function syncPaginationState() {
    if (currentBlendIndex >= 0) {
        currentPage = Math.floor(currentBlendIndex / blendsPerPage) + 1;
    }
}

// Keyboard navigation handler
function handleKeyNavigation(event) {
    if (event.key === 'ArrowLeft') {
        window.popupModule.navigateBlend('prev');
    } else if (event.key === 'ArrowRight') {
        window.popupModule.navigateBlend('next');
    } else if (event.key === 'Escape') {
        // Get the blend popup
        const blendPopup = document.getElementById('blendPopup');
        if (blendPopup) {
            // Smooth fade-out before closing
            blendPopup.style.opacity = '0';
            blendPopup.style.transition = 'opacity 0.2s ease-out';
            
            setTimeout(() => {
                window.popupModule.closePopup();
            }, 200);
        }
    }
}

// Popup Functionality
async function loadBlendData(filename) {
    try {
        console.group(`Loading Blend Data: ${filename}`);
        console.time('Blend Data Load Time');

        // Encode the filename to handle special characters
        const encodedFilename = encodeURIComponent(filename);
        const response = await fetch(`/blend_data/${encodedFilename}`);
        
        // Check if response is successful
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}, path: /blend_data/${encodedFilename}`);
            throw new Error(`HTTP error! status: ${response.status}, path: /blend_data/${encodedFilename}`);
        }
        
        const jsonData = await response.json();
        console.log('Raw JSON Data:', jsonData);
        
        // Get the first (and only) key's value
        const blendKey = Object.keys(jsonData)[0];
        const originalBlendData = jsonData[blendKey];
        
        // Validate blendData
        if (!originalBlendData || typeof originalBlendData !== 'object') {
            console.warn(`Invalid blend data in ${filename}`);
            return null;
        }

        // Return blend details with additional metadata
        const processedBlendData = { 
            filename: filename,
            name: originalBlendData.name || 'Unnamed Blend',
            blender: originalBlendData.blender || 'Unknown',
            blendedBy: originalBlendData.blendedBy || originalBlendData.blender || 'Unknown',
            manufacturedBy: originalBlendData.manufacturedBy || originalBlendData.blender || 'Unknown',
            blendType: originalBlendData.blendType || 'Unspecified',
            description: originalBlendData.description || '',
            searchText: `${filename} ${originalBlendData.name} ${originalBlendData.blender} ${originalBlendData.blendType}`.toLowerCase(),
            averageRating: originalBlendData.averageRating || 0,
            reviewCount: originalBlendData.reviewCount || 0,
            imagePath: originalBlendData.imagePath || '',
            contents: originalBlendData.contents || '',
            cut: originalBlendData.cut || '',
            packaging: originalBlendData.packaging || '',
            country: originalBlendData.country || '',
            production: originalBlendData.production || '',
            flavoring: originalBlendData.flavoring || 'None',
            ratings: originalBlendData.ratings || {}
        };

        console.timeEnd('Blend Data Load Time');
        console.groupEnd();

        return processedBlendData;
    } catch (error) {
        console.error(`Error loading blend file ${filename}:`, error);
        console.groupEnd();
        return null;
    }
}

function createRatingScale(ratingType, blendRating) {
    const scaleContainer = document.createElement('div');
    scaleContainer.className = 'flex justify-center'; // Removed margin bottom
    
    const scaleWrapper = document.createElement('div');
    scaleWrapper.className = 'flex justify-between text-sm text-[#8E8074] relative bg-[#362C29]/0 rounded-lg p-2'; 
    scaleWrapper.style.width = '92%';

    const scaleData = RATING_SCALES[ratingType];

    // First pass: Create unselected labels
    scaleData.scale.forEach((label, index) => {
        if (label !== blendRating.level) {
            const dotPosition = (index / (scaleData.scale.length - 1)) * 100;
            
            const dotLabelContainer = document.createElement('div');
            dotLabelContainer.className = 'absolute';
            dotLabelContainer.style.left = `${dotPosition}%`;
            dotLabelContainer.style.transform = 'translateX(-50%)';
            dotLabelContainer.style.width = 'max-content';
            dotLabelContainer.style.textAlign = 'center';
            dotLabelContainer.style.zIndex = '1';
            
            // Dot
            const dot = document.createElement('div');
            dot.className = 'w-5 h-5 rounded-full mx-auto bg-[#8E8074]/40'; // More transparent

            // Label
            const labelText = document.createElement('span');
            labelText.className = 'block text-center mt-3 whitespace-nowrap text-[#8E8074]/40'; // More transparent
            labelText.style.fontSize = '95%';
            labelText.textContent = label;

            dotLabelContainer.appendChild(dot);
            dotLabelContainer.appendChild(labelText);
            scaleWrapper.appendChild(dotLabelContainer);
        }
    });

    // Second pass: Create selected label (on top)
    scaleData.scale.forEach((label, index) => {
        if (label === blendRating.level) {
            const dotPosition = (index / (scaleData.scale.length - 1)) * 100;
            
            const dotLabelContainer = document.createElement('div');
            dotLabelContainer.className = 'absolute';
            dotLabelContainer.style.left = `${dotPosition}%`;
            dotLabelContainer.style.transform = 'translateX(-50%)';
            dotLabelContainer.style.width = 'max-content';
            dotLabelContainer.style.textAlign = 'center';
            dotLabelContainer.style.zIndex = '10';
            
            // Dot
            const dot = document.createElement('div');
            dot.className = 'w-5 h-5 rounded-full mx-auto bg-[#aa8a3f]';

            // Label Container
            const labelContainer = document.createElement('div');
            labelContainer.className = 'relative';
            
            // Background that cuts through other text
            const labelBackground = document.createElement('div');
            labelBackground.className = 'absolute inset-0 -mx-2 bg-[#362C29]/0 rounded-md py-0.5';
            labelContainer.appendChild(labelBackground);
            
            // Label text
            const labelText = document.createElement('span');
            labelText.className = 'relative block text-center mt-3 whitespace-nowrap text-[#aa8a3f] font-bold px-1';
            labelText.style.fontSize = '100%';
            labelText.textContent = label;
            labelContainer.appendChild(labelText);

            dotLabelContainer.appendChild(dot);
            dotLabelContainer.appendChild(labelContainer);
            scaleWrapper.appendChild(dotLabelContainer);
        }
    });

    scaleContainer.appendChild(scaleWrapper);
    return scaleContainer;
}

async function renderBlendPopup(blendKey) {
    try {
        // Remove any existing popup first
        const existingPopup = document.getElementById('blendPopup');
        if (existingPopup) {
            existingPopup.remove();
        }

        // Update available blends if not already set
        if (availableBlends.length === 0) {
            const blendElements = document.querySelectorAll('[data-blend-key]');
            // Convert to array and maintain the order from the DOM
            availableBlends = Array.from(blendElements)
                .sort((a, b) => {
                    const aOrder = parseInt(a.getAttribute('data-order') || '0');
                    const bOrder = parseInt(b.getAttribute('data-order') || '0');
                    return aOrder - bOrder;
                })
                .map(el => el.getAttribute('data-blend-key'));
            
            // Calculate total pages
            totalPages = Math.ceil(availableBlends.length / blendsPerPage);
        }
        
        // Find the index of the current blend
        currentBlendIndex = availableBlends.indexOf(blendKey);
        
        // Sync pagination state with current blend
        syncPaginationState();
        
        const blendPopup = document.createElement('div');
        blendPopup.id = 'blendPopup';
        blendPopup.className = 'fixed top-0 left-0 w-full h-full bg-black/85 flex justify-center items-center z-[1000]';
        document.body.appendChild(blendPopup);

        const popupContent = document.createElement('div');
        popupContent.id = 'popupContent';
        popupContent.className = 'max-w-7xl mx-auto overflow-visible';
        blendPopup.appendChild(popupContent);
        
        // Add click event listener to close popup when clicking outside content
        blendPopup.addEventListener('mousedown', (event) => {
            // Stop propagation for popup content to prevent closing when clicking inside
            popupContent.addEventListener('mousedown', (e) => {
                e.stopPropagation();
            });

            // Close popup if click is on the background
            if (event.target === blendPopup) {
                // Smooth fade-out before closing
                blendPopup.style.opacity = '0';
                blendPopup.style.transition = 'opacity 0.2s ease-out';
                
                setTimeout(() => {
                    closePopup();
                }, 200);
            }
        });
        
        // Clear previous content and show loading state
        popupContent.innerHTML = `
            <div class="flex justify-center items-center h-full p-6">
                <div class="animate-pulse text-[#C89F65]">Loading blend details...</div>
            </div>
        `;

        // Show the popup immediately
        blendPopup.classList.remove('hidden');
        
        // Add keyboard navigation
        document.addEventListener('keydown', handleKeyNavigation);

        try {
            // Dynamically load blend data
            const blend = await loadBlendData(blendKey);

            if (!blend) {
                popupContent.innerHTML = `
                    <div class="text-center text-[#C89F65] p-6">
                        <h2 class="text-2xl mb-4">Blend Not Found</h2>
                        <p>Unable to load details for the selected blend.</p>
                        <button onclick="window.popupModule.closePopup()" class="mt-4 px-4 py-2 bg-[#C89F65] text-[#E8DCD1] rounded">Close</button>
                    </div>
                `;
                return;
            }

            // Determine image path with robust fallback
            const imagePath = blend.imagePath && blend.imagePath.trim() !== '' 
                ? blend.imagePath 
                : '/blend_pictures/pictureless.jpg';

            // Create main content structure
            popupContent.innerHTML = `
                <div class="relative bg-[#241e1c] rounded-xl shadow-2xl max-w-7xl mx-auto overflow-visible">
                    <!-- Navigation buttons -->
                    <button onclick="window.popupModule.navigateBlend('prev')" 
                        class="absolute top-1/2 -left-16 -translate-y-1/2 text-[#8E8074] hover:text-[#C89F65] p-3 z-[1000] bg-[#352c26]/40 rounded-full hover:bg-[#49362F] transition-all duration-200 backdrop-blur-sm shadow-lg">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <button onclick="window.popupModule.navigateBlend('next')" 
                        class="absolute top-1/2 -right-16 -translate-y-1/2 text-[#8E8074] hover:text-[#C89F65] p-3 z-[1000] bg-[#352c26]/40 rounded-full hover:bg-[#49362F] transition-all duration-200 backdrop-blur-sm shadow-lg">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                    
                    <div class="flex flex-col gap-8 p-8">
                        <!-- Header Section with Title and Image -->
                        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <!-- Left Column with Title -->
                            <div class="lg:col-span-9 text-[#D6B680]">
                                <div class="mb-8">
                                    <div class="text-[#C89F65] text-lg mb-2 font-medium">${blend.blender}</div>
                                    <h2 class="text-3xl font-bold text-[#8E8074] mb-4">${blend.name}</h2>
                                    <p class="text-[#7c6f57] leading-relaxed text-lg">
                                        ${blend.description || 'No description available.'}
                                    </p>
                                </div>
                            </div>

                            <!-- Right Column - Image -->
                            <div class="lg:col-span-3">
                                <div class="sticky top-8">
                                    <form 
                                        style="margin: 0; padding: 0;"
                                        id="imageUploadForm"
                                        onsubmit="event.preventDefault();"
                                    >
                                        <input 
                                            type="file" 
                                            name="attachment" 
                                            accept="image/*" 
                                            style="display: none;" 
                                            id="imageInput"
                                            max="10485760"
                                        >
                                        <input type="hidden" name="_subject" value="${blend.name} - New Blend Picture">
                                        <input type="hidden" name="_template" value="table">
                                        <input type="hidden" name="blend_name" value="${blend.name}">
                                        <input type="hidden" name="blend_key" value="${blendKey}">
                                        <input type="hidden" name="blender" value="${blend.blender}">
                                        <input type="hidden" name="current_time" value="${new Date().toISOString()}">
                                        <div class="upload-container">
                                            <label for="imageInput" class="block cursor-pointer">
                                                <div class="upload-hover-banner">Submit a photo!</div>
                                            </label>
                                            <img 
                                                src="${imagePath}" 
                                                alt="${blend.name}" 
                                                class="w-full rounded-xl shadow-2xl border border-[#28201E]/50 object-cover aspect-square transition-opacity duration-200 cursor-pointer hover:opacity-80"
                                                onclick="document.getElementById('imageInput').click()"
                                                title="Click to upload a new picture"
                                                onerror="this.onerror=null; this.src='/blend_pictures/pictureless.jpg';"
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <!-- Blend Details Section -->
                        <div class="bg-[#161413]/20 rounded-xl p-6 backdrop-blur-sm w-full">
                            <h3 class="font-semibold mb-6 text-[#BDAE9F] text-lg">Blend Details</h3>
                            <div class="grid grid-cols-2 gap-4 text-base">
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3 flex justify-between items-center">
                                    <span class="text-[#8E8074]">Blend Type</span>
                                    <span class="text-[#BDAE9F] font-medium">${blend.blendType || 'Not specified'}</span>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3 flex justify-between items-center">
                                    <span class="text-[#8E8074]">Blended By</span>
                                    <span class="text-[#BDAE9F] font-medium">${blend.blendedBy}</span>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3 flex justify-between items-center">
                                    <span class="text-[#8E8074]">Contents</span>
                                    <span class="text-[#BDAE9F] font-medium">${blend.contents || 'Not specified'}</span>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3 flex justify-between items-center">
                                    <span class="text-[#8E8074]">Manufactured By</span>
                                    <span class="text-[#BDAE9F] font-medium">${blend.manufacturedBy}</span>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3 flex justify-between items-center">
                                    <span class="text-[#8E8074]">Flavoring</span>
                                    <span class="text-[#BDAE9F] font-medium">${blend.flavoring}</span>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3 flex justify-between items-center">
                                    <span class="text-[#8E8074]">Country</span>
                                    <span class="text-[#BDAE9F] font-medium">${blend.country || 'Not specified'}</span>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3 flex justify-between items-center">
                                    <span class="text-[#8E8074]">Cut</span>
                                    <span class="text-[#BDAE9F] font-medium">${blend.cut || 'Not specified'}</span>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3 flex justify-between items-center">
                                    <span class="text-[#8E8074]">Production</span>
                                    <span class="text-[#BDAE9F] font-medium">${blend.production || 'Not specified'}</span>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3 flex justify-between items-center">
                                    <span class="text-[#8E8074]">Packaging</span>
                                    <span class="text-[#BDAE9F] font-medium">${blend.packaging || 'Not specified'}</span>
                                </div>
                                ${blend.averageRating ? `
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3 flex justify-between items-center">
                                    <span class="text-[#8E8074]">Average Rating</span>
                                    <div class="text-[#BDAE9F] font-medium flex items-center gap-2">
                                        <span class="text-[#aa8a3f]">★</span>
                                        ${blend.averageRating.toFixed(1)}
                                        <span class="text-sm text-[#8E8074]">(${blend.reviewCount} ratings)</span>
                                    </div>
                                </div>
                                ` : ''}
                            </div>
                        </div>

                        <!-- Profile Ratings Section -->
                        <div class="bg-[#161413]/20 rounded-xl p-6 backdrop-blur-sm w-full">
                            <h3 class="font-semibold mb-6 text-[#BDAE9F] text-lg">Profile Ratings</h3>
                            <div class="grid grid-cols-1 gap-3">
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3">
                                    <h4 class="text-[#8E8074] font-medium mb-3">Strength</h4>
                                    <div id="strengthScale" class="h-[52px]"></div>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3">
                                    <h4 class="text-[#8E8074] font-medium mb-3">Taste</h4>
                                    <div id="tasteScale" class="h-[52px]"></div>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3">
                                    <h4 class="text-[#8E8074] font-medium mb-3">Flavoring</h4>
                                    <div id="flavoringScale" class="h-[52px]"></div>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3">
                                    <h4 class="text-[#8E8074] font-medium mb-3">Room Note</h4>
                                    <div id="roomNoteScale" class="h-[52px]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

        // Trigger multiple scaling events for robust rendering
        setTimeout(scalePopupContent, 50);  // Immediate short delay
        setTimeout(scalePopupContent, 200);  // Longer delay for complex content
        window.addEventListener('resize', scalePopupContent);  // Window resize listener
        
        // Mutation observer to catch dynamic content changes
        const contentObserver = new MutationObserver(scalePopupContent);
        contentObserver.observe(popupContent, { 
            childList: true, 
            subtree: true, 
            characterData: true 
        });

        // Add hover effect to images
        const popupImages = popupContent.querySelectorAll('img');
        /**
         * Adds transition and hover effect classes to each image element.
         * 
         * This ensures that when a user hovers over an image, 
         * it gradually changes its opacity for a smooth visual effect.
         */
        popupImages.forEach(img => {
            img.classList.add('transition-all', 'duration-300', 'ease-in-out', 'hover:opacity-90');
        });

        // Set up image upload handler
        const imageInput = document.getElementById('imageInput');
        imageInput.addEventListener('change', async function() {
            if (this.files && this.files[0]) {
                if (this.files[0].size > 10485760) {
                    alert('File is too large. Maximum size is 10MB.');
                    this.value = '';
                    return;
                }

                // Trigger photo submission popup
                const formData = new FormData();
                formData.append('blend_name', blend.name);
                formData.append('blend_key', blendKey);
                formData.append('blender', blend.blender);

                // Use PhotoSubmission to handle the submission
                PhotoSubmission.prepareSubmission(this.files[0], formData);
            }
        });

        // Render rating scales with null check
        const ratingTypes = ['strength', 'taste', 'flavoring', 'roomNote'];
        ratingTypes.forEach(type => {
            const scaleElement = document.getElementById(`${type}Scale`);
            if (blend.ratings && blend.ratings[type]) {
                scaleElement.appendChild(
                    createRatingScale(type, blend.ratings[type])
                );
            } else {
                scaleElement.innerHTML = '<span class="text-[#8E8074] text-sm">No rating available</span>';
            }
        });
    } catch (innerError) {
        console.error('Error loading blend data:', innerError);
        popupContent.innerHTML = `
            <div class="text-center text-[#C89F65] p-6">
                <h2 class="text-2xl mb-4">Error Loading Blend</h2>
                <p>An unexpected error occurred while loading blend details.</p>
                <button onclick="window.popupModule.closePopup()" class="mt-4 px-4 py-2 bg-[#C89F65] text-[#E8DCD1] rounded">Close</button>
            </div>
        `;
    }
} catch (outerError) {
    console.error('Error rendering blend popup:', outerError);
    // Create a fallback popup in case of any rendering errors
    const blendPopup = document.createElement('div');
    blendPopup.id = 'blendPopup';
    blendPopup.className = 'hidden fixed top-0 left-0 w-full h-full bg-black/85 flex justify-center items-center z-[1000]';
    document.body.appendChild(blendPopup);

    const popupContent = document.createElement('div');
    popupContent.innerHTML = `
        <div class="text-center text-[#C89F65] p-6">
            <h2 class="text-2xl mb-4">Popup Rendering Error</h2>
            <p>An unexpected error occurred while creating the popup.</p>
            <button onclick="window.popupModule.closePopup()" class="mt-4 px-4 py-2 bg-[#C89F65] text-[#E8DCD1] rounded">Close</button>
        </div>
    `;
    blendPopup.appendChild(popupContent);
    blendPopup.classList.remove('hidden');
    blendPopup.classList.add('flex');
}
}

// Function to dynamically scale popup content
function scalePopupContent() {
    const popupContainer = document.getElementById('blendPopup');
    const popupContent = document.getElementById('popupContent');
    
    if (!popupContainer || !popupContent) return;

    // Ensure content is fully rendered
    requestAnimationFrame(() => {
        // Reset any previous transformations
        popupContent.style.transform = '';
        popupContent.style.maxWidth = '';
        popupContent.style.width = '';

        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Get popup content dimensions
        const contentWidth = popupContent.scrollWidth;
        const contentHeight = popupContent.scrollHeight;

        // Calculate scaling factors
        const widthScale = viewportWidth / (contentWidth + 40);  // Add padding
        const heightScale = viewportHeight / (contentHeight + 40);  // Add padding

        // Choose the most appropriate scale
        const scale = Math.min(Math.min(widthScale, heightScale), 1);

        // Apply responsive scaling
        if (scale < 1) {
            popupContent.style.transform = `scale(${scale}) translateZ(0)`;
            popupContent.style.transformOrigin = 'center center';
            popupContent.style.maxWidth = `${contentWidth * scale}px`;
            popupContent.style.width = '90%';  // Fallback for very large content
        }

        // Ensure content is centered
        popupContainer.style.display = 'flex';
        popupContainer.style.justifyContent = 'center';
        popupContainer.style.alignItems = 'center';

        // Add a small delay to ensure layout is fully processed
        setTimeout(() => {
            // Optional: Add a resize observer for continuous adjustment
            const resizeObserver = new ResizeObserver(() => {
                scalePopupContent();
            });
            resizeObserver.observe(popupContent);
        }, 100);
    });
}

// Add a function to dynamically set popup styles
function setPopupStyles() {
    const popupContainer = document.getElementById('blendPopup');
    const popupContent = document.getElementById('popupContent');
    
    if (popupContainer && popupContent) {
        // Popup container styles
        popupContainer.style.position = 'fixed';
        popupContainer.style.top = '0';
        popupContainer.style.left = '0';
        popupContainer.style.width = '100%';
        popupContainer.style.height = '100vh';
        popupContainer.style.zIndex = '1000';
        popupContainer.style.display = 'flex';
        popupContainer.style.alignItems = 'center';
        popupContainer.style.justifyContent = 'center';

        // Call scaling function after a short delay to ensure content is rendered
        setTimeout(scalePopupContent, 50);
    }
}

// Navigation functions
async function navigateBlend(direction) {
    if (availableBlends.length === 0) return;

    // Determine the next blend index based on direction
    let newBlendIndex;
    if (direction === 'next') {
        newBlendIndex = (currentBlendIndex + 1) % availableBlends.length;
    } else if (direction === 'prev') {
        newBlendIndex = (currentBlendIndex - 1 + availableBlends.length) % availableBlends.length;
    } else {
        return;
    }

    // Get the new blend key
    const newBlendKey = availableBlends[newBlendIndex];

    // Preserve the existing background
    const blendPopup = document.getElementById('blendPopup');
    const popupContent = document.getElementById('popupContent');

    // Remove existing content but keep the background
    if (popupContent) {
        popupContent.remove();
    }

    // Render new blend content within the existing popup
    const newPopupContent = document.createElement('div');
    newPopupContent.id = 'popupContent';
    blendPopup.appendChild(newPopupContent);

    // Render the new blend popup
    renderBlendPopup(newBlendKey);

    // Update current blend key
    window.currentBlendKey = newBlendKey;

    // Update navigation buttons
    updateNavigationButtons();

    // Scale popup content
    scalePopupContent();
}

// Update navigation button visibility
function updateNavigationButtons() {
    const startIndexOnPage = (currentPage - 1) * blendsPerPage;
    const endIndexOnPage = Math.min(startIndexOnPage + blendsPerPage - 1, availableBlends.length - 1);
    
    const prevButton = document.querySelector('.nav-prev');
    const nextButton = document.querySelector('.nav-next');
    
    if (prevButton) {
        prevButton.style.visibility = (currentPage === 1) ? 'hidden' : 'visible';
    }
    if (nextButton) {
        nextButton.style.visibility = (currentPage === totalPages) ? 'hidden' : 'visible';
    }
}

// Load a specific page of blends
async function loadPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > totalPages) {
        console.error(`Invalid page number: ${pageNumber}`);
        return false;
    }
    
    currentPage = pageNumber;
    const startIndex = (currentPage - 1) * blendsPerPage;
    const endIndex = Math.min(startIndex + blendsPerPage - 1, availableBlends.length - 1);
    
    const visibleBlends = document.querySelectorAll('[data-blend-key]');
    let visibleCount = 0;
    
    visibleBlends.forEach(blend => {
        const order = parseInt(blend.getAttribute('data-order') || '-1');
        if (order >= startIndex && order <= endIndex) {
            blend.style.display = '';
            visibleCount++;
        } else {
            blend.style.display = 'none';
        }
    });
    
    if (visibleCount === 0) {
        console.warn(`No blends found for page ${pageNumber}`);
    }
    
    updateNavigationButtons();
    return true;
}

// Popup Control Functions
function closePopup() {
    const blendPopup = document.getElementById('blendPopup');
    if (blendPopup) {
        // Smooth fade-out
        blendPopup.style.opacity = '0';
        blendPopup.style.transition = 'opacity 0.2s ease-out';
        
        setTimeout(() => {
            // Remove event listeners
            document.removeEventListener('keydown', handleKeyNavigation);
            
            // Remove popup from DOM
            blendPopup.remove();
        }, 200);
    }
}

function openPopup(blendKey) {
    // Immediately remove any existing popups with a quick fade-out
    const existingPopup = document.getElementById('blendPopup');
    if (existingPopup) {
        existingPopup.style.opacity = '0';
        existingPopup.style.transition = 'opacity 0.2s ease-out';
        setTimeout(() => {
            existingPopup.remove();
        }, 200);
    }

    // Render new popup with a slight delay to ensure clean transition
    setTimeout(() => {
        renderBlendPopup(blendKey);
        
        // Get the newly created popup and show it with a fade-in
        const newPopup = document.getElementById('blendPopup');
        if (newPopup) {
            newPopup.style.opacity = '0';
            newPopup.classList.remove('hidden');
            newPopup.classList.add('flex');
            
            // Force reflow
            newPopup.offsetHeight;
            
            newPopup.style.transition = 'opacity 0.3s ease-in';
            newPopup.style.opacity = '1';
            
            setPopupStyles();
        }
    }, 50);
}

// Add global click handler for popup closing
document.addEventListener('mousedown', (event) => {
    const blendPopup = document.getElementById('blendPopup');
    const popupContent = document.getElementById('popupContent');
    
    // Check if popup exists and is visible
    if (blendPopup && !blendPopup.classList.contains('hidden')) {
        // Check if click is outside popup content
        if (popupContent && !popupContent.contains(event.target) && blendPopup === event.target) {
            event.preventDefault();
            event.stopPropagation();
            closePopup();
        }
    }
}, true); // Use capture phase to ensure it runs before other event handlers

// Photo submission handling
const PhotoSubmission = {
    currentSubmission: null,
    uploadPromise: null,
    
    showNotification(message, isSuccess = true) {
        const notification = document.getElementById('uploadNotification');
        
        // Clear existing content and add SVG and message
        notification.innerHTML = `
            <div class="max-w-xl mx-auto flex items-center justify-center">
                <svg class="w-6 h-6 mr-3 text-[#C89F65]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>${message}</span>
            </div>
        `;
        
        // Set notification styles exactly like the copied to clipboard notification
        notification.className = 'fixed top-0 left-0 w-full bg-[#28201E] text-[#BDAE9F] text-center py-3 z-[1200] shadow-lg transform -translate-y-full transition-transform duration-300';
        
        // Show notification by translating it into view
        notification.style.transform = 'translate(0, 0)';
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translate(0, -100%)';
        }, 3000);
    },

    showNameInputPopup() {
        document.getElementById('nameInputPopup').classList.remove('hidden');
        document.getElementById('submitterName').focus();
    },

    hideNameInputPopup() {
        document.getElementById('nameInputPopup').classList.add('hidden');
        document.getElementById('submitterName').value = '';
        // If there's an ongoing upload and user cancels, we should clean up
        if (this.uploadPromise) {
            this.currentSubmission = null;
            this.uploadPromise = null;
        }
    },

    showLoadingSpinner() {
        document.getElementById('loadingSpinner').classList.remove('hidden');
    },

    hideLoadingSpinner() {
        document.getElementById('loadingSpinner').classList.add('hidden');
    },

    prepareSubmission(file, formData) {
        // console.error('DIAGNOSTIC: prepareSubmission called!');
        // console.log('File:', file);
        // console.log('FormData:', Object.fromEntries(formData));
        
        // Store just what we need
        this.currentSubmission = {
            file: file,
            blendName: formData.get('blend_name'),
            blendKey: formData.get('blend_key'),
            blender: formData.get('blender')
        };
        
        // Close the blend popup if it's open
        const blendPopup = document.getElementById('blendPopup');
        if (blendPopup && !blendPopup.classList.contains('hidden')) {
            blendPopup.classList.add('hidden');
        }
        
        // Ensure name input popup is visible
        const nameInputPopup = document.getElementById('nameInputPopup');
        const submitterNameInput = document.getElementById('submitterName');
        
        // console.error('DIAGNOSTIC: Popup Elements', {
        //     nameInputPopup: !!nameInputPopup,
        //     submitterNameInput: !!submitterNameInput,
        //     nameInputPopupClasses: nameInputPopup ? nameInputPopup.classList.toString() : 'No popup element',
        //     submitterNameInputValue: submitterNameInput ? submitterNameInput.value : 'No input element'
        // });
        
        if (nameInputPopup) {
            // Remove hidden class and ensure it's visible
            nameInputPopup.classList.remove('hidden');
            
            if (submitterNameInput) {
                submitterNameInput.focus();
            }
        } else {
            console.error('Name input popup element not found!');
        }
    },

    async submitWithName() {
        console.log('Starting submitWithName', this.currentSubmission);
        const name = document.getElementById('submitterName').value.trim();
        if (!name) {
            alert('Please enter your name');
            return;
        }

        if (!this.currentSubmission) {
            alert('No photo selected. Please select a photo first.');
            this.hideNameInputPopup();
            return;
        }

        this.hideNameInputPopup();
        this.showLoadingSpinner();

        try {
            // Create form data with everything
            const formData = new FormData();
            
            // Add the file
            formData.append('attachment', this.currentSubmission.file);
            
            // Add the metadata
            formData.append('blend_name', this.currentSubmission.blendName);
            formData.append('blend_key', this.currentSubmission.blendKey);
            formData.append('blender', this.currentSubmission.blender);
            
            // Add the submitter's name
            const trimmedName = name.trim();
            console.log('Adding submitter name:', trimmedName);
            formData.append('submitter_name', trimmedName);
            
            // Log the form data
            console.log('Form data contents:');
            for (const [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
            
            // Do the upload
            console.log('Starting upload...');
            const response = await fetch('https://tabacwiki-upload.decombust.workers.dev', {
                method: 'POST',
                body: formData,
                mode: 'cors'
            });

            const responseText = await response.text();
            console.log('Upload response:', response.status, responseText);

            if (!response.ok) {
                throw new Error('Upload failed: ' + responseText);
            }
            
            this.showNotification('Image uploaded successfully!', true);
        } catch (error) {
            console.error('Error during submission:', error);
            this.showNotification('Failed to upload image: ' + error.message, false);
        } finally {
            this.hideLoadingSpinner();
            this.currentSubmission = null;
        }
    },

    debugPhotoSubmission() {
        console.error('DIAGNOSTIC: Photo Submission Debug');
        console.log('PhotoSubmission object:', this);
        console.log('Current Submission:', this.currentSubmission);
        console.log('Name Input Popup Element:', document.getElementById('nameInputPopup'));
        console.log('Submitter Name Input:', document.getElementById('submitterName'));
    },

    triggerPhotoSubmissionPopup(file, blendName, blendKey, blender) {
        console.error('DIAGNOSTIC: Triggering Photo Submission Popup');
        const formData = new FormData();
        formData.append('blend_name', blendName);
        formData.append('blend_key', blendKey);
        formData.append('blender', blender);

        this.prepareSubmission(file, formData);
    },
};

// Ensure PhotoSubmission is globally accessible for debugging
window.PhotoSubmission = PhotoSubmission;

// Add a global method to help with photo submission debugging
window.debugPhotoSubmission = () => {
    console.error('GLOBAL PHOTO SUBMISSION DEBUG');
    console.log('PhotoSubmission:', window.PhotoSubmission);
    console.log('Name Input Popup:', document.getElementById('nameInputPopup'));
    console.log('Submitter Name Input:', document.getElementById('submitterName'));
};

// Event Listeners
document.getElementById('cancelPhotoSubmit').addEventListener('click', () => PhotoSubmission.hideNameInputPopup.call(PhotoSubmission));
document.getElementById('confirmPhotoSubmit').addEventListener('click', () => PhotoSubmission.submitWithName.call(PhotoSubmission));

// Close popup when clicking outside
document.getElementById('blendPopup').addEventListener('click', function(event) {
    // console.log('Popup click debug:', {
    //     target: event.target,
    //     currentTarget: event.currentTarget,
    //     isPopupBackground: event.target === this,
    //     popupClasses: this.classList.toString()
    // });
    
    // Force close if click is on popup background
    if (event.target === this) {
        event.stopPropagation();
        event.preventDefault();
        
        // Force close using multiple methods
        this.classList.add('hidden');
        this.style.display = 'none';
        
        // Explicitly call closePopup
        if (typeof closePopup === 'function') {
            try {
                closePopup();
            } catch (err) {
                // console.error('Error in closePopup:', err);
            }
        }
    }
}, true);

// Close name input popup when clicking outside
document.getElementById('nameInputPopup').addEventListener('click', function(event) {
    if (event.target === this) {
        PhotoSubmission.hideNameInputPopup();
    }
});

// Export functions for global access and module usage
window.popupModule = {
    openPopup,
    closePopup,
    navigateBlend,
    renderBlendPopup
};

export {
    openPopup,
    closePopup,
    navigateBlend,
    renderBlendPopup
};

// Add keyboard navigation
document.addEventListener('keydown', handleKeyNavigation);

// Optional: Also set styles on window resize
window.addEventListener('resize', () => {
    const popupContainer = document.getElementById('blendPopupContainer');
    if (popupContainer && !popupContainer.classList.contains('hidden')) {
        setPopupStyles();
    }
});

// Add resize listener to handle window resizing
window.addEventListener('resize', () => {
    const blendPopup = document.getElementById('blendPopup');
    if (blendPopup && !blendPopup.classList.contains('hidden')) {
        scalePopupContent();
    }
});
