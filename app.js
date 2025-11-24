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
let logoLoaded = false;

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

// Add Logo to QR Code
function addLogoToQRCode(qrSize) {
    const canvas = qrCodeContainer.querySelector('canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const logoUrl = 'sts-logo.svg';
    
    // Calculate logo size (about 20% of QR code size)
    const logoSize = qrSize * 0.2;
    const logoX = (qrSize - logoSize) / 2;
    const logoY = (qrSize - logoSize) / 2;
    
    // Create an image element for the logo
    const logo = new Image();
    
    logo.onload = function() {
        // Draw white background circle for the logo
        const padding = 10;
        const bgSize = logoSize + padding * 2;
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(qrSize / 2, qrSize / 2, bgSize / 2, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw the logo
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
        
        // Mark logo as loaded
        logoLoaded = true;
    };
    
    logo.onerror = function() {
        console.error('Failed to load logo');
        logoLoaded = false;
    };
    
    logo.src = logoUrl;
}

// Generate QR Code
function generateQRCode() {
    const url = urlInput.value.trim();
    
    // Reset logo loaded flag
    logoLoaded = false;
    
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
        // Check URL length and adjust settings accordingly
        const urlLength = url.length;
        let qrSize = 256;
        // Use HIGH error correction to allow logo in center
        let correctLevel = QRCode.CorrectLevel.H;
        
        // For very long URLs, use lower error correction and larger size
        if (urlLength > 200) {
            correctLevel = QRCode.CorrectLevel.M; // Medium for very long URLs (logo may affect scanning)
            qrSize = 300; // Larger size for better scanning
        } else if (urlLength > 150) {
            correctLevel = QRCode.CorrectLevel.H;
            qrSize = 280;
        }
        
        qrCodeInstance = new QRCode(qrCodeContainer, {
            text: url,
            width: qrSize,
            height: qrSize,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: correctLevel
        });
        
        // Remove the img element, keep only the canvas
        // QRCode.js generates both canvas and img, we only need canvas
        setTimeout(() => {
            const img = qrCodeContainer.querySelector('img');
            if (img) {
                img.remove();
            }
            
            // Add logo to the center of QR code
            addLogoToQRCode(qrSize);
        }, 100);
        
        // Show QR code card with animation
        qrCodeCard.classList.remove('hidden');
        qrCodeCard.classList.add('animate-fadeIn');
        
        // Scroll to QR code
        setTimeout(() => {
            qrCodeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        
    } catch (error) {
        // Provide more detailed error message
        let errorMsg = 'Failed to generate QR code. ';
        if (url.length > 250) {
            errorMsg += 'The URL is too long. Try using a URL shortener.';
        } else {
            errorMsg += 'Please try again or use a shorter URL.';
        }
        showError(errorMsg);
        console.error('QR Code generation error:', error);
        console.error('URL length:', url.length);
        console.error('URL:', url);
    }
}

// Download QR Code directly
function downloadQRCode() {
    try {
        // Get the canvas element from QRCode.js
        const canvas = qrCodeContainer.querySelector('canvas');
        
        if (!canvas) {
            alert('No QR code to download. Please generate one first.');
            return;
        }
        
        // Function to perform the download
        const performDownload = () => {
            try {
                const timestamp = new Date().getTime();
                const defaultFilename = `qrcode-${timestamp}.png`;
                
                // Convert canvas to blob using the proper method
                canvas.toBlob((blob) => {
                    if (!blob) {
                        alert('Failed to create image. Please try again.');
                        return;
                    }
                    
                    // Try using the modern download API if available
                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                        // For IE/Edge
                        window.navigator.msSaveOrOpenBlob(blob, defaultFilename);
                    } else {
                        // For modern browsers - create a temporary link
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        
                        // Set link properties
                        link.href = url;
                        link.download = defaultFilename;
                        link.style.display = 'none';
                        
                        // Add to document, click, and remove
                        document.body.appendChild(link);
                        
                        // Force download by simulating click
                        link.dispatchEvent(new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        }));
                        
                        // Clean up after a delay
                        setTimeout(() => {
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                        }, 250);
                    }
                    
                    // Show success message
                    showSuccessMessage('QR code downloaded successfully!');
                    
                }, 'image/png', 1.0);
                
            } catch (err) {
                console.error('Download error:', err);
                alert('Failed to download QR code. Please try again.');
            }
        };
        
        // Wait for logo to load if it hasn't loaded yet
        if (!logoLoaded) {
            // Wait a bit for the logo to load
            setTimeout(performDownload, 500);
        } else {
            performDownload();
        }
        
    } catch (error) {
        alert('Failed to download QR code. Please try again.');
        console.error('Download error:', error);
    }
}

// Show success message
function showSuccessMessage(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-lime-500 text-gray-900 px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn font-semibold';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Event Listeners
generateBtn.addEventListener('click', generateQRCode);

// Download directly when download button is clicked
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

