class ExRaterApp {
    constructor() {
        this.exes = JSON.parse(localStorage.getItem('exes') || '[]');
        this.dimensions = JSON.parse(localStorage.getItem('dimensions') || JSON.stringify(this.getDefaultDimensions()));
        this.currentExId = null;
        this.currentView = 'ex-list-view';
        
        this.init();
    }

    getDefaultDimensions() {
        return [
            { id: 1, name: 'Communication', weight: 8 },
            { id: 2, name: 'Emotional Support', weight: 7 },
            { id: 3, name: 'Shared Values', weight: 9 },
            { id: 4, name: 'Respect', weight: 10 },
            { id: 5, name: 'Reliability', weight: 7 },
            { id: 6, name: 'Personal Growth', weight: 6 },
            { id: 7, name: 'Conflict Resolution', weight: 8 },
            { id: 8, name: 'Closeness', weight: 7 },
            { id: 9, name: 'Future Compatibility', weight: 9 },
            { id: 10, name: 'Fitness', weight: 4 },
            { id: 11, name: 'Healthy Lifestyle', weight: 5 }
        ];
    }

    init() {
        this.bindEvents();
        this.renderExList();
        this.renderDimensionsList();
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.showView(view);
            });
        });

        // Add Ex button
        document.getElementById('add-ex-btn').addEventListener('click', () => {
            this.showAddExForm();
        });

        // Back buttons
        document.getElementById('back-btn').addEventListener('click', () => {
            this.showView('ex-list-view');
        });

        document.getElementById('rating-back-btn').addEventListener('click', () => {
            this.showView('ex-list-view');
        });

        document.getElementById('dimensions-back-btn').addEventListener('click', () => {
            this.showView('ex-list-view');
        });

        // Form submission
        document.getElementById('ex-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEx();
        });

        // Search and sort
        document.getElementById('search-input').addEventListener('input', () => {
            this.renderExList();
        });

        document.getElementById('sort-select').addEventListener('change', () => {
            this.renderExList();
        });

        // Add dimension button
        document.getElementById('add-dimension-btn').addEventListener('click', () => {
            this.addCustomDimension();
        });
    }

    showView(viewId) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(viewId).classList.add('active');

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewId}"]`)?.classList.add('active');

        this.currentView = viewId;
    }

    showAddExForm(exId = null) {
        this.currentExId = exId;
        const form = document.getElementById('ex-form');
        const title = document.getElementById('form-title');
        
        if (exId) {
            const ex = this.exes.find(e => e.id === exId);
            title.textContent = 'Edit Ex';
            document.getElementById('ex-name').value = ex.name;
            document.getElementById('ex-location').value = ex.location || '';
            document.getElementById('ex-height').value = ex.height || '';
            document.getElementById('ex-weight').value = ex.weight || '';
        } else {
            title.textContent = 'Add New Ex';
            form.reset();
        }
        
        this.showView('ex-form-view');
    }

    saveEx() {
        const name = document.getElementById('ex-name').value.trim();
        const location = document.getElementById('ex-location').value.trim();
        const height = document.getElementById('ex-height').value.trim();
        const weight = document.getElementById('ex-weight').value.trim();

        if (!name) return;

        const exData = {
            name,
            location,
            height,
            weight,
            ratings: {},
            notes: {},
            favorite: false
        };

        if (this.currentExId) {
            const exIndex = this.exes.findIndex(e => e.id === this.currentExId);
            this.exes[exIndex] = { ...this.exes[exIndex], ...exData };
        } else {
            exData.id = Date.now();
            this.exes.push(exData);
        }

        this.saveData();
        this.renderExList();
        this.showView('ex-list-view');
    }

    deleteEx(exId) {
        if (confirm('Are you sure you want to delete this ex?')) {
            this.exes = this.exes.filter(e => e.id !== exId);
            this.saveData();
            this.renderExList();
        }
    }

    toggleFavorite(exId) {
        const ex = this.exes.find(e => e.id === exId);
        ex.favorite = !ex.favorite;
        this.saveData();
        this.renderExList();
    }

    showRatingView(exId) {
        this.currentExId = exId;
        const ex = this.exes.find(e => e.id === exId);
        document.getElementById('rating-title').textContent = `Rate ${ex.name}`;
        this.renderRatingForm(ex);
        this.showView('rating-view');
    }

    renderRatingForm(ex) {
        const container = document.getElementById('rating-content');
        container.innerHTML = '';

        this.dimensions.forEach(dimension => {
            const currentRating = ex.ratings[dimension.id] || 5;
            const currentNote = ex.notes[dimension.id] || '';

            const dimensionEl = document.createElement('div');
            dimensionEl.className = 'dimension-item';
            dimensionEl.innerHTML = `
                <div class="dimension-header">
                    <span class="dimension-name">${dimension.name}</span>
                    <span class="dimension-weight">Weight: ${dimension.weight}</span>
                </div>
                <div class="rating-slider">
                    <input type="range" min="1" max="10" value="${currentRating}" 
                           data-dimension="${dimension.id}" class="rating-input">
                    <div class="rating-value">${currentRating}/10</div>
                </div>
                <div class="notes-section">
                    <textarea placeholder="Add notes for ${dimension.name}..." 
                              data-dimension="${dimension.id}" class="notes-input">${currentNote}</textarea>
                </div>
            `;
            container.appendChild(dimensionEl);
        });

        // Add save button
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-primary';
        saveBtn.textContent = 'Save Ratings';
        saveBtn.style.marginTop = '20px';
        saveBtn.addEventListener('click', () => this.saveRatings());
        container.appendChild(saveBtn);

        // Bind rating slider events with better touch handling
        container.querySelectorAll('.rating-input').forEach(input => {
            const updateValue = (e) => {
                const value = e.target.value;
                const valueDisplay = e.target.parentNode.querySelector('.rating-value');
                valueDisplay.textContent = `${value}/10`;
            };

            // Handle multiple event types for better responsiveness
            input.addEventListener('input', updateValue);
            input.addEventListener('change', updateValue);
            
            // Add touch-specific handling for iOS
            input.addEventListener('touchstart', (e) => {
                e.target.style.transform = 'scale(1.02)';
            });
            
            input.addEventListener('touchend', (e) => {
                e.target.style.transform = 'scale(1)';
                updateValue(e);
            });
            
            // Prevent default touch behaviors that might interfere
            input.addEventListener('touchmove', (e) => {
                e.preventDefault();
                updateValue(e);
            });
        });
    }

    saveRatings() {
        const ex = this.exes.find(e => e.id === this.currentExId);
        
        document.querySelectorAll('.rating-input').forEach(input => {
            const dimensionId = parseInt(input.dataset.dimension);
            ex.ratings[dimensionId] = parseInt(input.value);
        });

        document.querySelectorAll('.notes-input').forEach(textarea => {
            const dimensionId = parseInt(textarea.dataset.dimension);
            ex.notes[dimensionId] = textarea.value.trim();
        });

        this.saveData();
        this.renderExList();
        this.showView('ex-list-view');
    }

    calculateScore(ex) {
        let totalWeightedScore = 0;
        let totalWeight = 0;

        this.dimensions.forEach(dimension => {
            const rating = ex.ratings[dimension.id] || 0;
            const weight = dimension.weight;
            totalWeightedScore += rating * weight;
            totalWeight += weight;
        });

        return totalWeight > 0 ? (totalWeightedScore / totalWeight).toFixed(1) : 0;
    }

    renderExList() {
        const container = document.getElementById('ex-list');
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const sortBy = document.getElementById('sort-select').value;

        let filteredExes = this.exes.filter(ex => 
            ex.name.toLowerCase().includes(searchTerm)
        );

        // Sort exes
        filteredExes.sort((a, b) => {
            switch (sortBy) {
                case 'score-desc':
                    return this.calculateScore(b) - this.calculateScore(a);
                case 'score-asc':
                    return this.calculateScore(a) - this.calculateScore(b);
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });

        if (filteredExes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No exes found</h3>
                    <p>Add your first ex to get started!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredExes.map(ex => {
            const score = this.calculateScore(ex);
            const details = [ex.location, ex.height, ex.weight].filter(Boolean).join(' • ');
            
            return `
                <div class="ex-card">
                    <div class="ex-card-header">
                        <div>
                            <div class="ex-name">
                                ${ex.name}
                                <button class="favorite-btn ${ex.favorite ? 'active' : ''}" 
                                        onclick="app.toggleFavorite(${ex.id})">
                                    ${ex.favorite ? '❤️' : '🤍'}
                                </button>
                            </div>
                            ${details ? `<div class="ex-details">${details}</div>` : ''}
                        </div>
                        <div class="ex-score">${score}</div>
                    </div>
                    <div class="ex-actions">
                        <button class="btn btn-primary" onclick="app.showRatingView(${ex.id})">
                            Rate
                        </button>
                        <button class="btn btn-secondary" onclick="app.showAddExForm(${ex.id})">
                            Edit
                        </button>
                        <button class="btn btn-danger" onclick="app.deleteEx(${ex.id})">
                            Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderDimensionsList() {
        const container = document.getElementById('dimensions-list');
        
        container.innerHTML = this.dimensions.map(dimension => `
            <div class="dimension-management-item">
                <div class="dimension-info">
                    <strong>${dimension.name}</strong>
                </div>
                <div class="dimension-actions">
                    <input type="number" min="1" max="10" step="1" value="${dimension.weight}" 
                           class="weight-input" data-dimension="${dimension.id}"
                           title="Weight: 1-10 (higher = more important)">
                    <button class="btn btn-danger" onclick="app.deleteDimension(${dimension.id})">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');

        // Bind weight change events with bulletproof validation
        container.querySelectorAll('.weight-input').forEach(input => {
            // Set initial valid value
            if (parseInt(input.value) < 1 || parseInt(input.value) > 10) {
                input.value = '5';
            }
            
            // Prevent invalid keystrokes completely
            input.addEventListener('keydown', (e) => {
                const currentValue = input.value;
                const key = e.key;
                const cursorPos = input.selectionStart;
                
                // Allow navigation and editing keys
                if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) {
                    return;
                }
                
                // Allow Ctrl combinations
                if (e.ctrlKey || e.metaKey) {
                    return;
                }
                
                // Only allow digits
                if (!/^[0-9]$/.test(key)) {
                    e.preventDefault();
                    return;
                }
                
                // Simulate the new value after this keystroke
                let newValue = currentValue.slice(0, cursorPos) + key + currentValue.slice(input.selectionEnd);
                
                // Remove leading zeros
                newValue = newValue.replace(/^0+/, '') || '0';
                
                const numValue = parseInt(newValue);
                
                // Prevent if it would create invalid number
                if (isNaN(numValue) || numValue < 1 || numValue > 10) {
                    e.preventDefault();
                }
            });

            // Force correction on any input change
            input.addEventListener('input', (e) => {
                let value = e.target.value;
                
                // Remove non-digits
                value = value.replace(/[^0-9]/g, '');
                
                // Handle empty or zero
                if (value === '' || value === '0') {
                    e.target.value = '1';
                    return;
                }
                
                // Remove leading zeros
                value = value.replace(/^0+/, '');
                
                const numValue = parseInt(value);
                
                // Enforce boundaries
                if (numValue < 1) {
                    e.target.value = '1';
                } else if (numValue > 10) {
                    e.target.value = '10';
                } else {
                    e.target.value = numValue.toString();
                }
            });
            
            // Validate when focus leaves the field
            input.addEventListener('blur', (e) => {
                let value = parseInt(e.target.value);
                
                if (isNaN(value) || value < 1) {
                    e.target.value = '1';
                    value = 1;
                } else if (value > 10) {
                    e.target.value = '10';
                    value = 10;
                }
                
                const dimensionId = parseInt(e.target.dataset.dimension);
                this.updateDimensionWeight(dimensionId, value);
            });
            
            // Handle paste events
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                
                let paste = (e.clipboardData || window.clipboardData).getData('text');
                paste = paste.replace(/[^0-9]/g, '');
                
                if (paste === '' || paste === '0') {
                    e.target.value = '1';
                } else {
                    let numValue = parseInt(paste);
                    if (numValue < 1) {
                        e.target.value = '1';
                    } else if (numValue > 10) {
                        e.target.value = '10';
                    } else {
                        e.target.value = numValue.toString();
                    }
                }
                
                const dimensionId = parseInt(e.target.dataset.dimension);
                this.updateDimensionWeight(dimensionId, parseInt(e.target.value));
            });
        });
    }

    updateDimensionWeight(dimensionId, weight) {
        const dimension = this.dimensions.find(d => d.id === dimensionId);
        if (dimension) {
            // Enforce strict boundaries
            dimension.weight = Math.max(1, Math.min(10, weight));
            this.saveData();
            // Update the ex list to reflect new scores
            this.renderExList();
        }
    }

    addCustomDimension() {
        const name = prompt('Enter dimension name:');
        if (name && name.trim()) {
            const newDimension = {
                id: Date.now(),
                name: name.trim(),
                weight: 5
            };
            this.dimensions.push(newDimension);
            this.saveData();
            this.renderDimensionsList();
        }
    }

    deleteDimension(dimensionId) {
        if (confirm('Are you sure you want to delete this dimension?')) {
            this.dimensions = this.dimensions.filter(d => d.id !== dimensionId);
            
            // Remove ratings for this dimension from all exes
            this.exes.forEach(ex => {
                delete ex.ratings[dimensionId];
                delete ex.notes[dimensionId];
            });
            
            this.saveData();
            this.renderDimensionsList();
        }
    }

    saveData() {
        localStorage.setItem('exes', JSON.stringify(this.exes));
        localStorage.setItem('dimensions', JSON.stringify(this.dimensions));
    }
}

// Initialize app
const app = new ExRaterApp();