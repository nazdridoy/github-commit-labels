// ==UserScript==
// @name         GitHub Commit Labels
// @namespace    https://github.com/nazdridoy
// @version      1.0.0
// @description  Enhances GitHub commits with beautiful labels for conventional commit types (feat, fix, docs, etc.)
// @author       nazdridoy
// @license      MIT
// @match        https://github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @homepageURL  https://github.com/nazdridoy/github-commit-labels
// @supportURL   https://github.com/nazdridoy/github-commit-labels/issues
// ==/UserScript==

/* 
MIT License

Copyright (c) 2025 nazDridoy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    // Color definitions using HSL values
    const COLORS = {
        'green': { bg: 'rgba(35, 134, 54, 0.2)', text: '#7ee787' },
        'purple': { bg: 'rgba(163, 113, 247, 0.2)', text: '#d2a8ff' },
        'blue': { bg: 'rgba(47, 129, 247, 0.2)', text: '#79c0ff' },
        'light-blue': { bg: 'rgba(31, 111, 235, 0.2)', text: '#58a6ff' },
        'yellow': { bg: 'rgba(210, 153, 34, 0.2)', text: '#e3b341' },
        'orange': { bg: 'rgba(219, 109, 40, 0.2)', text: '#ffa657' },
        'gray': { bg: 'rgba(139, 148, 158, 0.2)', text: '#8b949e' },
        'light-green': { bg: 'rgba(57, 211, 83, 0.2)', text: '#56d364' },
        'red': { bg: 'rgba(248, 81, 73, 0.2)', text: '#ff7b72' },
        'dark-yellow': { bg: 'rgba(187, 128, 9, 0.2)', text: '#bb8009' }
    };

    // Define default configuration
    const DEFAULT_CONFIG = {
        removePrefix: true,
        labelStyle: {
            fontSize: '14px',
            fontWeight: '500',
            height: '24px',
            padding: '0 10px',
            marginRight: '8px',
            borderRadius: '20px',
            minWidth: 'auto',
            textAlign: 'center',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
            background: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(240, 246, 252, 0.1)', // Subtle border
            color: '#ffffff'
        },
        commitTypes: {
            // Features
            feat: { emoji: '✨', label: 'Feature', color: 'green' },
            feature: { emoji: '✨', label: 'Feature', color: 'green' },

            // Added
            added: { emoji: '📝', label: 'Added', color: 'green' },
            add: { emoji: '📝', label: 'Added', color: 'green' },

            // Updated
            update: { emoji: '♻️', label: 'Updated', color: 'blue' },
            updated: { emoji: '♻️', label: 'Updated', color: 'blue' },

            // Removed
            removed: { emoji: '🗑️', label: 'Removed', color: 'red' },
            remove: { emoji: '🗑️', label: 'Removed', color: 'red' },

            // Fixes
            fix: { emoji: '🐛', label: 'Fix', color: 'purple' },
            bugfix: { emoji: '🐛', label: 'Fix', color: 'purple' },
            fixed: { emoji: '🐛', label: 'Fix', color: 'purple' },
            hotfix: { emoji: '🚨', label: 'Hot Fix', color: 'red' },

            // Documentation
            docs: { emoji: '📚', label: 'Docs', color: 'blue' },
            doc: { emoji: '📚', label: 'Docs', color: 'blue' },
            documentation: { emoji: '📚', label: 'Docs', color: 'blue' },

            // Styling
            style: { emoji: '💎', label: 'Style', color: 'light-green' },
            ui: { emoji: '🎨', label: 'UI', color: 'light-green' },
            css: { emoji: '💎', label: 'Style', color: 'light-green' },

            // Code Changes
            refactor: { emoji: '📦', label: 'Refactor', color: 'light-blue' },
            perf: { emoji: '🚀', label: 'Performance', color: 'purple' },
            performance: { emoji: '🚀', label: 'Performance', color: 'purple' },
            optimize: { emoji: '⚡', label: 'Optimize', color: 'purple' },

            // Testing
            test: { emoji: '🧪', label: 'Test', color: 'yellow' },
            tests: { emoji: '🧪', label: 'Test', color: 'yellow' },
            testing: { emoji: '🧪', label: 'Test', color: 'yellow' },

            // Build & Deploy
            build: { emoji: '🛠', label: 'Build', color: 'orange' },
            ci: { emoji: '⚙️', label: 'CI', color: 'gray' },
            cd: { emoji: '🚀', label: 'CD', color: 'gray' },
            deploy: { emoji: '📦', label: 'Deploy', color: 'orange' },
            release: { emoji: '🚀', label: 'Deploy', color: 'orange' },

            // Maintenance
            chore: { emoji: '♻️', label: 'Chore', color: 'light-green' },
            deps: { emoji: '📦', label: 'Dependencies', color: 'light-green' },
            dep: { emoji: '📦', label: 'Dependencies', color: 'light-green' },
            dependencies: { emoji: '📦', label: 'Dependencies', color: 'light-green' },
            revert: { emoji: '🗑', label: 'Revert', color: 'red' },
            wip: { emoji: '🚧', label: 'WIP', color: 'dark-yellow' }
        }
    };

    // Get saved configuration or use default
    const USER_CONFIG = GM_getValue('commitLabelsConfig', DEFAULT_CONFIG);

    // Create configuration window
    function createConfigWindow() {
        const configWindow = document.createElement('div');
        configWindow.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #0d1117;
            border: 1px solid #30363d;
            border-radius: 6px;
            padding: 20px;
            z-index: 9999;
            width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            color: #c9d1d9;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        `;

        const title = document.createElement('h2');
        title.textContent = 'Commit Labels Configuration';
        title.style.marginBottom = '20px';
        configWindow.appendChild(title);

        // Remove Prefix Option
        const prefixDiv = document.createElement('div');
        prefixDiv.style.marginBottom = '20px';
        const prefixCheckbox = document.createElement('input');
        prefixCheckbox.type = 'checkbox';
        prefixCheckbox.checked = USER_CONFIG.removePrefix;
        prefixCheckbox.id = 'remove-prefix';
        const prefixLabel = document.createElement('label');
        prefixLabel.htmlFor = 'remove-prefix';
        prefixLabel.textContent = ' Remove commit type prefix from message';
        prefixDiv.appendChild(prefixCheckbox);
        prefixDiv.appendChild(prefixLabel);
        configWindow.appendChild(prefixDiv);

        // Commit Types Configuration
        const typesContainer = document.createElement('div');
        typesContainer.style.marginBottom = '20px';

        // Group commit types by their label
        const groupedTypes = {};
        Object.entries(USER_CONFIG.commitTypes).forEach(([type, config]) => {
            const key = config.label;
            if (!groupedTypes[key]) {
                groupedTypes[key] = {
                    types: [],
                    config: config
                };
            }
            groupedTypes[key].types.push(type);
        });

        // Create rows for grouped types
        Object.entries(groupedTypes).forEach(([label, { types, config }]) => {
            const typeDiv = document.createElement('div');
            typeDiv.style.marginBottom = '10px';
            typeDiv.style.display = 'flex';
            typeDiv.style.alignItems = 'center';
            typeDiv.style.gap = '10px';

            // Type names (with aliases) and edit button container
            const typeContainer = document.createElement('div');
            typeContainer.style.display = 'flex';
            typeContainer.style.width = '150px';
            typeContainer.style.alignItems = 'center';
            typeContainer.style.gap = '4px';

            const typeSpan = document.createElement('span');
            typeSpan.style.color = '#8b949e';
            typeSpan.style.flex = '1';
            typeSpan.textContent = types.join(', ') + ':';

            const editAliasButton = document.createElement('button');
            editAliasButton.textContent = '✏️';
            editAliasButton.title = 'Edit Aliases';
            editAliasButton.style.cssText = `
                padding: 2px 4px;
                background: #21262d;
                color: #58a6ff;
                border: 1px solid #30363d;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
            `;

            editAliasButton.onclick = () => {
                const currentAliases = types.join(', ');
                const newAliases = prompt('Edit aliases (separate with commas):', currentAliases);

                if (newAliases && newAliases.trim()) {
                    const newTypes = newAliases.split(',').map(t => t.trim().toLowerCase()).filter(t => t);

                    // Check if any new aliases conflict with other types
                    const conflictingType = newTypes.find(type =>
                        USER_CONFIG.commitTypes[type] && !types.includes(type)
                    );

                    if (conflictingType) {
                        alert(`The alias "${conflictingType}" already exists in another group!`);
                        return;
                    }

                    // Remove old types
                    types.forEach(type => delete USER_CONFIG.commitTypes[type]);

                    // Add new types with same config
                    newTypes.forEach(type => {
                        USER_CONFIG.commitTypes[type] = { ...config };
                    });

                    // Update the display
                    typeSpan.textContent = newTypes.join(', ') + ':';

                    // Update dataset for inputs
                    const inputs = typeDiv.querySelectorAll('input, select');
                    inputs.forEach(input => {
                        input.dataset.types = newTypes.join(',');
                    });
                }
            };

            typeContainer.appendChild(typeSpan);
            typeContainer.appendChild(editAliasButton);
            typeDiv.appendChild(typeContainer);

            // Emoji input
            const emojiInput = document.createElement('input');
            emojiInput.type = 'text';
            emojiInput.value = config.emoji;
            emojiInput.style.width = '40px';
            emojiInput.dataset.types = types.join(',');
            emojiInput.dataset.field = 'emoji';
            typeDiv.appendChild(emojiInput);

            // Label input
            const labelInput = document.createElement('input');
            labelInput.type = 'text';
            labelInput.value = config.label;
            labelInput.style.width = '120px';
            labelInput.dataset.types = types.join(',');
            labelInput.dataset.field = 'label';
            typeDiv.appendChild(labelInput);

            // Color select
            const colorSelect = document.createElement('select');
            Object.keys(COLORS).forEach(color => {
                const option = document.createElement('option');
                option.value = color;
                option.textContent = color;
                if (config.color === color) option.selected = true;
                colorSelect.appendChild(option);
            });
            colorSelect.dataset.types = types.join(',');
            colorSelect.dataset.field = 'color';
            typeDiv.appendChild(colorSelect);

            // Delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '🗑️';
            deleteButton.style.cssText = `
                padding: 2px 8px;
                background: #21262d;
                color: #f85149;
                border: 1px solid #30363d;
                border-radius: 4px;
                cursor: pointer;
            `;
            deleteButton.onclick = () => {
                if (confirm(`Delete commit types "${types.join(', ')}"?`)) {
                    typeDiv.remove();
                    types.forEach(type => delete USER_CONFIG.commitTypes[type]);
                }
            };
            typeDiv.appendChild(deleteButton);

            typesContainer.appendChild(typeDiv);
        });

        // Add "Add New Type" button
        const addNewButton = document.createElement('button');
        addNewButton.textContent = '+ Add New Type';
        addNewButton.style.cssText = `
            margin-bottom: 15px;
            padding: 5px 16px;
            background: #238636;
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        `;

        addNewButton.onclick = () => {
            const typeInput = prompt('Enter the commit type and aliases (separated by commas, e.g., "added, add"):', '');
            if (typeInput && typeInput.trim()) {
                const types = typeInput.split(',').map(t => t.trim().toLowerCase()).filter(t => t);

                // Check if any of the types already exist
                const existingType = types.find(type => USER_CONFIG.commitTypes[type]);
                if (existingType) {
                    alert(`The commit type "${existingType}" already exists!`);
                    return;
                }

                // Create base config for all aliases
                const baseConfig = {
                    emoji: '🔄',
                    label: types[0].charAt(0).toUpperCase() + types[0].slice(1),
                    color: 'blue'
                };

                // Add all types to config with the same settings
                types.forEach(type => {
                    USER_CONFIG.commitTypes[type] = { ...baseConfig };
                });

                // Create and add new type row
                const typeDiv = document.createElement('div');
                typeDiv.style.marginBottom = '10px';
                typeDiv.style.display = 'flex';
                typeDiv.style.alignItems = 'center';
                typeDiv.style.gap = '10px';

                // Type names (with aliases)
                const typeSpan = document.createElement('span');
                typeSpan.style.width = '150px';
                typeSpan.style.color = '#8b949e';
                typeSpan.textContent = types.join(', ') + ':';
                typeDiv.appendChild(typeSpan);

                // Emoji input
                const emojiInput = document.createElement('input');
                emojiInput.type = 'text';
                emojiInput.value = baseConfig.emoji;
                emojiInput.style.width = '40px';
                emojiInput.dataset.types = types.join(',');
                emojiInput.dataset.field = 'emoji';
                typeDiv.appendChild(emojiInput);

                // Label input
                const labelInput = document.createElement('input');
                labelInput.type = 'text';
                labelInput.value = baseConfig.label;
                labelInput.style.width = '120px';
                labelInput.dataset.types = types.join(',');
                labelInput.dataset.field = 'label';
                typeDiv.appendChild(labelInput);

                // Color select
                const colorSelect = document.createElement('select');
                Object.keys(COLORS).forEach(color => {
                    const option = document.createElement('option');
                    option.value = color;
                    option.textContent = color;
                    if (color === 'blue') option.selected = true;
                    colorSelect.appendChild(option);
                });
                colorSelect.dataset.types = types.join(',');
                colorSelect.dataset.field = 'color';
                typeDiv.appendChild(colorSelect);

                // Delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '🗑️';
                deleteButton.style.cssText = `
                    padding: 2px 8px;
                    background: #21262d;
                    color: #f85149;
                    border: 1px solid #30363d;
                    border-radius: 4px;
                    cursor: pointer;
                `;
                deleteButton.onclick = () => {
                    if (confirm(`Delete commit types "${types.join(', ')}"?`)) {
                        typeDiv.remove();
                        types.forEach(type => delete USER_CONFIG.commitTypes[type]);
                    }
                };
                typeDiv.appendChild(deleteButton);

                typesContainer.appendChild(typeDiv);
            }
        };

        configWindow.appendChild(addNewButton);
        configWindow.appendChild(typesContainer);

        // Save and Close buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.justifyContent = 'flex-end';

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.cssText = `
            padding: 5px 16px;
            background: #238636;
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        `;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
            padding: 5px 16px;
            background: #21262d;
            color: #c9d1d9;
            border: 1px solid #30363d;
            border-radius: 6px;
            cursor: pointer;
        `;

        // Add Reset button next to Save and Close
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset to Default';
        resetButton.style.cssText = `
            padding: 5px 16px;
            background: #21262d;
            color: #f85149;
            border: 1px solid #30363d;
            border-radius: 6px;
            cursor: pointer;
            margin-right: auto;  // This pushes Save/Close to the right
        `;

        resetButton.onclick = () => {
            if (confirm('Are you sure you want to reset all settings to default? This will remove all custom types and settings.')) {
                GM_setValue('commitLabelsConfig', DEFAULT_CONFIG);
                location.reload();
            }
        };

        saveButton.onclick = () => {
            const newConfig = { ...USER_CONFIG };
            newConfig.removePrefix = prefixCheckbox.checked;
            newConfig.commitTypes = {};

            typesContainer.querySelectorAll('input, select').forEach(input => {
                const types = input.dataset.types.split(',');
                const field = input.dataset.field;

                types.forEach(type => {
                    if (!newConfig.commitTypes[type]) {
                        newConfig.commitTypes[type] = {};
                    }
                    newConfig.commitTypes[type][field] = input.value;
                });
            });

            GM_setValue('commitLabelsConfig', newConfig);
            location.reload();
        };

        closeButton.onclick = () => {
            document.body.removeChild(configWindow);
        };

        buttonContainer.appendChild(resetButton);
        buttonContainer.appendChild(closeButton);
        buttonContainer.appendChild(saveButton);
        configWindow.appendChild(buttonContainer);

        document.body.appendChild(configWindow);
    }

    // Register configuration menu command
    GM_registerMenuCommand('Configure Commit Labels', createConfigWindow);

    // Check if we're on a commit page
    function isCommitPage() {
        return window.location.pathname.includes('/commits') ||
               window.location.pathname.includes('/commit/');
    }

    function addCommitLabels() {
        // Only proceed if we're on a commit page
        if (!isCommitPage()) return;

        // Update selector to match GitHub's current DOM structure
        const commitMessages = document.querySelectorAll('.markdown-title a[data-pjax="true"]');

        commitMessages.forEach(message => {
            const text = message.textContent.trim();
            const match = text.match(/^(\w+)(?:\([\w-]+\))?:\s*(.*)/);

            if (match) {
                const type = match[1].toLowerCase();
                const restOfMessage = match[2];

                if (USER_CONFIG.commitTypes[type]) {
                    // Only add label if it hasn't been added yet
                    if (!message.parentElement.querySelector('.commit-label')) {
                        const label = document.createElement('span');
                        label.className = 'commit-label';
                        const color = COLORS[USER_CONFIG.commitTypes[type].color];

                        // Calculate perceived lightness (using GitHub's formula)
                        const perceivedL = (color.l / 100);
                        const lightnessSwitch = perceivedL <= 0.6 ? 1 : 0;
                        const lightenBy = ((0.6 - perceivedL) * 100) * lightnessSwitch;

                        // Apply styles
                        const styles = {
                            ...USER_CONFIG.labelStyle,
                            '--label-h': color.h,
                            '--label-s': color.s,
                            '--label-l': color.l,
                            'color': `hsl(${color.h}, ${color.s}%, ${color.l + lightenBy}%)`,
                            'background': `hsla(${color.h}, ${color.s}%, ${color.l}%, 0.18)`,
                            'borderColor': `hsla(${color.h}, ${color.s}%, ${color.l + lightenBy}%, 0.3)`,
                            backgroundColor: color.bg,
                            color: color.text
                        };

                        label.style.cssText = Object.entries(styles)
                            .map(([key, value]) => `${key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${value}`)
                            .join(';');

                        // Add hover effect
                        label.addEventListener('mouseenter', () => {
                            label.style.transform = 'translateY(-1px)';
                            label.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
                        });

                        label.addEventListener('mouseleave', () => {
                            label.style.transform = 'translateY(0)';
                            label.style.boxShadow = styles.boxShadow;
                        });

                        const emoji = document.createElement('span');
                        emoji.style.marginRight = '4px';
                        emoji.style.fontSize = '14px';
                        emoji.style.lineHeight = '1';
                        emoji.textContent = USER_CONFIG.commitTypes[type].emoji;

                        const labelText = document.createElement('span');
                        labelText.textContent = USER_CONFIG.commitTypes[type].label;

                        label.appendChild(emoji);
                        label.appendChild(labelText);
                        message.parentElement.insertBefore(label, message);

                        // Update the commit message text to remove the type prefix if enabled
                        if (USER_CONFIG.removePrefix) {
                            message.textContent = restOfMessage;
                        }
                    }
                }
            }
        });
    }

    // Only set up observers if we're on a commit page
    if (isCommitPage()) {
        // Initial run
        addCommitLabels();

        // Watch for DOM changes
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    addCommitLabels();
                }
            }
        });

        // Start observing the document with the configured parameters
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();