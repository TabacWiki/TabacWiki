export function initSiteDirectory() {
    const siteLogos = document.querySelectorAll('.site-logo');
    const body = document.body;
    let directoryOverlay = null;

    function createDirectoryOverlay() {
        const directory = document.createElement('div');
        directory.id = 'siteDirectoryOverlay';
        directory.className = 'fixed left-0 top-0 h-screen w-64 bg-[#241e1c] transform -translate-x-full transition-transform duration-300 z-[61] overflow-y-auto custom-scrollbar hidden';
        directory.style.height = '100vh';
        
        directory.innerHTML = `
            <div class="px-4 py-8 flex-1 overflow-y-auto">
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
    }

    function toggleDirectory(event) {
        event.preventDefault();
        
        if (!directoryOverlay) {
            directoryOverlay = createDirectoryOverlay();
            setupDirectoryButtons();
            
            // Add click handler for the document to close when clicking outside
            document.addEventListener('click', (e) => {
                if (directoryOverlay.classList.contains('translate-x-0') && 
                    !directoryOverlay.contains(e.target) && 
                    !e.target.classList.contains('site-logo')) {
                    hideDirectory();
                }
            });
        }

        // Show directory
        directoryOverlay.classList.remove('hidden');
        setTimeout(() => {
            directoryOverlay.classList.add('translate-x-0');
        }, 10);
    }

    function hideDirectory() {
        if (directoryOverlay) {
            directoryOverlay.classList.remove('translate-x-0');
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
