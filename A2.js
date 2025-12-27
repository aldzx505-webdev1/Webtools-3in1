
        // ==================== TOOL 2: GET SOURCE CODE ====================
        function updateSourceStats(htmlContent, fetchTime) {
            const sizeInKB = (htmlContent.length / 1024).toFixed(2);
            document.getElementById('codeSize').textContent = `${sizeInKB} KB`;
            document.getElementById('charLength').textContent = htmlContent.length.toLocaleString();
            document.getElementById('fetchTime').textContent = `${fetchTime}ms`;
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        async function fetchHTML(url) {
            const loadingOverlay = document.getElementById('loading');
            const codeOutput = document.getElementById('codeOutput');
            
            loadingOverlay.classList.add('active');
            codeOutput.textContent = '';
            
            const startTime = performance.now();
            
            try {
                if (!url || url.trim() === '' || url === 'https://') throw new Error('URL Input Empty');
                if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
                
                showNotification('Initializing proxy connection...', false);
                
                const proxies = [
                    'https://api.allorigins.win/get?url=',
                    'https://corsproxy.io/?',
                    'https://api.codetabs.com/v1/proxy?quest='
                ];
                
                let htmlContent = '';
                let success = false;
                
                for (const proxy of proxies) {
                    try {
                        const response = await fetch(proxy + encodeURIComponent(url), {
                            signal: AbortSignal.timeout(30000)
                        });
                        if (!response.ok) throw new Error(`HTTP ${response.status}`);
                        
                        if (proxy.includes('allorigins.win')) {
                            const data = await response.json();
                            htmlContent = data.contents;
                        } else if (proxy.includes('codetabs.com')) {
                            const text = await response.text();
                            try {
                                const json = JSON.parse(text);
                                htmlContent = json.contents || text; 
                            } catch(e) {
                                htmlContent = text;
                            }
                        } else {
                            htmlContent = await response.text();
                        }
                        
                        if(htmlContent) {
                            success = true;
                            break;
                        }
                    } catch (e) { continue; }
                }
                
                if (!success) throw new Error('All proxies failed or returned empty data.');
                
                const fetchTime = Math.round(performance.now() - startTime);
                codeOutput.textContent = htmlContent;
                updateSourceStats(htmlContent, fetchTime);
                loadingOverlay.classList.remove('active');
                showNotification(`Success: ${formatFileSize(htmlContent.length)} loaded`, false);
                
            } catch (error) {
                const fetchTime = Math.round(performance.now() - startTime);
                codeOutput.textContent = `SYSTEM ERROR:\n${error.message}\n\nTroubleshooting:\n1. Check if URL is correct.\n2. Target site may block access.\n3. Try a different URL.`;
                loadingOverlay.classList.remove('active');
                showNotification('Extraction Failed', true);
                updateSourceStats("Error", fetchTime);
            }
        }

        async function copyToClipboard() {
            const codeArea = document.getElementById('codeOutput');
            const text = codeArea.textContent;
            
            if (!text || text.trim().length === 0) {
                showNotification('Buffer empty - Nothing to copy', true);
                return;
            }

            try {
                await navigator.clipboard.writeText(text);
                showNotification('Source code copied to clipboard', false);
            } catch (err) {
                try {
                    const textArea = document.createElement("textarea");
                    textArea.value = text;
                    textArea.style.position = "fixed";
                    textArea.style.left = "-9999px";
                    textArea.style.top = "0";
                    textArea.setAttribute('readonly', '');
                    
                    document.body.appendChild(textArea);
                    textArea.select();
                    textArea.setSelectionRange(0, 99999);
                    
                    const successful = document.execCommand('copy');
                    document.body.removeChild(textArea);
                    
                    if (successful) {
                        showNotification('Source code copied (Fallback)', false);
                    } else {
                        throw new Error('Fallback failed');
                    }
                } catch (fErr) {
                    showNotification('Clipboard access denied', true);
                }
            }
        }

        function downloadCode() {
            const codeArea = document.getElementById('codeOutput');
            const text = codeArea.textContent;
            
            if (!text || text.trim().length === 0) {
                showNotification('No source code to download', true);
                return;
            }

            try {
                const blob = new Blob([text], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
                a.href = url;
                a.download = `website_source_${timestamp}.html`;
                
                document.body.appendChild(a);
                a.click();
                
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 100);
                
                showNotification('Source code saved as HTML file', false);
            } catch (e) {
                showNotification('Download failed', true);
            }
        }
