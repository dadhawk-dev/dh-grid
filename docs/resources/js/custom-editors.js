/**
 * Custom Web Components for DhGridComponent Cell Editing Showcase
 */

// 1. <status-selector> - Dropdown selector custom web component
class StatusSelector extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const currentVal = this.getAttribute('value') || 'Pending';
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; width: 100%; height: 100%; }
                select {
                    width: 100%;
                    height: 100%;
                    border: none;
                    background: #1e293b;
                    color: #38bdf8;
                    font-weight: 600;
                    font-size: 13px;
                    padding: 4px 8px;
                    border-radius: 4px;
                    outline: 2px solid #3b82f6;
                    cursor: pointer;
                }
                option { background: #0f172a; color: #f8fafc; }
            </style>
            <select id="selectEl">
                <option value="Active" ${currentVal === 'Active' ? 'selected' : ''}>🟢 Active</option>
                <option value="Pending" ${currentVal === 'Pending' ? 'selected' : ''}>🟡 Pending</option>
                <option value="Completed" ${currentVal === 'Completed' ? 'selected' : ''}>🔵 Completed</option>
                <option value="In Review" ${currentVal === 'In Review' ? 'selected' : ''}>🟣 In Review</option>
            </select>
        `;

        const select = this.shadowRoot.getElementById('selectEl');
        select.addEventListener('change', (e) => {
            this.dispatchEvent(new CustomEvent('change', {
                bubbles: true,
                composed: true,
                detail: { value: e.target.value }
            }));
        });

        setTimeout(() => select.focus(), 10);
    }
}
if (!customElements.get('status-selector')) {
    customElements.define('status-selector', StatusSelector);
}


// 2. <priority-badge-editor> - Interactive Priority selector
class PriorityBadgeEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const val = this.getAttribute('value') || 'Medium';
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: flex; align-items: center; justify-content: space-around; width: 100%; height: 100%; background: #0f172a; border-radius: 4px; padding: 2px; }
                button {
                    border: none;
                    font-size: 11px;
                    font-weight: 700;
                    padding: 4px 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: transform 0.1s ease;
                }
                button:hover { transform: scale(1.05); }
                .btn-high { background: #ef4444; color: #ffffff; }
                .btn-med { background: #f59e0b; color: #ffffff; }
                .btn-low { background: #10b981; color: #ffffff; }
            </style>
            <button class="btn-high" data-val="High">High</button>
            <button class="btn-med" data-val="Medium">Med</button>
            <button class="btn-low" data-val="Low">Low</button>
        `;

        this.shadowRoot.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedVal = btn.dataset.val;
                this.dispatchEvent(new CustomEvent('change', {
                    bubbles: true,
                    composed: true,
                    detail: { value: selectedVal }
                }));
            });
        });
    }
}
if (!customElements.get('priority-badge-editor')) {
    customElements.define('priority-badge-editor', PriorityBadgeEditor);
}


// 3. <rating-editor> - Interactive Star Rating Web Component
class RatingEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: flex; align-items: center; justify-content: center; gap: 4px; width: 100%; height: 100%; background: #1e293b; border-radius: 4px; }
                .star {
                    font-size: 16px;
                    color: #fbbf24;
                    cursor: pointer;
                    user-select: none;
                    transition: transform 0.15s ease;
                }
                .star:hover { transform: scale(1.3); }
            </style>
            <span class="star" data-rating="1">★</span>
            <span class="star" data-rating="2">★</span>
            <span class="star" data-rating="3">★</span>
            <span class="star" data-rating="4">★</span>
            <span class="star" data-rating="5">★</span>
        `;

        this.shadowRoot.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', () => {
                const count = parseInt(star.dataset.rating, 10);
                const ratingStr = '★'.repeat(count) + '☆'.repeat(5 - count);
                this.dispatchEvent(new CustomEvent('change', {
                    bubbles: true,
                    composed: true,
                    detail: { value: ratingStr }
                }));
            });
        });
    }
}
if (!customElements.get('rating-editor')) {
    customElements.define('rating-editor', RatingEditor);
}
