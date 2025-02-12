// Standard Rating Scales
const RATING_SCALES = {
    strength: {
        scale: [
            "Extremely Mild", "Very Mild", "Mild", "Mild to Medium", 
            "Medium", "Medium to Strong", "Strong", "Very Strong", 
            "Extremely Strong", "Overwhelming"
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
    },
    taste: {
        scale: [
            "Extremely Mild", "Very Mild", "Mild", "Mild to Medium", 
            "Medium", "Medium to Full", "Full", "Very Full", 
            "Extra Full", "Overwhelming"
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
        window.popupModule.closePopup();
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

        console.log('Processed Blend Data:', originalBlendData);
        
        // Return blend details with additional metadata
        const processedBlendData = { 
            filename: filename,
            name: originalBlendData.name || 'Unnamed Blend',
            blender: originalBlendData.blender || 'Unknown',
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
            ratings: originalBlendData.ratings || {}
        };

        console.log('Processed Blend Details:', processedBlendData);
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
    scaleContainer.className = 'flex justify-center mb-4 transform scale-[0.8]'; // Reduced margin and scaled down
    
    const scaleWrapper = document.createElement('div');
    scaleWrapper.className = 'flex justify-between mt-2 text-xs text-gray-500 relative';
    scaleWrapper.style.width = '90%';

    const scaleData = RATING_SCALES[ratingType];

    // Create dots and labels
    scaleData.scale.forEach((label, index) => {
        const dotPosition = (index / (scaleData.scale.length - 1)) * 100;
        
        // Create a container for dot and label to maintain alignment
        const dotLabelContainer = document.createElement('div');
        dotLabelContainer.className = 'absolute';
        dotLabelContainer.style.left = `${dotPosition}%`;
        dotLabelContainer.style.transform = 'translateX(-50%)';
        dotLabelContainer.style.width = 'max-content';
        dotLabelContainer.style.textAlign = 'center';
        
        // Dot
        const dot = document.createElement('div');
        dot.className = 'w-4 h-4 rounded-full mx-auto';
        dot.classList.add(
            blendRating.level === label ? 'bg-blue-600' : 'bg-gray-400'
        );

        // Label
        const labelSpan = document.createElement('span');
        labelSpan.className = 'block text-center mt-2 whitespace-nowrap';
        if (blendRating.level === label) {
            labelSpan.classList.add('text-blue-600', 'font-bold');
        } else {
            labelSpan.style.fontSize = '90%';
        }
        labelSpan.textContent = label;

        dotLabelContainer.appendChild(dot);
        dotLabelContainer.appendChild(labelSpan);
        scaleWrapper.appendChild(dotLabelContainer);
    });

    scaleContainer.appendChild(scaleWrapper);
    return scaleContainer;
}

async function renderBlendPopup(blendKey) {
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
    
    const blendPopup = document.getElementById('blendPopup');
    const popupContent = document.getElementById('popupContent');
    
    // Clear previous content and show loading state
    popupContent.innerHTML = `
        <div class="flex justify-center items-center h-full p-6">
            <div class="animate-pulse text-gray-500">Loading blend details...</div>
        </div>
    `;

    // Show the popup immediately
    blendPopup.style.display = 'flex';
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);

    try {
        // Dynamically load blend data
        const blend = await loadBlendData(blendKey);

        if (!blend) {
            popupContent.innerHTML = `
                <div class="text-center text-red-500 p-6">
                    <h2 class="text-2xl mb-4">Blend Not Found</h2>
                    <p>Unable to load details for the selected blend.</p>
                    <button onclick="window.popupModule.closePopup()" class="mt-4 px-4 py-2 bg-red-600 text-white rounded">Close</button>
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
            <div class="relative bg-gray-800 rounded-xl shadow-2xl max-w-7xl mx-auto overflow-visible">
                <!-- Navigation buttons -->
                <button onclick="window.popupModule.navigateBlend('prev')" 
                    class="absolute top-1/2 -left-16 -translate-y-1/2 text-gray-400 hover:text-white p-3 z-[1000] bg-gray-800/90 rounded-full hover:bg-gray-700 transition-all duration-200 backdrop-blur-sm shadow-lg">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <button onclick="window.popupModule.navigateBlend('next')" 
                    class="absolute top-1/2 -right-16 -translate-y-1/2 text-gray-400 hover:text-white p-3 z-[1000] bg-gray-800/90 rounded-full hover:bg-gray-700 transition-all duration-200 backdrop-blur-sm shadow-lg">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
                
                <div class="flex flex-col gap-8 p-8 overflow-y-auto max-h-[90vh]">
                    <!-- Header Section with Title and Image -->
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <!-- Left Column with Title -->
                        <div class="lg:col-span-9 text-gray-300">
                            <div class="mb-8">
                                <div class="text-blue-400 text-lg mb-2 font-medium">${blend.blender}</div>
                                <h2 class="text-3xl font-bold text-white mb-4">${blend.name}</h2>
                                <p class="text-gray-300 leading-relaxed text-lg">
                                    ${blend.description || 'No description available.'}
                                </p>
                            </div>
                        </div>

                        <!-- Right Column - Image -->
                        <div class="lg:col-span-3">
                            <div class="sticky top-8">
                                <img 
                                    src="${imagePath}" 
                                    alt="${blend.name}" 
                                    class="w-full rounded-xl shadow-2xl border border-gray-700/50 object-cover aspect-square transition-opacity duration-200"
                                    onerror="this.onerror=null; this.src='/blend_pictures/pictureless.jpg';"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Blend Details Section -->
                    <div class="bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm w-full">
                        <h3 class="font-semibold mb-6 text-white text-lg">Blend Details</h3>
                        <div class="grid grid-cols-2 gap-6 text-base">
                            <div class="flex gap-2"><span class="text-gray-400">Blended By:</span> <span class="text-white font-medium">${blend.blender}</span></div>
                            <div class="flex gap-2"><span class="text-gray-400">Blend Type:</span> <span class="text-white font-medium">${blend.blendType || 'Not specified'}</span></div>
                            <div class="flex gap-2"><span class="text-gray-400">Contents:</span> <span class="text-white font-medium">${blend.contents || 'Not specified'}</span></div>
                            <div class="flex gap-2"><span class="text-gray-400">Cut:</span> <span class="text-white font-medium">${blend.cut || 'Not specified'}</span></div>
                            <div class="flex gap-2"><span class="text-gray-400">Packaging:</span> <span class="text-white font-medium">${blend.packaging || 'Not specified'}</span></div>
                            <div class="flex gap-2"><span class="text-gray-400">Country:</span> <span class="text-white font-medium">${blend.country || 'Not specified'}</span></div>
                            <div class="flex gap-2"><span class="text-gray-400">Production:</span> <span class="text-white font-medium">${blend.production || 'Not specified'}</span></div>
                            ${blend.averageRating ? `
                            <div class="flex items-center gap-2">
                                <span class="text-gray-400">Average Rating:</span>
                                <div class="text-white font-medium flex items-center gap-2">
                                    <span class="text-yellow-400">★</span>
                                    ${blend.averageRating.toFixed(1)}
                                    <span class="text-sm text-gray-400">(${blend.reviewCount} ratings)</span>
                                </div>
                            </div>` : ''}
                        </div>
                    </div>

                    <!-- Profile Ratings Section -->
                    <div class="bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm w-full space-y-16">
                        <div class="space-y-1">
                            <h3 class="text-white font-medium mb-6">Strength</h3>
                            <div id="strengthScale"></div>
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-white font-medium mb-6">Flavoring</h3>
                            <div id="flavoringScale"></div>
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-white font-medium mb-6">Room Note</h3>
                            <div id="roomNoteScale"></div>
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-white font-medium mb-6">Taste</h3>
                            <div id="tasteScale"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Render rating scales with null check
        const ratingTypes = ['strength', 'flavoring', 'roomNote', 'taste'];
        ratingTypes.forEach(type => {
            const scaleElement = document.getElementById(`${type}Scale`);
            if (blend.ratings && blend.ratings[type]) {
                scaleElement.appendChild(
                    createRatingScale(type, blend.ratings[type])
                );
            } else {
                scaleElement.innerHTML = '<span class="text-gray-500 text-sm">No rating available</span>';
            }
        });
    } catch (error) {
        console.error('Error rendering blend popup:', error);
        popupContent.innerHTML = `
            <div class="text-center text-red-500 p-6">
                <h2 class="text-2xl mb-4">Error Loading Blend</h2>
                <p>An unexpected error occurred while loading blend details.</p>
                <p class="text-sm mt-2">Filename: ${blendKey}</p>
                <p class="text-xs mt-4">${error.message}</p>
                <button onclick="window.popupModule.closePopup()" class="mt-4 px-4 py-2 bg-red-600 text-white rounded">Close</button>
            </div>
        `;
    }
}

// Popup Control Functions
function openPopup(blendKey) {
    renderBlendPopup(blendKey);
    document.getElementById('blendPopup').style.display = 'flex';
}

function closePopup() {
    const blendPopup = document.getElementById('blendPopup');
    blendPopup.style.display = 'none';
    // Reset navigation state
    currentBlendIndex = -1;
}

// Navigation functions
async function navigateBlend(direction) {
    if (availableBlends.length === 0) return;
    
    // Ensure pagination state is in sync
    syncPaginationState();
    
    const startIndexOnPage = (currentPage - 1) * blendsPerPage;
    const endIndexOnPage = Math.min(startIndexOnPage + blendsPerPage - 1, availableBlends.length - 1);
    
    let newIndex = currentBlendIndex;
    let newPage = currentPage;

    if (direction === 'next') {
        if (currentBlendIndex === endIndexOnPage) {
            // At the end of current page, try to load next page
            if (currentPage < totalPages) {
                newPage = currentPage + 1;
                newIndex = (newPage - 1) * blendsPerPage; // First blend of next page
            }
        } else if (currentBlendIndex < endIndexOnPage) {
            newIndex = currentBlendIndex + 1;
        }
    } else { // previous
        if (currentBlendIndex === startIndexOnPage) {
            // At the start of current page, try to load previous page
            if (currentPage > 1) {
                newPage = currentPage - 1;
                newIndex = newPage * blendsPerPage - 1; // Last blend of previous page
            }
        } else if (currentBlendIndex > startIndexOnPage) {
            newIndex = currentBlendIndex - 1;
        }
    }

    // Only proceed if we have a valid new index
    if (newIndex !== currentBlendIndex) {
        if (newPage !== currentPage) {
            // Load new page if needed
            await loadPage(newPage);
        }
        const nextBlendKey = availableBlends[newIndex];
        await renderBlendPopup(nextBlendKey);
        updateNavigationButtons();
    }
}

// Update navigation button visibility
function updateNavigationButtons() {
    const startIndexOnPage = (currentPage - 1) * blendsPerPage;
    const endIndexOnPage = Math.min(startIndexOnPage + blendsPerPage - 1, availableBlends.length - 1);
    
    const prevButton = document.querySelector('.nav-prev');
    const nextButton = document.querySelector('.nav-next');
    
    if (prevButton) {
        prevButton.style.visibility = (currentBlendIndex <= startIndexOnPage && currentPage === 1) ? 'hidden' : 'visible';
    }
    if (nextButton) {
        nextButton.style.visibility = (currentBlendIndex >= endIndexOnPage && currentPage === totalPages) ? 'hidden' : 'visible';
    }
}

// Load a specific page of blends
async function loadPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    
    // Update current page
    currentPage = pageNumber;
    
    // Calculate valid index range for the new page
    const startIndex = (currentPage - 1) * blendsPerPage;
    const endIndex = Math.min(startIndex + blendsPerPage - 1, availableBlends.length - 1);
    
    // Update the UI to show blends for this page
    const visibleBlends = document.querySelectorAll('[data-blend-key]');
    visibleBlends.forEach(blend => {
        const order = parseInt(blend.getAttribute('data-order') || '0');
        if (order >= startIndex && order <= endIndex) {
            blend.style.display = '';
        } else {
            blend.style.display = 'none';
        }
    });
    
    updateNavigationButtons();
}

// Close popup when clicking outside
document.getElementById('blendPopup').addEventListener('click', function(event) {
    if (event.target === this) {
        closePopup();
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
