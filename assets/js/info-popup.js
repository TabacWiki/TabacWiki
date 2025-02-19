// Info popup functionality

export function initInfoPopup() {
    // Get the info buttons
    const infoButton = document.getElementById('infoButton');
    const mobileInfoButton = document.getElementById('mobileInfoButton');

    // Add click events to both desktop and mobile buttons
    [infoButton, mobileInfoButton].forEach(button => {
        if (button) {
            button.addEventListener('click', openInfoPopup);
        }
    });
    
    // Create info popup element
    const popup = document.createElement('div');
    popup.id = 'infoPopup';
    popup.className = 'hidden fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4';

    // Function to load JSON data
    const loadJsonData = async () => {
        try {
            const response = await fetch('/assets/data/legal_info.json');
            if (!response.ok) throw new Error('Failed to load legal_info.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading legal_info.json:', error);
            return { terms_and_conditions: 'Error loading terms and conditions.' };
        }
    };

    // Function to update popup content
    const updatePopupContent = async () => {
        try {
            const data = await loadJsonData();
            
            const popupContent = document.createElement('div');
            popupContent.className = 'bg-[#28201E] rounded-xl max-w-3xl w-full p-6 transform scale-95 transition-transform duration-300';
            
            popupContent.innerHTML = `
                <div class="relative">
                    <button id="closeInfoPopup" class="absolute top-2 right-2 text-[#BFB0A3] hover:text-[#C89F65]">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    <div class="pr-8 max-h-[80vh] overflow-y-auto text-center">
                        <h2 class="text-2xl font-bold text-[#C89F65] mb-6">Site Policy & Terms of Use</h2>
                        <div class="text-[#BDAE9F] text-base leading-relaxed whitespace-pre-wrap text-center">${data.terms_and_conditions}</div>
                    </div>
                </div>
            `;

            // Add the popup content
            popup.innerHTML = '';
            popup.appendChild(popupContent);

            // Add close button handler
            const closeButton = popupContent.querySelector('#closeInfoPopup');
            closeButton.addEventListener('click', closeInfoPopup);
        } catch (error) {
            console.error('Error updating popup content:', error);
        }
    };

    // Add the popup to the document
    document.body.appendChild(popup);

    // Add click outside to close
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closeInfoPopup();
        }
    });

    // Initialize the popup content
    updatePopupContent();
}

function openInfoPopup() {
    const popup = document.getElementById('infoPopup');
    if (popup) {
        popup.classList.remove('hidden');
        popup.classList.add('flex');
        const content = popup.querySelector('div');
        if (content) {
            setTimeout(() => {
                content.style.transform = 'scale(1)';
            }, 10);
        }
    }
}

function closeInfoPopup() {
    const popup = document.getElementById('infoPopup');
    if (popup) {
        const content = popup.querySelector('div');
        if (content) {
            content.style.transform = 'scale(0.95)';
        }
        setTimeout(() => {
            popup.classList.remove('flex');
            popup.classList.add('hidden');
        }, 200);
    }
}
