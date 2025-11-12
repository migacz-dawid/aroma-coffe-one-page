// Navigation
const navigationToggle = document.getElementById('navigation-toggle')
const navigationMobile = document.getElementById('navigation-mobile-menu')
const navigationWrapper = document.getElementById('navigation-main')
const mobileLinks = navigationMobile.querySelectorAll('.navigation-mobile-item')

let lastFocusedElement = null

function trapFocus(container, e) {
	const focusableSelectors = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

	const focusableElements = Array.from(container.querySelectorAll(focusableSelectors))
	const allFocusable = [navigationToggle, ...focusableElements]

	if (!allFocusable.length) return

	const firstEl = allFocusable[0]
	const lastEl = allFocusable[allFocusable.length - 1]

	if (e.shiftKey && document.activeElement === firstEl) {
		e.preventDefault()
		lastEl.focus()
	} else if (!e.shiftKey && document.activeElement === lastEl) {
		e.preventDefault()
		firstEl.focus()
	}
}

// Toggle mobile menu
navigationToggle.addEventListener('click', () => {
	const isExpanded = navigationToggle.getAttribute('aria-expanded') === 'true'
	navigationToggle.setAttribute('aria-expanded', !isExpanded)
	navigationMobile.setAttribute('aria-hidden', isExpanded)

	// Prevent body scroll when menu is open
	if (!isExpanded) {
		document.body.style.overflow = 'hidden'
	} else {
		document.body.style.overflow = ''
	}
})

// Focus trap in mobile menu
document.addEventListener('keydown', e => {
	const isMenuOpen = navigationToggle.getAttribute('aria-expanded') === 'true'
	if (!isMenuOpen || e.key !== 'Tab') return
	trapFocus(navigationMobile, e)
})

// Close mobile menu when link is clicked
mobileLinks.forEach(link => {
	link.addEventListener('click', () => {
		navigationToggle.setAttribute('aria-expanded', 'false')
		navigationMobile.setAttribute('aria-hidden', 'true')
		document.body.style.overflow = ''
	})
})

// Close mobile menu on enter
document.addEventListener('keydown', e => {
	if (
		e.key === 'Enter' &&
		navigationToggle.getAttribute('aria-expanded') === 'true' &&
		e.target.closest('#navigation-mobile-menu a')
	) {
		navigationToggle.setAttribute('aria-expanded', 'false')
		navigationMobile.setAttribute('aria-hidden', 'true')
		document.body.style.overflow = ''
	}
})

// Close mobile menu on escape key
document.addEventListener('keydown', e => {
	if (e.key === 'Escape' && navigationToggle.getAttribute('aria-expanded') === 'true') {
		navigationToggle.setAttribute('aria-expanded', 'false')
		navigationMobile.setAttribute('aria-hidden', 'true')
		document.body.style.overflow = ''
		navigationToggle.focus()
	}
})

// Close mobile menu on resize to desktop
let lastWidth = window.innerWidth
window.addEventListener('resize', () => {
	if (window.innerWidth > 767 && lastWidth <= 767) {
		navigationToggle.setAttribute('aria-expanded', 'false')
		navigationMobile.setAttribute('aria-hidden', 'true')
		document.body.style.overflow = ''
	}
	lastWidth = window.innerWidth
})

// GALLERY CAROUSEL
function initCarousel() {
	const track = document.getElementById('galleryCarouselTrack')
	const prevBtn = document.getElementById('galleryPrev')
	const nextBtn = document.getElementById('galleryNext')

	if (!track || !prevBtn || !nextBtn) return

	let currentIndex = 0
	const slides = Array.from(track.children)
	const totalSlides = slides.length
	if (totalSlides <= 1) return

	function updateCarousel() {
		const offset = currentIndex * -100
		track.style.transform = `translateX(${offset}%)`
	}

	function showNextSlide() {
		currentIndex = (currentIndex + 1) % totalSlides
		updateCarousel()
	}

	function showPrevSlide() {
		currentIndex = (currentIndex - 1 + totalSlides) % totalSlides
		updateCarousel()
	}

	let autoPlayInterval = null

	function startAutoPlay() {
		if (autoPlayInterval) return
		autoPlayInterval = setInterval(showNextSlide, 5000)
	}

	function stopAutoPlay() {
		if (!autoPlayInterval) return
		clearInterval(autoPlayInterval)
		autoPlayInterval = null
	}

	prevBtn.addEventListener('click', showPrevSlide)
	nextBtn.addEventListener('click', showNextSlide)
	track.addEventListener('mouseenter', stopAutoPlay)
	track.addEventListener('mouseleave', startAutoPlay)

	startAutoPlay()
}

// FORMS
function showAlert(alertId, message) {
	const alert = document.getElementById(alertId)
	if (!alert) return

	alert.textContent = message
	alert.classList.add('alert-visible')

	setTimeout(() => {
		alert.classList.remove('alert-visible')
	}, 5000)
}

function initForms() {
	const reserveForm = document.getElementById('reserveForm')
	const inquiryForm = document.getElementById('inquiryForm')
	const subscribeForm = document.getElementById('subscribeForm')

	if (reserveForm) {
		reserveForm.addEventListener('submit', e => {
			e.preventDefault()
			showAlert(
				'reserveAlert',
				'Dziękujemy! Twoja prośba o rezerwację została odebrana. Wkrótce skontaktujemy się z Tobą w celu jej potwierdzenia.'
			)
			reserveForm.reset()
		})
	}

	if (inquiryForm) {
		inquiryForm.addEventListener('submit', e => {
			e.preventDefault()
			showAlert('inquiryAlert', 'Dziękujemy za zapytanie. Odpowiemy w ciągu jednego dnia roboczego.')
			inquiryForm.reset()
		})
	}

	if (subscribeForm) {
		subscribeForm.addEventListener('submit', e => {
			e.preventDefault()
			showAlert(
				'subscribeAlert',
				'Dziękujemy za subskrypcję. Teraz możesz spodziewać się porad dotyczących parzenia i starannie dobranych doświadczeń kawowych prosto do Twojej skrzynki odbiorczej.'
			)
			subscribeForm.reset()
		})
	}
}

// Footer animation
function initScrollAnimations() {
	const animatedSections = document.querySelectorAll('.js-anim-section')
	if (!animatedSections.length) return

	const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

	if (reduceMotion) {
		animatedSections.forEach(section => {
			section.classList.add('section-anim--visible')
		})
		return
	}

	// if no IntersectionObserver – show all sections
	if (!('IntersectionObserver' in window)) {
		animatedSections.forEach(section => {
			section.classList.add('section--visible')
		})
		return
	}

	animatedSections.forEach(section => {
		section.classList.add('section--hidden')
	})

	const observerOptions = {
		threshold: 0,
		rootMargin: '0px 0px -10% 0px',
	}

	const animatedSectionsObserver = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('section--visible')
				entry.target.classList.remove('section--hidden')
				animatedSectionsObserver.unobserve(entry.target)
			}
		})
	}, observerOptions)

	animatedSections.forEach(section => {
		animatedSectionsObserver.observe(section)
	})
}

function handleYear() {
	const footerYear = document.querySelector('.footer-year')
	const currentYear = new Date().getFullYear()
	footerYear.textContent = currentYear
}

function initApp() {
	initCarousel()
	initForms()
	initScrollAnimations()
	handleYear()
}

initApp()



