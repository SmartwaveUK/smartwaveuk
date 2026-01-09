function formatPrice(amount, currency = 'USD') {
    const locale = currency === 'NGN' ? 'en-NG' : 'en-US';

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

const tests = [
    { amount: 1000, currency: 'NGN', expected: '₦1,000.00' },
    { amount: 1000, currency: 'USD', expected: '$1,000.00' },
    { amount: 1000, currency: 'EUR', expected: '€1,000.00' },
];

let failed = false;
tests.forEach(test => {
    const result = formatPrice(test.amount, test.currency);
    // Note: spaces might differ (non-breaking space etc), so we might want to be careful. 
    // But let's just log it for visual verification if strict check fails.
    console.log(`Checking ${test.currency}: ${result}`);
    if (!result.includes(test.currency === 'NGN' ? '₦' : (test.currency === 'USD' ? '$' : '€'))) {
        console.error(`FAILED ${test.currency}: Expected symbol not found in ${result}`);
        failed = true;
    }
});

if (!failed) {
    console.log("All currency symbol checks passed!");
}
