// Problem Report Popup Module
const ProblemReportModule = (function() {
  const CLOUDFLARE_WORKER_URL = 'https://problem-report.tabacwiki.workers.dev';

  function createProblemReportPopup() {
    // Create popup container
    const popupContainer = document.createElement('div');
    popupContainer.id = 'problem-report-popup';
    popupContainer.classList.add('problem-report-popup');
    popupContainer.innerHTML = `
      <div class="problem-report-modal">
        <h2>Report a Problem</h2>
        <form id="problem-report-form">
          <div class="form-group">
            <label for="submitter-name">Your Name (Optional)</label>
            <input type="text" id="submitter-name" name="submitter_name" placeholder="Enter your name">
          </div>
          <div class="form-group">
            <label for="problem-title">Problem Title <span class="required">*</span></label>
            <input type="text" id="problem-title" name="problem_title" required placeholder="Briefly describe the issue">
          </div>
          <div class="form-group">
            <label for="problem-description">Problem Description <span class="required">*</span></label>
            <textarea id="problem-description" name="problem_description" required placeholder="Provide detailed information about the problem"></textarea>
          </div>
          <div class="form-group">
            <label for="attachment">Attachment (Optional)</label>
            <input type="file" id="attachment" name="attachment" accept="image/*">
          </div>
          <div class="form-actions">
            <button type="button" id="cancel-problem-report" class="btn btn-secondary">Cancel</button>
            <button type="submit" id="submit-problem-report" class="btn btn-primary">Submit Report</button>
          </div>
        </form>
      </div>
    `;

    // Add styles
    const styles = `
      .problem-report-popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      .problem-report-modal {
        background-color: #28201E;
        padding: 30px;
        border-radius: 12px;
        width: 500px;
        max-width: 90%;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transform: scale(0.95);
        transition: transform 0.3s ease;
      }
      .problem-report-modal h2 {
        margin-top: 0;
        color: #8E8074;
        text-align: center;
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .form-group {
        margin-bottom: 15px;
      }
      .form-group label {
        display: block;
        margin-bottom: 5px;
        color: #8E8074;
        font-weight: semibold;
      }
      .form-group input, 
      .form-group textarea {
        width: 100%;
        padding: 8px;
        border: 1px solid #392823;
        border-radius: 4px;
        background-color: #241E1C;
        color: #BDAE9F;
      }
      .form-group textarea {
        min-height: 100px;
        resize: vertical;
      }
      .form-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
      }
      .btn {
        padding: 10px 15px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s;
      }
      .btn-primary {
        background-color: #352C26;
        color: #8E8074;
      }
      .btn-primary:hover {
        background-color: #49362F;
      }
      .btn-secondary {
        background-color: #241E1C;
        color: #8E8074;
      }
      .btn-secondary:hover {
        background-color: #352C26;
      }
      .required {
        color: #C89F65;
      }
      .form-group input:focus, 
      .form-group textarea:focus {
        outline: 2px solid #C89F65;
        border-color: #C89F65;
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // Add event listeners
    document.body.appendChild(popupContainer);
    
    const form = popupContainer.querySelector('#problem-report-form');
    const cancelButton = popupContainer.querySelector('#cancel-problem-report');

    cancelButton.addEventListener('click', closeProblemReportPopup);
    form.addEventListener('submit', handleProblemReportSubmission);

    return popupContainer;
  }

  function closeProblemReportPopup() {
    const popup = document.getElementById('problem-report-popup');
    if (popup) {
      popup.remove();
    }
  }

  async function handleProblemReportSubmission(event) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('#submit-problem-report');
    const formData = new FormData(form);

    // Basic validation
    if (!validateForm(form)) {
      return;
    }

    try {
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';

      const response = await fetch(CLOUDFLARE_WORKER_URL, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const result = await response.json();

      if (result.success) {
        alert('Problem report submitted successfully! Thank you for helping improve TabacWiki.');
        closeProblemReportPopup();
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Problem report submission error:', error);
      alert(`Failed to submit problem report: ${error.message}`);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit Report';
    }
  }

  function validateForm(form) {
    const problemTitle = form.querySelector('#problem-title');
    const problemDescription = form.querySelector('#problem-description');

    if (!problemTitle.value.trim()) {
      alert('Please provide a problem title.');
      problemTitle.focus();
      return false;
    }

    if (!problemDescription.value.trim()) {
      alert('Please provide a detailed problem description.');
      problemDescription.focus();
      return false;
    }

    return true;
  }

  // Hyperlink method (placeholder for future implementation)
  function reportProblemViaHyperlink() {
    // Future implementation to redirect to GitHub issues
    window.open('https://github.com/TabacWiki/TabacWiki/issues/new', '_blank');
  }

  return {
    createProblemReportPopup,
    reportProblemViaHyperlink
  };
})();

// Export for potential use in other modules
export default ProblemReportModule;

// Immediately expose function to global scope
if (typeof window !== 'undefined') {
  window.openProblemReportPopup = ProblemReportModule.createProblemReportPopup;
  console.log('openProblemReportPopup function set globally');
}

// Multiple ways to attach the event listener
function attachEventListeners() {
  console.log('Attaching event listeners');
  
  // Method 1: Direct button in Wiki Status popup
  const reportButton1 = document.querySelector('#wiki-status-popup button');
  if (reportButton1) {
    console.log('Found button in Wiki Status popup');
    reportButton1.addEventListener('click', ProblemReportModule.createProblemReportPopup);
  } else {
    console.warn('Could not find button in Wiki Status popup');
  }

  // Method 2: Button by specific ID
  const reportButton2 = document.getElementById('report-problem-btn');
  if (reportButton2) {
    console.log('Found button by ID');
    reportButton2.addEventListener('click', ProblemReportModule.createProblemReportPopup);
  } else {
    console.warn('Could not find button by ID');
  }
}

// Try to attach listeners immediately and on DOM content loaded
attachEventListeners();
document.addEventListener('DOMContentLoaded', attachEventListeners);

console.log('Problem report script loaded, openProblemReportPopup function registered');
