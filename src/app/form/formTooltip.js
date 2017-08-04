export default function(tooltippTpl) {
    const content = tooltippTpl.querySelector('.tooltip-content');
    if (content.innerHTML.trim() !== '') {
        tooltippTpl.classList.add('displayed');
        tooltippTpl.classList.add('tooltip--right');
        tooltippTpl.classList.add('tooltip--bottom');
    }
}
