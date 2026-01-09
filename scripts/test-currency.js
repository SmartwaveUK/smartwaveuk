const currencies = ['USD', 'EUR', 'NGN'];
const value = 1234.56;

currencies.forEach(currency => {
    console.log(`${currency} (en-US):`, new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value));
    console.log(`${currency} (en-NG):`, new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(value));
});
