// ============================================
// MAIN JS
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

	// ========== CUSTOM CURSOR ==========
	const cursorDot = $('.cursor-dot');
	const cursorOutline = $('.cursor-outline');

	$(document).on('mousemove', function (e) {
		cursorDot.css({
			top: e.clientY - 4,
			left: e.clientX - 4
		});
		cursorOutline.css({
			top: e.clientY - 20,
			left: e.clientX - 20
		});
	});

	// Magnetic effect
	$('.btn, .problem-card, .employee-card').on('mouseenter', function () {
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

	// ========== PARTICLE BACKGROUND ==========
	const canvas = document.getElementById('particleCanvas');
	if (canvas) {
		const ctx = canvas.getContext('2d');
		let particles = [];

		function resizeCanvas() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}

		function createParticles() {
			const particleCount = 60;
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
			requestAnimationFrame(animateParticles);
		}

		resizeCanvas();
		createParticles();
		animateParticles();

		window.addEventListener('resize', () => {
			resizeCanvas();
			particles = [];
			createParticles();
		});
	}

	// ========== AOS INIT ==========
	AOS.init({
		duration: 800,
		once: true,
		mirror: false,
		offset: 80,
		easing: 'ease-out-cubic'
	});

	// ========== MOBILE MENU ==========
	const menuToggle = $('#menuToggle');
	const navbarCollapse = $('#navbarNav');
	const navbar = $('.navbar');

	menuToggle.on('click', function () {
		$(this).toggleClass('active');
		navbarCollapse.toggleClass('show');
		navbar.toggleClass('menu-open');

		if ($('body').hasClass('menu-open')) {
			$('body').css('overflow', 'hidden');
		} else {
			$('body').css('overflow', '');
		}
	});

	$('.nav-link').on('click', function () {
		if (navbarCollapse.hasClass('show')) {
			menuToggle.removeClass('active');
			navbarCollapse.removeClass('show');
			navbar.removeClass('menu-open');
			$('body').css('overflow', '');
		}
	});

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

		// Navbar background
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

	// ========== CARD HOVER ==========
	$('.problem-card, .employee-card').hover(
		function () { $(this).css('transform', 'translateY(-5px)'); },
		function () { $(this).css('transform', 'translateY(0)'); }
	);

});