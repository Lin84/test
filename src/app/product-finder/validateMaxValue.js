export default function validateMaxValue(input) {
    const maxValue = input.dataset.maxValue;

    input.addEventListener('keyup', (e) => {
        if (Number(e.target.value) > maxValue) {
            e.target.value = maxValue;
        }
    });
}
