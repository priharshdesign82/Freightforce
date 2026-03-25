// ============================================
// FREIGHTFORCE.AI - MAIN JS
// Clean | Fast | Mobile Menu Working | Tabs Working
// ============================================

$(document).ready(function () {

	// ========== LOADER ==========
	setTimeout(function () {
		$('#loader').addClass('fade-out');
		setTimeout(function () {
			$('#loader').css('display', 'none');
			$('#main-content').fadeIn(500);
		}, 500);
	}, 1500);

	// ========== AOS INIT ==========
	AOS.init({
		duration: 800,
		once: true,
		mirror: false,
		offset: 80,
		easing: 'ease-out-cubic'
	});

	// ========== AI TABS - WORKING ==========
	// Tab switching for premium tabs
	$('.tab-premium').on('click', function () {
		const tabId = $(this).data('tab');

		// Remove active class from all tabs
		$('.tab-premium').removeClass('active');
		// Add active class to clicked tab
		$(this).addClass('active');

		// Hide all tab panes
		$('.tab-pane-premium').removeClass('active');
		// Show selected tab pane
		$(`#tab-${tabId}-premium`).addClass('active');

		// Reset and restart counters for new tab
		setTimeout(() => {
			$('.count-number').removeClass('counted');
			animateCounters();
		}, 100);
	});

	// ========== ANIMATED COUNTERS ==========
	function animateCounters() {
		$('.count-number').each(function () {
			const $this = $(this);
			const countTo = parseInt($this.data('count'));

			if (!isNaN(countTo) && !$this.hasClass('counted')) {
				$this.addClass('counted');
				$({ countNum: 0 }).animate({
					countNum: countTo
				}, {
					duration: 2000,
					easing: 'swing',
					step: function () {
						$this.text(Math.floor(this.countNum));
					},
					complete: function () {
						$this.text(countTo);
					}
				});
			}
		});
	}

	// Initial counter animation
	setTimeout(() => {
		animateCounters();
	}, 500);

	// ========== CUSTOM CURSOR (Desktop Only) ==========
	if (window.innerWidth > 768) {
		const cursorDot = $('.cursor-dot');
		const cursorOutline = $('.cursor-outline');

		$(document).on('mousemove', function (e) {
			cursorDot.css({ top: e.clientY - 4, left: e.clientX - 4 });
			cursorOutline.css({ top: e.clientY - 20, left: e.clientX - 20 });
		});

		$('.btn, .problem-card, .employee-card, .plan-card, .tab-premium').on('mouseenter', function () {
			cursorOutline.css({
				transform: 'scale(1.5)',
				borderColor: '#6366f1',
				backgroundColor: 'rgba(99, 102, 241, 0.1)'
			});
		}).on('mouseleave', function () {
			cursorOutline.css({
				transform: 'scale(1)',
				borderColor: 'rgba(99, 102, 241, 0.5)',
				backgroundColor: 'transparent'
			});
		});

		$(document).on('mouseleave', function () {
			cursorDot.css('opacity', 0);
			cursorOutline.css('opacity', 0);
		}).on('mouseenter', function () {
			cursorDot.css('opacity', 1);
			cursorOutline.css('opacity', 1);
		});
	} else {
		$('.cursor-dot, .cursor-outline').hide();
	}

	// ========== PRICING TOGGLE ==========
	const toggle = $('#pricingToggle');
	const monthlyPrices = $('.monthly-price');
	const yearlyPrices = $('.yearly-price');

	if (toggle.length) {
		toggle.on('change', function () {
			if ($(this).is(':checked')) {
				monthlyPrices.hide();
				yearlyPrices.show();
				$('.toggle-label.monthly').css('color', '#a3a3a3');
				$('.toggle-label.yearly').css('color', '#6366f1');
			} else {
				monthlyPrices.show();
				yearlyPrices.hide();
				$('.toggle-label.monthly').css('color', '#6366f1');
				$('.toggle-label.yearly').css('color', '#a3a3a3');
			}
		});
	}

	// ========== MOBILE MENU (FIXED) ==========
	const menuToggle = $('#menuToggle');
	const navbarCollapse = $('#navbarNav');
	const navbar = $('.navbar');

	if (menuToggle.length) {
		menuToggle.on('click', function (e) {
			e.stopPropagation();
			$(this).toggleClass('active');
			navbarCollapse.toggleClass('show');
			navbar.toggleClass('menu-open');

			if (navbarCollapse.hasClass('show')) {
				$('body').css('overflow', 'hidden');
			} else {
				$('body').css('overflow', '');
			}
		});

		$('.nav-link').on('click', function () {
			menuToggle.removeClass('active');
			navbarCollapse.removeClass('show');
			navbar.removeClass('menu-open');
			$('body').css('overflow', '');
		});

		$(document).on('click', function (e) {
			if (navbarCollapse.hasClass('show') && !$(e.target).closest('.navbar').length) {
				menuToggle.removeClass('active');
				navbarCollapse.removeClass('show');
				navbar.removeClass('menu-open');
				$('body').css('overflow', '');
			}
		});
	}

	// ========== ACTIVE MENU ON SCROLL ==========
	const sections = $('section');
	const navLinks = $('.nav-link');

	$(window).on('scroll', function () {
		let current = '';
		const scrollPos = $(window).scrollTop() + 150;

		sections.each(function () {
			const sectionTop = $(this).offset().top;
			const sectionBottom = sectionTop + $(this).outerHeight();
			if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
				current = $(this).attr('id');
			}
		});

		navLinks.removeClass('active');
		if (current) {
			$(`.nav-link[href="#${current}"]`).addClass('active');
		}

		if ($(window).scrollTop() > 50) {
			$('.navbar').addClass('navbar-scrolled');
		} else {
			$('.navbar').removeClass('navbar-scrolled');
		}
	});

	// ========== SMOOTH SCROLL ==========
	$('a[href*="#"]:not([href="#"])').on('click', function (e) {
		e.preventDefault();
		const target = $(this.hash);
		if (target.length) {
			if (navbarCollapse.hasClass('show')) {
				menuToggle.removeClass('active');
				navbarCollapse.removeClass('show');
				navbar.removeClass('menu-open');
				$('body').css('overflow', '');
			}
			$('html, body').animate({
				scrollTop: target.offset().top - 80
			}, 800, 'swing');
		}
	});

	// ========== LEAD FORM HANDLER ==========
	$('#leadForm').on('submit', function (e) {
		e.preventDefault();

		const name = $('#leadName').val();
		const email = $('#leadEmail').val();
		const phone = $('#leadPhone').val();
		const company = $('#leadCompany').val();
		const plan = $('#leadPlan').val();

		if (!name || !email || !phone) {
			alert('Please fill in all required fields (Name, Email, Phone)');
			return;
		}

		const lead = {
			name: name,
			email: email,
			phone: phone,
			company: company,
			plan: plan,
			timestamp: new Date().toISOString(),
			source: 'FreightForce.AI Landing Page'
		};

		let leads = localStorage.getItem('freightforce_leads');
		leads = leads ? JSON.parse(leads) : [];
		leads.push(lead);
		localStorage.setItem('freightforce_leads', JSON.stringify(leads));

		$('#leadForm').hide();
		$('#successMessage').fadeIn();
		$('#leadForm')[0].reset();

		setTimeout(function () {
			$('#successMessage').fadeOut();
			$('#leadForm').fadeIn();
		}, 5000);

		console.log('Lead captured:', lead);
	});

	// ========== NEWSLETTER SUBSCRIPTION ==========
	$('#newsletterForm').on('submit', function (e) {
		e.preventDefault();
		const email = $(this).find('input[type="email"]').val();

		if (email) {
			let subscribers = localStorage.getItem('freightforce_subscribers');
			subscribers = subscribers ? JSON.parse(subscribers) : [];

			if (!subscribers.includes(email)) {
				subscribers.push(email);
				localStorage.setItem('freightforce_subscribers', JSON.stringify(subscribers));

				$(this).hide();
				$(this).siblings('.newsletter-success').fadeIn();

				setTimeout(() => {
					$(this).siblings('.newsletter-success').fadeOut();
					$(this).show();
					$(this).find('input').val('');
				}, 3000);

				console.log('New subscriber:', email);
			} else {
				alert('You are already subscribed!');
			}
		}
	});

	// ========== PARTICLE BACKGROUND (Optimized) ==========
	const canvas = document.getElementById('particleCanvas');
	if (canvas && window.innerWidth > 768) {
		const ctx = canvas.getContext('2d');
		let particles = [];
		let animationId = null;

		function resizeCanvas() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}

		function createParticles() {
			const particleCount = Math.min(60, Math.floor(window.innerWidth / 20));
			particles = [];
			for (let i = 0; i < particleCount; i++) {
				particles.push({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					radius: Math.random() * 2 + 1,
					speedX: (Math.random() - 0.5) * 0.3,
					speedY: (Math.random() - 0.5) * 0.3,
					opacity: Math.random() * 0.2 + 0.05
				});
			}
		}

		function animateParticles() {
			if (!ctx) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			particles.forEach(p => {
				p.x += p.speedX;
				p.y += p.speedY;
				if (p.x < 0) p.x = canvas.width;
				if (p.x > canvas.width) p.x = 0;
				if (p.y < 0) p.y = canvas.height;
				if (p.y > canvas.height) p.y = 0;

				ctx.beginPath();
				ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
				ctx.fill();
			});

			animationId = requestAnimationFrame(animateParticles);
		}

		resizeCanvas();
		createParticles();
		animateParticles();

		let resizeTimeout;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				if (animationId) cancelAnimationFrame(animationId);
				resizeCanvas();
				createParticles();
				animateParticles();
			}, 150);
		});
	}

	// ========== CARD HOVER EFFECT ==========
	$('.problem-card, .employee-card').hover(
		function () { $(this).css('transform', 'translateY(-5px)'); },
		function () { $(this).css('transform', 'translateY(0)'); }
	);

});
// ========== CHAT AUTO-SCROLL ==========
function scrollChatToBottom() {
	const chatMessages = $('.chat-messages');
	if (chatMessages.length) {
		chatMessages.each(function () {
			this.scrollTop = this.scrollHeight;
		});
	}
}

// Auto-scroll when new messages appear
const observer = new MutationObserver(function () {
	scrollChatToBottom();
});

// Observe chat messages container
$('.chat-messages').each(function () {
	observer.observe(this, { childList: true, subtree: true });
});

// Initial scroll
setTimeout(scrollChatToBottom, 500);

// Simulate typing animation and auto-response
let chatInterval;
let messageCount = 0;
const demoMessages = [
	{ user: "Where is my shipment FREIGHT-001?", ai: "Your shipment is currently in transit from Mumbai and expected to arrive on April 15, 2024. <a href='#'>Track live →</a>" },
	{ user: "What's the estimated delivery time?", ai: "The estimated delivery is April 15, 2024 by 6:00 PM local time. I'll notify you when it's out for delivery." },
	{ user: "Can I change the delivery address?", ai: "Yes, you can request address change. Please share the new address and I'll update it for you." }
];

function addUserMessage(text) {
	const chatMessages = $('.chat-messages');
	const messageHtml = `
    <div class="message user">
      <div class="message-bubble">${text}</div>
      <div class="message-time">Just now</div>
    </div>
  `;
	chatMessages.append(messageHtml);
	scrollChatToBottom();
}

function addAIMessage(text, isTyping = false) {
	const chatMessages = $('.chat-messages');
	if (isTyping) {
		const typingHtml = `
      <div class="message ai typing">
        <div class="message-bubble">
          Typing<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>
        </div>
      </div>
    `;
		chatMessages.append(typingHtml);
	} else {
		// Remove typing indicator
		$('.message.typing').remove();
		const messageHtml = `
      <div class="message ai">
        <div class="message-bubble">${text}</div>
        <div class="message-time">Just now</div>
      </div>
    `;
		chatMessages.append(messageHtml);
	}
	scrollChatToBottom();
}

function startChatSimulation() {
	if (chatInterval) clearInterval(chatInterval);

	let index = 0;

	function simulateNext() {
		if (index >= demoMessages.length) return;

		const msg = demoMessages[index];

		// Add user message
		addUserMessage(msg.user);

		// Show typing indicator after user message
		setTimeout(() => {
			addAIMessage('', true);

			// Add AI response after typing
			setTimeout(() => {
				addAIMessage(msg.ai);
				index++;

				if (index < demoMessages.length) {
					setTimeout(simulateNext, 3000);
				}
			}, 1500);
		}, 500);
	}

	setTimeout(simulateNext, 2000);
}

// Start chat simulation when Support AI tab is opened
$('.tab-premium').on('click', function () {
	const tabId = $(this).data('tab');
	if (tabId === 'support') {
		setTimeout(() => {
			scrollChatToBottom();
			// Clear existing messages and start fresh
			$('.chat-messages').empty();
			// Add welcome message
			addAIMessage("Hello! I'm Support AI. How can I help you with your freight today?");
			startChatSimulation();
		}, 300);
	}
});

// Start simulation if Support AI is active on page load
if ($('.tab-premium.active').data('tab') === 'support') {
	setTimeout(() => {
		startChatSimulation();
	}, 1000);
}