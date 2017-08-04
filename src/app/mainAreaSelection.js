export default function() {
    const container = document.getElementById('target-group-select');
    const head1 = document.createElement('H1');
    const selectedSection = document.getElementById('target-group-select-list');

    head1.classList.add('target-group-select--trigger');

    if (selectedSection) {
        const activeItem = selectedSection.querySelector('.active').textContent;

        head1.textContent = activeItem;
        container.insertBefore(head1, container.firstChild);
    }
}
