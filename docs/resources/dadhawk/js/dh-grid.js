/**
 * DhGrid — High-Performance Data Grid Web Component.
 * @author Telman Shahbazov / Dadhawk (with Google DeepMind Antigravity AI)
 * @license GNU LGPL v3.0
 */
class DhGridElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.activeEditor = null;
        this.focusedRow = 0;
        this.focusedCol = 0;
    }

    static get observedAttributes() {
        return ['rows', 'cols', 'content', 'components', 'captions', 'readonly', 'readonly-cells', 'cell-styles', 'css-compatible'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && this.isConnected) {
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    get cssCompatible() {
        return this.getAttribute('css-compatible') || '';
    }

    set cssCompatible(val) {
        if (val) this.setAttribute('css-compatible', val);
        else this.removeAttribute('css-compatible');
    }

    get readOnly() {
        return this.hasAttribute('readonly') && this.getAttribute('readonly') !== 'false';
    }

    set readOnly(val) {
        if (val) this.setAttribute('readonly', 'true');
        else this.removeAttribute('readonly');
    }

    get readOnlyCells() {
        return this.getAttribute('readonly-cells');
    }

    set readOnlyCells(val) {
        if (typeof val === 'object') this.setAttribute('readonly-cells', JSON.stringify(val));
        else if (val) this.setAttribute('readonly-cells', val);
        else this.removeAttribute('readonly-cells');
    }

    get cellStyles() {
        return this.getAttribute('cell-styles');
    }

    set cellStyles(val) {
        if (typeof val === 'object') this.setAttribute('cell-styles', JSON.stringify(val));
        else if (val) this.setAttribute('cell-styles', val);
        else this.removeAttribute('cell-styles');
    }

    get captions() {
        return this.getCaptions();
    }

    set captions(val) {
        if (Array.isArray(val) || typeof val === 'object') {
            this.setAttribute('captions', JSON.stringify(val));
        } else if (typeof val === 'string') {
            this.setAttribute('captions', val);
        } else if (val == null) {
            this.removeAttribute('captions');
        }
    }

    get rows() {
        const data = this.getData();
        const dataRows = Array.isArray(data) ? data.length : 0;
        const attrVal = this.getAttribute('rows');
        const attrRows = attrVal ? parseInt(attrVal, 10) : 0;
        return Math.max(attrRows, dataRows, 5);
    }

    get cols() {
        const data = this.getData();
        let maxDataCols = 0;
        if (Array.isArray(data)) {
            for (const row of data) {
                if (Array.isArray(row) && row.length > maxDataCols) {
                    maxDataCols = row.length;
                }
            }
        }
        const attrVal = this.getAttribute('cols');
        const attrCols = attrVal ? parseInt(attrVal, 10) : 0;
        return Math.max(attrCols, maxDataCols, 5);
    }

    getCaptions() {
        try {
            const raw = this.getAttribute('captions');
            if (raw) {
                const clean = raw.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
                const parsed = JSON.parse(clean);
                if (parsed) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error("Error parsing captions attribute:", e);
        }

        const data = this.getData();

        if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
            return data[0];
        }

        const maxCols = (Array.isArray(data) && data[0]) ? data[0].length : 5;
        return Array.from({ length: maxCols }, (_, i) => `Col ${i + 1}`);
    }

    getData() {
        try {
            const raw = this.getAttribute('content');
            if (!raw || raw === '[]' || raw === '') {
                return [
                    ["Quarter", "Revenue ($)", "Expenses ($)", "Margin (%)", "Performance"],
                    ["Q1 2026", "$120,000", "$85,000", "29.1%", "Completed"],
                    ["Q2 2026", "$145,000", "$92,000", "36.5%", "Active"],
                    ["Q3 2026", "$160,000", "$98,000", "38.7%", "Pending"],
                    ["Q4 2026", "$210,000", "$110,000", "47.6%", "In Review"]
                ];
            }
            const clean = raw.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
            return JSON.parse(clean);
        } catch (e) {
            console.error("Error parsing content:", e);
            return [
                ["Quarter", "Revenue ($)", "Expenses ($)", "Margin (%)", "Performance"],
                ["Q1 2026", "$120,000", "$85,000", "29.1%", "Completed"],
                ["Q2 2026", "$145,000", "$92,000", "36.5%", "Active"],
                ["Q3 2026", "$160,000", "$98,000", "38.7%", "Pending"],
                ["Q4 2026", "$210,000", "$110,000", "47.6%", "In Review"]
            ];
        }
    }

    getComponentMap() {
        try {
            const raw = this.getAttribute('components') || '{}';
            const clean = raw.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
            return JSON.parse(clean);
        } catch (e) {
            console.error("Error parsing components map:", e);
            return {};
        }
    }

    isCellReadOnly(row, col) {
        if (this.readOnly) return true;

        const raw = this.getAttribute('readonly-cells');
        if (!raw) return false;

        try {
            const clean = raw.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
            const parsed = JSON.parse(clean);

            const keyCell = `r${row}_c${col}`;
            const keyCol = `c${col}`;
            const keyRow = `r${row}`;

            if (Array.isArray(parsed)) {
                return parsed.includes(keyCell) || parsed.includes(keyCol) || parsed.includes(keyRow);
            } else if (typeof parsed === 'object' && parsed !== null) {
                if (parsed[keyCell] !== undefined) return Boolean(parsed[keyCell]);
                if (parsed[keyCol] !== undefined) return Boolean(parsed[keyCol]);
                if (parsed[keyRow] !== undefined) return Boolean(parsed[keyRow]);
            }
        } catch (e) {
            console.error("Error parsing readonly-cells attribute:", e);
        }
        return false;
    }

    getCellStyle(row, col) {
        const raw = this.getAttribute('cell-styles');
        if (!raw) return '';

        try {
            const clean = raw.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
            const parsed = JSON.parse(clean);
            if (typeof parsed === 'object' && parsed !== null) {
                const keyCell = `r${row}_c${col}`;
                const keyCol = `c${col}`;
                const keyRow = `r${row}`;

                const styleVal = parsed[keyCell] || parsed[keyCol] || parsed[keyRow];
                if (typeof styleVal === 'string') {
                    return styleVal;
                } else if (typeof styleVal === 'object' && styleVal !== null) {
                    let css = '';
                    if (styleVal.bg || styleVal.background || styleVal['background-color']) {
                        css += `background-color: ${styleVal.bg || styleVal.background || styleVal['background-color']}; `;
                    }
                    if (styleVal.color) {
                        css += `color: ${styleVal.color}; `;
                    }
                    if (styleVal.fontWeight || styleVal['font-weight']) {
                        css += `font-weight: ${styleVal.fontWeight || styleVal['font-weight']}; `;
                    }
                    if (styleVal.fontSize || styleVal['font-size']) {
                        css += `font-size: ${styleVal.fontSize || styleVal['font-size']}; `;
                    }
                    if (styleVal.textAlign || styleVal['text-align']) {
                        css += `text-align: ${styleVal.textAlign || styleVal['text-align']}; `;
                    }
                    return css;
                }
            }
        } catch (e) {
            console.error("Error parsing cell-styles attribute:", e);
        }
        return '';
    }

    parseHeaderStructure(captionsInput, numCols) {
        if (!captionsInput) return null;

        if (Array.isArray(captionsInput) && Array.isArray(captionsInput[0])) {
            return captionsInput.map((row, r) => row.map((text, c) => ({
                text: String(text),
                colspan: 1,
                rowspan: 1,
                col: c
            })));
        }

        let paths = [];

        if (Array.isArray(captionsInput) && typeof captionsInput[0] === 'object' && captionsInput[0] !== null && captionsInput[0].title) {
            function traverse(node, currentPath) {
                const newPath = [...currentPath, node.title || node.name || ''];
                if (node.children && Array.isArray(node.children) && node.children.length > 0) {
                    node.children.forEach(child => {
                        if (typeof child === 'string') {
                            paths.push([...newPath, child]);
                        } else {
                            traverse(child, newPath);
                        }
                    });
                } else {
                    paths.push(newPath);
                }
            }
            captionsInput.forEach(item => {
                if (typeof item === 'string') paths.push([item]);
                else traverse(item, []);
            });
        } else if (Array.isArray(captionsInput)) {
            paths = captionsInput.map(c => {
                if (typeof c === 'string') {
                    if (c.includes('/')) return c.split('/').map(s => s.trim());
                    if (c.includes('>')) return c.split('>').map(s => s.trim());
                    return [c.trim()];
                }
                return [String(c)];
            });
        } else {
            return null;
        }

        const totalCols = Math.max(paths.length, numCols || 0);
        while (paths.length < totalCols) {
            paths.push([`Col ${paths.length + 1}`]);
        }

        const maxDepth = Math.max(...paths.map(p => p.length));
        if (maxDepth <= 1) {
            return [paths.map((p, c) => ({ text: p[0], colspan: 1, rowspan: 1, col: c }))];
        }

        const grid = [];
        for (let depth = 0; depth < maxDepth; depth++) {
            const row = [];
            for (let col = 0; col < totalCols; col++) {
                const p = paths[col];
                if (depth < p.length - 1) {
                    row.push({ text: p[depth], isLeaf: false, pathKey: p.slice(0, depth + 1).join('/') });
                } else if (depth === p.length - 1) {
                    row.push({ text: p[p.length - 1], isLeaf: true, pathKey: p.join('/'), leafDepth: depth });
                } else {
                    row.push(null);
                }
            }
            grid.push(row);
        }

        const headerRows = [];
        const spanCovered = Array.from({ length: maxDepth }, () => Array(totalCols).fill(false));

        for (let d = 0; d < maxDepth; d++) {
            const rowCells = [];
            for (let c = 0; c < totalCols; c++) {
                if (spanCovered[d][c]) continue;
                const item = grid[d][c];
                if (!item) continue;

                let colspan = 1;
                while (c + colspan < totalCols) {
                    const nextItem = grid[d][c + colspan];
                    if (nextItem && nextItem.pathKey === item.pathKey && !spanCovered[d][c + colspan]) {
                        colspan++;
                    } else {
                        break;
                    }
                }

                let rowspan = 1;
                if (item.isLeaf && d < maxDepth - 1) {
                    rowspan = maxDepth - d;
                }

                for (let rSpan = 0; rSpan < rowspan; rSpan++) {
                    for (let cSpan = 0; cSpan < colspan; cSpan++) {
                        if (d + rSpan < maxDepth && c + cSpan < totalCols) {
                            spanCovered[d + rSpan][c + cSpan] = true;
                        }
                    }
                }

                rowCells.push({ text: item.text, colspan, rowspan, col: c });
            }
            headerRows.push(rowCells);
        }

        return headerRows;
    }

    render() {
        const cols = this.cols;
        const data = this.getData();
        const captions = this.getCaptions();
        const startRow = 1;

        const endRow = Math.max(this.rows, Array.isArray(data) ? data.length : 0);
        const headerStructure = this.parseHeaderStructure(captions, cols);

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: relative;
                    font-family: var(--dh-font-family, var(--font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif));
                    font-size: 14px;
                    width: 100%;

                    /* Built-in high-contrast default theme tokens */
                    --dh-table-bg: var(--dh-bg, #ffffff);
                    --dh-header-bg: var(--dh-head-bg, #f1f5f9);
                    --dh-header-color: var(--dh-head-color, #0f172a);
                    --dh-cell-color: var(--dh-text-color, #1e293b);
                    --dh-border-color: var(--dh-grid-border, #cbd5e1);
                    --dh-hover-bg: #e0f2fe;
                    --dh-hover-outline: #38bdf8;
                    --dh-readonly-bg: rgba(241, 245, 249, 0.8);
                    --dh-readonly-color: #64748b;
                    --dh-focus-ring: #2563eb;
                }

                /* Scoped PrimeThemes CSS variables compatibility mode */
                :host([css-compatible="primethemes"]),
                :host([css-compatible="true"]) {
                    --dh-table-bg: var(--surface-a, var(--surface-card, #ffffff));
                    --dh-header-bg: var(--surface-b, var(--surface-section, var(--surface-50, #f1f5f9)));
                    --dh-header-color: var(--text-color, #0f172a);
                    --dh-cell-color: var(--text-color, #1e293b);
                    --dh-border-color: var(--surface-border, var(--surface-d, #cbd5e1));
                    --dh-hover-bg: var(--surface-hover, var(--primary-50, #e0f2fe));
                    --dh-hover-outline: var(--primary-color, #38bdf8);
                    --dh-readonly-bg: var(--surface-c, rgba(241, 245, 249, 0.7));
                    --dh-readonly-color: var(--text-color-secondary, #64748b);
                    --dh-focus-ring: var(--focus-ring-color, var(--primary-color, #2563eb));
                }
                .grid-container {
                    position: relative;
                    display: block;
                    width: 100%;
                    overflow-x: auto;
                    border-radius: 8px;
                }
                .grid-table {
                    width: 100%;
                    border-collapse: collapse;
                    border: 2px solid var(--dh-border-color);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    background-color: var(--dh-table-bg);
                    color: var(--dh-cell-color);
                }
                .grid-header-cell {
                    background: var(--dh-header-bg);
                    font-weight: 700;
                    color: var(--dh-header-color);
                    border: 1px solid var(--dh-border-color);
                    border-bottom: 2px solid var(--dh-border-color);
                    padding: 8px 12px;
                    text-align: center;
                    cursor: default;
                    user-select: none;
                }
                .grid-cell {
                    border: 1px solid var(--dh-border-color);
                    padding: 10px 14px;
                    min-width: 110px;
                    height: 38px;
                    text-align: left;
                    cursor: cell;
                    transition: background 0.15s ease, outline 0.15s ease;
                    color: var(--dh-cell-color);
                    font-weight: 500;
                    box-sizing: border-box;
                    white-space: nowrap;
                }
                .grid-cell:hover {
                    background-color: var(--dh-hover-bg);
                    outline: 2px solid var(--dh-hover-outline);
                    outline-offset: -2px;
                }
                .grid-cell:focus, .grid-cell.grid-cell-focused {
                    outline: 2px solid var(--dh-focus-ring);
                    outline-offset: -2px;
                    background-color: var(--dh-hover-bg);
                }
                .grid-cell.grid-cell-readonly {
                    background-color: var(--dh-readonly-bg);
                    color: var(--dh-readonly-color);
                    cursor: not-allowed;
                }
                .grid-cell.grid-cell-readonly:hover {
                    background-color: var(--dh-readonly-bg);
                    outline: 1px solid var(--dh-border-color);
                }
                @keyframes cellShake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-4px); }
                    40%, 80% { transform: translateX(4px); }
                }
                .cell-locked-shake {
                    animation: cellShake 0.35s ease;
                }
                .cell-overlay {
                    position: absolute;
                    background: var(--dh-table-bg);
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
                    border: 2px solid var(--dh-focus-ring);
                    border-radius: 4px;
                    z-index: 999;
                    display: flex;
                    align-items: center;
                    box-sizing: border-box;
                }
                .cell-overlay input {
                    width: 100%;
                    height: 100%;
                    border: none;
                    outline: none;
                    padding: 0 10px;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--dh-cell-color);
                    box-sizing: border-box;
                    background: var(--dh-table-bg);
                }
            </style>
            <div class="grid-container" id="container">
                <table class="grid-table">
                    <thead>
                        ${(headerStructure && headerStructure.length > 0) ? headerStructure.map(hRow => `
                            <tr>
                                ${hRow.map(cell => `
                                    <th class="grid-header-cell" colspan="${cell.colspan}" rowspan="${cell.rowspan}" data-col="${cell.col}">
                                        ${cell.text}
                                    </th>
                                `).join('')}
                            </tr>
                        `).join('') : ''}
                    </thead>
                    <tbody>
                        ${Array.from({ length: Math.max(0, endRow - startRow) }, (_, idx) => {
                            const r = startRow + idx;
                            return `
                                <tr>
                                    ${Array.from({ length: cols }, (_, c) => {
                                        const val = (data[r] && data[r][c] !== undefined) ? data[r][c] : '';
                                        const customStyle = this.getCellStyle(r, c);
                                        const isReadOnly = this.isCellReadOnly(r, c);
                                        const readOnlyClass = isReadOnly ? ' grid-cell-readonly' : '';
                                        const readOnlyAttr = isReadOnly ? ' data-readonly="true"' : '';
                                        return `<td class="grid-cell${readOnlyClass}"${readOnlyAttr} tabindex="0" style="${customStyle}" data-row="${r}" data-col="${c}">${val}</td>`;
                                    }).join('')}
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;

        this.attachEvents();
        const minRow = 1;
        if (this.focusedRow === undefined || this.focusedRow < minRow) {
            this.focusedRow = minRow;
        }
        if (this.focusedCol === undefined || this.focusedCol < 0) {
            this.focusedCol = 0;
        }
        const isFocusedInGrid = this.shadowRoot && (this.shadowRoot.contains(this.shadowRoot.activeElement) || this.shadowRoot.contains(document.activeElement));
        this.focusCell(this.focusedRow, this.focusedCol, Boolean(isFocusedInGrid));
    }

    attachEvents() {
        if (this._eventsAttached) return;
        this._eventsAttached = true;

        this.shadowRoot.addEventListener('click', (e) => {
            const cell = e.target.closest('.grid-cell');
            if (cell && cell.dataset.row !== undefined && cell.dataset.col !== undefined) {
                const r = parseInt(cell.dataset.row, 10);
                const c = parseInt(cell.dataset.col, 10);
                this.focusCell(r, c, true);
            }
        });

        this.shadowRoot.addEventListener('focusin', (e) => {
            const cell = e.target.closest('.grid-cell');
            if (cell && cell.dataset.row !== undefined && cell.dataset.col !== undefined) {
                const r = parseInt(cell.dataset.row, 10);
                const c = parseInt(cell.dataset.col, 10);
                this.focusedRow = r;
                this.focusedCol = c;
                this.shadowRoot.querySelectorAll('.grid-cell-focused').forEach(el => el.classList.remove('grid-cell-focused'));
                cell.classList.add('grid-cell-focused');
            }
        });

        this.shadowRoot.addEventListener('dblclick', (e) => {
            const cell = e.target.closest('.grid-cell');
            if (cell && cell.dataset.row !== undefined && cell.dataset.col !== undefined) {
                const r = parseInt(cell.dataset.row, 10);
                const c = parseInt(cell.dataset.col, 10);
                this.openEditor(cell, r, c);
            }
        });

        this.shadowRoot.addEventListener('keydown', (e) => {
            if (this.activeEditor) return;

            const cell = e.target.closest('.grid-cell');
            let currR = this.focusedRow;
            let currC = this.focusedCol;

            if (cell && cell.dataset.row !== undefined && cell.dataset.col !== undefined) {
                currR = parseInt(cell.dataset.row, 10);
                currC = parseInt(cell.dataset.col, 10);
                this.focusedRow = currR;
                this.focusedCol = currC;
            }

            const key = e.key;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Escape'].includes(key)) {
                e.preventDefault();
                e.stopPropagation();

                if (key === 'ArrowUp') {
                    this.focusCell(currR - 1, currC, true);
                } else if (key === 'ArrowDown') {
                    this.focusCell(currR + 1, currC, true);
                } else if (key === 'Enter') {
                    const targetCell = this.getCellElement(currR, currC);
                    if (targetCell) {
                        this.openEditor(targetCell, currR, currC);
                    }
                } else if (key === 'ArrowLeft') {
                    this.focusCell(currR, currC - 1, true);
                } else if (key === 'ArrowRight') {
                    this.focusCell(currR, currC + 1, true);
                } else if (key === 'Tab') {
                    const nextPos = this.getNextTabPosition(e.shiftKey ? -1 : 1, currR, currC);
                    this.focusCell(nextPos.r, nextPos.c, true);
                } else if (key === 'Escape') {
                    this.focusCell(currR, currC, true);
                }
            } else if (key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
                const targetCell = this.getCellElement(currR, currC);
                if (targetCell && !this.isCellReadOnly(currR, currC)) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.openEditor(targetCell, currR, currC, key);
                }
            }
        });

        document.addEventListener('click', (e) => {
            if (this.activeEditor && !this.contains(e.target) && !this.shadowRoot.contains(e.target)) {
                this.closeEditor();
            }
        });
    }

    getCellElement(row, col) {
        return this.shadowRoot.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
    }

    focusCell(row, col, forceFocus = true) {
        const data = this.getData();
        const minRow = 1;
        const maxRow = Math.max(minRow, data.length - 1);
        const maxCol = Math.max(0, this.cols - 1);

        const clampedRow = Math.max(minRow, Math.min(row, maxRow));
        const clampedCol = Math.max(0, Math.min(col, maxCol));

        this.focusedRow = clampedRow;
        this.focusedCol = clampedCol;

        if (!this.shadowRoot) return;

        this.shadowRoot.querySelectorAll('.grid-cell-focused').forEach(el => el.classList.remove('grid-cell-focused'));

        const target = this.getCellElement(clampedRow, clampedCol);
        if (target) {
            target.classList.add('grid-cell-focused');
            if (forceFocus) {
                target.focus({ preventScroll: true });
                if (typeof target.scrollIntoView === 'function') {
                    target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
                }
            }
        }
    }

    getNextTabPosition(direction, fromRow, fromCol) {
        const data = this.getData();
        const minRow = 1;
        const maxRow = Math.max(minRow, data.length - 1);
        const totalCols = this.cols;

        let r = fromRow !== undefined ? fromRow : this.focusedRow;
        let c = fromCol !== undefined ? fromCol : this.focusedCol;

        if (direction > 0) {
            c++;
            if (c >= totalCols) {
                c = 0;
                r++;
            }
            if (r > maxRow) {
                r = maxRow;
                c = totalCols - 1;
            }
        } else {
            c--;
            if (c < 0) {
                c = totalCols - 1;
                r--;
            }
            if (r < minRow) {
                r = minRow;
                c = 0;
            }
        }
        return { r, c };
    }

    openEditor(cell, row, col, initialChar = null) {
        this.focusedRow = row;
        this.focusedCol = col;

        if (this.isCellReadOnly(row, col)) {
            cell.classList.add('cell-locked-shake');
            setTimeout(() => cell.classList.remove('cell-locked-shake'), 350);
            return;
        }

        this.closeEditor();

        const container = this.shadowRoot.getElementById('container');
        if (!container) return;
        const containerRect = container.getBoundingClientRect();
        const cellRect = cell.getBoundingClientRect();

        const overlay = document.createElement('div');
        overlay.className = 'cell-overlay';
        overlay.style.top = `${cellRect.top - containerRect.top}px`;
        overlay.style.left = `${cellRect.left - containerRect.left}px`;
        overlay.style.width = `${cellRect.width}px`;
        overlay.style.height = `${cellRect.height}px`;

        const key = `r${row}_c${col}`;
        const compMap = this.getComponentMap();
        const customCompTag = compMap[key];

        const commitAndNavigate = (newVal, actionKey, isShift) => {
            cell.innerText = newVal;
            let nextR = row;
            let nextC = col;

            if (actionKey === 'Enter') {
                nextR = row + 1;
            } else if (actionKey === 'Tab') {
                const nextPos = this.getNextTabPosition(isShift ? -1 : 1, row, col);
                nextR = nextPos.r;
                nextC = nextPos.c;
            }

            this.focusedRow = nextR;
            this.focusedCol = nextC;

            this.closeEditor();
            this.notifyChange(row, col, newVal);
            this.focusCell(nextR, nextC, true);
        };

        if (customCompTag && customElements.get(customCompTag)) {
            const customEl = document.createElement(customCompTag);
            customEl.setAttribute('value', initialChar !== null ? initialChar : cell.innerText.trim());
            customEl.setAttribute('row', row);
            customEl.setAttribute('col', col);

            const handleCustomSave = (val) => {
                const newVal = String(val !== undefined ? val : (customEl.value || cell.innerText));
                commitAndNavigate(newVal, 'Enter', false);
            };

            customEl.addEventListener('cell-save', (ev) => handleCustomSave(ev.detail?.value ?? ev.detail));
            customEl.addEventListener('change', (ev) => handleCustomSave(ev.detail?.value ?? customEl.value));
            customEl.addEventListener('value-changed', (ev) => handleCustomSave(ev.detail?.value ?? customEl.value));
            customEl.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter') {
                    ev.preventDefault();
                    ev.stopPropagation();
                    const val = customEl.value !== undefined ? customEl.value : cell.innerText.trim();
                    commitAndNavigate(val, 'Enter', false);
                } else if (ev.key === 'Tab') {
                    ev.preventDefault();
                    ev.stopPropagation();
                    const val = customEl.value !== undefined ? customEl.value : cell.innerText.trim();
                    commitAndNavigate(val, 'Tab', ev.shiftKey);
                } else if (ev.key === 'Escape') {
                    ev.preventDefault();
                    ev.stopPropagation();
                    this.closeEditor();
                    this.focusCell(row, col, true);
                }
            });

            overlay.appendChild(customEl);
        } else {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = initialChar !== null ? initialChar : cell.innerText.trim();

            input.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter') {
                    ev.preventDefault();
                    ev.stopPropagation();
                    commitAndNavigate(input.value, 'Enter', false);
                } else if (ev.key === 'Tab') {
                    ev.preventDefault();
                    ev.stopPropagation();
                    commitAndNavigate(input.value, 'Tab', ev.shiftKey);
                } else if (ev.key === 'Escape') {
                    ev.preventDefault();
                    ev.stopPropagation();
                    this.closeEditor();
                    this.focusCell(row, col, true);
                }
            });

            overlay.appendChild(input);
            setTimeout(() => {
                input.focus();
                if (initialChar !== null) {
                    input.setSelectionRange(initialChar.length, initialChar.length);
                } else {
                    input.select();
                }
            }, 20);
        }

        container.appendChild(overlay);
        this.activeEditor = overlay;
    }

    closeEditor() {
        if (this.activeEditor) {
            this.activeEditor.remove();
            this.activeEditor = null;
        }
    }

    notifyChange(row, col, value) {
        try {
            const data = this.getData();
            if (data && data[row]) {
                data[row][col] = value;
                this.setAttribute('content', JSON.stringify(data));
            }
        } catch (e) {
            console.error("Error updating content attribute:", e);
        }

        this.dispatchEvent(new CustomEvent('cell-change', {
            bubbles: true,
            composed: true,
            detail: { row, col, value }
        }));
    }

    addRow(defaultRow) {
        const data = this.getData();
        const cols = this.cols;
        const newRow = defaultRow || Array.from({ length: cols }, (_, c) => `Row ${data.length + 1} Col ${c + 1}`);
        data.push(newRow);
        this.setAttribute('rows', data.length);
        this.setAttribute('content', JSON.stringify(data));
        this.render();
    }

    addCol(defaultColName) {
        const data = this.getData();
        const cols = this.cols;
        data.forEach((row) => {
            row.push(defaultColName ? `${defaultColName} ${cols + 1}` : `Col ${cols + 1}`);
        });

        const captions = [...this.getCaptions()];
        if (Array.isArray(captions)) {
            captions.push(defaultColName ? `${defaultColName} ${cols + 1}` : `Col ${cols + 1}`);
            this.setAttribute('captions', JSON.stringify(captions));
        }

        this.setAttribute('cols', cols + 1);
        this.setAttribute('content', JSON.stringify(data));
        this.render();
    }
}

if (!customElements.get('dh-grid-element')) {
    customElements.define('dh-grid-element', DhGridElement);
}
