// Custom Cursor
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

window.addEventListener('mousemove', function (e) {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.style.left = `${posX}px`;
    cursorOutline.style.top = `${posY}px`;

    // Add hover effect to interactive elements
    const element = document.elementFromPoint(posX, posY);
    if (element && (element.tagName === 'A' || element.tagName === 'BUTTON' || element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.backgroundColor = 'rgba(0, 210, 255, 0.1)';
        cursorOutline.style.borderColor = 'transparent';
    } else {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.backgroundColor = 'transparent';
        cursorOutline.style.borderColor = 'var(--main-color)';
    }

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Toggle Icon Navbar
let menuIcon = document.querySelector('.menu-btn');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('fa-xmark');
    navbar.classList.toggle('active');
};

// Scroll Sections Active Link
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        }
    });

    // Sticky Header
    let header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);

    // Remove toggle icon and navbar when click navbar link
    menuIcon.classList.remove('fa-xmark');
    navbar.classList.remove('active');
};

// Scroll Reveal is optional but good. 
// If specific scroll animations are needed without external libraries:
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.about-content, .skills-container, .input-box, textarea').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// ============================================
// CONTACT FORM - EmailJS Integration
// ============================================

// Initialize EmailJS with your Public Key
// IMPORTANT: Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS Public Key
emailjs.init('YOUR_PUBLIC_KEY');

// Contact Form Handler
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formMessage = document.getElementById('form-message');

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('from_name').value.trim();
    const email = document.getElementById('from_email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Basic validation
    if (!name || !email || !phone || !subject || !message) {
        showMessage('Please fill in all fields!', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address!', 'error');
        return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
        showMessage('Please enter a valid phone number!', 'error');
        return;
    }

    // Show loading state
    submitBtn.value = 'Sending...';
    submitBtn.disabled = true;

    // Send email using EmailJS
    // IMPORTANT: Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual IDs
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        from_name: name,
        from_email: email,
        phone: phone,
        subject: subject,
        message: message
    })
        .then(function (response) {
            console.log('SUCCESS!', response.status, response.text);
            showMessage('Message sent successfully! I will get back to you soon.', 'success');
            contactForm.reset();
            submitBtn.value = 'Send Message';
            submitBtn.disabled = false;
        })
        .catch(function (error) {
            console.log('FAILED...', error);
            showMessage('Failed to send message. Please try again or email me directly.', 'error');
            submitBtn.value = 'Send Message';
            submitBtn.disabled = false;
        });
});

// Show message function
function showMessage(msg, type) {
    formMessage.textContent = msg;
    formMessage.style.color = type === 'success' ? '#00d2ff' : '#ff4444';
    formMessage.style.fontWeight = '500';

    // Clear message after 5 seconds
    setTimeout(() => {
        formMessage.textContent = '';
    }, 5000);
}
