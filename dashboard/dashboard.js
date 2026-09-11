document.addEventListener('DOMContentLoaded', () => {
    // Initialize icons
    feather.replace();

    // Mobile Sidebar Toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            const currentTransform = sidebar.style.transform;
            if (currentTransform === 'translateX(0px)' || currentTransform === '') {
                sidebar.style.transform = 'translateX(-260px)';
            } else {
                sidebar.style.transform = 'translateX(0px)';
            }
        });
    }

    // Interactive chart tooltips
    const chartContainer = document.querySelector('.chart-container');
    const tooltipArea = document.querySelector('.chart-tooltip-area');
    
    if (chartContainer && tooltipArea) {
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.background = 'var(--panel-lighter)';
        tooltip.style.border = '1px solid var(--border-blue)';
        tooltip.style.padding = '8px 12px';
        tooltip.style.borderRadius = '8px';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.2s';
        tooltip.style.fontSize = '12px';
        tooltip.style.color = 'var(--text-main)';
        tooltip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        chartContainer.appendChild(tooltip);

        chartContainer.style.position = 'relative';

        tooltipArea.addEventListener('mousemove', (e) => {
            const rect = tooltipArea.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            tooltip.style.opacity = '1';
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y - 40}px`;
            tooltip.innerHTML = `<strong>Spend:</strong> $${Math.floor(200 - y + 100)}K<br><span style="color:var(--text-muted)">Month ${Math.floor(x/50) + 1}</span>`;
        });
        
        tooltipArea.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    }

    // Filter Buttons
    const filters = document.querySelectorAll('.chart-filter');
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const area = document.querySelector('.chart-area');
            const line = document.querySelector('.chart-line');
            if (area && line) {
                area.style.animation = 'none';
                line.style.animation = 'none';
                void area.offsetWidth;
                area.style.animation = 'fadeArea 1s ease-out forwards 0.2s';
                line.style.animation = 'drawLine 1s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            }
        });
    });

    // Number Animation
    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            let current = Math.floor(easeOut * (end - start) + start);
            
            if (end > 1000000) {
                obj.innerHTML = `$${(current / 1000000).toFixed(1)}M`;
            } else if (end > 1000) {
                if (obj.innerHTML.startsWith('$')) {
                    obj.innerHTML = `$${(current / 1000).toFixed(0)}K`;
                } else {
                    obj.innerHTML = current.toLocaleString();
                }
            } else {
                obj.innerHTML = current;
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    const kpiValues = document.querySelectorAll('.kpi-card__value');
    kpiValues.forEach(kpi => {
        const endValue = parseInt(kpi.getAttribute('data-value'), 10);
        if (!isNaN(endValue)) {
            animateValue(kpi, 0, endValue, 1200);
        }
    });
});
