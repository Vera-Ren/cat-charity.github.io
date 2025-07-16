document.addEventListener('DOMContentLoaded', () => {
    // Language Switcher Logic
    const languageSwitcher = document.getElementById('language-switcher');
    // Set default language to English, or use previously selected language
    let currentLanguage = localStorage.getItem('catCharityLanguage') || 'en';

    // Function to apply translations to all elements with data-lang attribute
    const applyTranslations = (lang) => {
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            if (translations[lang] && translations[lang][key]) {
                // Handle input placeholders specifically
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });

        // Handle specific case for title element
        document.title = translations[lang] ? translations[lang]["app_title"] : "Cat Guardians - Home of Love and Hope";

        // Re-render dynamically added content if needed (like donation list)
        renderDonations();
        // Note: For existing expense table rows, we use data-lang-key which is handled by getTranslation
        // when a new expense is added, ensuring they adapt without full re-render on language change.
    };

    // Set initial language in the dropdown
    languageSwitcher.value = currentLanguage;
    // Apply translations on page load
    applyTranslations(currentLanguage);

    // Event listener for language change
    languageSwitcher.addEventListener('change', (event) => {
        currentLanguage = event.target.value;
        localStorage.setItem('catCharityLanguage', currentLanguage); // Save selection
        applyTranslations(currentLanguage); // Apply new language
    });

    // --- Utility function for getting translation (used by dynamic content) ---
    const getTranslation = (key, defaultValue = key) => {
        return translations[currentLanguage] && translations[currentLanguage][key] ? translations[currentLanguage][key] : defaultValue;
    };


    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollInView({
                behavior: 'smooth'
            });
        });
    });

    // --- Cat Cafe Alliance Section ---
    const cafeCards = document.querySelectorAll('.cafe-card');
    const cafeDetailsSection = document.getElementById('cafe-details');
    const oddCatCafeDetails = document.getElementById('odd-cat-cafe-details');
    const pawsCatCafeDetails = document.getElementById('paws-cat-cafe-details');
    const backToCafesBtn = document.querySelector('.back-to-cafes');
    const cafeList = document.querySelector('.cafe-list');

    cafeCards.forEach(card => {
        card.addEventListener('click', () => {
            const cafeId = card.dataset.cafe;
            cafeList.classList.add('hidden');
            cafeDetailsSection.classList.remove('hidden');

            if (cafeId === 'odd-cat-cafe') {
                oddCatCafeDetails.classList.remove('hidden');
                pawsCatCafeDetails.classList.add('hidden');
            } else if (cafeId === 'paws-cat-cafe') {
                pawsCatCafeDetails.classList.remove('hidden');
                oddCatCafeDetails.classList.add('hidden');
            }
        });
    });

    backToCafesBtn.addEventListener('click', () => {
        cafeList.classList.remove('hidden');
        cafeDetailsSection.classList.add('hidden');
        oddCatCafeDetails.classList.add('hidden');
        pawsCatCafeDetails.classList.add('hidden');
    });

    // --- Donation Section ---
    const donationForm = document.getElementById('donationForm');
    const donationsList = document.getElementById('donationsList');

    // Load donations from localStorage (if any)
    let donations = JSON.parse(localStorage.getItem('catCharityDonations')) || [];

    const renderDonations = () => {
        donationsList.innerHTML = ''; // Clear existing list
        donations.forEach(donation => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${donation.name}</span>
                <span>${donation.location}</span>
                <span>¥${donation.amount}</span>
            `;
            donationsList.appendChild(listItem);
        });
    };

    renderDonations(); // Initial render

    donationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const donorName = document.getElementById('donorName').value;
        const donorLocation = document.getElementById('donorLocation').value;
        const donationAmount = parseFloat(document.getElementById('donationAmount').value);

        if (donorName && donorLocation && donationAmount > 0) {
            const newDonation = {
                name: donorName,
                location: donorLocation,
                amount: donationAmount,
                timestamp: new Date().toISOString()
            };
            donations.push(newDonation);
            localStorage.setItem('catCharityDonations', JSON.stringify(donations));
            renderDonations(); // Re-render to show new donation

            // Clear form fields
            donationForm.reset();
            alert(getTranslation('donate_alert_success')); // Use translated alert
        } else {
            alert(getTranslation('donate_alert_invalid')); // Use translated alert
        }
    });

    // --- Expense Tracking Section ---
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    const expenseModal = document.getElementById('expenseModal');
    const closeModalBtn = document.querySelector('.close-button');
    const expenseForm = document.getElementById('expenseForm');
    const expenseTableBody = document.querySelector('#expenseTable tbody');

    // Helper to add a single expense row (used by form submission)
    const addExpenseRow = (expense) => {
        const row = expenseTableBody.insertRow();
        row.insertCell().textContent = expense.date;
        row.insertCell().textContent = expense.category; // Use raw text for dynamic input
        const proofCell = row.insertCell();
        if (expense.proof) {
            const link = document.createElement('a');
            link.href = expense.proof;
            link.target = '_blank';
            link.textContent = getTranslation('tracking_proof_view'); // Translated text
            proofCell.appendChild(link);
        } else {
            proofCell.textContent = getTranslation('tracking_proof_none'); // Translated text
        }
        row.insertCell().textContent = expense.payer; // Use raw text for dynamic input
    };


    addExpenseBtn.addEventListener('click', () => {
        expenseModal.style.display = 'flex'; // Show modal
    });

    closeModalBtn.addEventListener('click', () => {
        expenseModal.style.display = 'none'; // Hide modal
    });

    // Hide modal if clicked outside
    window.addEventListener('click', (event) => {
        if (event.target == expenseModal) {
            expenseModal.style.display = 'none';
        }
    });

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const expenseDate = document.getElementById('expenseDate').value;
        const expenseCategory = document.getElementById('expenseCategory').value;
        const expensePayer = document.getElementById('expensePayer').value;
        const expenseProofFile = document.getElementById('expenseProof').files[0];

        let proofUrl = '';
        if (expenseProofFile) {
            // For a real-world scenario, you'd upload this to a server
            // and get a URL. For a simple GitHub Pages site, you might
            // ask users to manually upload to an 'images' folder and
            // provide the path, or just use Data URLs for temporary display.
            proofUrl = URL.createObjectURL(expenseProofFile);
            alert(getTranslation('tracking_alert_upload_note')); // Use translated alert
        }

        const newExpense = {
            date: expenseDate,
            category: expenseCategory,
            proof: proofUrl,
            payer: expensePayer
        };

        addExpenseRow(newExpense); // Add the new row to the table

        // Optional: Save to localStorage if you want persistence beyond session
        // let expenses = JSON.parse(localStorage.getItem('catCharityExpenses')) || [];
        // expenses.push(newExpense);
        // localStorage.setItem('catCharityExpenses', JSON.stringify(expenses));

        expenseForm.reset();
        expenseModal.style.display = 'none';
        alert(getTranslation('tracking_alert_success')); // Use translated alert
    });
});
