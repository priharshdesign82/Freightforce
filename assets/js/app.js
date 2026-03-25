// ============================================
// FREIGHTFORCE.AI - MAIN JS (CLEAN)
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

	// ========== AI TABS ==========
	$('.tab-premium').on('click', function () {
		const tabId = $(this).data('tab');
		$('.tab-premium').removeClass('active');
		$(this).addClass('active');
		$('.tab-pane-premium').removeClass('active');
		$(`#tab-${tabId}-premium`).addClass('active');

		// Reset counters
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
					step: function () { $this.text(Math.floor(this.countNum)); },
					complete: function () { $this.text(countTo); }
				});
			}
		});
	}
	setTimeout(() => { animateCounters(); }, 500);

	// ========== CUSTOM CURSOR (Desktop Only) ==========
	if (window.innerWidth > 768) {
		const cursorDot = $('.cursor-dot');
		const cursorOutline = $('.cursor-outline');
		$(document).on('mousemove', function (e) {
			cursorDot.css({ top: e.clientY - 4, left: e.clientX - 4 });
			cursorOutline.css({ top: e.clientY - 20, left: e.clientX - 20 });
		});
		$('.btn, .problem-card, .employee-card, .plan-card, .tab-premium').on('mouseenter', function () {
			cursorOutline.css({ transform: 'scale(1.5)', borderColor: '#6366f1', backgroundColor: 'rgba(99, 102, 241, 0.1)' });
		}).on('mouseleave', function () {
			cursorOutline.css({ transform: 'scale(1)', borderColor: 'rgba(99, 102, 241, 0.5)', backgroundColor: 'transparent' });
		});
		$(document).on('mouseleave', function () { cursorDot.css('opacity', 0); cursorOutline.css('opacity', 0); })
			.on('mouseenter', function () { cursorDot.css('opacity', 1); cursorOutline.css('opacity', 1); });
	} else {
		$('.cursor-dot, .cursor-outline').hide();
	}

	// ========== PRICING TOGGLE ==========
	const toggle = $('#pricingToggle');
	if (toggle.length) {
		toggle.on('change', function () {
			if ($(this).is(':checked')) {
				$('.monthly-price').hide(); $('.yearly-price').show();
				$('.toggle-label.monthly').css('color', '#a3a3a3'); $('.toggle-label.yearly').css('color', '#6366f1');
			} else {
				$('.monthly-price').show(); $('.yearly-price').hide();
				$('.toggle-label.monthly').css('color', '#6366f1'); $('.toggle-label.yearly').css('color', '#a3a3a3');
			}
		});
	}

	// ========== MOBILE MENU ==========
	const menuToggle = $('#menuToggle');
	const navbarCollapse = $('#navbarNav');
	const navbar = $('.navbar');
	if (menuToggle.length) {
		menuToggle.on('click', function (e) {
			e.stopPropagation();
			$(this).toggleClass('active');
			navbarCollapse.toggleClass('show');
			navbar.toggleClass('menu-open');
			$('body').css('overflow', navbarCollapse.hasClass('show') ? 'hidden' : '');
		});
		$('.nav-link').on('click', function () {
			menuToggle.removeClass('active'); navbarCollapse.removeClass('show'); navbar.removeClass('menu-open'); $('body').css('overflow', '');
		});
		$(document).on('click', function (e) {
			if (navbarCollapse.hasClass('show') && !$(e.target).closest('.navbar').length) {
				menuToggle.removeClass('active'); navbarCollapse.removeClass('show'); navbar.removeClass('menu-open'); $('body').css('overflow', '');
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
			const sectionTop = $(this).offset().top, sectionBottom = sectionTop + $(this).outerHeight();
			if (scrollPos >= sectionTop && scrollPos < sectionBottom) current = $(this).attr('id');
		});
		navLinks.removeClass('active');
		if (current) $(`.nav-link[href="#${current}"]`).addClass('active');
		$(window).scrollTop() > 50 ? $('.navbar').addClass('navbar-scrolled') : $('.navbar').removeClass('navbar-scrolled');
	});

	// ========== SMOOTH SCROLL ==========
	$('a[href*="#"]:not([href="#"])').on('click', function (e) {
		e.preventDefault();
		const target = $(this.hash);
		if (target.length) {
			if (navbarCollapse.hasClass('show')) { menuToggle.removeClass('active'); navbarCollapse.removeClass('show'); navbar.removeClass('menu-open'); $('body').css('overflow', ''); }
			$('html, body').animate({ scrollTop: target.offset().top - 80 }, 800, 'swing');
		}
	});

	// ========== LEAD FORM ==========
	$('#leadForm').on('submit', function (e) {
		e.preventDefault();
		const name = $('#leadName').val(), email = $('#leadEmail').val(), phone = $('#leadPhone').val(), company = $('#leadCompany').val(), plan = $('#leadPlan').val();
		if (!name || !email || !phone) { alert('Please fill in all required fields'); return; }
		const lead = { name, email, phone, company, plan, timestamp: new Date().toISOString(), source: 'FreightForce.AI Landing Page' };
		let leads = localStorage.getItem('freightforce_leads'); leads = leads ? JSON.parse(leads) : []; leads.push(lead); localStorage.setItem('freightforce_leads', JSON.stringify(leads));
		$('#leadForm').hide(); $('#successMessage').fadeIn(); $('#leadForm')[0].reset();
		setTimeout(() => { $('#successMessage').fadeOut(); $('#leadForm').fadeIn(); }, 5000);
	});

	// ========== NEWSLETTER ==========
	$('#newsletterForm').on('submit', function (e) {
		e.preventDefault();
		const email = $(this).find('input[type="email"]').val();
		if (email) {
			let subscribers = localStorage.getItem('freightforce_subscribers'); subscribers = subscribers ? JSON.parse(subscribers) : [];
			if (!subscribers.includes(email)) {
				subscribers.push(email); localStorage.setItem('freightforce_subscribers', JSON.stringify(subscribers));
				$(this).hide(); $(this).siblings('.newsletter-success').fadeIn();
				setTimeout(() => { $(this).siblings('.newsletter-success').fadeOut(); $(this).show(); $(this).find('input').val(''); }, 3000);
			} else { alert('You are already subscribed!'); }
		}
	});

	// ========== PARTICLE BACKGROUND ==========
	const canvas = document.getElementById('particleCanvas');
	if (canvas && window.innerWidth > 768) {
		const ctx = canvas.getContext('2d'); let particles = []; let animationId = null;
		function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
		function createParticles() {
			const particleCount = Math.min(60, Math.floor(window.innerWidth / 20)); particles = [];
			for (let i = 0; i < particleCount; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: Math.random() * 2 + 1, speedX: (Math.random() - 0.5) * 0.3, speedY: (Math.random() - 0.5) * 0.3, opacity: Math.random() * 0.2 + 0.05 });
		}
		function animateParticles() {
			if (!ctx) return; ctx.clearRect(0, 0, canvas.width, canvas.height);
			particles.forEach(p => { p.x += p.speedX; p.y += p.speedY; if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0; if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`; ctx.fill(); });
			animationId = requestAnimationFrame(animateParticles);
		}
		resizeCanvas(); createParticles(); animateParticles();
		let resizeTimeout; window.addEventListener('resize', () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(() => { if (animationId) cancelAnimationFrame(animationId); resizeCanvas(); createParticles(); animateParticles(); }, 150); });
	}

	// ========== CARD HOVER ==========
	$('.problem-card, .employee-card').hover(function () { $(this).css('transform', 'translateY(-5px)'); }, function () { $(this).css('transform', 'translateY(0)'); });

});

// ========== SMOOTH TYPING ANIMATION ==========
const words = ['Logistics Teams', 'Supply Chains', 'Global Trade'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedTextElement = document.getElementById('typed-text');

function typeEffect() {
	if (!typedTextElement) return;
	const currentWord = words[wordIndex];
	if (isDeleting) {
		charIndex--;
	} else {
		charIndex++;
	}

	typedTextElement.textContent = currentWord.substring(0, charIndex);
	let typeSpeed = isDeleting ? 40 : 80;

	if (!isDeleting) {
		typeSpeed += Math.random() * 40;
	}

	if (!isDeleting && charIndex === currentWord.length) {
		typeSpeed = 2000;
		isDeleting = true;
	}
	else if (isDeleting && charIndex === 0) {
		isDeleting = false;
		wordIndex = (wordIndex + 1) % words.length;
		typeSpeed = 500;
	}

	setTimeout(typeEffect, typeSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
	if (typedTextElement) setTimeout(typeEffect, 500);
});

// ========== CHAT AUTO-SCROLL ==========
function scrollChatToBottom() { $('.chat-messages').each(function () { this.scrollTop = this.scrollHeight; }); }
const chatObserver = new MutationObserver(scrollChatToBottom);
$('.chat-messages').each(function () { chatObserver.observe(this, { childList: true, subtree: true }); });
setTimeout(scrollChatToBottom, 500);

let chatInterval;
const demoMessages = [
	{ user: "Where is my shipment FREIGHT-001?", ai: "Your shipment is currently in transit from Mumbai and expected to arrive on April 15, 2024. <a href='#'>Track live →</a>" },
	{ user: "What's the estimated delivery time?", ai: "The estimated delivery is April 15, 2024 by 6:00 PM local time." },
	{ user: "Can I change the delivery address?", ai: "Yes, you can request address change. Please share the new address." }
];

function addUserMessage(text) { $('.chat-messages').append(`<div class="message user"><div class="message-bubble">${text}</div><div class="message-time">Just now</div></div>`); scrollChatToBottom(); }
function addAIMessage(text, isTyping = false) {
	const $chat = $('.chat-messages');
	if (isTyping) { $chat.append(`<div class="message ai typing"><div class="message-bubble">Typing<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span></div></div>`); }
	else { $('.message.typing').remove(); $chat.append(`<div class="message ai"><div class="message-bubble">${text}</div><div class="message-time">Just now</div></div>`); }
	scrollChatToBottom();
}
function startChatSimulation() { if (chatInterval) clearInterval(chatInterval); let index = 0; function simulateNext() { if (index >= demoMessages.length) return; const msg = demoMessages[index]; addUserMessage(msg.user); setTimeout(() => { addAIMessage('', true); setTimeout(() => { addAIMessage(msg.ai); index++; if (index < demoMessages.length) setTimeout(simulateNext, 3000); }, 1500); }, 500); } setTimeout(simulateNext, 2000); }
$('.tab-premium').on('click', function () { if ($(this).data('tab') === 'support') { setTimeout(() => { scrollChatToBottom(); $('.chat-messages').empty(); addAIMessage("Hello! I'm Support AI. How can I help you?"); startChatSimulation(); }, 300); } });
if ($('.tab-premium.active').data('tab') === 'support') { setTimeout(startChatSimulation, 1000); }

// ========== 3D PARTICLE SYSTEM FOR HERO SECTION ==========
function initHeroParticles() {
	const canvas = document.getElementById('hero-particles-canvas');
	if (!canvas) return;

	const ctx = canvas.getContext('2d');
	let particles = [];
	let animationId = null;
	let mouseX = 0, mouseY = 0;

	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	function createParticles() {
		const particleCount = Math.min(120, Math.floor(window.innerWidth / 12));
		particles = [];
		for (let i = 0; i < particleCount; i++) {
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				radius: Math.random() * 3 + 1.5,
				originalRadius: Math.random() * 3 + 1.5,
				speedX: (Math.random() - 0.5) * 0.4,
				speedY: (Math.random() - 0.5) * 0.3,
				opacity: Math.random() * 0.4 + 0.2,
				color: `hsl(${Math.random() * 60 + 240}, 70%, 60%)`,
				pulseSpeed: Math.random() * 0.02 + 0.01,
				pulsePhase: Math.random() * Math.PI * 2
			});
		}
	}

	// Mouse move effect
	document.addEventListener('mousemove', (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;
	});

	function animateParticles() {
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		particles.forEach(p => {
			// Update position
			p.x += p.speedX;
			p.y += p.speedY;

			// Wrap around edges
			if (p.x < -50) p.x = canvas.width + 50;
			if (p.x > canvas.width + 50) p.x = -50;
			if (p.y < -50) p.y = canvas.height + 50;
			if (p.y > canvas.height + 50) p.y = -50;

			// Mouse interaction - particles move away from cursor
			const dx = p.x - mouseX;
			const dy = p.y - mouseY;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < 100) {
				const angle = Math.atan2(dy, dx);
				const force = (100 - dist) / 100 * 1.5;
				p.x += Math.cos(angle) * force;
				p.y += Math.sin(angle) * force;
			}

			// Pulsing effect
			const pulse = Math.sin(Date.now() * p.pulseSpeed + p.pulsePhase) * 0.3 + 0.7;
			const currentRadius = p.originalRadius * pulse;

			// Draw particle
			ctx.beginPath();
			ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity * pulse})`;
			ctx.fill();

			// Glow effect
			ctx.beginPath();
			ctx.arc(p.x, p.y, currentRadius * 1.5, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity * 0.2})`;
			ctx.fill();
		});

		// Draw connecting lines between nearby particles
		ctx.beginPath();
		ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)';
		ctx.lineWidth = 0.8;
		for (let i = 0; i < particles.length; i++) {
			for (let j = i + 1; j < particles.length; j++) {
				const dx = particles[i].x - particles[j].x;
				const dy = particles[i].y - particles[j].y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < 120) {
					ctx.beginPath();
					ctx.moveTo(particles[i].x, particles[i].y);
					ctx.lineTo(particles[j].x, particles[j].y);
					ctx.stroke();
				}
			}
		}

		animationId = requestAnimationFrame(animateParticles);
	}

	resizeCanvas();
	createParticles();
	animateParticles();

	window.addEventListener('resize', () => {
		if (animationId) cancelAnimationFrame(animationId);
		resizeCanvas();
		createParticles();
		animateParticles();
	});
}

// Initialize hero particles
if (document.getElementById('hero-particles-canvas')) {
	setTimeout(initHeroParticles, 100);
}

// ========== STAT COUNTER ANIMATION ==========
function animateStats() {
	$('.hero-stats .stat-number').each(function () {
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

// Run stats animation when hero comes into view
const heroObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			animateStats();
			heroObserver.unobserve(entry.target);
		}
	});
});

if (document.querySelector('.hero-stats')) {
	heroObserver.observe(document.querySelector('.hero-stats'));
}
// ========== STAT CARD COUNTER ANIMATION (Sleek Cards) ==========
function animateSleekStats() {
	$('.hero-stats-inline .stat-number').each(function () {
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

// Run stats animation when hero comes into view
const sleekStatsObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			animateSleekStats();
			sleekStatsObserver.unobserve(entry.target);
		}
	});
});

if (document.querySelector('.hero-stats-inline')) {
	sleekStatsObserver.observe(document.querySelector('.hero-stats-inline'));
}