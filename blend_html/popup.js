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

// Standard state variables
let blendsPerPage = 12; // Assuming 12 blends per page

// Keyboard handler for escape key
function handleKeyNavigation(event) {
    if (event.key === 'Escape') {
        // Get the blend popup
        const blendPopup = document.getElementById('blendPopup');
        if (blendPopup) {
            // Just call closePopup directly since it handles the animation
            window.popupModule.closePopup();
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

        // Simplified image path handling with non-blocking image check
        const imagePath = originalBlendData.imagePath && originalBlendData.imagePath.trim() !== '' 
            ? originalBlendData.imagePath 
            : '/blend_pictures/pictureless.jpg';

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
            imagePath: imagePath,
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
    scaleWrapper.className = 'flex justify-between text-sm text-[#BFB0A3] relative bg-[#362C29]/0 rounded-lg p-2'; 
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
            dot.className = 'w-5 h-5 rounded-full mx-auto bg-[#BFB0A3]/40'; // Keep original transparency

            // Label
            const labelText = document.createElement('span');
            labelText.className = 'block text-center mt-3 whitespace-nowrap text-[#BFB0A3] sm:opacity-40 opacity-0'; // Transparent on mobile
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

            // Create main content structure
            popupContent.innerHTML = `
                <div class="relative bg-[#241e1c] rounded-xl shadow-2xl max-w-7xl mx-auto overflow-visible p-8">
                    <button onclick="window.popupModule.closePopup()" class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center z-50 group hover:scale-110 transition-all duration-200 lg:hidden">
                        <svg width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="transition-transform duration-200 drop-shadow-lg">
                            <path d="M1 1L13 13M1 13L13 1" stroke="#BFB0A3" stroke-width="2.5" stroke-linecap="round"/>
                        </svg>
                    </button>
                    
                    <div class="flex flex-col gap-8">
                        <!-- Header Section with Title and Image -->
                        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <!-- Left Column with Title -->
                            <div class="lg:col-span-9 text-[#D6B680]">
                                <div class="mb-8">
                                    <div class="text-[#C89F65] text-lg mb-2 font-medium">${blend.blender}</div>
                                    <h2 class="text-3xl font-bold text-[#BFB0A3] mb-4">${blend.name}</h2>
                                    <p class="text-[#9A8B7C] leading-relaxed text-lg">
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
                                        <div class="upload-container relative" id="uploadContainer">
                                            <img 
                                                src="${blend.imagePath}" 
                                                alt="${blend.name}" 
                                                class="w-full rounded-xl shadow-2xl border border-[#28201E]/50 object-cover aspect-square"
                                                onerror="this.onerror=null; this.src='/blend_pictures/pictureless.jpg';"
                                            />
                                            <div id="uploadOverlay" class="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-xl opacity-0 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                                                <span class="text-[#C89F65] text-lg font-medium">Submit a photo</span>
                                            </div>
                                            <label for="imageInput" class="absolute bottom-3 right-3 w-12 h-12 flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-200" onmouseenter="document.getElementById('uploadOverlay').style.opacity = '1'" onmouseleave="document.getElementById('uploadOverlay').style.opacity = '0'">
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="transition-transform duration-200 drop-shadow-lg">
                                                    <path d="M12 4V20M4 12H20" stroke="#BFB0A3" stroke-width="3" stroke-linecap="round"/>
                                                </svg>
                                            </label>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <!-- Blend Details Section -->
                        <div class="bg-[#161413]/20 rounded-xl p-6 backdrop-blur-sm w-full relative">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="font-semibold text-[#BDAE9F] text-lg">Blend Details</h3>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 order-6 sm:order-none">
                                    <span class="text-[#BFB0A3]/70">Blend Type</span>
                                    <span class="text-[#BDAE9F] font-medium break-words">${blend.blendType || 'Not specified'}</span>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 order-2 sm:order-none">
                                    <span class="text-[#BFB0A3]/70">Blended By</span>
                                    <span class="text-[#BDAE9F] font-medium break-words">${blend.blendedBy}</span>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 order-7 sm:order-none">
                                    <span class="text-[#BFB0A3]/70">Contents</span>
                                    <span class="text-[#BDAE9F] font-medium break-words">${blend.contents || 'Not specified'}</span>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 order-3 sm:order-none">
                                    <span class="text-[#BFB0A3]/70">Manufactured By</span>
                                    <span class="text-[#BDAE9F] font-medium break-words">${blend.manufacturedBy}</span>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 order-8 sm:order-none">
                                    <span class="text-[#BFB0A3]/70">Flavoring</span>
                                    <span class="text-[#BDAE9F] font-medium break-words">${blend.flavoring}</span>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 order-5 sm:order-none">
                                    <span class="text-[#BFB0A3]/70">Country</span>
                                    <span class="text-[#BDAE9F] font-medium break-words">${blend.country || 'Not specified'}</span>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 order-9 sm:order-none">
                                    <span class="text-[#BFB0A3]/70">Cut</span>
                                    <span class="text-[#BDAE9F] font-medium break-words">${blend.cut || 'Not specified'}</span>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 order-4 sm:order-none">
                                    <span class="text-[#BFB0A3]/70">Production</span>
                                    <span class="text-[#BDAE9F] font-medium break-words">${blend.production || 'Not specified'}</span>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 order-10 sm:order-none">
                                    <span class="text-[#BFB0A3]/70">Packaging</span>
                                    <span class="text-[#BDAE9F] font-medium break-words">${blend.packaging || 'Not specified'}</span>
                                </div>
                                ${blend.averageRating ? `
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 order-1 sm:order-none">
                                    <span class="text-[#BFB0A3]/70">Average Rating</span>
                                    <div class="text-[#BDAE9F] font-medium flex items-center gap-2">
                                        <span class="text-[#aa8a3f]">★</span>
                                        ${blend.averageRating.toFixed(1)}
                                        <span class="text-sm text-[#BFB0A3]">(${blend.reviewCount} ratings)</span>
                                    </div>
                                </div>
                                ` : ''}
                            </div>
                        </div>

                        <!-- Profile Ratings Section -->
                        <div class="bg-[#161413]/20 rounded-xl p-6 backdrop-blur-sm w-full">
                            <div class="flex justify-between items-center mb-6">
                                <h3 class="font-semibold text-[#BDAE9F] text-lg">Profile Ratings</h3>
                                <button 
                                    class="px-4 py-2 rounded bg-[#362C29] hover:bg-[#53403A] transition-colors text-[#BFB0A3] flex items-center gap-2 border border-[#53403A]"
                                    id="rateBlendButton"
                                >
                                    <span class="text-[#aa8a3f]">★</span>
                                    Submit A Rating
                                </button>
                            </div>                            
                            <div class="grid grid-cols-1 gap-3">
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3">
                                    <h4 class="text-[#BFB0A3] font-medium mb-3">Strength</h4>
                                    <div id="strengthScale" class="h-[52px]"></div>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3">
                                    <h4 class="text-[#BFB0A3] font-medium mb-3">Taste</h4>
                                    <div id="tasteScale" class="h-[52px]"></div>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3">
                                    <h4 class="text-[#BFB0A3] font-medium mb-3">Flavoring</h4>
                                    <div id="flavoringScale" class="h-[52px]"></div>
                                </div>
                                <div class="bg-[#362C29]/20 rounded-lg px-4 py-3">
                                    <h4 class="text-[#BFB0A3] font-medium mb-3">Room Note</h4>
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
                scaleElement.innerHTML = '<span class="text-[#BFB0A3] text-sm">No rating available</span>';
            }
        });

        // Add the event listener after creating the button
        document.getElementById('rateBlendButton').addEventListener('click', () => {
            document.getElementById('ratingModal').classList.remove('hidden');
            window.currentBlendForRating = blend.filename;
            window.initializeRatingUI(blend.name);
        });

        // Star rating handlers
        const stars = document.querySelectorAll('.rating-star');  // Changed from .star to .rating-star
        window.selectedRating = 0;  // Initialize with 0
        const submitButton = document.getElementById('submitRating');
        window.profileRatings = {
            strength: '',
            taste: '',
            flavoring: '',
            roomNote: ''
        };

        function checkSubmitButton() {
            // Check if we have both a star rating and all profile ratings
            const hasStarRating = window.selectedRating > 0;
            const hasAllProfileRatings = Object.values(window.profileRatings).every(v => v !== '');
            
            // Enable submit only if both conditions are met
            if (submitButton) {
                submitButton.disabled = !(hasStarRating && hasAllProfileRatings);
            }
        }

        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const isLeftHalf = x < rect.width / 2;
                const fullRating = parseFloat(e.currentTarget.dataset.rating);
                const halfRating = parseFloat(e.currentTarget.dataset.half);
                
                // Set rating based on which half was clicked
                window.selectedRating = isLeftHalf ? halfRating : fullRating;
                
                updateStarDisplay(window.selectedRating);
                checkSubmitButton();
            });

            // Add hover effect
            star.addEventListener('mousemove', (e) => {
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const isLeftHalf = x < rect.width / 2;
                const fullRating = parseFloat(e.currentTarget.dataset.rating);
                const halfRating = parseFloat(e.currentTarget.dataset.half);
                
                // Show preview based on hover position
                const previewRating = isLeftHalf ? halfRating : fullRating;
                updateStarDisplay(previewRating, true);
            });

            star.addEventListener('mouseleave', () => {
                updateStarDisplay(window.selectedRating);
            });
        });

        function updateStarDisplay(rating, isPreview = false) {
            stars.forEach(s => {
                const starRating = parseFloat(s.dataset.rating);
                const halfStarValue = parseFloat(s.dataset.half);
                const fullStar = s.querySelector('.full-star');
                const halfStar = s.querySelector('.half-star');
                
                // Reset both full and half stars
                fullStar.classList.remove('text-[#C89F65]');
                halfStar.classList.add('hidden');
                halfStar.classList.remove('text-[#C89F65]');
                
                if (starRating <= rating) {
                    // Full star
                    fullStar.classList.add('text-[#C89F65]');
                    if (isPreview) {
                        fullStar.style.opacity = '0.7';
                    } else {
                        fullStar.style.opacity = '1';
                    }
                } else if (halfStarValue === rating) {
                    // Half star
                    halfStar.classList.remove('hidden');
                    halfStar.classList.add('text-[#C89F65]');
                    if (isPreview) {
                        halfStar.style.opacity = '0.7';
                    } else {
                        halfStar.style.opacity = '1';
                    }
                }

                // Handle stars before the current rating
                if (starRating < rating) {
                    fullStar.classList.add('text-[#C89F65]');
                    if (isPreview) {
                        fullStar.style.opacity = '0.7';
                    } else {
                        fullStar.style.opacity = '1';
                    }
                }
            });
        }
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
let resizeTimeout;
let currentResizeObserver;

function scalePopupContent() {
    const popupContainer = document.getElementById('blendPopup');
    const popupContent = document.getElementById('popupContent');
    
    if (!popupContainer || !popupContent) return;

    // Clean up any existing resize observer
    if (currentResizeObserver) {
        currentResizeObserver.disconnect();
    }

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Determine device type and OS
    const isMobile = viewportWidth < 768;
    const isAndroid = /Android/i.test(navigator.userAgent);

    // Base styles for popup container
    const containerStyles = {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.85)',
        zIndex: '1000',
        overflow: 'hidden'
    };

    // Apply container styles
    Object.assign(popupContainer.style, containerStyles);

    if (isMobile) {
        // Mobile styles
        const mobileStyles = {
            width: '100%',
            maxWidth: '100%',
            margin: '0',
            padding: '15px',
            transform: 'none',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            overflowY: 'auto',
            overflowX: 'hidden',
            '-webkit-overflow-scrolling': 'touch',
            height: isAndroid ? '100%' : 'auto',
            maxHeight: isAndroid ? `${viewportHeight}px` : 'none',
            willChange: 'transform',
            backfaceVisibility: 'hidden'
        };

        // Apply mobile styles
        Object.assign(popupContent.style, mobileStyles);

        // Android-specific fixes
        if (isAndroid) {
            // Prevent unnecessary repaints
            popupContent.style.transform = 'translateZ(0)';
            
            // Force hardware acceleration
            popupContainer.style.webkitTransform = 'translateZ(0)';
            popupContent.style.webkitTransform = 'translateZ(0)';
        }
    } else {
        // Desktop styles
        const contentWidth = popupContent.scrollWidth;
        const contentHeight = popupContent.scrollHeight;

        const scaleX = Math.min((viewportWidth - 80) / contentWidth, 1);
        const scaleY = Math.min((viewportHeight - 80) / contentHeight, 1);
        const scale = Math.min(scaleX, scaleY, 1);

        const desktopStyles = {
            width: '90%',
            maxWidth: '1200px',
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            margin: '40px auto',
            padding: '40px',
            position: 'relative',
            visibility: 'visible',
            display: 'block'
        };

        // Apply desktop styles
        Object.assign(popupContent.style, desktopStyles);
    }

    // Debounced resize handling
    currentResizeObserver = new ResizeObserver(() => {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(() => {
            if (document.getElementById('blendPopup')) {
                scalePopupContent();
            }
        }, 150);
    });

    currentResizeObserver.observe(popupContent);
}

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



// Popup Control Functions
function closePopup() {
    const blendPopup = document.getElementById('blendPopup');
    if (blendPopup) {
        // Set a faster transition
        blendPopup.style.transition = 'opacity 0.15s ease-out';
        blendPopup.style.opacity = '0';
        
        // Remove event listeners immediately
        document.removeEventListener('keydown', handleKeyNavigation);
        
        // Remove popup slightly before the transition ends for a snappier feel
        setTimeout(() => {
            blendPopup.remove();
        }, 100);
    }
}

function openPopup(blendKey) {
    // Render the popup immediately
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
    renderBlendPopup
};

export {
    openPopup,
    closePopup,
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

async function submitRating(blendKey, ratings) {
    try {
        console.log("Submitting rating for blend:", blendKey);
        console.log("Rating data:", JSON.stringify(ratings));
        
        const response = await fetch('https://ratings.decombust.workers.dev', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                blendKey: blendKey,
                ratings: ratings,
                timestamp: new Date().toISOString()
            })
        });
        
        const result = await response.json();
        console.log("Rating submission result:", result);
        
        if (response.ok) {
            showNotification("Rating submitted successfully!", true);
            return true;
        } else {
            console.error("Error submitting rating:", result.error || "Unknown error");
            showNotification("Failed to submit rating: " + (result.error || "Unknown error"), false);
            return false;
        }
    } catch (error) {
        console.error("Exception when submitting rating:", error);
        showNotification("Failed to submit rating: " + error.message, false);
        return false;
    }
}
