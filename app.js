function colourChecker(r,g,b) {
    if (r*0.299 + g*0.587 + b*0.114 < 127){
        return false;
    } else {
        return true;
    }
}

function randomColor() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return colourChecker(r,g,b) ? 'rgb(' + r + ',' + g + ',' + b + ')' : randomColor();
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.car-type-cards div').forEach(function(el) {
        el.style.backgroundColor = randomColor();
    });
    
    const formBox = document.querySelector('.form-box');
    
    if (formBox) {
        const filledContainer = document.createElement('div');
        filledContainer.className = 'filled-section';
        formBox.appendChild(filledContainer);
        
        let timeouts = new Map();
        
        function isGroupFilled(group) {
            const slider = group.querySelector('input[type="range"]');
            if (slider && slider.value !== slider.min) {
                return true;
            }
            
            const checkboxes = group.querySelectorAll('input[type="checkbox"]');
            for (let checkbox of checkboxes) {
                if (checkbox.checked) return true;
            }
            
            const radios = group.querySelectorAll('input[type="radio"]');
            for (let radio of radios) {
                if (radio.checked) return true;
            }
            
            return false;
        }
        
        function updateGroupPosition(group) {
            if (isGroupFilled(group)) {
                group.style.opacity = '0';
                group.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    if (filledContainer.firstChild) {
                        filledContainer.insertBefore(group, filledContainer.firstChild);
                    } else {
                        filledContainer.appendChild(group);
                    }
                    
                    setTimeout(() => {
                        group.style.opacity = '1';
                        group.style.transform = 'translateY(0)';
                    }, 50);
                }, 300);
            } else {
                group.style.opacity = '0';
                group.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    formBox.insertBefore(group, filledContainer);
                    
                    setTimeout(() => {
                        group.style.opacity = '1';
                        group.style.transform = 'translateY(0)';
                    }, 50);
                }, 300);
            }
        }
        
        function debouncedUpdate(group, delay = 1500) {
            if (timeouts.has(group)) {
                clearTimeout(timeouts.get(group));
            }
            
            const timeout = setTimeout(() => {
                updateGroupPosition(group);
                timeouts.delete(group);
            }, delay);
            
            timeouts.set(group, timeout);
        }
        
        const allGroups = formBox.querySelectorAll('.slider-group, .input-group');
        
        allGroups.forEach(group => {
            const slider = group.querySelector('input[type="range"]');
            if (slider) {
                slider.addEventListener('input', () => debouncedUpdate(group, 1500));
            }
            
            const checkboxes = group.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => debouncedUpdate(group, 1500));
            });
            
            const radios = group.querySelectorAll('input[type="radio"]');
            radios.forEach(radio => {
                radio.addEventListener('change', () => {
                    const radioName = radio.name;
                    const relatedGroups = formBox.querySelectorAll(`.input-group:has(input[name="${radioName}"])`);
                    relatedGroups.forEach(g => debouncedUpdate(g, 800));
                });
            });
        });
    }
});