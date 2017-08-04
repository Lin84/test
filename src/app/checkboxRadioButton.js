export default function() {
    const allInputs = document.getElementsByTagName('input');
    for (let i = 0; i < allInputs.length; i += 1) {
        const currentInput = allInputs[i];
        if (currentInput.type === 'checkbox') {
            currentInput.id += i;
            const id = currentInput.id;
            currentInput.nextElementSibling.id = id;
            currentInput.nextElementSibling.nextElementSibling.setAttribute('for', id);
        }
        if (currentInput.type === 'radio') {
            currentInput.id += i;
            const id = currentInput.id;
            currentInput.nextElementSibling.setAttribute('for', id);
        }
    }
}
