        // ==================== TOOL 3: DEPLOYMENT ====================
        const VercelTokens = [
            "DnxPJKeYJO9k1FCwIFXTb5Kx",
            "YFT1243UKGcf6fhgyl1z2jF7",
            "Eiru24PZqYsn2MpyqpuRBgDz",
            "HwNrfVWGaYB6kg5GAxHJRMbA",
            "2XzSNnNXBHS3PpdmUJnvQ08M"
        ];

        let selectedFile = null;
        let currentTokenIndex = 0;

        function updateTokenCounter() {
            document.getElementById('tokenCounter').textContent = `${currentTokenIndex + 1}/${VercelTokens.length}`;
            
            const tokenStatus = document.getElementById('tokenStatus');
            if (currentTokenIndex >= VercelTokens.length - 1) {
                tokenStatus.textContent = "Token Vercel: Terbatas";
                tokenStatus.style.color = "var(--warning)";
            } else {
                tokenStatus.textContent = "Token Vercel: Tersedia";
                tokenStatus.style.color = "var(--success)";
            }
        }

        function addToConsole(message, type = '') {
            const line = document.createElement('div');
            line.className = `terminal-line ${type}`;
            line.textContent = message;
            document.getElementById('terminalContent').appendChild(line);
            document.getElementById('terminal').scrollTop = document.getElementById('terminal').scrollHeight;
        }

        function resetDeployButton() {
            document.getElementById('btnDeploy').disabled = false;
            document.getElementById('btnDeploy').innerHTML = '<i class="fas fa-rocket"></i> START DEPLOYMENT';
        }

        function formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }

        function readFileAsText(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.onerror = e => reject(new Error('Gagal membaca file'));
                reader.readAsText(file);
            });
        }

        function showResult(message, type) {
            document.getElementById('modalBody').innerHTML = message;
            document.getElementById('modalHeader').className = `modal-header ${type}`;
            document.getElementById('modalTitle').textContent = type === 'success' ? 'Deployment Berhasil!' : 'Deployment Gagal';
            document.getElementById('resultModal').classList.add('active');
        }

        function showInfoPanel(url, tokenIndex) {
            const infoPanel = document.getElementById('infoPanel');
            const infoContent = document.getElementById('infoContent');
            
            infoContent.innerHTML = `
                <div style="text-align: center; width: 100%;">
                    <div style="font-size: 24px; margin-bottom: 10px; color: var(--success);">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3 style="margin-bottom: 15px;">Deployment Berhasil!</h3>
                    <p style="margin-bottom: 10px;">Website Anda telah online:</p>
                    <p style="margin-bottom: 15px;">
                        <a href="${url}" target="_blank" style="color: var(--accent); font-weight: bold; font-size: 18px;">${url}</a>
                    </p>
                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-top: 20px;">
                        <p style="margin-bottom: 5px; font-size: 14px;">Token Vercel: <strong>${tokenIndex + 1}</strong></p>
                        <p style="margin-bottom: 5px; font-size: 14px;">Waktu: ${new Date().toLocaleString()}</p>
                    </div>
                </div>
            `;
            infoPanel.style.display = 'block';
            infoPanel.style.borderColor = 'var(--success)';
        }

        // ==================== NOTIFICATION SYSTEM ====================
        function showNotification(message, isError = false) {
            const notification = document.getElementById('notification');
            const notificationText = document.getElementById('notification-text');
            
            notificationText.textContent = message;
            
            if (isError) {
                notification.classList.add('error');
            } else {
                notification.classList.remove('error');
            }
            
            notification.classList.add('show');
            clearTimeout(notification.timeoutId);
            notification.timeoutId = setTimeout(() => { 
                notification.classList.remove('show'); 
            }, 3000);
        }

        // ==================== EVENT LISTENERS ====================
        document.addEventListener('DOMContentLoaded', function() {
            // Matrix Background
            const canvas = document.getElementById('matrix-bg');
            const ctx = canvas.getContext('2d');

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const chars = '01'; 
            const fontSize = 14;
            const columns = canvas.width / fontSize;

            const drops = [];
            for (let x = 0; x < columns; x++) {
                drops[x] = Math.random() * canvas.height / fontSize;
            }

            function draw() {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = '#444444'; 
                ctx.font = fontSize + 'px monospace';

                for (let i = 0; i < drops.length; i++) {
                    const text = chars[Math.floor(Math.random() * chars.length)];
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }

                    drops[i]++;
                }
            }

            setInterval(draw, 50);

            window.addEventListener('resize', () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                const newColumns = canvas.width / fontSize;
                drops.length = 0;
                for (let x = 0; x < newColumns; x++) {
                    drops[x] = Math.random() * canvas.height / fontSize;
                }
            });

            // Code Encryptor listeners
            document.getElementById('codeInput').addEventListener('input', function() {
                document.getElementById('inputLength').textContent = this.value.length.toLocaleString();
            });

            // Source Code Tool listeners
            document.getElementById('clearBtn').addEventListener('click', () => {
                document.getElementById('codeOutput').textContent = `/**\n * GET SOURCE WEBSITE - READY\n */`;
                document.getElementById('codeSize').textContent = '0 KB';
                document.getElementById('charLength').textContent = '0';
                document.getElementById('fetchTime').textContent = '0ms';
                showNotification('Console cleared', false);
            });

            document.getElementById('fetchBtn').addEventListener('click', () => {
                fetchHTML(document.getElementById('urlInput').value.trim());
            });

            document.getElementById('urlInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') document.getElementById('fetchBtn').click();
            });

            document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
            document.getElementById('downloadBtn').addEventListener('click', downloadCode);

            // Deployment Tool listeners
            const dropzone = document.getElementById('dropzone');
            const fileInput = document.getElementById('fileInput');
            const btnDeploy = document.getElementById('btnDeploy');
            const siteName = document.getElementById('siteName');

            dropzone.onclick = () => fileInput.click();

            fileInput.onchange = (e) => {
                if (e.target.files.length > 0) {
                    selectedFile = e.target.files[0];
                    btnDeploy.disabled = false;
                    
                    const fileNameClean = selectedFile.name.split('.')[0].toLowerCase().replace(/[^a-z0-9-]/g, '-');
                    if (!siteName.value) siteName.value = fileNameClean;
                    
                    document.getElementById('fileName').textContent = selectedFile.name;
                    document.getElementById('fileInfo').style.display = 'flex';
                    
                    addToConsole(`File terpilih: ${selectedFile.name}`);
                    addToConsole(`Ukuran: ${formatBytes(selectedFile.size)}`);
                    
                    document.getElementById('terminal').classList.add('active');
                }
            };

            btnDeploy.onclick = async () => {
                if (!selectedFile) return;
                
                if (!siteName.value.trim()) {
                    showResult("Harap masukkan nama website", "error");
                    addToConsole('$ Error: Nama website tidak boleh kosong', 'error');
                    return;
                }
                
                btnDeploy.disabled = true;
                btnDeploy.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
                
                addToConsole(`Memulai deployment untuk: ${siteName.value}`, "proses");
                addToConsole(`Token yang digunakan: ${currentTokenIndex + 1}/${VercelTokens.length}`, "loading");
                
                try {
                    let filesPayload = [];
                    
                    if (selectedFile.name.endsWith('.zip')) {
                        addToConsole('Membaca file ZIP...', "loading");
                        
                        if (typeof JSZip === 'undefined') {
                            throw new Error('JSZip library tidak dimuat. Pastikan JSZip disertakan.');
                        }
                        
                        const zip = new JSZip();
                        const arrayBuffer = await selectedFile.arrayBuffer();
                        const contents = await zip.loadAsync(arrayBuffer);
                        
                        const filePromises = [];
                        contents.forEach((relativePath, file) => {
                            if (!file.dir) {
                                filePromises.push(
                                    file.async("string").then(data => {
                                        return { file: relativePath, data };
                                    })
                                );
                            }
                        });
                        
                        filesPayload = await Promise.all(filePromises);
                        addToConsole(`Ditemukan ${filesPayload.length} file dalam ZIP`, "success");
                    } else {
                        addToConsole('Membaca file HTML...', "loading");
                        const content = await readFileAsText(selectedFile);
                        filesPayload.push({ file: "index.html", data: content });
                        addToConsole('File HTML berhasil dibaca', "success");
                    }
                    
                    addToConsole('Menginisialisasi deployment ke Vercel...', "loading");
                    
                    const VERCEL_TOKEN = VercelTokens[currentTokenIndex];
                    let deploymentSuccess = false;
                    let websiteUrl = '';
                    let errorMessage = '';
                    
                    try {
                        addToConsole('Membuat project di Vercel...', "loading");
                        const createProjectResponse = await fetch("https://api.vercel.com/v9/projects", {
                            method: "POST",
                            headers: {
                                "Authorization": `Bearer ${VERCEL_TOKEN}`,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ name: siteName.value })
                        });
                        
                        if (createProjectResponse.ok) {
                            addToConsole('✓ Project berhasil dibuat di Vercel', 'success');
                            
                            try {
                                addToConsole('Mengunggah file ke Vercel...', "loading");
                                
                                const deployResponse = await fetch("https://api.vercel.com/v13/deployments", {
                                    method: "POST",
                                    headers: {
                                        "Authorization": `Bearer ${VERCEL_TOKEN}`,
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        name: siteName.value,
                                        files: filesPayload,
                                        target: 'production'
                                    })
                                });
                                
                                const data = await deployResponse.json();
                                
                                if (deployResponse.ok && data.url) {
                                    websiteUrl = `https://${siteName.value}.vercel.app`;
                                    deploymentSuccess = true;
                                    const successMessage = `Website berhasil dibuat!<br><a href="${websiteUrl}" target="_blank" style="color: var(--success); text-decoration: none; font-weight: 600;">${websiteUrl}</a>`;
                                    
                                    showResult(successMessage, "success");
                                    addToConsole('✓ Deployment berhasil!', 'success');
                                    addToConsole(`Website URL: ${websiteUrl}`);
                                    addToConsole('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                                    
                                    showInfoPanel(websiteUrl, currentTokenIndex);
                                    
                                } else {
                                    errorMessage = data.error?.message || "Terjadi kesalahan pada deployment";
                                    deploymentSuccess = false;
                                    showResult(`⚠️ Gagal: ${errorMessage}`, "error");
                                    addToConsole(`✗ Deployment gagal: ${errorMessage}`, 'error');
                                }
                                
                            } catch (deployError) {
                                errorMessage = deployError.message;
                                deploymentSuccess = false;
                                addToConsole(`✗ Error deployment: ${errorMessage}`, 'error');
                                showResult("Koneksi ke Vercel gagal", "error");
                            }
                            
                        } else {
                            const errorData = await createProjectResponse.json().catch(() => ({}));
                            errorMessage = errorData.error?.message || 'Gagal membuat project';
                            throw new Error(errorMessage);
                        }
                        
                    } catch (error) {
                        addToConsole(`✗ Gagal membuat project: ${error.message}`, 'error');
                        
                        if (currentTokenIndex < VercelTokens.length - 1) {
                            currentTokenIndex++;
                            addToConsole(`Mencoba token ${currentTokenIndex + 1}...`, "loading");
                            updateTokenCounter();
                            btnDeploy.disabled = false;
                            btnDeploy.innerHTML = '<i class="fas fa-rocket"></i> Coba Lagi dengan Token Lain';
                            return;
                        } else {
                            showResult("Semua token Vercel gagal. Coba lagi nanti.", "error");
                            addToConsole('$ Semua token Vercel telah dicoba dan gagal', 'error');
                        }
                    }
                } catch (error) {
                    addToConsole(`✗ Error: ${error.message}`, 'error');
                    showResult(`Terjadi kesalahan: ${error.message}`, "error");
                } finally {
                    resetDeployButton();
                }
            };

            document.getElementById('btnClear').addEventListener('click', () => {
                document.getElementById('terminalContent').innerHTML = '<div class="terminal-line">$ Terminal cleared</div><div class="terminal-line">$ Siap untuk menerima file...</div>';
            });

            document.getElementById('modalClose').onclick = () => {
                document.getElementById('resultModal').classList.remove('active');
            };

            window.onclick = (event) => {
                if (event.target === document.getElementById('resultModal')) {
                    document.getElementById('resultModal').classList.remove('active');
                }
            };

            // Drag and drop
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.style.borderColor = 'var(--accent)';
                dropzone.style.background = 'rgba(0, 112, 243, 0.1)';
            });

            dropzone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                dropzone.style.borderColor = 'var(--border-color)';
                dropzone.style.background = '';
            });

            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.style.borderColor = 'var(--border-color)';
                dropzone.style.background = '';
                
                if (e.dataTransfer.files.length > 0) {
                    const dt = new DataTransfer();
                    dt.items.add(e.dataTransfer.files[0]);
                    fileInput.files = dt.files;
                    
                    const event = new Event('change', { bubbles: true });
                    fileInput.dispatchEvent(event);
                }
            });


            // Polyfill for AbortSignal.timeout
            if (!AbortSignal.timeout) {
                AbortSignal.timeout = function(ms) {
                    const controller = new AbortController();
                    setTimeout(() => controller.abort(), ms);
                    return controller.signal;
                };
            }

            // Initial setup
            updateTokenCounter();
            showNotification('Web Tools 3 in 1 Ready!');
        });