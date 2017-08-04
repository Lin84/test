export default function validateIban() {
    window.ibanValidation = {
        validate: (iban) => {
            validate(iban);
        }
    };

    function validate(iban) {
        if (/^DE[0-9]{20}$/.test(iban)) {
            const step1 = iban.replace('DE', '');
            const step2 = step1.substring(0, 2);
            const step3 = step1.replace(step2, '');
            const step4 = `${step3}1314${step2}`;

            if (modulo(step4, 97) === 1) {
                console.log('Valid');
            } else {
                console.log('Not valid');
            }
        } else {
            console.log('Wrong length');
        }
    }

    function modulo(value, divisor) {
        let remainder = value;
        let block;

        while (remainder.length > 2) {
            block = remainder.slice(0, 9);
            remainder = `${parseInt(block, 10) % divisor}${remainder.slice(block.length)}`;
        }

        return parseInt(remainder, 10) % divisor;
    }
}
