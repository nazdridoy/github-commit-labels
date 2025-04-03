// ==UserScript==
// @name         GitHub Commit Labels
// @namespace    https://github.com/nazdridoy
// @version      1.1.0
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

    // Detect GitHub theme (dark, light, or dark dimmed)
    function detectTheme() {
        const html = document.documentElement;
        if (html.getAttribute('data-color-mode') === 'dark') {
            const darkTheme = html.getAttribute('data-dark-theme');
            return darkTheme === 'dark_dimmed' ? 'dark_dimmed' : 'dark';
        }
        return 'light';
    }

    // Get current theme
    let currentTheme = detectTheme();
    
    // Color definitions based on theme
    const THEME_COLORS = {
        light: {
            'green': { bg: 'rgba(35, 134, 54, 0.1)', text: '#1a7f37' },
            'purple': { bg: 'rgba(163, 113, 247, 0.1)', text: '#8250df' },
            'blue': { bg: 'rgba(47, 129, 247, 0.1)', text: '#0969da' },
            'light-blue': { bg: 'rgba(31, 111, 235, 0.1)', text: '#0550ae' },
            'yellow': { bg: 'rgba(210, 153, 34, 0.1)', text: '#9e6a03' },
            'orange': { bg: 'rgba(219, 109, 40, 0.1)', text: '#bc4c00' },
            'gray': { bg: 'rgba(139, 148, 158, 0.1)', text: '#57606a' },
            'light-green': { bg: 'rgba(57, 211, 83, 0.1)', text: '#1a7f37' },
            'red': { bg: 'rgba(248, 81, 73, 0.1)', text: '#cf222e' },
            'dark-yellow': { bg: 'rgba(187, 128, 9, 0.1)', text: '#9e6a03' }
        },
        dark: {
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
        },
        dark_dimmed: {
            'green': { bg: 'rgba(35, 134, 54, 0.15)', text: '#6bc46d' },
            'purple': { bg: 'rgba(163, 113, 247, 0.15)', text: '#c297ff' },
            'blue': { bg: 'rgba(47, 129, 247, 0.15)', text: '#6cb6ff' },
            'light-blue': { bg: 'rgba(31, 111, 235, 0.15)', text: '#539bf5' },
            'yellow': { bg: 'rgba(210, 153, 34, 0.15)', text: '#daaa3f' },
            'orange': { bg: 'rgba(219, 109, 40, 0.15)', text: '#f0883e' },
            'gray': { bg: 'rgba(139, 148, 158, 0.15)', text: '#909dab' },
            'light-green': { bg: 'rgba(57, 211, 83, 0.15)', text: '#6bc46d' },
            'red': { bg: 'rgba(248, 81, 73, 0.15)', text: '#e5534b' },
            'dark-yellow': { bg: 'rgba(187, 128, 9, 0.15)', text: '#daaa3f' }
        }
    };

    // Get colors for current theme
    let COLORS = THEME_COLORS[currentTheme];

    // Define default configuration
    const DEFAULT_CONFIG = {
        removePrefix: true,
        enableTooltips: true,
        labelsVisible: true,
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
            feat: { emoji: '✨', label: 'Feature', color: 'green', description: 'New user features (not for new files without user features)' },
            feature: { emoji: '✨', label: 'Feature', color: 'green', description: 'New user features (not for new files without user features)' },

            // Added
            added: { emoji: '📝', label: 'Added', color: 'green', description: 'New files/resources with no user-facing features' },
            add: { emoji: '📝', label: 'Added', color: 'green', description: 'New files/resources with no user-facing features' },

            // Updated
            update: { emoji: '♻️', label: 'Updated', color: 'blue', description: 'Changes to existing functionality' },
            updated: { emoji: '♻️', label: 'Updated', color: 'blue', description: 'Changes to existing functionality' },

            // Removed
            removed: { emoji: '🗑️', label: 'Removed', color: 'red', description: 'Removing files/code' },
            remove: { emoji: '🗑️', label: 'Removed', color: 'red', description: 'Removing files/code' },

            // Fixes
            fix: { emoji: '🐛', label: 'Fix', color: 'purple', description: 'Bug fixes/corrections to errors' },
            bugfix: { emoji: '🐛', label: 'Fix', color: 'purple', description: 'Bug fixes/corrections to errors' },
            fixed: { emoji: '🐛', label: 'Fix', color: 'purple', description: 'Bug fixes/corrections to errors' },
            hotfix: { emoji: '🚨', label: 'Hot Fix', color: 'red', description: 'Critical bug fixes requiring immediate attention' },

            // Documentation
            docs: { emoji: '📚', label: 'Docs', color: 'blue', description: 'Documentation only changes' },
            doc: { emoji: '📚', label: 'Docs', color: 'blue', description: 'Documentation only changes' },
            documentation: { emoji: '📚', label: 'Docs', color: 'blue', description: 'Documentation only changes' },

            // Styling
            style: { emoji: '💎', label: 'Style', color: 'light-green', description: 'Formatting/whitespace changes (no code change)' },
            ui: { emoji: '🎨', label: 'UI', color: 'light-green', description: 'User interface changes' },
            css: { emoji: '💎', label: 'Style', color: 'light-green', description: 'CSS/styling changes' },

            // Code Changes
            refactor: { emoji: '📦', label: 'Refactor', color: 'light-blue', description: 'Restructured code (no behavior change)' },
            perf: { emoji: '🚀', label: 'Performance', color: 'purple', description: 'Performance improvements' },
            performance: { emoji: '🚀', label: 'Performance', color: 'purple', description: 'Performance improvements' },
            optimize: { emoji: '⚡', label: 'Optimize', color: 'purple', description: 'Code optimization without functional changes' },

            // Testing
            test: { emoji: '🧪', label: 'Test', color: 'yellow', description: 'Test-related changes' },
            tests: { emoji: '🧪', label: 'Test', color: 'yellow', description: 'Test-related changes' },
            testing: { emoji: '🧪', label: 'Test', color: 'yellow', description: 'Test-related changes' },

            // Build & Deploy
            build: { emoji: '🛠', label: 'Build', color: 'orange', description: 'Build system changes' },
            ci: { emoji: '⚙️', label: 'CI', color: 'gray', description: 'CI pipeline changes' },
            cd: { emoji: '🚀', label: 'CD', color: 'gray', description: 'Continuous deployment changes' },
            deploy: { emoji: '📦', label: 'Deploy', color: 'orange', description: 'Deployment related changes' },
            release: { emoji: '🚀', label: 'Deploy', color: 'orange', description: 'Production releases' },

            // Maintenance
            chore: { emoji: '♻️', label: 'Chore', color: 'light-green', description: 'Routine maintenance tasks' },
            deps: { emoji: '📦', label: 'Dependencies', color: 'light-green', description: 'Dependency updates or changes' },
            dep: { emoji: '📦', label: 'Dependencies', color: 'light-green', description: 'Dependency updates or changes' },
            dependencies: { emoji: '📦', label: 'Dependencies', color: 'light-green', description: 'Dependency updates or changes' },
            revert: { emoji: '🗑', label: 'Revert', color: 'red', description: 'Reverting previous changes' },
            wip: { emoji: '🚧', label: 'WIP', color: 'dark-yellow', description: 'Work in progress' },

            // Security
            security: { emoji: '🔒', label: 'Security', color: 'red', description: 'Security-related changes' },
            
            // Internationalization
            i18n: { emoji: '🌐', label: 'i18n', color: 'blue', description: 'Internationalization and localization' },
            
            // Accessibility
            a11y: { emoji: '♿', label: 'Accessibility', color: 'purple', description: 'Accessibility improvements' },
            
            // API changes
            api: { emoji: '🔌', label: 'API', color: 'light-blue', description: 'API-related changes' },
            
            // Database changes
            data: { emoji: '🗃️', label: 'Database', color: 'orange', description: 'Database schema or data changes' },
            
            // Configuration changes
            config: { emoji: '⚙️', label: 'Config', color: 'gray', description: 'Configuration changes' },
            
            // Initial setup
            init: { emoji: '🎬', label: 'Init', color: 'green', description: 'Initial commit/project setup' }
        }
    };

    // Get saved configuration or use default
    const USER_CONFIG = GM_getValue('commitLabelsConfig', DEFAULT_CONFIG);
    
    // Ensure labelsVisible exists in config (for backward compatibility)
    if (USER_CONFIG.labelsVisible === undefined) {
        USER_CONFIG.labelsVisible = true;
        GM_setValue('commitLabelsConfig', USER_CONFIG);
    }

    // Create floating toggle button for labels
    function createLabelToggle() {
        // Only create if we're on a commit page
        if (!isCommitPage()) return;
        
        // Check if toggle already exists
        if (document.getElementById('commit-labels-toggle')) return;
        
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'commit-labels-toggle';
        toggleBtn.textContent = USER_CONFIG.labelsVisible ? '🏷️' : '🏷️ ❌';
        toggleBtn.title = USER_CONFIG.labelsVisible ? 'Hide commit labels' : 'Show commit labels';
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #238636;
            color: #ffffff;
            border: none;
            font-size: 16px;
            cursor: pointer;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            opacity: 0.8;
            transition: opacity 0.2s, transform 0.2s;
        `;
        
        // Add hover effect
        toggleBtn.addEventListener('mouseenter', () => {
            toggleBtn.style.opacity = '1';
            toggleBtn.style.transform = 'scale(1.1)';
        });
        
        toggleBtn.addEventListener('mouseleave', () => {
            toggleBtn.style.opacity = '0.8';
            toggleBtn.style.transform = 'scale(1)';
        });
        
        // Toggle labels on click
        toggleBtn.addEventListener('click', () => {
            USER_CONFIG.labelsVisible = !USER_CONFIG.labelsVisible;
            GM_setValue('commitLabelsConfig', USER_CONFIG);
            
            // Update button
            toggleBtn.textContent = USER_CONFIG.labelsVisible ? '🏷️' : '🏷️ ❌';
            toggleBtn.title = USER_CONFIG.labelsVisible ? 'Hide commit labels' : 'Show commit labels';
            
            // Toggle label visibility
            document.querySelectorAll('.commit-label').forEach(label => {
                label.style.display = USER_CONFIG.labelsVisible ? 'inline-flex' : 'none';
            });
        });
        
        document.body.appendChild(toggleBtn);
    }

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

        // Add toggle for tooltips
        const tooltipDiv = document.createElement('div');
        tooltipDiv.style.marginBottom = '20px';
        const tooltipCheckbox = document.createElement('input');
        tooltipCheckbox.type = 'checkbox';
        tooltipCheckbox.checked = USER_CONFIG.enableTooltips;
        tooltipCheckbox.id = 'enable-tooltips';
        const tooltipLabel = document.createElement('label');
        tooltipLabel.htmlFor = 'enable-tooltips';
        tooltipLabel.textContent = ' Enable tooltips with extended descriptions';
        tooltipDiv.appendChild(tooltipCheckbox);
        tooltipDiv.appendChild(tooltipLabel);
        configWindow.insertBefore(tooltipDiv, prefixDiv.nextSibling);

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
            newConfig.enableTooltips = tooltipCheckbox.checked;
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

    // Create export/import dialog
    function createExportImportDialog() {
        // Check if dialog already exists
        if (document.getElementById('config-export-import')) {
            document.getElementById('config-export-import').remove();
        }
        
        const dialog = document.createElement('div');
        dialog.id = 'config-export-import';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #0d1117;
            border: 1px solid #30363d;
            border-radius: 6px;
            padding: 20px;
            z-index: 9999;
            width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            color: #c9d1d9;
            box-shadow: 0 0 20px rgba(0,0,0,0.7);
        `;
        
        const title = document.createElement('h2');
        title.textContent = 'Export/Import Configuration';
        title.style.marginBottom = '15px';
        
        const exportSection = document.createElement('div');
        exportSection.style.marginBottom = '20px';
        
        const exportTitle = document.createElement('h3');
        exportTitle.textContent = 'Export Configuration';
        exportTitle.style.marginBottom = '10px';
        
        const configOutput = document.createElement('textarea');
        configOutput.readOnly = true;
        configOutput.value = JSON.stringify(USER_CONFIG, null, 2);
        configOutput.style.cssText = `
            width: 100%;
            height: 150px;
            background: #161b22;
            color: #c9d1d9;
            border: 1px solid #30363d;
            border-radius: 6px;
            padding: 10px;
            font-family: monospace;
            resize: vertical;
            margin-bottom: 10px;
        `;
        
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy to Clipboard';
        copyButton.style.cssText = `
            padding: 6px 16px;
            background: #238636;
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin-right: 10px;
        `;
        
        copyButton.onclick = () => {
            configOutput.select();
            document.execCommand('copy');
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy to Clipboard';
            }, 2000);
        };
        
        exportSection.appendChild(exportTitle);
        exportSection.appendChild(configOutput);
        exportSection.appendChild(copyButton);
        
        const importSection = document.createElement('div');
        importSection.style.marginBottom = '20px';
        
        const importTitle = document.createElement('h3');
        importTitle.textContent = 'Import Configuration';
        importTitle.style.marginBottom = '10px';
        
        const configInput = document.createElement('textarea');
        configInput.placeholder = 'Paste configuration JSON here...';
        configInput.style.cssText = `
            width: 100%;
            height: 150px;
            background: #161b22;
            color: #c9d1d9;
            border: 1px solid #30363d;
            border-radius: 6px;
            padding: 10px;
            font-family: monospace;
            resize: vertical;
            margin-bottom: 10px;
        `;
        
        const importButton = document.createElement('button');
        importButton.textContent = 'Import';
        importButton.style.cssText = `
            padding: 6px 16px;
            background: #238636;
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin-right: 10px;
        `;
        
        importButton.onclick = () => {
            try {
                const newConfig = JSON.parse(configInput.value);
                
                // Validate basic structure
                if (!newConfig.commitTypes) {
                    throw new Error('Invalid configuration: missing commitTypes object');
                }
                
                if (confirm('Are you sure you want to import this configuration? This will overwrite your current settings.')) {
                    GM_setValue('commitLabelsConfig', newConfig);
                    alert('Configuration imported successfully! Page will reload to apply changes.');
                    location.reload();
                }
            } catch (error) {
                alert('Error importing configuration: ' + error.message);
            }
        };
        
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
            padding: 6px 16px;
            background: #21262d;
            color: #c9d1d9;
            border: 1px solid #30363d;
            border-radius: 6px;
            cursor: pointer;
        `;
        
        closeButton.onclick = () => {
            document.body.removeChild(dialog);
        };
        
        importSection.appendChild(importTitle);
        importSection.appendChild(configInput);
        importSection.appendChild(importButton);
        
        dialog.appendChild(title);
        dialog.appendChild(exportSection);
        dialog.appendChild(importSection);
        dialog.appendChild(closeButton);
        
        document.body.appendChild(dialog);
    }

    // Register configuration menu command
    GM_registerMenuCommand('Configure Commit Labels', createConfigWindow);
    GM_registerMenuCommand('Toggle Labels', () => {
        USER_CONFIG.labelsVisible = !USER_CONFIG.labelsVisible;
        GM_setValue('commitLabelsConfig', USER_CONFIG);
        
        // Toggle label visibility
        document.querySelectorAll('.commit-label').forEach(label => {
            label.style.display = USER_CONFIG.labelsVisible ? 'inline-flex' : 'none';
        });
        
        // Update toggle button if it exists
        const toggleBtn = document.getElementById('commit-labels-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = USER_CONFIG.labelsVisible ? '🏷️' : '🏷️ ❌';
            toggleBtn.title = USER_CONFIG.labelsVisible ? 'Hide commit labels' : 'Show commit labels';
        }
    });
    GM_registerMenuCommand('Export/Import Config', createExportImportDialog);

    // Check if we're on a commit page
    function isCommitPage() {
        return window.location.pathname.includes('/commits') ||
               window.location.pathname.includes('/commit/');
    }

    // Update colors when theme changes
    function updateThemeColors() {
        const newTheme = detectTheme();
        if (newTheme !== currentTheme) {
            currentTheme = newTheme;
            COLORS = THEME_COLORS[currentTheme];
            
            // Update existing labels
            document.querySelectorAll('.commit-label').forEach(label => {
                const type = label.dataset.commitType;
                if (type && USER_CONFIG.commitTypes[type]) {
                    const color = COLORS[USER_CONFIG.commitTypes[type].color];
                    label.style.backgroundColor = color.bg;
                    label.style.color = color.text;
                }
            });
        }
    }

    function addCommitLabels() {
        // Only proceed if we're on a commit page
        if (!isCommitPage()) return;

        // Update theme colors
        updateThemeColors();
        
        // Create toggle button if it doesn't exist
        createLabelToggle();

        // Update selector to match GitHub's current DOM structure
        const commitMessages = document.querySelectorAll('.markdown-title a[data-pjax="true"]');

        // Debounce and batch process for performance improvement
        let processedCount = 0;
        const batchSize = 20;
        const commitMessagesArray = Array.from(commitMessages);
        
        const processCommitBatch = (startIndex) => {
            const endIndex = Math.min(startIndex + batchSize, commitMessagesArray.length);
            
            for (let i = startIndex; i < endIndex; i++) {
                const message = commitMessagesArray[i];
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
                            label.dataset.commitType = type;
                            
                            const color = COLORS[USER_CONFIG.commitTypes[type].color];
                            
                            // Apply styles
                            const styles = {
                                ...USER_CONFIG.labelStyle,
                                backgroundColor: color.bg,
                                color: color.text,
                                display: USER_CONFIG.labelsVisible ? 'inline-flex' : 'none'
                            };

                            label.style.cssText = Object.entries(styles)
                                .map(([key, value]) => `${key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${value}`)
                                .join(';');

                            // Add tooltip if enabled
                            if (USER_CONFIG.enableTooltips && USER_CONFIG.commitTypes[type].description) {
                                label.title = USER_CONFIG.commitTypes[type].description;
                            }

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
            }
            
            // Process next batch if needed
            processedCount += (endIndex - startIndex);
            if (processedCount < commitMessagesArray.length) {
                setTimeout(() => processCommitBatch(endIndex), 0);
            }
        };
        
        // Start processing first batch
        if (commitMessagesArray.length > 0) {
            processCommitBatch(0);
        }
    }

    // Only set up observers if we're on a commit page
    function initialize() {
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
        
        // Watch for theme changes
        const themeObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === 'data-color-mode' || 
                    mutation.attributeName === 'data-dark-theme' || 
                    mutation.attributeName === 'data-light-theme') {
                    updateThemeColors();
                }
            }
        });
        
        // Start observing the html element for theme changes
        themeObserver.observe(document.documentElement, { attributes: true });
    }

    // Initialize on page load
    initialize();

    // Handle GitHub's client-side navigation
    const navigationObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                // Check if we're on a commit page after navigation
                if (isCommitPage()) {
                    // Small delay to ensure GitHub has finished rendering
                    setTimeout(addCommitLabels, 100);
                }
            }
        }
    });

    // Observe changes to the main content area
    navigationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Listen for popstate events (browser back/forward navigation)
    window.addEventListener('popstate', () => {
        if (isCommitPage()) {
            setTimeout(addCommitLabels, 100);
        }
    });

    // Listen for GitHub's custom navigation event
    document.addEventListener('turbo:render', () => {
        if (isCommitPage()) {
            setTimeout(addCommitLabels, 100);
        }
    });
})();