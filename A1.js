        // ==================== TOOL 1: CODE ENCRYPTOR ====================
        function updateStats(input, output, layers, time) {
            document.getElementById('inputLength').textContent = input.length.toLocaleString();
            document.getElementById('outputLength').textContent = output.length.toLocaleString();
            document.getElementById('securityLayers').textContent = layers;
            document.getElementById('encodeTime').textContent = time + 'ms';
        }

        function encryptCode() {
            const input = document.getElementById('codeInput').value;
            const output = document.getElementById('encryptedOutput');
            const codeType = document.getElementById('codeType').value;
            const encryptionLevel = document.getElementById('encryptionLevel').value;

            if (!input) {
                showNotification('Please enter code to encrypt!');
                return;
            }

            const startTime = performance.now();

            try {
                let result;
                let layers;
                
                switch(encryptionLevel) {
                    case 'hard':
                        result = encryptHard(input, codeType);
                        layers = 4;
                        break;
                    case 'slow':
                        result = encryptSlow(input, codeType);
                        layers = 3;
                        break;
                    case 'extreme':
                        result = encryptExtreme(input, codeType);
                        layers = 6;
                        break;
                    default:
                        result = encryptHard(input, codeType);
                        layers = 4;
                }

                const endTime = performance.now();
                const encodeDuration = (endTime - startTime).toFixed(2);
                
                output.value = result;
                updateStats(input, result, layers, encodeDuration);
                showNotification(`${encryptionLevel.toUpperCase()} Encryption Complete! ${layers} security layers applied.`);
                
            } catch (error) {
                output.value = `Encryption Error: ${error.message}`;
                updateStats(input, '', 0, 0);
                showNotification('Encryption failed! Please check your input.');
            }
        }

        function encryptHard(input, codeType) {
            if (codeType === 'html') {
                let layer1 = btoa(unescape(encodeURIComponent(input)));
                const chunks = [];
                for (let i = 0; i < layer1.length; i += 30) {
                    chunks.push(btoa(layer1.slice(i, i + 30)));
                }
                let layer2 = chunks.join('|');
                let layer3 = btoa(layer2);
                let layer4 = encodeURIComponent(layer3);
                return generateOutputTemplate(codeType, layer4, 4);
            } else {
                const encoded = btoa(unescape(encodeURIComponent(input)));
                return generateOutputTemplate(codeType, encoded, 1, 'base64');
            }
        }

        function encryptSlow(input, codeType) {
            if (codeType === 'html') {
                let layer1 = btoa(unescape(encodeURIComponent(input)));
                let layer2 = btoa(layer1);
                let layer3 = encodeURIComponent(layer2);
                return generateOutputTemplate(codeType, layer3, 3);
            } else {
                const encoded = btoa(unescape(encodeURIComponent(input)));
                return generateOutputTemplate(codeType, encoded, 1, 'base64');
            }
        }

        function encryptExtreme(input, codeType) {
            if (codeType === 'html') {
                let layer1 = btoa(unescape(encodeURIComponent(input)));
                let layer2 = layer1.split('').reverse().join('');
                const chunks = [];
                for (let i = 0; i < layer2.length; i += 20) {
                    chunks.push(btoa(layer2.slice(i, i + 20)));
                }
                let layer3 = chunks.join('|');
                let layer4 = btoa(layer3);
                let layer5 = '';
                for (let i = 0; i < layer4.length; i++) {
                    let charCode = layer4.charCodeAt(i);
                    layer5 += String.fromCharCode(charCode + 1);
                }
                let layer6 = encodeURIComponent(layer5);
                return generateOutputTemplate(codeType, layer6, 6);
            } else {
                const encoded = btoa(unescape(encodeURIComponent(input)));
                return generateOutputTemplate(codeType, encoded, 1, 'base64');
            }
        }

        function generateOutputTemplate(codeType, encryptedData, layers) {
            const safeData = encryptedData.replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
            
            const header = `<!-- Encoded By AldzX505 -->\n\n`;
            
            switch(codeType) {
                case 'html':
                    const decryptionScript = generateDecryptionScript(safeData, layers);
                    return header + `
<script>${decryptionScript}document.write(a);</script>`;
                
                default:
                    return header + `// Encrypted ${codeType.toUpperCase()} Code\n// Manual decryption required\n// Encoded Data: ${safeData}\n// Use appropriate decoder for this language`;
            }
        }

        function generateDecryptionScript(encryptedData, layers) {
            let script = '';
            
            switch(layers) {
                case 3:
                    script = `\n\n\n\n\n\n<!--- Encoded Level Slow -->\n\n\n\n\n\nlet e="${encryptedData}";let d=decodeURIComponent(e);let c=atob(atob(d));let b=decodeURIComponent(escape(c));let a=b;`;
                    break;
                case 4:
                    script = `\n\n\n\n\n\n\n\n\n<!-- Encoded Level Hard -->\n\n\n\n\n\n\n\n\nlet e="${encryptedData}";let d=decodeURIComponent(e);let c=atob(d);let b=c.split("|").map(x=>atob(x)).join("");let a=decodeURIComponent(escape(atob(b)));`;
                    break;
                case 6:
                    script = `\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<!-- Encoded Level Extreme -->\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nlet e="${encryptedData}";let d=decodeURIComponent(e);let c='';for(let i=0;i<d.length;i++){c+=String.fromCharCode(d.charCodeAt(i)-1);}let b=atob(c);let a=b.split("|").map(x=>atob(x)).join("");a=a.split("").reverse().join("");a=decodeURIComponent(escape(atob(a)));`;
                    break;
                default:
                    script = `\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nlet e="${encryptedData}";let d=decodeURIComponent(e);let c=atob(d);let b=c.split("|").map(x=>atob(x)).join("");let a=decodeURIComponent(escape(atob(b)));`;
            }
            
            return script;
        }

        function copyResult() {
            const output = document.getElementById('encryptedOutput');
            if (!output.value) {
                showNotification('No content to copy!');
                return;
            }
            output.select();
            document.execCommand('copy');
            showNotification('Encrypted code copied to clipboard!');
        }

        function clearAll() {
            document.getElementById('codeInput').value = '';
            document.getElementById('encryptedOutput').value = '';
            updateStats('', '', 0, 0);
            showNotification('All fields cleared!');
        }
        
        function downloadResult() {
            const output = document.getElementById('encryptedOutput').value;
            if (!output) {
                showNotification('No content to download!');
                return;
            }
            
            const codeType = document.getElementById('codeType').value;
            let extension = 'txt';
            let mimeType = 'text/plain';
            
            switch(codeType) {
                case 'html': extension = 'html'; mimeType = 'text/html'; break;
            }
            
            const blob = new Blob([output], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `encrypted_${Date.now()}.${extension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showNotification('Encrypted file downloaded successfully!');
        }
