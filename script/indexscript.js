
(function demoPipelineTicker() {
    const statusDivs = document.querySelectorAll('.step');
    if (statusDivs.length) {
        const statusMessages = ['✅ arch finalized', '🔨 coding in progress', '🧪 QA reviewing', '🚀 deploying preview'];
        let idx = 0;
        setInterval(() => {
            const targetStep = statusDivs[idx % statusDivs.length];
            if (targetStep) {
                const smallDiv = targetStep.querySelector('div:last-child');
                if (smallDiv && !smallDiv.querySelector('i')) {
                    smallDiv.style.background = "#00F2FF30";
                    smallDiv.style.transition = "0.2s";
                }
            }
            idx++;
        }, 3200);
    }
    const terminalLog = document.querySelector('.pipeline-demo div[style*="monospace"]');
    if (terminalLog) {
        const logs = [
            "[Orchestrator] Architect agent pushed design v2 → reviewed",
            "[Developer] Completed user-auth module, passing lint",
            "[QA] 4 new integration tests added, coverage +6%",
            "[Pipeline] Deployment to staging succeeded 🟢"
        ];
        let logIdx = 0;
        setInterval(() => {
            if (terminalLog) {
                terminalLog.innerHTML = `<i class="fas fa-terminal"></i> ${logs[logIdx % logs.length]}`;
                logIdx++;
            }
        }, 4800);
    }
})();