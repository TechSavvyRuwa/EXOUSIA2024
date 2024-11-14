document.addEventListener('DOMContentLoaded', () => {

    const { jsPDF } = window.jspdf;

    // Retrieve data and QR code URL from localStorage
    const data = JSON.parse(localStorage.getItem('qrData') || '{}');
    const qrCodeUrl = localStorage.getItem('qrCodeUrl');

    console.log('QR Data:', data);
    console.log('QR Code URL:', qrCodeUrl);

    // Fill in ticket details
    const firstNameElem = document.getElementById('first-name');
    const lastNameElem = document.getElementById('last-name');
    const ticketIDElem = document.getElementById('ticket-id');
    const companyNameElem = document.getElementById('company-name');
    const jobPositionElem = document.getElementById('job-position');
    const qrElement = document.getElementById('qrcode');

    if (firstNameElem) firstNameElem.textContent = data.firstName || '';
    if (lastNameElem) lastNameElem.textContent = data.lastName || '';
    if (ticketIDElem) ticketIDElem.textContent = data.ticketID || '';
    if (companyNameElem) companyNameElem.textContent = data.companyName || '';
    if (jobPositionElem) jobPositionElem.textContent = data.jobPosition || '';
    if (qrElement && qrCodeUrl) {
        const img = document.createElement("img");
        img.src = qrCodeUrl;
        qrElement.appendChild(img);
    }

    // Back button functionality
    document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = 'index.html'; // Navigate back to the form
    });

    // Download ticket as PDF
    document.getElementById('download-btn').addEventListener('click', () => {
        const doc = new jsPDF();
        
        // Add banner image to the top of the PDF
        const bannerImg = new Image();
        bannerImg.src = './images/banner_1.jpeg'; // Ensure this is the correct path to your image

        bannerImg.onload = function() {
            // Calculate the correct size for the banner image to maintain quality
            const bannerWidth = 190; // Set the width for the banner
            const bannerHeight = (bannerImg.height / bannerImg.width) * bannerWidth; // Maintain aspect ratio

            // Add the banner image
            doc.addImage(bannerImg, 'JPEG', 10, 10, bannerWidth, bannerHeight);

            // Add the second image (welcome_text.png) below the banner
            const welcomeImg = new Image();
            welcomeImg.src = './images/welcome_text.png'; // Path to your second image

            welcomeImg.onload = function() {
                // Calculate the correct size for the welcome text image
                const welcomeWidth = 190; // Set the width for the welcome text
                const welcomeHeight = (welcomeImg.height / welcomeImg.width) * welcomeWidth; // Maintain aspect ratio

                // Add the welcome text image below the banner
                doc.addImage(welcomeImg, 'PNG', 10, 10 + bannerHeight, welcomeWidth, welcomeHeight);

                // Add ticket.png after the welcome text
                const ticketImg = new Image();
                ticketImg.src = './images/ticket.png'; // Path to your ticket image

                ticketImg.onload = function() {
                    // Calculate the correct size for the ticket image
                    const ticketWidth = 190; // Set the width for the ticket image
                    const ticketHeight = (ticketImg.height / ticketImg.width) * ticketWidth; // Maintain aspect ratio

                    // Set the Y position after the welcome text and ticket image
                    let yPosition = 10 + bannerHeight + welcomeHeight + 10; // Reduced space between welcome text and ticket image

                    // Add the ticket image below the welcome text
                    doc.addImage(ticketImg, 'PNG', 10, yPosition, ticketWidth, ticketHeight);

                    // Set the Y position after the ticket image
                    yPosition += ticketHeight + 15; // Space before ticket details

                    // Center the ticket details and QR code
                    const pageWidth = doc.internal.pageSize.width;
                    const textWidth = 180; // Width for the ticket details section (set to your desired width)
                    const textXPosition = (pageWidth - textWidth) / 2; // Center horizontally

                    // Reduce text size for ticket details to fit better
                    doc.setFontSize(10); // Reduced font size to 10 for ticket details

                    // Add the ticket details below the ticket image, centered
                    // Center ticket details header
                    const headerText = "EXOUSIA 2024 Ticket";
                    const headerWidth = doc.getStringUnitWidth(headerText) * doc.getFontSize() / doc.internal.scaleFactor;
                    const headerXPosition = (pageWidth - headerWidth) / 2; // Center the header

                    doc.text(headerText, headerXPosition, yPosition);
                    yPosition += 10; // Space after the header

                    // Center each line of ticket details
                    const ticketDetails = [
                        `First Name: ${data.firstName}`,
                        `Last Name: ${data.lastName}`,
                        `Ticket ID: ${data.ticketID}`,
                        `Company: ${data.companyName}`,
                        `Job Position: ${data.jobPosition}`
                    ];

                    // Add each ticket detail line, centered
                    ticketDetails.forEach((line, index) => {
                        const lineWidth = doc.getStringUnitWidth(line) * doc.getFontSize() / doc.internal.scaleFactor;
                        const xPosition = (pageWidth - lineWidth) / 2;
                        doc.text(line, xPosition, yPosition);
                        yPosition += 5; // Reduced space between lines
                    });

                    yPosition += 5; // Extra space before QR code

                    // Center QR code horizontally
                    const qrWidth = 40; // Reduced QR code width to 40
                    const qrHeight = 40; // Keep the height equal to width for square aspect ratio
                    const qrXPosition = (pageWidth - qrWidth) / 2; // Center QR code horizontally

                    // Add the QR code to the PDF
                    doc.addImage(qrCodeUrl, 'PNG', qrXPosition, yPosition, qrWidth, qrHeight); // Position and size of QR code

                    // Save the PDF
                    doc.save('ticket.pdf');
                };
            };
        };
    });
});
