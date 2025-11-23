// QR Code Generator Application

// DOM Elements
const urlInput = document.getElementById('urlInput');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qrCodeCard = document.getElementById('qrCodeCard');
const qrCodeContainer = document.getElementById('qrcode');
const errorMessage = document.getElementById('errorMessage');

// QR Code instance
let qrCodeInstance = null;

// URL Validation Function
function isValidURL(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (err) {
        return false;
    }
}

// Show Error Message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    urlInput.classList.add('border-red-500');
    urlInput.classList.remove('border-gray-700');
}

// Hide Error Message
function hideError() {
    errorMessage.classList.add('hidden');
    urlInput.classList.remove('border-red-500');
    urlInput.classList.add('border-gray-700');
}

// Generate QR Code
function generateQRCode() {
    const url = urlInput.value.trim();
    
    // Hide any previous errors
    hideError();
    
    // Validate input
    if (!url) {
        showError('Please enter a URL');
        return;
    }
    
    if (!isValidURL(url)) {
        showError('Please enter a valid URL (must start with http:// or https://)');
        return;
    }
    
    // Clear previous QR code
    qrCodeContainer.innerHTML = '';
    
    // Generate new QR code
    try {
        qrCodeInstance = new QRCode(qrCodeContainer, {
            text: url,
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
        
        // Show QR code card with animation
        qrCodeCard.classList.remove('hidden');
        qrCodeCard.classList.add('animate-fadeIn');
        
        // Scroll to QR code
        setTimeout(() => {
            qrCodeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        
    } catch (error) {
        showError('Failed to generate QR code. Please try again.');
        console.error('QR Code generation error:', error);
    }
}

// Download QR Code
function downloadQRCode() {
    try {
        // Get the canvas element from QRCode.js
        const canvas = qrCodeContainer.querySelector('canvas');
        
        if (!canvas) {
            alert('No QR code to download. Please generate one first.');
            return;
        }
        
        // Convert canvas to blob and download
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const timestamp = new Date().getTime();
            
            link.download = `qrcode-${timestamp}.png`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up the URL object
            URL.revokeObjectURL(url);
        });
        
    } catch (error) {
        alert('Failed to download QR code. Please try again.');
        console.error('Download error:', error);
    }
}

// Event Listeners
generateBtn.addEventListener('click', generateQRCode);

downloadBtn.addEventListener('click', downloadQRCode);

// Allow Enter key to generate QR code
urlInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        generateQRCode();
    }
});

// Clear error when user starts typing
urlInput.addEventListener('input', function() {
    if (errorMessage.classList.contains('hidden') === false) {
        hideError();
    }
});

// Focus on input when page loads
window.addEventListener('load', function() {
    urlInput.focus();
});

