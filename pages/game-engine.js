document.querySelectorAll('.pion-img').forEach(img => {
    img.addEventListener('click', function() {
        document.querySelectorAll('.pion-img').forEach(i => i.classList.remove('selected'));
        this.classList.add('selected');
        // active le bouton commencer
        document.getElementById('start-game-btn').disabled = false;
    });
});