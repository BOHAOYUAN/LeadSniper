const STORAGE_KEYS = {
  API_KEY:   'leadsniper_api_key',
  NICHE:     'leadsniper_niche',
  ENDPOINT:  'leadsniper_endpoint',
  MODEL:     'leadsniper_model',
  LICENSE:   'leadsniper_license',
  WEBHOOK:   'leadsniper_webhook',
  AUTO_SYNC: 'leadsniper_auto_sync',
  VALUE_PROP: 'leadsniper_value_prop',
  MUTE_SOUND: 'leadsniper_mute_sound',
  BLACKLIST: 'leadsniper_blacklist',
  REPLY_STYLE: 'leadsniper_reply_style',
  DAILY_LIMIT: 'leadsniper_autopilot_daily_limit'
};

const $apiKey   = document.getElementById('apiKey');
const $licenseKey = document.getElementById('licenseKey');
const $niche    = document.getElementById('niche');
const $apiEndpoint = document.getElementById('apiEndpoint');
const $apiModel   = document.getElementById('apiModel');
const $webhookUrl = document.getElementById('webhookUrl');
const $autoSync   = document.getElementById('autoSyncWebhook');
const $saveBtn  = document.getElementById('saveBtn');
const $openBtn  = document.getElementById('openSidepanelBtn');
const $masterSwitch = document.getElementById('masterSwitch');
const $autoHunterSwitch = document.getElementById('autoHunterSwitch');
const $muteSoundSwitch = document.getElementById('muteSoundSwitch');
const $blacklistKeywords = document.getElementById('blacklistKeywords');
const $valueProp = document.getElementById('valueProp');
const $testConnBtn = document.getElementById('testConnBtn');
const $toast    = document.getElementById('toast');
const $statusDot = document.querySelector('.status-dot');

const $autoPilotSwitch = document.getElementById('autoPilotSwitch');
const $autoPilotThreshold = document.getElementById('autoPilotThreshold');
const $thresholdVal = document.getElementById('thresholdVal');
const $autoPilotLock = document.getElementById('autoPilotLock');
const $scramBtn = document.getElementById('scramBtn');
const $disclaimerModal = document.getElementById('disclaimerModal');
const $acceptDisclaimerBtn = document.getElementById('acceptDisclaimerBtn');
const $apiReplyStyle = document.getElementById('apiReplyStyle');
const $autoPilotDailyLimit = document.getElementById('autoPilotDailyLimit');
const $dailyLimitVal = document.getElementById('dailyLimitVal');
const $lowThresholdWarning = document.getElementById('lowThresholdWarning');
const $scramCooldownText = document.getElementById('scramCooldownText');

let scramTimer = null;
function startScramCountdown(cooldownTime) {
  if (scramTimer) clearInterval(scramTimer);
  
  const updateTimer = () => {
    const remaining = cooldownTime - Date.now();
    if (remaining <= 0) {
      clearInterval(scramTimer);
      scramTimer = null;
      if ($scramCooldownText) $scramCooldownText.style.display = 'none';
      if ($scramBtn) $scramBtn.style.display = 'none';
      refreshLicenseUI();
    } else {
      if ($scramCooldownText) {
        $scramCooldownText.style.display = 'inline-block';
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        $scramCooldownText.textContent = `⏳ ${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
      if ($autoPilotSwitch) {
        $autoPilotSwitch.checked = false;
        $autoPilotSwitch.disabled = true;
      }
      if ($scramBtn) $scramBtn.style.display = 'none';
    }
  };
  
  updateTimer();
  scramTimer = setInterval(updateTimer, 1000);
}

// Load values
chrome.storage.local.get([...Object.values(STORAGE_KEYS), 'leadsniper_active', 'leadsniper_autohunter', 'leadsniper_scram_cooldown_until', 'leadsniper_disclaimer_accepted'], (result) => {
  $apiKey.value     = result[STORAGE_KEYS.API_KEY] || '';
  $licenseKey.value = result[STORAGE_KEYS.LICENSE] || '';
  $niche.value      = result[STORAGE_KEYS.NICHE]   || 'AI Automation and SaaS Growth';
  if ($valueProp)  $valueProp.value  = result[STORAGE_KEYS.VALUE_PROP] || '';
  if ($webhookUrl) $webhookUrl.value = result[STORAGE_KEYS.WEBHOOK] || '';
  if ($autoSync)   $autoSync.checked = result[STORAGE_KEYS.AUTO_SYNC] !== false; // default true
  if ($muteSoundSwitch) $muteSoundSwitch.checked = result[STORAGE_KEYS.MUTE_SOUND] === true;
  if ($blacklistKeywords) $blacklistKeywords.value = result[STORAGE_KEYS.BLACKLIST] || '';
  if ($apiReplyStyle) $apiReplyStyle.value = result[STORAGE_KEYS.REPLY_STYLE] || 'Geek';
  if ($autoPilotDailyLimit) {
    const limit = result[STORAGE_KEYS.DAILY_LIMIT] || 15;
    $autoPilotDailyLimit.value = limit;
    if ($dailyLimitVal) $dailyLimitVal.textContent = limit;
  }
  
  let endp = result[STORAGE_KEYS.ENDPOINT] || 'https://api.deepseek.com/chat/completions';
  if (endp.includes('openai.com')) endp = 'https://api.deepseek.com/chat/completions';
  $apiEndpoint.value = endp;
  
  let mod = result[STORAGE_KEYS.MODEL] || 'deepseek-chat';
  if (mod.includes('gpt-')) mod = 'deepseek-chat';
  $apiModel.value = mod;

  // Master Switch state
  const isActive = result.leadsniper_active !== false; 
  $masterSwitch.checked = isActive;
  updateStatusDot(isActive);

  // Auto-Hunter switch state
  const isAutoHunter = result.leadsniper_autohunter === true;
  if ($autoHunterSwitch) $autoHunterSwitch.checked = isAutoHunter;

  // Auto-Pilot switch and threshold state
  refreshLicenseUI();
});

function refreshLicenseUI() {
  chrome.storage.local.get(['leadsniper_autopilot', 'leadsniper_autopilot_threshold', 'leadsniper_license_valid', 'leadsniper_license_tier', 'leadsniper_scram_cooldown_until'], (res) => {
    const isAutoPilot = res.leadsniper_autopilot === true;
    const threshold = res.leadsniper_autopilot_threshold || 85;
    const hasLicense = res.leadsniper_license_valid === true;
    const tier = res.leadsniper_license_tier || 'basic';
    const cooldownUntil = res.leadsniper_scram_cooldown_until || 0;

    if ($lowThresholdWarning) {
      $lowThresholdWarning.style.display = threshold < 80 ? 'block' : 'none';
    }

    if (cooldownUntil > Date.now()) {
      startScramCountdown(cooldownUntil);
      return;
    } else {
      if ($scramCooldownText) $scramCooldownText.style.display = 'none';
    }

    if ($autoPilotSwitch) {
      if (!hasLicense) {
        $autoPilotSwitch.checked = false;
        $autoPilotSwitch.disabled = true;
        if ($autoPilotLock) {
          $autoPilotLock.style.display = 'inline-block';
          $autoPilotLock.innerHTML = '🔒';
          $autoPilotLock.title = "Buy License to Unlock Auto-Pilot";
        }
        if ($scramBtn) $scramBtn.style.display = 'none';
      } else if (tier === 'basic') {
        $autoPilotSwitch.checked = false;
        $autoPilotSwitch.disabled = true;
        if ($autoPilotLock) {
          $autoPilotLock.style.display = 'inline-block';
          $autoPilotLock.innerHTML = '🔒 <span style="font-size: 8px; color: #ff2e4c; font-weight: bold; vertical-align: middle; text-decoration: underline;">UPGRADE</span>';
          $autoPilotLock.title = "Upgrade to Pro to Unlock Auto-Pilot";
        }
        if ($scramBtn) $scramBtn.style.display = 'none';
      } else {
        $autoPilotSwitch.checked = isAutoPilot;
        $autoPilotSwitch.disabled = false;
        if ($autoPilotLock) $autoPilotLock.style.display = 'none';
        if ($scramBtn) $scramBtn.style.display = isAutoPilot ? 'block' : 'none';
      }
    }
    if ($autoPilotThreshold) {
      $autoPilotThreshold.value = threshold;
      if ($thresholdVal) $thresholdVal.textContent = threshold;
    }
  });
}

function updateStatusDot(active) {
  $statusDot.style.background = active ? '#00ff9d' : '#ff2e4c';
  $statusDot.style.boxShadow = active ? '0 0 8px #00ff9d' : '0 0 8px #ff2e4c';
}

$masterSwitch.addEventListener('change', () => {
  const active = $masterSwitch.checked;
  chrome.storage.local.set({ leadsniper_active: active });
  updateStatusDot(active);
  showToast(active ? '🛰️ SCANNER ONLINE' : '💤 SCANNER OFFLINE', !active);
});

if ($autoHunterSwitch) {
  $autoHunterSwitch.addEventListener('change', () => {
    const active = $autoHunterSwitch.checked;
    chrome.storage.local.set({ leadsniper_autohunter: active });
    showToast(active ? '⚡ AUTO-HUNTER BOT ONLINE' : '💤 AUTO-HUNTER BOT OFFLINE', !active);
  });
}

if ($muteSoundSwitch) {
  $muteSoundSwitch.addEventListener('change', () => {
    const active = $muteSoundSwitch.checked;
    chrome.storage.local.set({ [STORAGE_KEYS.MUTE_SOUND]: active });
    showToast(active ? '🔇 SOUND MUTED' : '🔊 SOUND ENABLED', false);
  });
}

if ($autoPilotSwitch) {
  $autoPilotSwitch.addEventListener('change', () => {
    const active = $autoPilotSwitch.checked;
    if (active) {
      chrome.storage.local.get('leadsniper_disclaimer_accepted', (res) => {
        if (!res.leadsniper_disclaimer_accepted) {
          $autoPilotSwitch.checked = false;
          if ($disclaimerModal) $disclaimerModal.style.display = 'flex';
        } else {
          chrome.storage.local.set({ leadsniper_autopilot: true }, () => {
            if ($scramBtn) $scramBtn.style.display = 'block';
            showToast('🛰️ AUTO-PILOT ON', false);
          });
        }
      });
    } else {
      chrome.storage.local.set({ leadsniper_autopilot: false }, () => {
        if ($scramBtn) $scramBtn.style.display = 'none';
        showToast('🛰️ AUTO-PILOT OFF', true);
      });
    }
  });
}

if ($acceptDisclaimerBtn) {
  $acceptDisclaimerBtn.addEventListener('click', () => {
    chrome.storage.local.set({
      leadsniper_disclaimer_accepted: true,
      leadsniper_autopilot: true
    }, () => {
      if ($disclaimerModal) $disclaimerModal.style.display = 'none';
      if ($autoPilotSwitch) {
        $autoPilotSwitch.checked = true;
        $autoPilotSwitch.disabled = false;
      }
      if ($scramBtn) $scramBtn.style.display = 'block';
      showToast('🛰️ AUTO-PILOT ON', false);
    });
  });
}

if ($disclaimerModal) {
  $disclaimerModal.addEventListener('click', (e) => {
    if (e.target === $disclaimerModal) {
      $disclaimerModal.style.display = 'none';
      if ($autoPilotSwitch) $autoPilotSwitch.checked = false;
    }
  });
}

if ($autoPilotThreshold) {
  $autoPilotThreshold.addEventListener('input', () => {
    const val = parseInt($autoPilotThreshold.value, 10);
    if ($thresholdVal) $thresholdVal.textContent = val;
    if ($lowThresholdWarning) {
      $lowThresholdWarning.style.display = val < 80 ? 'block' : 'none';
    }
  });
  $autoPilotThreshold.addEventListener('change', () => {
    chrome.storage.local.set({ leadsniper_autopilot_threshold: parseInt($autoPilotThreshold.value, 10) });
  });
}

if ($autoPilotDailyLimit) {
  $autoPilotDailyLimit.addEventListener('input', () => {
    if ($dailyLimitVal) $dailyLimitVal.textContent = $autoPilotDailyLimit.value;
  });
  $autoPilotDailyLimit.addEventListener('change', () => {
    chrome.storage.local.set({ [STORAGE_KEYS.DAILY_LIMIT]: parseInt($autoPilotDailyLimit.value, 10) });
  });
}

if ($apiReplyStyle) {
  $apiReplyStyle.addEventListener('change', () => {
    chrome.storage.local.set({ [STORAGE_KEYS.REPLY_STYLE]: $apiReplyStyle.value }, () => {
      showToast('🎨 STYLE UPDATED: ' + $apiReplyStyle.value, false);
    });
  });
}

if ($scramBtn) {
  $scramBtn.addEventListener('click', () => {
    const cooldownDuration = 30 * 60 * 1000;
    const cooldownTime = Date.now() + cooldownDuration;
    
    chrome.storage.local.set({
      leadsniper_autopilot: false,
      leadsniper_scram_cooldown_until: cooldownTime
    }, () => {
      if ($autoPilotSwitch) {
        $autoPilotSwitch.checked = false;
        $autoPilotSwitch.disabled = true;
      }
      if ($scramBtn) $scramBtn.style.display = 'none';
      
      chrome.runtime.sendMessage({ type: "SCRAM_KILL" });
      startScramCountdown(cooldownTime);
      showToast('🛑 EMERGENCY SCRAM TRIGGERED', true);
    });
  });
}

if ($autoPilotLock) {
  $autoPilotLock.addEventListener('click', () => {
    chrome.storage.local.get(['leadsniper_license_valid', 'leadsniper_license_tier'], (res) => {
      const hasLicense = res.leadsniper_license_valid === true;
      const tier = res.leadsniper_license_tier;
      if (!hasLicense) {
        window.open('https://checkout.dodopayments.com/buy/pdt_0NgNoZpvOKdipx3cyM5dX?quantity=1', '_blank');
      } else if (tier === 'basic') {
        // Redirect to upgrade
        window.open('https://checkout.dodopayments.com/buy/pdt_0NgNoZpvOKdipx3cyM5dX?quantity=1', '_blank');
      }
    });
  });
}

if ($testConnBtn) {
  $testConnBtn.addEventListener('click', async () => {
    const apiKey = $apiKey.value.trim();
    const endpoint = $apiEndpoint.value.trim() || 'https://api.deepseek.com/chat/completions';
    const model = $apiModel.value.trim() || 'deepseek-chat';

    if (!apiKey) {
      showToast('❌ ENTER API KEY FIRST', true);
      return;
    }

    const origText = $testConnBtn.textContent;
    $testConnBtn.textContent = "⌛...";
    $testConnBtn.disabled = true;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: 'Connection check' }],
          max_tokens: 1
        })
      });

      if (res.ok || res.status === 400) {
        $testConnBtn.textContent = "✅";
        $testConnBtn.style.color = "#00ff9d";
        showToast('✅ CONNECTION VERIFIED', false);
        setTimeout(() => {
          $testConnBtn.textContent = origText;
          $testConnBtn.style.color = "";
          $testConnBtn.disabled = false;
        }, 2000);
      } else if (res.status === 401 || res.status === 402 || res.status === 429) {
        $testConnBtn.textContent = "❌";
        $testConnBtn.style.color = "#ff2e4c";
        showToast('DeepSeek API Error: Insufficient Balance or Invalid Key.', true);
        setTimeout(() => {
          $testConnBtn.textContent = origText;
          $testConnBtn.style.color = "";
          $testConnBtn.disabled = false;
        }, 3000);
      } else if (res.status === 404) {
        $testConnBtn.textContent = "❌";
        $testConnBtn.style.color = "#ff2e4c";
        showToast('Network Error: Invalid Endpoint URL (404).', true);
        setTimeout(() => {
          $testConnBtn.textContent = origText;
          $testConnBtn.style.color = "";
          $testConnBtn.disabled = false;
        }, 3000);
      } else {
        $testConnBtn.textContent = "❌";
        $testConnBtn.style.color = "#ff2e4c";
        showToast('❌ AUTH FAILED', true);
        setTimeout(() => {
          $testConnBtn.textContent = origText;
          $testConnBtn.style.color = "";
          $testConnBtn.disabled = false;
        }, 2000);
      }
    } catch (err) {
      $testConnBtn.textContent = "❌";
      $testConnBtn.style.color = "#ff2e4c";
      showToast('❌ NETWORK ERROR', true);
      setTimeout(() => {
        $testConnBtn.textContent = origText;
        $testConnBtn.style.color = "";
        $testConnBtn.disabled = false;
      }, 2000);
    }
  });
}

$saveBtn.addEventListener('click', async () => {
  const apiKey     = $apiKey.value.trim();
  const licenseKey = $licenseKey.value.trim();
  const niche      = $niche.value.trim();
  const valueProp  = $valueProp ? $valueProp.value.trim() : '';
  const endpoint   = $apiEndpoint.value.trim() || 'https://api.deepseek.com/chat/completions';
  const model      = $apiModel.value.trim() || 'deepseek-chat';
  const webhook    = $webhookUrl ? $webhookUrl.value.trim() : '';
  const autoSync   = $autoSync ? $autoSync.checked : true;
  const blacklist  = $blacklistKeywords ? $blacklistKeywords.value.trim() : '';
  const muteSound  = $muteSoundSwitch ? $muteSoundSwitch.checked : false;
  const style      = $apiReplyStyle ? $apiReplyStyle.value : 'Geek';
  const dailyLimit = $autoPilotDailyLimit ? parseInt($autoPilotDailyLimit.value, 10) : 15;

  if (!apiKey || !niche) {
    showToast('❌ PLEASE FILL API KEY & NICHE', true);
    return;
  }

  const origText = $saveBtn.textContent;

  if (licenseKey) {
    $saveBtn.textContent = "⚡ VERIFYING...";
    try {
      const response = await chrome.runtime.sendMessage({ 
          type: "ACTIVATE_EXT", 
          key: licenseKey 
      });
      if (!response.success) {
        $saveBtn.textContent = origText;
        showToast('❌ ' + response.error, true);
        return;
      }
    } catch(err) {
      $saveBtn.textContent = origText;
      showToast('❌ VERIFICATION FAILED', true);
      return;
    }
  }

  chrome.storage.local.set({
    [STORAGE_KEYS.API_KEY]:   apiKey,
    [STORAGE_KEYS.LICENSE]:   licenseKey,
    [STORAGE_KEYS.NICHE]:     niche,
    [STORAGE_KEYS.VALUE_PROP]: valueProp,
    [STORAGE_KEYS.ENDPOINT]:  endpoint,
    [STORAGE_KEYS.MODEL]:     model,
    [STORAGE_KEYS.WEBHOOK]:   webhook,
    [STORAGE_KEYS.AUTO_SYNC]: autoSync,
    [STORAGE_KEYS.BLACKLIST]:  blacklist,
    [STORAGE_KEYS.MUTE_SOUND]: muteSound,
    [STORAGE_KEYS.REPLY_STYLE]: style,
    [STORAGE_KEYS.DAILY_LIMIT]: dailyLimit
  }, () => {
    $saveBtn.textContent = origText;
    refreshLicenseUI();
    showToast('✅ SECURED & LOCKED', false);
  });
});

$openBtn.addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (tabs[0]) {
      chrome.sidePanel.open({ tabId: tabs[0].id });
    }
  });
});

const $intentSearchBtn = document.getElementById('intentSearchBtn');
if ($intentSearchBtn) {
  $intentSearchBtn.addEventListener('click', () => {
    chrome.storage.local.get([STORAGE_KEYS.NICHE], (result) => {
      const niche = result[STORAGE_KEYS.NICHE] || 'AI Automation and SaaS Growth';
      
      // 1. Open X/Twitter advanced search
      const queryX = `("recommendation" OR "looking for" OR "anyone know" OR "help me find" OR "suggest me") AND (${niche})`;
      const urlX = `https://x.com/search?q=${encodeURIComponent(queryX)}&f=live`;
      chrome.tabs.create({ url: urlX });

      // 2. Open Reddit advanced search
      const queryReddit = `("looking for" OR "recommend" OR "anyone know" OR "suggest" OR "alternative to") AND (${niche})`;
      const urlReddit = `https://www.reddit.com/search/?q=${encodeURIComponent(queryReddit)}&sort=new`;
      chrome.tabs.create({ url: urlReddit });
    });
  });
}

function showToast(msg, error) {
  $toast.textContent = msg;
  $toast.style.background = error ? '#ff2e4c' : '#00ff9d';
  $toast.style.color = error ? '#fff' : '#000';
  $toast.classList.add('show');
  setTimeout(() => $toast.classList.remove('show'), 2000);
}
