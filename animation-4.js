document.addEventListener('DOMContentLoaded', () => {
    const cable = document.getElementById('cableLayers');
    const layerInfo = document.getElementById('layerInfo');
    const layerTitle = document.getElementById('layerTitle');
    const layerDescription = document.getElementById('layerDescription');
    const explodeBtn = document.getElementById('explodeBtn');
    const resetBtn = document.getElementById('resetBtn');

    const layerDetails = {
        'Outer Cover': 'Protective exterior layer made of durable plastic or rubber, shielding internal components from environmental damage and providing mechanical protection.',
        'Metal Mesh': 'Braided metallic shield that prevents electromagnetic interference, maintains signal integrity, and provides additional protection against external noise.',
        'Insulator': 'Dielectric layer that separates inner wire from metal mesh, preventing electrical shorts and ensuring optimal signal transmission with minimal signal loss.',
        'Inner Wire': 'Central copper conductor responsible for transmitting electrical signals, typically made of high-conductivity copper to ensure efficient signal transfer.'
    };

    let isExploded = false;
    let layerPositions = [];

    // Layer hover information
    cable.querySelectorAll('.layer').forEach(layer => {
        layer.addEventListener('mouseover', (e) => {
            const layerName = e.currentTarget.dataset.layer;
            layerTitle.textContent = layerName;
            layerDescription.textContent = layerDetails[layerName];
        });
    });

    // Explode view
    explodeBtn.addEventListener('click', () => {
        if (isExploded) return;

        // Slightly increase cable size
        cable.style.transform = 'scale(1.05)';

        // Explode layers with horizontal positioning
        const layers = cable.querySelectorAll('.layer');

        // Define specific translations for each layer with horizontal spacing
        const translations = [
            { translateX: '0px', scale: 1, opacity: 1 },       // Outer Cover
            { translateX: '100px', scale: 0.9, opacity: 1 },    // Metal Mesh
            { translateX: '180px', scale: 0.8, opacity: 1 },   // Insulator
            { translateX: '160px', scale: 0.7, opacity: 1 }    // Inner Wire
        ];

        // Store original positions
        layerPositions = [];

        layers.forEach((layer, index) => {
            // Store original position
            layerPositions.push({
                transform: layer.style.transform,
                opacity: layer.style.opacity,
                zIndex: layer.style.zIndex
            });

            const { translateX, scale, opacity } = translations[index];
            layer.style.transform = `translateX(${translateX}) scale(${scale})`;
            layer.style.opacity = opacity;
            layer.style.zIndex = 10 - index;
        });

        isExploded = true;
        explodeBtn.disabled = true;
        resetBtn.disabled = false;
    });

    // Reset view
    resetBtn.addEventListener('click', () => {
        if (!isExploded) return;

        const layers = cable.querySelectorAll('.layer');

        // Restore to original state
        layers.forEach((layer, index) => {
            const originalState = layerPositions[index];
            layer.style.transform = 'translateX(0) scale(1)';
            layer.style.opacity = '1';
            layer.style.zIndex = '';
        });

        // Reset cable scale
        cable.style.transform = 'scale(1)';

        isExploded = false;
        resetBtn.disabled = true;
        explodeBtn.disabled = false;
    });

    // Disable reset button initially
    resetBtn.disabled = true;

    // Optional: Add hover effect to layers
    cable.querySelectorAll('.layer').forEach(layer => {
        layer.addEventListener('mouseenter', (e) => {
            if (isExploded) {
                e.currentTarget.style.transform = `${e.currentTarget.style.transform} scale(1.05)`;
            }
        });

        layer.addEventListener('mouseleave', (e) => {
            if (isExploded) {
                // Remove the additional scale
                const currentTransform = e.currentTarget.style.transform;
                e.currentTarget.style.transform = currentTransform.replace('scale(1.05)', '');
            }
        });
    });
});