document.addEventListener('DOMContentLoaded', () => {
    const database = firebase.database();
    const widgets = document.querySelectorAll('.trail-status-widget');

    if (widgets.length === 0) return;

    let liftsData = null;
    let trailsData = null;
    let overallLatest = 0;

    const frontLiftsKeys = ['tube-conveyor', 'ski-conveyor', 'lift-1', 'lift-2', 'lift-3', 'lift-4'];
    const backLiftsKeys = ['lift-5', 'lift-6', 'lift-7', 'lift-8'];
    const frontTrailsKeys = ['mk-tubing', 'little-beaver', 'timberwolf', 'wolf-chute', 'wolf-ridge', 'big-brave', 'brave-chute', 'little-brave', 'wild-deer', 'eagle-ridge', 'sundance'];
    const backTrailsKeys = ['sleepy-hollow', 'birch-coulee', 'big-hawk-ridge', 'little-forest', 'sleepy-creek', 'little-crow', 'tomahawk-chute', 'big-bear'];

    function getDiffClass(diff) {
        if (!diff) return '';
        const d = diff.toLowerCase();
        if (d.includes('green')) return 'diff-green';
        if (d.includes('blue')) return 'diff-blue';
        if (d.includes('black')) return 'diff-black';
        return '';
    }

    function updateLastModifiedText() {
        if (overallLatest === 0) return;
        const date = new Date(overallLatest);
        const timeString = `Updated: ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        
        widgets.forEach(widget => {
            const lastUpdatedEl = widget.querySelector('.widget-last-updated');
            if (lastUpdatedEl) {
                lastUpdatedEl.textContent = timeString;
            }
        });
    }

    // Function to render standard data into a specific container
    function renderPublicList(data, container, widget, isLifts) {
        container.innerHTML = '';
        if (!data) return;

        const isMicro = widget.classList.contains('widget-micro');

        Object.keys(data).forEach(key => {
            const item = data[key];
            if (item.lastUpdated > overallLatest) overallLatest = item.lastUpdated;

            const div = document.createElement('div');
            const statusLower = item.status.toLowerCase();
            div.className = `public-status-item status-${statusLower}`;

            const diffHtml = item.difficulty ? `<span class="difficulty-indicator ${getDiffClass(item.difficulty)}" title="${item.difficulty}"></span>` : '';

            let displayName = item.name;
            if (isMicro && isLifts) {
                const numMatch = item.name.match(/\d+/);
                displayName = numMatch ? numMatch[0] : item.name.charAt(0).toUpperCase();
            }

            let badgeHtml = `<div class="item-badge badge-${statusLower}">${item.status}</div>`;
            if (isMicro) {
                badgeHtml = `<span class="micro-status-bullet micro-${statusLower}" title="${item.status}"></span>`;
            }

            div.innerHTML = `
                <div class="item-title">
                    ${diffHtml}
                    <span class="item-name-text">${displayName}</span>
                </div>
                ${badgeHtml}
            `;
            container.appendChild(div);
        });
    }

    // Function specifically for the overlay variant
    function renderOverlay(widget) {
        if (!liftsData || !trailsData) return; // Wait until both are loaded

        const frontContainer = widget.querySelector('.overlay-front');
        const backContainer = widget.querySelector('.overlay-back');
        if (!frontContainer || !backContainer) return;

        frontContainer.innerHTML = '<span class="overlay-row-label">Front Side:</span><div class="overlay-row-items"></div>';
        backContainer.innerHTML = '<span class="overlay-row-label">Back Side:</span><div class="overlay-row-items"></div>';

        const frontItems = frontContainer.querySelector('.overlay-row-items');
        const backItems = backContainer.querySelector('.overlay-row-items');

        function appendItems(keys, dataSource, container, isLifts) {
            keys.forEach(key => {
                const item = dataSource[key];
                if (!item) return;

                if (item.lastUpdated > overallLatest) overallLatest = item.lastUpdated;

                const statusLower = item.status.toLowerCase();
                const div = document.createElement('div');
                div.className = `overlay-status-item`;

                let displayName = item.name;
                if (isLifts) {
                    const numMatch = item.name.match(/\d+/);
                    displayName = numMatch ? 'L'+numMatch[0] : item.name.charAt(0).toUpperCase();
                    if(key.includes('conveyor')) displayName = key.includes('tube') ? 'TC' : 'SC';
                }

                div.innerHTML = `
                    <span class="item-name-text">${displayName}</span>
                    <span class="micro-status-bullet micro-${statusLower}" title="${item.status}"></span>
                `;
                container.appendChild(div);
            });
        }

        appendItems(frontLiftsKeys, liftsData, frontItems, true);
        appendItems(frontTrailsKeys, trailsData, frontItems, false);
        
        appendItems(backLiftsKeys, liftsData, backItems, true);
        appendItems(backTrailsKeys, trailsData, backItems, false);
    }

    // Initialize logic
    widgets.forEach(widget => {
        const isOverlay = widget.classList.contains('widget-overlay');
        
        if (isOverlay) {
            widget.querySelector('.widget-standard-view').style.display = 'none';
            widget.querySelector('.widget-overlay-view').style.display = 'flex';
        } else {
            widget.querySelector('.widget-overlay-view').style.display = 'none';
            const tabs = widget.querySelectorAll('.widget-tab');
            const contents = widget.querySelectorAll('.widget-content');

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    contents.forEach(c => c.classList.remove('active'));
                    
                    tab.classList.add('active');
                    const targetClass = tab.dataset.target;
                    widget.querySelector('.' + targetClass).classList.add('active');
                });
            });
        }
    });

    // Fetch Data
    database.ref('lifts').on('value', snapshot => {
        liftsData = snapshot.val();
        widgets.forEach(widget => {
            if (widget.classList.contains('widget-overlay')) {
                renderOverlay(widget);
            } else {
                const listContainer = widget.querySelector('.public-lifts-list');
                if (listContainer) renderPublicList(liftsData, listContainer, widget, true);
            }
        });
        updateLastModifiedText();
    });

    database.ref('trails').on('value', snapshot => {
        trailsData = snapshot.val();
        widgets.forEach(widget => {
            if (widget.classList.contains('widget-overlay')) {
                renderOverlay(widget);
            } else {
                const listContainer = widget.querySelector('.public-trails-list');
                if (listContainer) renderPublicList(trailsData, listContainer, widget, false);
            }
        });
        updateLastModifiedText();
    });

    database.ref('mtbTrails').on('value', snapshot => {
        const mtbData = snapshot.val();
        widgets.forEach(widget => {
            if (widget.classList.contains('widget-mtb')) {
                // Update the header text with global status
                const headerText = widget.querySelector('.widget-header h2');
                const headerContainer = widget.querySelector('.widget-header');
                if (headerText && mtbData && mtbData['all-mtb-trails']) {
                    const masterStatus = mtbData['all-mtb-trails'].status;
                    headerText.textContent = `MTB Trail Status: ${masterStatus}`;
                    
                    if (masterStatus === 'Closed') {
                        headerContainer.classList.add('widget-header-closed');
                    } else {
                        headerContainer.classList.remove('widget-header-closed');
                    }
                }
            }

            if (widget.classList.contains('widget-modal')) {
                const wrapper = widget.closest('.trail-status-modal-wrapper');
                if (wrapper && mtbData && mtbData['all-mtb-trails']) {
                    const masterStatus = mtbData['all-mtb-trails'].status;
                    const trigger = wrapper.querySelector('.status-modal-trigger');
                    if (trigger) {
                        trigger.textContent = `MTB Trails: ${masterStatus}`;
                        trigger.classList.remove('badge-open', 'badge-closed', 'badge-hold', 'badge-groomed', 'badge-some-closures');
                        const statusClass = masterStatus.toLowerCase().replace(' ', '-');
                        trigger.classList.add(`badge-${statusClass}`);
                    }
                }
            }

            if (widget.classList.contains('widget-overlay')) {
                // If they want an MTB overlay in the future, it would go here.
                // Currently, overlay is hardcoded to winter trails.
            } else {
                const listContainer = widget.querySelector('.public-mtb-list');
                if (listContainer) renderPublicList(mtbData, listContainer, widget, false);
            }
        });
        updateLastModifiedText();
    });

    // Ensure the correct tab is active based on the variant
    widgets.forEach(widget => {
        if (widget.classList.contains('widget-mtb') || widget.classList.contains('widget-modal')) {
            const mtbTab = widget.querySelector('.widget-tab[data-target="widget-mtb"]');
            if (mtbTab) mtbTab.click(); // Programmatically switch to MTB tab
            
            // Set fallback text before data loads
            const header = widget.querySelector('.widget-header h2');
            if (header && !header.textContent.includes(':')) {
                header.textContent = 'MTB Trail Status';
            }
        }
    });

    // Modal Logic
    const modalWrappers = document.querySelectorAll('.trail-status-modal-wrapper');
    modalWrappers.forEach(wrapper => {
        const trigger = wrapper.querySelector('.status-modal-trigger');
        const overlay = wrapper.querySelector('.status-modal-overlay');
        const closeBtn = wrapper.querySelector('.status-modal-close');

        if (trigger && overlay && closeBtn) {
            trigger.addEventListener('click', () => {
                overlay.classList.remove('hidden');
            });

            closeBtn.addEventListener('click', () => {
                overlay.classList.add('hidden');
            });

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.add('hidden');
                }
            });
        }
    });
});
