// Donation popup functionality
import { config } from './config.js';

export function initDonationPopup() {
    // Create container for both buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'fixed bottom-4 left-0 w-64 flex flex-col gap-2 z-40';

    // Create donation button
    const donationButton = document.createElement('button');
    donationButton.id = 'donationButton';
    donationButton.className = 'w-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-medium py-2 rounded shadow-md transition-all duration-200 border border-gray-700 hover:border-gray-600';
    donationButton.innerHTML = 'Support The Wiki';

    // Create wiki status button
    const statusButton = document.createElement('button');
    statusButton.id = 'statusButton';
    statusButton.className = 'w-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-medium py-1.5 rounded shadow-md transition-all duration-200 border border-gray-700 hover:border-gray-600 text-sm';
    statusButton.innerHTML = 'Wiki Status';
    
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
    popup.className = 'hidden fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4';

    // Create status popup elements
    const statusPopup = document.createElement('div');
    statusPopup.id = 'statusPopup';
    statusPopup.className = 'hidden fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4';
    
    // Calculate days until domain expiry
    const expiryDate = new Date('02-11-26');
    const today = new Date();
    const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    const statusPopupContent = document.createElement('div');
    statusPopupContent.className = 'bg-gray-800 rounded-xl max-w-lg w-full p-6 transform scale-95 transition-transform duration-300';
    
    statusPopupContent.innerHTML = `
        <div class="relative text-center">
            <button id="closeStatusPopup" class="absolute top-0 right-0 text-gray-400 hover:text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
            <h2 class="text-2xl font-bold text-white mb-4">Wiki Status</h2>
            <div class="space-y-4 text-left">
                <div class="bg-gray-700 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-white mb-2">Current Status</h3>
                    <ul class="list-none space-y-2 text-gray-300">
                        <li class="flex">
                            <span class="mr-2">•</span>
                            <span class="flex-1 -mt-0.5">Domain: ${daysRemaining} days until expiry</span>
                        </li>
                        <li class="flex">
                            <span class="mr-2">•</span>
                            <span class="flex-1 -mt-0.5">Blend Database: Ever so slightly behind</span>
                        </li>
                        <li class="flex">
                            <span class="mr-2">•</span>
                            <span class="flex-1 -mt-0.5">Last Update: Jan 10, 2024</span>
                        </li>
                    </ul>
                </div>
                <div class="bg-gray-700 rounded-lg p-4">
                    <h3 class="text-lg font-semibold text-white mb-2">Known Issues:</h3>
                    <ul class="list-none space-y-2 text-gray-300">
                        <li class="flex">
                            <span class="mr-2">•</span>
                            <span class="flex-1 -mt-0.5">Blend Card Navigation Errors (navigation craps it sometimes)</span>
                        </li>
                        <li class="flex">
                            <span class="mr-2">•</span>
                            <span class="flex-1 -mt-0.5">Pagination Errors (disappearing blends?)</span>
                        </li>
                        <li class="flex">
                            <span class="mr-2">•</span>
                            <span class="flex-1 -mt-0.5">Long initial load time (takes up to 50s)</span>
                        </li>
                    </ul>
                </div>
                <button id="reportProblemBtn" class="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200">
                    Report A Problem
                </button>
            </div>
        </div>
    `;

    // Create report problem popup
    const reportPopup = document.createElement('div');
    reportPopup.id = 'reportPopup';
    reportPopup.className = 'hidden fixed inset-0 bg-black bg-opacity-70 z-[51] flex items-center justify-center p-4';

    const reportPopupContent = document.createElement('div');
    reportPopupContent.className = 'bg-gray-800 rounded-xl max-w-lg w-full p-6 transform scale-95 transition-transform duration-300';

    reportPopupContent.innerHTML = `
        <div class="relative text-center">
            <button id="closeReportPopup" class="absolute top-0 right-0 text-gray-400 hover:text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
            <h2 class="text-2xl font-bold text-white mb-4">Report A Problem</h2>
            <div class="space-y-4">
                <textarea
                    id="problemDescription"
                    class="w-full h-40 px-3 py-2 text-gray-300 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Describe the problem you're experiencing..."
                ></textarea>
                <button id="submitProblem" class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200">
                    Submit Report
                </button>
            </div>
        </div>
    `;
    
    const popupContent = document.createElement('div');
    popupContent.className = 'bg-gray-800 rounded-xl max-w-lg w-full p-6 transform scale-95 transition-transform duration-300';
    
    // Define crypto buttons data
    const cryptoButtons = [
        { id: 'xmr', label: 'XMR', altText: 'Monero', address: 'your_xmr_address_here', color: 'orange' },
        { id: 'btc', label: 'BTC', altText: 'Bitcoin', address: 'your_btc_address_here', color: 'yellow' },
        { id: 'icp', label: 'ICP', altText: 'Internet Computer', address: 'your_icp_address_here', color: 'purple' },
        { id: 'eth', label: 'ETH', altText: 'Ethereum', address: 'your_eth_address_here', color: 'blue' },
        { id: 'ltc', label: 'LTC', altText: 'Litecoin', address: 'your_ltc_address_here', color: 'gray' },
        { id: 'tp', label: 'Can you code?', altText: 'You could help!!', address: 'https://github.com/TabacWiki/TabacWiki', color: 'pink', isLink: true }
    ];

    popupContent.innerHTML = `
        <div class="relative text-center">
            <button id="closeDonationPopup" class="absolute top-0 right-0 text-gray-400 hover:text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
            <h2 class="text-2xl font-bold text-white mb-4">The Tabac Wiki Needs You!</h2>
            <p class="text-gray-300 mb-6">Your support helps maintain the database, fix issues, add new features, and keeps this resource free and available for everyone. All contributions will go directly to the upkeep and growth of the Tabac Wiki. Thank you!</p>
            <div class="grid grid-cols-2 gap-4 mb-6">
                ${cryptoButtons.map(btn => `
                    <button 
                        id="${btn.id}Button"
                        class="crypto-btn bg-${btn.color}-600 hover:bg-${btn.color}-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-all duration-300"
                        data-address="${btn.address}"
                        data-label="${btn.label}"
                        data-alt-text="${btn.altText}">
                        ${btn.label}
                    </button>
                `).join('')}
            </div>
            <div id="copyNotification" class="hidden fixed left-1/2 transform -translate-x-1/2 top-[-80px] bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 z-[60]">
                Wallet address copied to clipboard!
            </div>
            <p class="text-gray-400 text-sm mt-6 text-center">$25 renews the domain name for a year / pays for 1 hour of debugging!</p>
        </div>
    `;

    // Append all content to their respective popups
    popup.appendChild(popupContent);
    statusPopup.appendChild(statusPopupContent);
    reportPopup.appendChild(reportPopupContent);

    // Append all popups to document body
    document.body.appendChild(popup);
    document.body.appendChild(statusPopup);
    document.body.appendChild(reportPopup);

    // Add event listeners for donation popup
    donationButton.addEventListener('click', openDonationPopup);
    document.getElementById('closeDonationPopup').addEventListener('click', closeDonationPopup);

    // Add event listeners for status popup
    statusButton.addEventListener('click', openStatusPopup);
    document.getElementById('closeStatusPopup').addEventListener('click', closeStatusPopup);

    // Add event listeners for report popup
    const reportProblemBtn = document.getElementById('reportProblemBtn');
    const closeReportBtn = document.getElementById('closeReportPopup');
    const submitProblemBtn = document.getElementById('submitProblem');

    reportProblemBtn.addEventListener('click', () => {
        reportPopup.classList.remove('hidden');
        reportPopup.classList.add('flex');
        const content = reportPopup.querySelector('div');
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
    });

    closeReportBtn.addEventListener('click', () => {
        const content = reportPopup.querySelector('div');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        setTimeout(() => {
            reportPopup.classList.remove('flex');
            reportPopup.classList.add('hidden');
        }, 200);
    });

    submitProblemBtn.addEventListener('click', async () => {
        const submitButton = document.getElementById('submitProblem');
        const problemText = document.getElementById('problemDescription').value;
        const notification = document.getElementById('copyNotification');

        if (!problemText.trim()) {
            notification.textContent = 'Please describe the problem before submitting.';
            notification.classList.remove('bg-green-500');
            notification.classList.add('bg-red-500');
            notification.classList.remove('hidden');
            notification.style.top = '20px';
            setTimeout(() => {
                notification.style.top = '-80px';
                setTimeout(() => {
                    notification.classList.add('hidden');
                    notification.classList.remove('bg-red-500');
                    notification.classList.add('bg-green-500');
                }, 300);
            }, 3000);
            return;
        }

        try {
            // Disable the submit button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = 'Submitting...';

            // GitHub token for creating issues
            const token = config.githubToken;
            
            const headers = {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json',
            };
            
            // First verify the token works
            try {
                const verifyResponse = await fetch('https://api.github.com/user', { headers });
                console.log('Token verification response:', await verifyResponse.json());
                
                if (!verifyResponse.ok) {
                    throw new Error(`Token verification failed: ${verifyResponse.status}`);
                }
            } catch (error) {
                console.error('Token verification error:', error);
                throw new Error('Failed to verify GitHub token');
            }
            
            // Log the request details
            console.log('Raw token:', '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');
            console.log('Encoded token:', token);
            console.log('Request headers:', headers);
            console.log('Request body:', {
                title: 'User Reported Issue',
                body: problemText,
                labels: ['user-reported']
            });
            
            const response = await fetch('https://api.github.com/repos/TabacWiki/TabacWiki/issues', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    title: 'User Reported Issue',
                    body: problemText,
                    labels: ['user-reported']
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('GitHub API Error:', errorText);
                throw new Error(`Failed to submit report: ${response.status} ${response.statusText}`);
            }

            // Clear the textarea
            document.getElementById('problemDescription').value = '';

            // Close the report popup first
            const content = reportPopup.querySelector('div');
            content.classList.remove('scale-100');
            content.classList.add('scale-95');
            reportPopup.classList.remove('flex');
            reportPopup.classList.add('hidden');

            // Show success message
            notification.textContent = 'Thanks for your report! Your issue has been created.';
            notification.classList.remove('hidden');
            notification.style.top = '20px';
            setTimeout(() => {
                notification.style.top = '-80px';
                setTimeout(() => {
                    notification.classList.add('hidden');
                }, 300);
            }, 3000);

        } catch (error) {
            console.error('Error submitting report:', error);
            notification.textContent = 'Sorry, there was an error submitting your report. Please try again later.';
            notification.classList.remove('bg-green-500');
            notification.classList.add('bg-red-500');
            notification.classList.remove('hidden');
            notification.style.top = '20px';
            setTimeout(() => {
                notification.style.top = '-80px';
                setTimeout(() => {
                    notification.classList.add('hidden');
                    notification.classList.remove('bg-red-500');
                    notification.classList.add('bg-green-500');
                }, 300);
            }, 3000);
        } finally {
            // Re-enable the submit button and restore original text
            submitButton.disabled = false;
            submitButton.innerHTML = 'Submit Report';
        }
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

    reportPopup.addEventListener('click', (event) => {
        if (event.target === reportPopup) {
            const content = reportPopup.querySelector('div');
            content.classList.remove('scale-100');
            content.classList.add('scale-95');
            setTimeout(() => {
                reportPopup.classList.remove('flex');
                reportPopup.classList.add('hidden');
            }, 200);
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
            if (!reportPopup.classList.contains('hidden')) {
                const content = reportPopup.querySelector('div');
                content.classList.remove('scale-100');
                content.classList.add('scale-95');
                setTimeout(() => {
                    reportPopup.classList.remove('flex');
                    reportPopup.classList.add('hidden');
                }, 200);
            }
        }
    });

    // Add event listeners for crypto buttons after DOM insertion

    document.getElementById('closeReportPopup').addEventListener('click', () => {
        const content = reportPopup.querySelector('div');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        setTimeout(() => {
            reportPopup.classList.remove('flex');
            reportPopup.classList.add('hidden');
        }, 200);
    });



    reportPopup.addEventListener('click', (event) => {
        if (event.target === reportPopup) {
            const content = reportPopup.querySelector('div');
            content.classList.remove('scale-100');
            content.classList.add('scale-95');
            setTimeout(() => {
                reportPopup.classList.remove('flex');
                reportPopup.classList.add('hidden');
            }, 200);
        }
    });
    
    // Add event listeners for both popups
    donationButton.addEventListener('click', openDonationPopup);
    document.getElementById('closeDonationPopup').addEventListener('click', closeDonationPopup);
    statusButton.addEventListener('click', openStatusPopup);
    document.getElementById('closeStatusPopup').addEventListener('click', closeStatusPopup);
    
    // Click outside to close for both popups
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
    
    // Escape key handler for both popups
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (!popup.classList.contains('hidden')) {
                closeDonationPopup();
            }
            if (!statusPopup.classList.contains('hidden')) {
                closeStatusPopup();
            }
            if (!reportPopup.classList.contains('hidden')) {
                const content = reportPopup.querySelector('div');
                content.classList.remove('scale-100');
                content.classList.add('scale-95');
                setTimeout(() => {
                    reportPopup.classList.remove('flex');
                    reportPopup.classList.add('hidden');
                }, 200);
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
                            const notification = document.getElementById('copyNotification');
                            notification.classList.remove('hidden');
                            notification.classList.add('opacity-100');
                            
                            setTimeout(() => {
                                notification.classList.add('opacity-0');
                                setTimeout(() => {
                                    notification.classList.add('hidden');
                                    notification.classList.remove('opacity-0');
                                }, 300);
                            }, 2000);
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
    popup.classList.remove('hidden');
    popup.classList.add('flex');
    
    // Add entrance animation
    const content = popup.querySelector('div');
    content.classList.remove('scale-95');
    content.classList.add('scale-100');
}

function closeDonationPopup() {
    const popup = document.getElementById('donationPopup');
    const content = popup.querySelector('div');
    
    // Add exit animation
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
    
    // Hide popup after animation
    setTimeout(() => {
        popup.classList.remove('flex');
        popup.classList.add('hidden');
    }, 200);
}

function openStatusPopup() {
    const popup = document.getElementById('statusPopup');
    popup.classList.remove('hidden');
    popup.classList.add('flex');
    
    // Add entrance animation
    const content = popup.querySelector('div');
    content.classList.remove('scale-95');
    content.classList.add('scale-100');
}

function closeStatusPopup() {
    const popup = document.getElementById('statusPopup');
    const content = popup.querySelector('div');
    
    // Add exit animation
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
    
    // Hide popup after animation
    setTimeout(() => {
        popup.classList.remove('flex');
        popup.classList.add('hidden');
    }, 200);
}
