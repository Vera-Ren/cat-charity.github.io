{\rtf1\ansi\ansicpg1252\cocoartf2639
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\froman\fcharset0 Times-Roman;\f1\fnil\fcharset222 Thonburi;\f2\fnil\fcharset134 STSongti-SC-Regular;
}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf0 \expnd0\expndtw0\kerning0
document.addEventListener('DOMContentLoaded', () => \{\
    const langSwitcher = document.querySelector('.lang-switcher');\
    const langElements = document.querySelectorAll('[data-lang-en], [data-lang-zh], [data-lang-th], [data-lang-id]');\
    let currentLang = localStorage.getItem('lang') || 'en'; // Default language to English\
\
    // Function to update content based on selected language\
    function updateContent(lang) \{\
        langElements.forEach(element => \{\
            const enText = element.getAttribute('data-lang-en');\
            const zhText = element.getAttribute('data-lang-zh');\
            const thText = element.getAttribute('data-lang-th');\
            const idText = element.getAttribute('data-lang-id');\
\
            if (lang === 'en' && enText) \{\
                element.innerHTML = enText;\
            \} else if (lang === 'zh' && zhText) \{\
                element.innerHTML = zhText;\
            \} else if (lang === 'th' && thText) \{\
                element.innerHTML = thText;\
            \} else if (lang === 'id' && idText) \{\
                element.innerHTML = idText;\
            \}\
        \});\
\
        // Update active state of language switcher buttons\
        document.querySelectorAll('.lang-switcher span').forEach(span => \{\
            if (span.getAttribute('data-lang') === lang) \{\
                span.classList.add('active');\
            \} else \{\
                span.classList.remove('active');\
            \}\
        \});\
\
        // Update the lang attribute of the HTML root element\
        document.documentElement.lang = lang;\
\
        // Re-update donation amount to reflect currency/language preference\
        updateDonationAmount();\
    \}\
\
    // Initialize page language\
    updateContent(currentLang);\
\
    // Language switcher click event\
    langSwitcher.addEventListener('click', (event) => \{\
        if (event.target.tagName === 'SPAN') \{\
            const newLang = event.target.getAttribute('data-lang');\
            if (newLang && newLang !== currentLang) \{\
                currentLang = newLang;\
                localStorage.setItem('lang', newLang); // Save language choice\
                updateContent(currentLang);\
            \}\
        \}\
    \});\
\
    // Function to update donation amount\
    function updateDonationAmount() \{\
        // Simulated data, in a real application this would come from a backend\
        const totalAmountUSD = 15789.23;\
\
        let displayAmount = '';\
        if (currentLang === 'zh') \{\
            const totalAmountCNY = (totalAmountUSD * 7.25).toFixed(2); // Example CNY exchange rate\
            displayAmount = `\'a5 $\{totalAmountCNY\}`;\
        \} else if (currentLang === 'th') \{\
            const totalAmountTHB = (totalAmountUSD * 36.80).toFixed(2); // Example THB exchange rate\
            displayAmount = `
\f1 \'df
\f0  $\{totalAmountTHB\}`;\
        \} else if (currentLang === 'id') \{\
            const totalAmountIDR = (totalAmountUSD * 16300).toLocaleString('id-ID', \{ maximumFractionDigits: 0 \}); // Example IDR exchange rate, formatted\
            displayAmount = `Rp $\{totalAmountIDR\}`;\
        \} else \{ // Default to English (USD)\
            displayAmount = `$ $\{totalAmountUSD.toFixed(2)\}`;\
        \}\
\
        // Update the displayed amount based on the current language\
        // We'll update the element specific to the currently active language,\
        // or a common element if one exists. For simplicity, we'll keep the\
        // separate IDs and just update the one that corresponds to the active lang.\
        // A better approach for real dynamic numbers would be a single span and\
        // update its text content based on the chosen currency format.\
        if (document.getElementById('total-donations-en')) \{\
            document.getElementById('total-donations-en').textContent = (currentLang === 'en') ? displayAmount : 'Actively fundraising!'; // Show English text if English, otherwise generic for other languages\
        \}\
        if (document.getElementById('total-donations')) \{ // This was used for Chinese previously, now a fallback\
             document.getElementById('total-donations').textContent = (currentLang === 'zh') ? displayAmount : '
\f2 \'c5\'ac\'c1\'a6\'b3\'ef\'bc\'af\'d6\'d0\'a3\'a1
\f0 ';\
        \}\
        if (document.getElementById('total-donations-th')) \{\
            document.getElementById('total-donations-th').textContent = (currentLang === 'th') ? displayAmount : '
\f1 \'a1\'d3\'c5\'d1\'a7\'c3\'d0\'b4\'c1\'b7\'d8\'b9
\f0 !';\
        \}\
        if (document.getElementById('total-donations-id')) \{\
            document.getElementById('total-donations-id').textContent = (currentLang === 'id') ? displayAmount : 'Sedang Menggalang Dana!';\
        \}\
\
        // A more robust way to handle donation amount display across languages\
        // would be to have a single element for the amount and update its text content.\
        const totalDonationsSpan = document.querySelector('.donation-summary p span[id]');\
        if (totalDonationsSpan) \{\
            totalDonationsSpan.textContent = displayAmount;\
        \}\
\
    \}\
\
    // Update donation amount on page load\
    updateDonationAmount();\
    // You could set an interval to regularly update if data changes in real-time\
    // setInterval(updateDonationAmount, 60000); // Update every minute\
\
    // Smooth scrolling to anchor links\
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => \{\
        anchor.addEventListener('click', function (e) \{\
            e.preventDefault();\
            document.querySelector(this.getAttribute('href')).scrollIntoView(\{\
                behavior: 'smooth'\
            \});\
        \});\
    \});\
\});}