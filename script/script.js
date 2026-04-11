 const canvas = document.getElementById('waveCanvas');
        let ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let waveHeight = 280;
        let time = 0;

        function resizeCanvas() {
            width = window.innerWidth;
            canvas.width = width;
            canvas.height = waveHeight;
        }

        function drawWaves() {
            ctx.clearRect(0, 0, width, waveHeight);
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                let amp = 18 + i * 6;
                let freq = 0.008 + i * 0.002;
                let phase = time * 0.008 + i;
                for (let x = 0; x <= width; x += 15) {
                    let y = waveHeight / 1.8 + Math.sin(x * freq + phase) * amp;
                    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.lineTo(width, waveHeight);
                ctx.lineTo(0, waveHeight);
                ctx.fillStyle = `rgba(0,242,255,${0.08 - i * 0.02})`;
                ctx.fill();
            }
            time++;
            requestAnimationFrame(drawWaves);
        }

        resizeCanvas();
        drawWaves();
        window.addEventListener("resize", resizeCanvas);

        /* ========== APP STATE ========== */
        const STACKS = [
            { name: "React + Vite", icon: "⚛️", desc: "Fast SPA" },
            { name: "Next.js 14", icon: "▲", desc: "Fullstack React" },
            { name: "Node.js + Express", icon: "🟢", desc: "REST API" },
            { name: "FastAPI", icon: "🐍", desc: "Python async" }
        ];

        const ROLES = ["Frontend Engineer", "Backend Engineer", "Solutions Architect"];
        const MODELS = ["GPT-4o", "Gemini 1.5 Pro", "Claude 3.5 Sonnet"];

        let selectedStack = STACKS[0].name;
        let roleAssignments = {
            "Frontend Engineer": "GPT-4o",
            "Backend Engineer": "Gemini 1.5 Pro",
            "Solutions Architect": "Claude 3.5 Sonnet"
        };

        /* DOM elements */
        const terminal = document.getElementById("terminalLogs");
        const promptInput = document.getElementById("promptInput");
        const orchestrateBtn = document.getElementById("orchestrateBtn");
        const orchestrationScreen = document.getElementById("orchestrationScreen");
        const buildStatus = document.getElementById("buildStatus");
        const finalResultDiv = document.getElementById("finalResult");
        const appUrlLink = document.getElementById("appUrl");
        const backBtn = document.getElementById("backBtn");
        const settingsIcon = document.getElementById("settingsIcon");
        const apiModal = document.getElementById("apiModal");
        const demoModeBtn = document.getElementById("demoModeBtn");
        const saveKeysBtn = document.getElementById("saveKeysBtn");

        let flowNodes = document.querySelectorAll(".flow-node");
        let flowLines = document.querySelectorAll(".flow-line");

        function updateFlowElements() {
            flowNodes = document.querySelectorAll(".flow-node");
            flowLines = document.querySelectorAll(".flow-line");
        }

        /* Logging */
        function log(msg) {
            const div = document.createElement("div");
            div.className = "log-line";
            div.innerText = "➜ " + msg;
            terminal.appendChild(div);
            terminal.scrollTop = terminal.scrollHeight;
        }

        /* Render Stack Selector */
        function renderStacks() {
            const container = document.getElementById("stackContainer");
            container.innerHTML = "";
            STACKS.forEach(stack => {
                const div = document.createElement("div");
                div.className = `stack-option ${selectedStack === stack.name ? "active" : ""}`;
                div.innerHTML = `
                    <div class="stack-icon">${stack.icon}</div>
                    <div class="stack-info">
                        <h4>${stack.name}</h4>
                        <p>${stack.desc}</p>
                    </div>
                `;
                div.addEventListener("click", () => {
                    selectedStack = stack.name;
                    renderStacks();
                    log(`📦 Stack changed to ${stack.name}`);
                });
                container.appendChild(div);
            });
        }

        /* Render Roles & Model selection */
        function renderRoles() {
            const container = document.getElementById("rolesContainer");
            container.innerHTML = "";
            ROLES.forEach(role => {
                const row = document.createElement("div");
                row.className = "role-row";
                row.innerHTML = `
                    <div class="role-name"><i class="fas fa-user-astronaut"></i> ${role}</div>
                    <div class="model-chips" data-role="${role}"></div>
                `;
                const chipsDiv = row.querySelector(".model-chips");
                MODELS.forEach(model => {
                    const chip = document.createElement("span");
                    chip.className = `model-chip ${roleAssignments[role] === model ? "active" : ""}`;
                    chip.innerText = model;
                    chip.addEventListener("click", () => {
                        roleAssignments[role] = model;
                        renderRoles();
                        log(`🤖 ${role} assigned to ${model}`);
                    });
                    chipsDiv.appendChild(chip);
                });
                container.appendChild(row);
            });
        }

        /* Render Active Assignment Summary */
        function renderAssignments() {
            const container = document.getElementById("assignedSummary");
            container.innerHTML = "";
            for (const [role, model] of Object.entries(roleAssignments)) {
                const pill = document.createElement("div");
                pill.className = "assigned-pill";
                pill.innerHTML = `<span><i class="fas fa-microchip"></i> ${role}</span><span style="color:#00F2FF;">${model}</span>`;
                container.appendChild(pill);
            }
        }

        /* Full Orchestration Flow */
        function runOrchestration() {
            const prompt = promptInput.value.trim();
            if (!prompt) {
                log("❌ Please enter a mission prompt");
                return;
            }
            log("🚀 Starting orchestration...");
            log(`📦 Selected Stack: ${selectedStack}`);
            log(`🎯 Mission: "${prompt.substring(0, 70)}${prompt.length > 70 ? '...' : ''}"`);
            log(`🧠 Agents: Frontend(${roleAssignments["Frontend Engineer"]}), Backend(${roleAssignments["Backend Engineer"]}), Architect(${roleAssignments["Solutions Architect"]})`);

            // Show orchestration overlay
            orchestrationScreen.style.display = "flex";
            updateFlowElements();
            flowNodes.forEach(n => n.classList.remove("active"));
            flowLines.forEach(l => l.classList.remove("active"));
            finalResultDiv.style.display = "none";
            buildStatus.innerText = "Initializing agents...";

            const steps = [
                "Designing architecture...",
                "Generating frontend...",
                "Building backend...",
                "Deploying to edge..."
            ];

            let stepIndex = 0;

            function nextStep() {
                if (stepIndex > 0 && flowLines[stepIndex - 1]) flowLines[stepIndex - 1].classList.add("active");
                if (flowNodes[stepIndex]) flowNodes[stepIndex].classList.add("active");
                buildStatus.innerText = steps[stepIndex];
                log(steps[stepIndex]);
                stepIndex++;
                if (stepIndex < steps.length) {
                    setTimeout(nextStep, 1300);
                } else {
                    finishBuild();
                }
            }

            function finishBuild() {
                setTimeout(() => {
                    const uniqueId = Math.random().toString(36).slice(2, 8);
                    const generatedUrl = `https://app-${uniqueId}.ecclesia.dev`;
                    appUrlLink.innerText = generatedUrl;
                    appUrlLink.href = generatedUrl;
                    finalResultDiv.style.display = "block";
                    buildStatus.innerText = "✅ Build Complete · Zero‑shot Deployment";
                    log("🎉 Deployment successful! App is live.");
                    log(`🌐 Live at: ${generatedUrl}`);
                }, 1000);
            }

            nextStep();
        }

        /* Reset overlay */
        function resetOrchestrationOverlay() {
            orchestrationScreen.style.display = "none";
            updateFlowElements();
            if (flowNodes) flowNodes.forEach(n => n.classList.remove("active"));
            if (flowLines) flowLines.forEach(l => l.classList.remove("active"));
            finalResultDiv.style.display = "none";
            buildStatus.innerText = "Initializing agents...";
        }

        /* API Modal handlers (cosmetic) */
        function openModal() {
            apiModal.classList.add("active");
        }
        function closeModal() {
            apiModal.classList.remove("active");
        }
        demoModeBtn.addEventListener("click", () => {
            log("✨ Demo Mode active — using simulated intelligence.");
            closeModal();
        });
        saveKeysBtn.addEventListener("click", () => {
            const openai = document.getElementById("openaiKey").value;
            const gemini = document.getElementById("geminiKey").value;
            if (openai || gemini) log("🔐 API keys stored (simulated)");
            closeModal();
        });
        settingsIcon.addEventListener("click", openModal);
        window.addEventListener("click", (e) => {
            if (e.target === apiModal) closeModal();
        });

        /* Event Listeners */
        orchestrateBtn.addEventListener("click", runOrchestration);
        backBtn.addEventListener("click", resetOrchestrationOverlay);

        /* Initial Render & Default Log */
        renderStacks();
        renderRoles();
        renderAssignments();
        log("🌊 Ecclesia Neural Core ready · Sidebar removed, full focus mode");
        log("💡 Choose stack, assign AI models, then orchestrate your next-gen app.");
        log("🔧 Click the gear icon for API demo settings.");