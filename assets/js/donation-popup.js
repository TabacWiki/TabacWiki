// Donation popup functionality

import ProblemReportModule from './problem-report.js';

export function initDonationPopup() {
    // Create container for both buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'fixed bottom-4 left-0 w-64 flex flex-col gap-2 z-40';

    // Create donation button
    const donationButton = document.createElement('button');
    donationButton.id = 'donationButton';
    donationButton.className = 'w-full bg-[#28201E] hover:bg-[#392823] accent-text font-medium py-2 rounded shadow-md transition-all duration-200 border border-[#2F2423] hover:border-[#392823]';
    donationButton.innerHTML = 'Support The Wiki';

    // Create wiki status button
    const statusButton = document.createElement('button');
    statusButton.id = 'statusButton';
    statusButton.className = 'w-full bg-[#28201E] hover:bg-[#392823] accent-text font-medium py-1.5 rounded shadow-md transition-all duration-200 border border-[#2F2423] hover:border-[#392823] text-sm';

    statusButton.innerHTML = 'Wiki Report';
    
    // Add subtle hover effect
    donationButton.addEventListener('mouseenter', () => {
        donationButton.classList.add('translate-y-[-2px]');
    });
    
    donationButton.addEventListener('mouseleave', () => {
        donationButton.classList.remove('translate-y-[-2px]');
    });

    // Add hover effect to status button
    statusButton.addEventListener('mouseenter', () => {
        statusButton.classList.add('translate-y-[-2px]');
    });
    
    statusButton.addEventListener('mouseleave', () => {
        statusButton.classList.remove('translate-y-[-2px]');
    });
    
    // Add buttons to container
    buttonContainer.appendChild(donationButton);
    buttonContainer.appendChild(statusButton);
    document.body.appendChild(buttonContainer);
    
    // Create donation popup elements
    const popup = document.createElement('div');
    popup.id = 'donationPopup';
    popup.className = 'hidden fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4';

    // Create status popup elements
    const statusPopup = document.createElement('div');
    statusPopup.id = 'statusPopup';
    statusPopup.className = 'hidden fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4';

    // Function to create list items from data
    const createListItems = (items) => {
        return items.map(item => {
            if (item.type === 'domain_expiry') {
                const expiryDate = new Date(item.expiryDate);
                const today = new Date();
                const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                return `
                    <li class="flex">
                        <span class="mr-2">•</span>
                        <span class="flex-1 -mt-0.5">Domain: ${daysRemaining} days until expiry</span>
                    </li>
                `;
            }
            return `
                <li class="flex flex-col">
                    <div class="flex">
                        <span class="mr-2">•</span>
                        <span class="flex-1 -mt-0.5">${item.text}</span>
                    </div>
                    ${item.subtext ? `<span class="text-sm text-[#8E8074] ml-5 mt-1">${item.subtext}</span>` : ''}
                </li>
            `;
        }).join('');
    };

    // Function to load JSON data
    const loadJsonData = async (filename) => {
        try {
            const response = await fetch(`/assets/data/${filename}.json`);
            if (!response.ok) throw new Error(`Failed to load ${filename}.json`);
            return await response.json();
        } catch (error) {
            console.error(`Error loading ${filename}.json:`, error);
            return { items: [] };
        }
    };

    // Function to update popup content
    const updatePopupContent = async () => {
        try {
            const [statusData, featuresData, issuesData] = await Promise.all([
                loadJsonData('wiki_status'),
                loadJsonData('upcoming_features'),
                loadJsonData('known_issues')
            ]);

            const statusPopupContent = document.createElement('div');
            statusPopupContent.className = 'bg-[#28201E] rounded-xl max-w-lg w-full p-6 transform scale-95 transition-transform duration-300';
            
            statusPopupContent.innerHTML = `
                <div class="relative text-center">
                    <button id="closeStatusPopup" class="absolute top-0 right-0 text-[#8E8074] hover:text-[#C89F65]">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    <h2 class="text-2xl font-bold text-[#8E8074] mb-4 text-center">Tabac Wiki Status Report</h2>
                    <div class="space-y-4 text-center">
                        <div class="bg-[#241e1c] rounded-lg p-4">
                            <h3 class="text-lg font-semibold text-[#8E8074] mb-3 text-center"></h3>
                            <ul class="space-y-2 text-[#BDAE9F]">

                                <li class="flex justify-between">
                                    <span>Domain:</span>
                                    <span class="font-semibold">361 days until expiry</span>
                                </li>

                                <li class="flex justify-between">
                                    <span>Last Update:</span>
                                    <span class="font-semibold">Feb 15, 2025</span>
                                </li>

                                <li class="flex justify-between">
                                    <span>Blend Database:</span>
                                    <span class="font-semibold">Up to date</span>
                                </li>

                                <li class="flex justify-between">
                                    <span>Community Contributions:</span>
                                    <span class="font-semibold">0 accepted, 0 rejected</span>
                                </li>

                                <li class="flex justify-between">
                                    <span>Bug Bounty Allowance:</span>
                                    <span class="font-semibold">0.00 BTC ($0 USD)</span>
                                </li>

                                <li class="flex justify-between">
                                    <span>Donations Received:</span>
                                    <span class="font-semibold">0.00 BTC ($0 USD)</span>
                                </li>

                                <li class="flex justify-between">
                                    <span>Bounty Rewards:</span>
                                    <span class="font-semibold">0.00 BTC ($0 USD)</span>
                                </li>


                            </ul>
                        </div>
                        <div id="toggleFeatures" class="bg-[#241e1c] rounded-lg p-4 mt-4 cursor-pointer hover:bg-[#352c26] transition-colors duration-200">
                            <div class="flex items-center justify-between text-lg font-semibold text-[#8E8074]">
                                <span>Upcoming Features</span>
                                <svg class="w-5 h-5 transform transition-transform duration-200" id="featuresArrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                            <div id="featuresContent" class="overflow-hidden">
                                <ul class="list-none space-y-2 text-[#8E8074]">
                                    ${createListItems(featuresData.items)}
                                </ul>
                            </div>
                        </div>
                        <div id="toggleIssues" class="bg-[#241e1c] rounded-lg p-4 mt-4 cursor-pointer hover:bg-[#352c26] transition-colors duration-200">
                            <div class="flex items-center justify-between text-lg font-semibold text-[#8E8074]">
                                <span>Known Issues</span>
                                <svg class="w-5 h-5 transform transition-transform duration-200" id="issuesArrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                            <div id="issuesContent" class="overflow-hidden">
                                <ul class="list-none space-y-2 text-[#8E8074]">
                                    ${createListItems(issuesData.items)}
                                </ul>
                            </div>
                        </div>
                        <button id="reportProblemBtn" class="mt-6 w-full bg-[#352c26]/50 hover:bg-[#49362F]/50 text-[#8E8074] font-medium py-2 px-4 rounded transition-colors duration-200">
                            Report A Problem
                        </button>
                    </div>
                </div>
            `;

            // Clear existing content and append new content
            statusPopup.innerHTML = '';
            statusPopup.appendChild(statusPopupContent);

            // Reattach event listeners
            document.getElementById('closeStatusPopup').addEventListener('click', closeStatusPopup);
            document.getElementById('reportProblemBtn').addEventListener('click', () => {
                // Close the status popup before opening the problem report popup
                closeStatusPopup();
                
                // Use the createProblemReportPopup method from the imported module
                ProblemReportModule.createProblemReportPopup();
            });

            // Add toggle functionality for issues and features sections
            const toggleIssues = document.getElementById('toggleIssues');
            const issuesContent = document.getElementById('issuesContent');
            const issuesArrow = document.getElementById('issuesArrow');
            const toggleFeatures = document.getElementById('toggleFeatures');
            const featuresContent = document.getElementById('featuresContent');
            const featuresArrow = document.getElementById('featuresArrow');

            function setupSmoothToggle(toggleElement, contentElement, arrowElement) {
                // Prepare content for smooth transition
                contentElement.style.overflow = 'hidden';
                contentElement.style.transition = 'max-height 0.3s ease-out, opacity 0.3s ease-out';
                contentElement.style.maxHeight = '0px';
                contentElement.style.opacity = '0';

                toggleElement.addEventListener('click', () => {
                    const isHidden = contentElement.style.maxHeight === '0px';

                    if (isHidden) {
                        // Open
                        contentElement.style.maxHeight = `${contentElement.scrollHeight}px`;
                        contentElement.style.opacity = '1';
                        arrowElement.classList.add('rotate-180');
                    } else {
                        // Close
                        contentElement.style.maxHeight = '0px';
                        contentElement.style.opacity = '0';
                        arrowElement.classList.remove('rotate-180');
                    }
                });
            }

            // Setup smooth toggles
            setupSmoothToggle(toggleIssues, issuesContent, issuesArrow);
            setupSmoothToggle(toggleFeatures, featuresContent, featuresArrow);
        } catch (error) {
            console.error('Error updating popup content:', error);
        }
    };

    
    const popupContent = document.createElement('div');
    popupContent.className = 'bg-[#28201E] rounded-xl max-w-lg w-full p-6 transform scale-95 transition-transform duration-300';
    
    // Define crypto buttons data
    const cryptoButtons = [
        { id: 'xmr', label: 'XMR', altText: 'Monero', address: '47gBRkVs6ZbCdRmqrCo6awXYPsMwFFsNcifBBTtDzbW6C4ziaQgss9TQgWuKfYAu37MY7v6eMjpyBFdsMLMF2ZVQMCxWvYt', color: 'bg-[#632617]/50' },
        { id: 'btc', label: 'BTC', altText: 'Bitcoin', address: 'bc1qxc55djna5gslqzz2wzrp755sy5u7h2mgdhu9sj', color: 'bg-[#635017]/50' },
        { id: 'icp', label: 'ICP', altText: 'Internet Computer', address: '1625be0ccc8303fc69ba693bae13d8b9fed6c5f27e3ccf2e88a09c4920d18adc', color: 'bg-[#631742]/50' },
        { id: 'eth', label: 'ETH', altText: 'Ethereum', address: '0x67A0812ad4cdcF7Dde6948F92c9c1C943601b153', color: 'bg-[#0A2936]/50' },
        { id: 'ltc', label: 'LTC', altText: 'Litecoin', address: 'ltc1q85xawp9p22a0nqr6amn7sxwy06svfpwkwhpavy', color: 'bg-[#0A3622]/50' },
        { id: 'tp', label: 'Can you code?', altText: 'You could help!!', address: 'https://github.com/TabacWiki/TabacWiki/blob/main/README.md', color: 'bg-[#175863]/50', isLink: true }
    ];

    popupContent.innerHTML = `
        <div class="relative text-center">
            <button id="closeDonationPopup" class="absolute top-0 right-0 text-[#8E8074] hover:text-[#C89F65]">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
            <h2 class="text-2xl font-bold text-[#8E8074] mb-4">The Tabac Wiki Needs You!</h2>
            <p class="text-[#8E8074] mb-6">Your donation directly helps support the maintainance of the database, upkeep of the domain name and growth of the wiki via reward allocations for the Bug Bounty Program</p>
            <div class="grid grid-cols-2 gap-4 mb-6">
                ${cryptoButtons.map(btn => `
                    <button 
                        id="${btn.id}Button"
                        class="crypto-btn bg-[#241e1c] hover:bg-[#352c26] text-[#8E8074] font-bold py-3 px-4 rounded-lg text-center transition-all duration-300 backdrop-blur-sm"
                        data-address="${btn.address}"
                        data-label="${btn.label}"
                        data-alt-text="${btn.altText}">
                        ${btn.label}
                    </button>
                `).join('')}
            </div>
            <p class="text-[#8E8074] text-sm mt-6 text-center">$25 USD renews domain name for a year or pays for 1-3 bug bounties!</p>
        </div>
    `;

    // Initial content update
    updatePopupContent();

    // Append donation popup content
    popup.appendChild(popupContent);

    const copyNotification = document.createElement('div');
    copyNotification.id = 'copyNotification';
    copyNotification.className = 'fixed top-0 left-0 w-full bg-[#28201E] text-[#BDAE9F] text-center py-3 z-[100] shadow-lg transform -translate-y-full transition-transform duration-300';
    copyNotification.innerHTML = `
        <div class="max-w-xl mx-auto flex items-center justify-center">
            <svg class="w-6 h-6 mr-3 text-[#C89F65]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Wallet address copied to clipboard!</span>
        </div>
    `;
    document.body.appendChild(copyNotification);

    // Function to show notification
    function showCopyNotification() {
        copyNotification.style.transform = 'translate(0, 0)';
        setTimeout(() => {
            copyNotification.style.transform = 'translate(0, -100%)';
        }, 3000);
    }

    // Append all popups to document body
    document.body.appendChild(popup);
    document.body.appendChild(statusPopup);

    // Add event listeners for donation popup
    donationButton.addEventListener('click', openDonationPopup);
    document.getElementById('closeDonationPopup').addEventListener('click', closeDonationPopup);

    // Add event listeners for status popup
    statusButton.addEventListener('click', () => {
        openStatusPopup();
        updatePopupContent(); // Refresh content when opening popup
    });

    // Add click outside handlers
    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            closeDonationPopup();
        }
    });

    statusPopup.addEventListener('click', (event) => {
        if (event.target === statusPopup) {
            closeStatusPopup();
        }
    });

    // Add escape key handler for all popups
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (!popup.classList.contains('hidden')) {
                closeDonationPopup();
            }
            if (!statusPopup.classList.contains('hidden')) {
                closeStatusPopup();
            }
        }
    });

    // Add event listeners for crypto buttons after DOM insertion
    
    // Add event listeners for donation popup
    donationButton.addEventListener('click', openDonationPopup);
    document.getElementById('closeDonationPopup').addEventListener('click', closeDonationPopup);
    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            closeDonationPopup();
        }
    });

    // Add event listeners for status popup
    statusButton.addEventListener('click', () => {
        openStatusPopup();
        updatePopupContent(); // Refresh content when opening popup
    });
    
    statusPopup.addEventListener('click', (event) => {
        if (event.target === statusPopup) {
            closeStatusPopup();
        }
    });
    
    // Escape key handler for both popups
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (!popup.classList.contains('hidden')) {
                closeDonationPopup();
            }
            if (!statusPopup.classList.contains('hidden')) {
                closeStatusPopup();
            }
        }
    });

    // Add event listeners for crypto buttons after DOM insertion
    cryptoButtons.forEach(btn => {
        const button = document.getElementById(`${btn.id}Button`);
        if (button) {
            // Hover effect to change text
            button.addEventListener('mouseenter', () => {
                button.textContent = button.dataset.altText;
            });

            button.addEventListener('mouseleave', () => {
                button.textContent = button.dataset.label;
            });

            // Click to copy address
            button.addEventListener('click', () => {
                if (btn.isLink) {
                    window.open(button.dataset.address, '_blank');
                } else {
                    // Copy to clipboard for crypto addresses
                    navigator.clipboard.writeText(button.dataset.address)
                        .then(() => {
                            showCopyNotification();
                        })
                        .catch(err => {
                            console.error('Failed to copy address:', err);
                        });
                }
            });
        }
    });
    
    // Add event listeners
    donationButton.addEventListener('click', openDonationPopup);
    document.getElementById('closeDonationPopup').addEventListener('click', closeDonationPopup);
    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            closeDonationPopup();
        }
    });

    // Add escape key listener
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !popup.classList.contains('hidden')) {
            closeDonationPopup();
        }
    });
}

function openDonationPopup() {
    const popup = document.getElementById('donationPopup');
    if (popup) {
        popup.classList.remove('hidden');
        popup.classList.add('flex');
        
        // Add fade-in transition
        popup.style.opacity = '0';
        // Force reflow
        popup.offsetHeight;
        popup.style.transition = 'opacity 0.3s ease-in';
        popup.style.opacity = '1';
    }
}

function closeDonationPopup() {
    const popup = document.getElementById('donationPopup');
    if (popup) {
        // Smooth fade-out
        popup.style.opacity = '0';
        popup.style.transition = 'opacity 0.2s ease-out';
        
        setTimeout(() => {
            popup.classList.remove('flex');
            popup.classList.add('hidden');
        }, 200);
    }
}

function openStatusPopup() {
    const popup = document.getElementById('statusPopup');
    if (popup) {
        popup.classList.remove('hidden');
        popup.classList.add('flex');
        
        // Add fade-in transition
        popup.style.opacity = '0';
        // Force reflow
        popup.offsetHeight;
        popup.style.transition = 'opacity 0.3s ease-in';
        popup.style.opacity = '1';
    }
}

function closeStatusPopup() {
    const popup = document.getElementById('statusPopup');
    if (popup) {
        // Smooth fade-out
        popup.style.opacity = '0';
        popup.style.transition = 'opacity 0.2s ease-out';
        
        setTimeout(() => {
            popup.classList.remove('flex');
            popup.classList.add('hidden');
        }, 200);
    }
}
