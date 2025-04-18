class DSSSDiagram {
    constructor() {
        this.initializeVariables();
        this.setupEventListeners();
    }

    initializeVariables() {
        // Plot configuration
        this.plots = [
            {
                id: 'binarySignalPlot',
                sequenceId: 'binarySequence',
                name: 'Original Binary Signal',
                sequence: []
            },
            {
                id: 'chipSequencePlot',
                sequenceId: 'chipSequence',
                name: 'Chip Sequence',
                sequence: []
            },
            {
                id: 'spreadSignalPlot',
                sequenceId: 'spreadSequence',
                name: 'Spread Signal',
                sequence: []
            }
        ];

        // SVG Dimensions
        this.width = 800;
        this.height = 250;
        this.margin = { top: 20, right: 20, bottom: 30, left: 40 };
    }

    setupEventListeners() {
        const visualizeButton = document.getElementById('visualizeButton');
        visualizeButton.addEventListener('click', () => this.visualizeDSSS());
    }

    validateBinaryInput(input) {
        return /^[01]{2,4}$/.test(input);
    }

    validateChipCount(count) {
        return count >= 8 && count <= 12;
    }

    generateChipSequence(length) {
        return Array.from({ length }, () => Math.round(Math.random()));
    }

    performDSSS(binaryInput, chipSequence) {
        const spreadSignal = [];
        const chipsPerBit = chipSequence.length / binaryInput.length;

        for (let i = 0; i < binaryInput.length; i++) {
            const bit = parseInt(binaryInput[i]);
            const startIndex = i * chipsPerBit;
            const endIndex = startIndex + chipsPerBit;

            const chipSubsequence = chipSequence.slice(startIndex, endIndex);
            const spreadBits = chipSubsequence.map(chip => bit ^ chip);

            spreadSignal.push(...spreadBits);
        }

        return spreadSignal;
    }

    renderSequence(sequenceId, sequence) {
        const sequenceContainer = document.getElementById(sequenceId);
        sequenceContainer.innerHTML = '';

        sequence.forEach(bit => {
            const bitToken = document.createElement('span');
            bitToken.classList.add('bit-token', bit === 0 ? 'zero' : 'one');
            bitToken.textContent = bit;
            sequenceContainer.appendChild(bitToken);
        });
    }

    createPolarNRZPlot(plotId, sequence) {
        // Clear previous plot
        d3.select(`#${plotId}`).selectAll("*").remove();

        const svg = d3.select(`#${plotId}`)
            .attr('width', this.width)
            .attr('height', this.height);

        const width = this.width - this.margin.left - this.margin.right;
        const height = this.height - this.margin.top - this.margin.bottom;

        const g = svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        const bitWidth = width / sequence.length;
        const yCenter = height / 2;
        const amplitude = height / 4;

        // X-axis (center line)
        g.append('line')
            .attr('x1', 0)
            .attr('y1', yCenter)
            .attr('x2', width)
            .attr('y2', yCenter)
            .attr('stroke', '#ddd')
            .attr('stroke-dasharray', '5,5');

        // Create step-like Polar NRZ plot
        const plotPoints = [];
        let currentY = yCenter;

        // Generate points for step-like representation
        sequence.forEach((bit, index) => {
            const x1 = index * bitWidth;
            const x2 = (index + 1) * bitWidth;
            const y = bit === 1 ? yCenter - amplitude : yCenter + amplitude;

            // Previous level point
            plotPoints.push({ x: x1, y: currentY });
            // Immediate step
            plotPoints.push({ x: x1, y });
            // Maintain level
            plotPoints.push({ x: x2, y });

            currentY = y;
        });

        // Create line generator
        const line = d3.line()
            .x(d => d.x)
            .y(d => d.y);

        // Plot the line
        g.append('path')
            .datum(plotPoints)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2)
            .attr('d', line);

        // Add points at bit transitions
        g.selectAll('circle')
            .data(plotPoints.filter((d, i) => i % 3 === 1)) // Select step points
            .enter()
            .append('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', 4)
            .attr('fill', 'steelblue');

        // Add bit labels
        g.selectAll('.bit-label')
            .data(sequence)
            .enter()
            .append('text')
            .attr('x', (d, i) => i * bitWidth + bitWidth / 2)
            .attr('y', 15)
            .attr('text-anchor', 'middle')
            .text(d => d)
            .attr('class', 'bit-label');
    }

    visualizeDSSS() {
        const binaryInput = document.getElementById('binaryInput').value;
        const chipCount = parseInt(document.getElementById('chipCount').value);

        // Validate inputs
        if (!this.validateBinaryInput(binaryInput)) {
            alert('Invalid binary input. Use 2-4 bits (0/1)');
            return;
        }

        if (!this.validateChipCount(chipCount)) {
            alert('Invalid chip count. Use 8-12 chips');
            return;
        }

        // Convert binary input to array
        const binarySequence = binaryInput.split('').map(Number);

        // Generate chip sequence
        const chipSequence = this.generateChipSequence(chipCount * binaryInput.length);

        // Perform DSSS
        const spreadSignal = this.performDSSS(binaryInput, chipSequence);

        // Update plots
        this.plots[0].sequence = binarySequence;
        this.plots[1].sequence = chipSequence;
        this.plots[2].sequence = spreadSignal;

        // Render sequences and plots
        this.plots.forEach(plot => {
            this.renderSequence(plot.sequenceId, plot.sequence);
            this.createPolarNRZPlot(plot.id, plot.sequence);
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new DSSSDiagram();
});