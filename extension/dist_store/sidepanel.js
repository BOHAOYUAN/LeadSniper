// LeadSnapper B2B Sidepanel Solution Engine (Refactored & Three.js Removed)

// DOM Elements
const emptyStateEl = document.getElementById('empty-state');
const mainDashboardEl = document.getElementById('main-dashboard');
const signalsCardEl = document.getElementById('signals-card');
const signalsListEl = document.getElementById('signals-list');
const statsCounterEl = document.getElementById('stats-counter');
const statsEl = document.getElementById('stats'); // Advanced metric telemetry element
const liveTickerEl = document.getElementById('stealth-live-ticker');
const signalTrailListEl = document.getElementById('signal-trail-list');

// Action Elements
const syncWebhookBtn = document.getElementById('syncWebhookBtn');
const directSnipeBtn = document.getElementById('directSnipeBtn');
const btnShareSnapshot = document.getElementById('btn-share-snapshot');
const btnStatusDmed = document.getElementById('btn-status-dmed');
const btnStatusArchive = document.getElementById('btn-status-archive');
const btnOpenProfile = document.getElementById('btn-open-profile');
const btnOpenDm = document.getElementById('btn-open-dm');

// CLI Elements
const cliInput = document.getElementById('cli-input');
const cliSubmit = document.getElementById('cli-submit');
const universalCli = document.getElementById('universal-cli') || (cliInput ? cliInput.parentElement : null);

let targets = []; // Array of detected targets
let currentSelectedTarget = null;

// Stealth ticker simulation texts
const stealthTickers = [
  "[STEALTH: Spoofing Canvas noise profile...]",
  "[STEALTH: Simulating random mouse path...]",
  "[STEALTH: Perturbing WebGL parameter matrices...]",
  "[STEALTH: Injecting virtual keyboard layout delays...]",
  "[STEALTH: Bypassing automated cloud headless detectors...]"
];
let currentTickerIdx = 0;

// Initialize
function init() {
  // Setup stealth ticker rotation
  setInterval(rotateStealthTicker, 3500);
  // Setup UI self-healing check simulation (keeping original calibration logic representation)
  setInterval(simulateSelfHealingCheck, 12000);
}

function rotateStealthTicker() {
  if (!liveTickerEl) return;
  currentTickerIdx = (currentTickerIdx + 1) % stealthTickers.length;
  liveTickerEl.textContent = stealthTickers[currentTickerIdx];
}

// ═══════════ TARGET SELECTION & BINDING ═══════════

function selectTarget(target) {
  if (!target) return;
  currentSelectedTarget = target;
  
  // Update targets switcher UI classes
  const badges = document.querySelectorAll('.signal-badge');
  badges.forEach(b => {
    if (b.getAttribute('data-target-id') === target.id.toString()) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });

  // Scroll active window context if needed
  scrollToTarget(target.id, target.tabId);

  // Bind Target fields
  const nameEl = document.getElementById('drawer-target-name');
  const scoreEl = document.getElementById('drawer-score');
  const reasonEl = document.getElementById('drawer-reason');
  const orgEl = document.getElementById('profile-org');
  const bioEl = document.getElementById('profile-bio');
  const tagsContainer = document.getElementById('profile-tags');

  const shortOpenerEl = document.getElementById('reply-short-opener');
  const linkedinRequestEl = document.getElementById('reply-linkedin-request');

  if (nameEl) nameEl.textContent = ((target.name || 'TARGET NODE') + '').toUpperCase();
  if (scoreEl) scoreEl.textContent = target.score || '--';
  if (reasonEl) reasonEl.textContent = target.reason || "High intent metrics matched strategic qualification rules.";
  
  // Update score ring SVG progress and status text
  updateScoreRing(target.score || 0);

  // Profile fields
  const p = target.profile || {};
  if (orgEl) orgEl.textContent = p.company || 'Enterprise Target Tech';
  if (bioEl) bioEl.textContent = p.bio || 'High Net-Worth Individual / Decision Maker.';

  // Build Profile Tags
  if (tagsContainer) {
    tagsContainer.innerHTML = '';
    
    // Authority tag
    const authTag = document.createElement('span');
    authTag.className = 'profile-tag-badge';
    authTag.textContent = p.authority || 'Authority: C-Level';
    tagsContainer.appendChild(authTag);

    // Platform tag
    const platformTag = document.createElement('span');
    platformTag.className = 'profile-tag-badge';
    platformTag.style.background = '#EFF6FF';
    platformTag.style.color = '#2563EB';
    platformTag.style.borderColor = '#BFDBFE';
    platformTag.textContent = `Source: ${getTargetPlatformLabel(target)}`;
    tagsContainer.appendChild(platformTag);

    // ICP Match tag
    if (target.score >= 80) {
      const icpTag = document.createElement('span');
      icpTag.className = 'profile-tag-badge';
      icpTag.style.background = '#ECFDF5';
      icpTag.style.color = '#047857';
      icpTag.style.borderColor = '#A7F3D0';
      icpTag.textContent = 'ICP Match: High';
      tagsContainer.appendChild(icpTag);
    }
  }

  // Update Status Buttons
  if (btnStatusDmed) {
    if (target.status === 'dmed') {
      btnStatusDmed.style.background = '#10B981';
      btnStatusDmed.style.color = '#FFFFFF';
      btnStatusDmed.innerHTML = '<i class="fas fa-check-double"></i> DM\'ed';
    } else {
      btnStatusDmed.style.background = 'transparent';
      btnStatusDmed.style.color = '#10B981';
      btnStatusDmed.innerHTML = '<i class="fas fa-check"></i> DM\'ed';
    }
  }

  // Bind Dynamic Profile and DM Links
  if (btnOpenProfile) {
    if (target.profileUrl) {
      btnOpenProfile.style.display = 'inline-flex';
      btnOpenProfile.href = target.profileUrl;
    } else if (target.postUrl) {
      btnOpenProfile.style.display = 'inline-flex';
      btnOpenProfile.href = target.postUrl;
    } else {
      btnOpenProfile.style.display = 'none';
    }
  }

  if (btnOpenDm) {
    let dmUrl = null;
    const profileUrl = target.profileUrl || '';
    if (profileUrl.includes('x.com') || profileUrl.includes('twitter.com')) {
      dmUrl = 'https://x.com/messages';
    } else if (profileUrl.includes('linkedin.com')) {
      dmUrl = 'https://www.linkedin.com/messaging/';
    } else if (profileUrl.includes('reddit.com')) {
      const match = profileUrl.match(/reddit\.com\/user\/([^\/\?#]+)/);
      if (match && match[1]) {
        dmUrl = `https://www.reddit.com/message/compose/?to=${match[1]}`;
      } else {
        dmUrl = 'https://www.reddit.com/message/';
      }
    }
    if (dmUrl) {
      btnOpenDm.style.display = 'inline-flex';
      btnOpenDm.href = dmUrl;
    } else {
      btnOpenDm.style.display = 'none';
    }
  }

  // AI Drafts
  const repliesContainer = document.getElementById('drawer-replies-container');
  const generateBtn = document.getElementById('btn-generate-ondemand');

  if (!target.replies) {
    if (repliesContainer) repliesContainer.style.display = 'none';
    if (generateBtn) {
      generateBtn.style.display = 'block';
      generateBtn.onclick = () => generateOutreachOnDemand(target);
    }
  } else {
    if (repliesContainer) repliesContainer.style.display = 'block';
    if (generateBtn) generateBtn.style.display = 'none';

    const r = target.replies;
    if (shortOpenerEl) shortOpenerEl.textContent = r.ShortOpener || r.Professional || r.Option1 || "No DM opener draft generated.";
    if (linkedinRequestEl) linkedinRequestEl.textContent = r.LinkedInRequest || r.Humor || r.Option2 || "No connection note draft generated.";
  }

  // Update Signal Trail timeline UI
  updateSignalTrailUI(target);

  // Ensure main dashboard displays
  if (emptyStateEl) emptyStateEl.style.display = 'none';
  if (mainDashboardEl) mainDashboardEl.style.display = 'flex';
}

// Helper to calculate SVG circular progress stroke offset
function updateScoreRing(score) {
  const scoreRing = document.getElementById('score-ring');
  const statusEl = document.getElementById('score-status');
  if (!scoreRing) return;

  const radius = scoreRing.r.baseVal.value;
  const circumference = 2 * Math.PI * radius; // 2 * 3.14159 * 38 = 238.76
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;
  
  scoreRing.style.strokeDasharray = `${circumference} ${circumference}`;
  scoreRing.style.strokeDashoffset = offset;

  // Set colors and status messages based on score
  if (score >= 80) {
    scoreRing.style.stroke = '#10B981'; // Emerald Success
    if (statusEl) statusEl.textContent = '🔥 High Buying Intent';
  } else if (score >= 50) {
    scoreRing.style.stroke = '#F59E0B'; // Orange Warning
    if (statusEl) statusEl.textContent = '⚡ Medium Buying Intent';
  } else {
    scoreRing.style.stroke = '#EF4444'; // Red Danger
    if (statusEl) statusEl.textContent = '⚠️ Low Buying Intent';
  }
}

// ═══════════ TARGET CAROUSEL / SELECTOR LIST ═══════════

function updateTargetsListUI() {
  if (!signalsCardEl || !signalsListEl) return;

  if (targets.length === 0) {
    signalsCardEl.style.display = 'none';
    if (mainDashboardEl) mainDashboardEl.style.display = 'none';
    if (emptyStateEl) {
      emptyStateEl.style.display = 'flex';
      const emptyTitle = document.getElementById('empty-title');
      const emptySub = document.getElementById('empty-subtitle');
      if (emptyTitle) emptyTitle.textContent = '🔍 Listening for signals...';
      if (emptySub) emptySub.textContent = 'AI intelligence engine ready. Scroll LinkedIn, X (Twitter), or Reddit community feeds to analyze leads.';
    }
    return;
  }

  // Show active targets card
  signalsCardEl.style.display = 'flex';
  
  if (statsCounterEl) {
    statsCounterEl.textContent = `Targets: ${targets.length}`;
  }

  signalsListEl.innerHTML = '';
  targets.forEach(t => {
    const badge = document.createElement('div');
    badge.className = `signal-badge${currentSelectedTarget && currentSelectedTarget.id === t.id ? ' active' : ''}`;
    badge.setAttribute('data-target-id', t.id);
    
    // Choose correct platform icon
    let platIconHTML = '<i class="fas fa-user platform-icon"></i>';
    if (t.category === 'COMMERCIAL_LEAD') {
      platIconHTML = '<i class="fab fa-linkedin platform-icon" style="color:#0a66c2"></i>';
    } else if (t.category === 'INDUSTRY_NEWS') {
      platIconHTML = '<i class="fab fa-twitter platform-icon" style="color:#1da1f2"></i>';
    } else if (t.category === 'CASUAL_POST') {
      platIconHTML = '<i class="fab fa-reddit-alien platform-icon" style="color:#ff4500"></i>';
    } else if (t.id.toString().includes('linkedin')) {
      platIconHTML = '<i class="fab fa-linkedin platform-icon" style="color:#0a66c2"></i>';
    } else if (t.id.toString().includes('twitter') || t.id.toString().includes('x.com')) {
      platIconHTML = '<i class="fab fa-twitter platform-icon" style="color:#1da1f2"></i>';
    } else if (t.id.toString().includes('reddit')) {
      platIconHTML = '<i class="fab fa-reddit-alien platform-icon" style="color:#ff4500"></i>';
    }

    const nameText = t.name || 'Target Lead';
    const scoreColorClass = t.score >= 80 ? 'score-high' : (t.score >= 50 ? 'score-med' : 'score-low');
    
    const isDmed = t.status === 'dmed';
    if (isDmed) {
      badge.style.opacity = '0.6';
    } else {
      badge.style.opacity = '1';
    }

    badge.innerHTML = `
      ${platIconHTML}
      <span class="badge-name" style="${isDmed ? 'text-decoration: line-through;' : ''}">${nameText}</span>
      <span class="badge-score ${scoreColorClass}">${t.score}</span>
      ${isDmed ? '<i class="fas fa-check-circle" style="color:#10B981; font-size: 11px; margin-left: 2px;"></i>' : ''}
    `;

    badge.onclick = (e) => {
      e.stopPropagation();
      selectTarget(t);
    };

    signalsListEl.appendChild(badge);
  });

  // If no target is selected, default to the first one
  if (!currentSelectedTarget && targets.length > 0) {
    selectTarget(targets[0]);
  }
}

function getTargetPlatformLabel(target) {
  if (target.id.toString().includes('linkedin')) return 'LinkedIn';
  if (target.id.toString().includes('twitter') || target.id.toString().includes('x.com') || target.category === 'INDUSTRY_NEWS') return 'X (Twitter)';
  if (target.id.toString().includes('reddit') || target.category === 'CASUAL_POST') return 'Reddit';
  return 'Community Feed';
}

// ═══════════ SIGNAL TRAIL & SNAPSHOT HELPERS ═══════════

function updateSignalTrailUI(target) {
  if (!signalTrailListEl) return;
  signalTrailListEl.innerHTML = '';
  
  const history = target.history || [];
  if (history.length === 0) {
    signalTrailListEl.innerHTML = '<div style="font-size: 10px; color: #94A3B8; text-align: center; padding: 10px 0;">No prior signals tracked.</div>';
    return;
  }
  
  // Sort history by timestamp descending
  const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  sortedHistory.forEach(item => {
    const timeStr = new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const scoreColorClass = item.score >= 80 ? 'score-high' : (item.score >= 50 ? 'score-med' : 'score-low');
    
    const div = document.createElement('div');
    div.className = 'timeline-item';
    div.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <div class="timeline-header">
          <span class="timeline-time">${timeStr}</span>
          <span class="timeline-score ${scoreColorClass}">${item.score}</span>
        </div>
        <div class="timeline-body">${escapeHtml(item.postText || item.reason || '')}</div>
      </div>
    `;
    signalTrailListEl.appendChild(div);
  });
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function copyShareableSnapshot(target) {
  if (!target) return;
  
  // Desensitize: hide real name, use generic title
  const profile = target.profile || {};
  const company = profile.company || "Stealth Startup";
  const bio = profile.bio || "Founder / Builder";
  
  let title = "B2B Prospect";
  if (bio && bio !== 'Pending target acquisition.' && bio !== 'High Net-Worth Individual / Decision Maker.') {
    title = bio.split(' ').slice(0, 4).join(' ');
  }
  
  const postExcerpt = target.postText ? (target.postText.length > 120 ? target.postText.substring(0, 120) + "..." : target.postText) : "";
  
  const text = `🔥 [Lead Snapper Signal Captured]
🎯 Intent Score: ${target.score}% | Category: ${target.category || 'COMMERCIAL_LEAD'}
👤 Role: ${title} @ ${company}
📌 Pain Point: ${target.reason || 'High buying intent detected.'}
💬 Post: "${postExcerpt}"

---
I found these with Lead Snapper. It watches Twitter/LinkedIn while I code.`;

  safeCopyToClipboard(text).then(ok => {
    if (ok) {
      showToast('✓ Shareable Snapshot copied!');
    } else {
      showToast('⚠️ Copy failed');
    }
  });
}

// ═══════════ DIRECT SNIPE & WEBHOOK ACTIONS ═══════════

if (directSnipeBtn) {
  directSnipeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!currentSelectedTarget) {
      showToast('⚠️ No target selected');
      return;
    }

    const origText = directSnipeBtn.innerHTML;
    directSnipeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Executing...';
    directSnipeBtn.disabled = true;

    const profEl = document.getElementById('reply-short-opener');
    const replyText = profEl ? profEl.textContent : '';

    safeCopyToClipboard(replyText).then(ok => {
      executeReplyRPA(replyText);
      setTimeout(() => {
        if (ok && replyText) {
          directSnipeBtn.innerHTML = '<i class="fas fa-check"></i> Snap Executed';
          directSnipeBtn.style.background = '#10B981';
          directSnipeBtn.style.color = '#FFFFFF';
          showToast('✓ Snap copied & auto-populated!');
        } else {
          directSnipeBtn.innerHTML = '⚠️ Snap Failed';
          directSnipeBtn.style.background = '#EF4444';
          directSnipeBtn.style.color = '#FFFFFF';
        }
        setTimeout(() => {
          directSnipeBtn.innerHTML = origText;
          directSnipeBtn.style.background = '';
          directSnipeBtn.style.color = '';
          directSnipeBtn.disabled = false;
        }, 2000);
      }, 800);
    });
  });
}

if (syncWebhookBtn) {
  syncWebhookBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!currentSelectedTarget) {
      showToast('⚠️ No target selected');
      return;
    }

    const origText = syncWebhookBtn.innerHTML;
    syncWebhookBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing...';
    syncWebhookBtn.disabled = true;

    // Pull real webhook config from background
    chrome.runtime.sendMessage({ type: 'GET_WEBHOOK_CONFIG' }, (config) => {
      const webhookUrl = config && config.webhook;

      if (webhookUrl) {
        const payload = {
          source: 'LeadSnapper_V3_Radar',
          timestamp: new Date().toISOString(),
          target_name: currentSelectedTarget.name || 'Target',
          intent_score: currentSelectedTarget.score,
          category: currentSelectedTarget.category,
          analysis_reason: currentSelectedTarget.reason,
          profile_data: currentSelectedTarget.profile,
          outreach_drafts: currentSelectedTarget.replies
        };

        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).then(res => {
          if (res.ok) {
            syncWebhookBtn.innerHTML = '<i class="fas fa-check"></i> Synced ✓';
            syncWebhookBtn.style.borderColor = '#10B981';
            syncWebhookBtn.style.color = '#10B981';
            showToast('✓ Synced to CRM!');
          } else {
            syncWebhookBtn.innerHTML = '⚠️ Webhook Error';
            syncWebhookBtn.style.borderColor = '#F59E0B';
            syncWebhookBtn.style.color = '#F59E0B';
            showToast(`⚠️ Sync failed: ${res.status}`);
          }
        }).catch(err => {
          syncWebhookBtn.innerHTML = '❌ Sync Failed';
          syncWebhookBtn.style.borderColor = '#EF4444';
          syncWebhookBtn.style.color = '#EF4444';
          showToast(`❌ Webhook error: ${err.message}`);
        }).finally(() => {
          setTimeout(() => {
            syncWebhookBtn.innerHTML = origText;
            syncWebhookBtn.style.borderColor = '';
            syncWebhookBtn.style.color = '';
            syncWebhookBtn.disabled = false;
          }, 2000);
        });
      } else {
        setTimeout(() => {
          syncWebhookBtn.innerHTML = '⚠️ No Webhook';
          syncWebhookBtn.style.borderColor = '#F59E0B';
          syncWebhookBtn.style.color = '#F59E0B';
          showToast('⚠️ Webhook URL not set in popup settings');
          setTimeout(() => {
            syncWebhookBtn.innerHTML = origText;
            syncWebhookBtn.style.borderColor = '';
            syncWebhookBtn.style.color = '';
            syncWebhookBtn.disabled = false;
          }, 2000);
        }, 500);
      }
    });
  });
}

if (btnShareSnapshot) {
  btnShareSnapshot.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!currentSelectedTarget) {
      showToast('⚠️ No target selected');
      return;
    }
    copyShareableSnapshot(currentSelectedTarget);
  });
}

// ═══════════ DRAFTS COPY CLICK EVENT DELEGATION ═══════════

document.addEventListener('click', (e) => {
  const card = e.target.closest('.reply-card[data-copy-target]');
  if (!card) return;
  e.stopPropagation();

  const targetId = card.getAttribute('data-copy-target');
  const textEl = document.getElementById(targetId);
  if (!textEl) return;

  const text = textEl.textContent || textEl.innerText;
  if (!text || text.includes('Awaiting strategic target analysis')) return;

  safeCopyToClipboard(text).then(ok => {
    executeReplyRPA(text);
    
    // Copy feedback inside card
    const btn = card.querySelector('.btn-copy-mini');
    const tip = card.querySelector('.copy-tip');
    const originalBtnHTML = btn ? btn.innerHTML : '';
    
    if (btn) {
      btn.innerHTML = ok ? '<i class="fas fa-check"></i> Copied' : '<i class="fas fa-exclamation-triangle"></i> Failed';
      btn.style.color = ok ? '#10B981' : '#EF4444';
    }
    if (tip) {
      tip.textContent = ok ? '✓ Copied to clipboard & draft populated!' : '⚠️ Failed to copy';
    }
    
    const prevBorder = card.style.borderColor;
    const prevBg = card.style.background;
    card.style.borderColor = ok ? '#10B981' : '#EF4444';
    card.style.background = ok ? '#F0FDF4' : '#FEF2F2';
    
    setTimeout(() => {
      if (btn) {
        btn.innerHTML = originalBtnHTML;
        btn.style.color = '';
      }
      if (tip) {
        tip.textContent = 'Click to copy & auto-fill';
      }
      card.style.borderColor = prevBorder;
      card.style.background = prevBg;
    }, 1500);
  });
});

// ═══════════ UNIVERSAL COMMAND LINE (CLI) ═══════════

if (cliSubmit) {
  cliSubmit.addEventListener('click', async () => {
    const command = cliInput.value.trim();
    if (!command) return;

    cliInput.disabled = true;
    cliSubmit.disabled = true;
    const origSubmitText = cliSubmit.innerHTML;
    cliSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scan...';
    if (universalCli) universalCli.classList.add('processing');
    
    showToast('Executing agent CLI command...');

    try {
      // 1. Get Active Tab
      const tabs = await new Promise(res => chrome.tabs.query({active: true, currentWindow: true}, res));
      if (!tabs || tabs.length === 0 || !tabs[0].id) {
        throw new Error("No active browser tab detected.");
      }

      // 2. Inject Page Context Extractor Script
      const injection = await new Promise((res, rej) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: extractUniversalContext
        }, (results) => {
          if (chrome.runtime.lastError) rej(chrome.runtime.lastError);
          else res(results);
        });
      });

      const extractedData = injection[0].result;
      if (!extractedData || !extractedData.text) throw new Error("No readable text found on page.");
      
      cliSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyze...';

      // 3. Dispatch to Background AI Processor
      chrome.runtime.sendMessage({
        type: 'UNIVERSAL_COMMAND',
        command: command,
        pageText: extractedData.text,
        elements: extractedData.interactiveElements
      }, (response) => {
        if (response && response.error) {
          showToast(`❌ AI error: ${response.error}`);
        } else if (response) {
          showToast(`✓ Universal Command executed!`);
          displayUniversalResult(command, response, extractedData, tabs[0].id);
        } else {
          showToast(`❌ Unknown response error.`);
        }
        
        // Reset CLI input state
        cliInput.disabled = false;
        cliSubmit.disabled = false;
        cliSubmit.innerHTML = origSubmitText;
        if (universalCli) universalCli.classList.remove('processing');
        cliInput.value = '';
      });

    } catch(e) {
      showToast(`❌ Error: ${e.message}`);
      cliInput.disabled = false;
      cliSubmit.disabled = false;
      cliSubmit.innerHTML = origSubmitText;
      if (universalCli) universalCli.classList.remove('processing');
    }
  });

  cliInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') cliSubmit.click();
  });
}

function displayUniversalResult(command, aiData, domData, activeTabId) {
  // Create a synthetic target for command output display
  const mockTarget = {
    id: aiData.Target_ID || ('universal-' + Date.now()),
    tabId: activeTabId,
    score: 99,
    name: "CLI AGENT RESULT",
    reason: aiData.Analysis || "Executed custom command on page contents.",
    category: "UNIVERSAL_AGENT",
    profile: {
      company: "Command: " + (command.length > 22 ? command.substring(0,22)+'...' : command),
      bio: "Context: Generic Web Page Content"
    },
    replies: aiData.Draft_Replies || {}
  };
  
  if (aiData.Target_ID) {
    scrollToTarget(aiData.Target_ID, mockTarget.tabId);
  }

  // Push to targets lists memory
  spawnTarget(mockTarget.id, mockTarget.score, mockTarget.name, mockTarget.reason, mockTarget.category, mockTarget.profile, mockTarget.replies, mockTarget.tabId);
}

// ═══════════ SERIALIZED PAGE CONTEXT EXTRACTOR ═══════════
function extractUniversalContext() {
  const elements = document.querySelectorAll('p, h1, h2, h3, article, section, [role="article"], button, a, input, textarea');
  let distilled = [];
  let textContext = document.body.innerText.substring(0, 3000);
  
  let idCounter = 0;
  elements.forEach(el => {
    if (['A','BUTTON','INPUT','TEXTAREA'].includes(el.tagName) || el.getAttribute('role') === 'button') {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const id = 'hy-univ-' + (++idCounter);
        el.setAttribute('data-ls-id', id);
        distilled.push({
          id: id,
          tag: el.tagName,
          text: (el.innerText || el.value || '').substring(0, 100).replace(/\s+/g, ' '),
          ariaLabel: el.getAttribute('aria-label') || ''
        });
      }
    }
  });
  
  return {
    text: textContext,
    interactiveElements: distilled
  };
}

// ═══════════ OTHER HELPER UTILITIES ═══════════

function generateOutreachOnDemand(target) {
  const btn = document.getElementById('btn-generate-ondemand');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
  }
  
  chrome.runtime.sendMessage({ type: 'ENRICH_ON_DEMAND', targetId: target.id }, (response) => {
    if (chrome.runtime.lastError) {
      showToast('❌ Background script offline.');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '⚡ ANALYZE & GENERATE OUTREACH';
      }
      return;
    }
    
    if (response && response.error) {
      showToast(`❌ Generation failed: ${response.error}`);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '⚡ ANALYZE & GENERATE OUTREACH';
      }
      return;
    }

    if (response && response.success && response.target) {
      showToast('✓ AI outreach generated!');
      // Update local storage targets
      const index = targets.findIndex(t => t.id === response.target.id);
      if (index !== -1) {
        targets[index] = response.target;
      }
      
      if (currentSelectedTarget && currentSelectedTarget.id === response.target.id) {
        selectTarget(response.target);
      }
      updateTargetsListUI();
    }
  });
}

function executeReplyRPA(replyText) {
  if (!currentSelectedTarget) return;
  
  const tabId = currentSelectedTarget.tabId;
  const id = currentSelectedTarget.id;
  
  if (!tabId) return;
  
  chrome.tabs.sendMessage(tabId, {
    type: 'EXECUTE_RPA_REPLY',
    id: id,
    text: replyText
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.warn(`[RPA] message failed: ${chrome.runtime.lastError.message}`);
      return;
    }
  });
}

function simulateSelfHealingCheck() {
  if (targets.length === 0 || !statsEl) return;
  
  const origText = statsEl.textContent;
  statsEl.textContent = "⚠️ SHIELD SHIFT :: RE-CALIBRATING...";
  statsEl.style.color = "#F59E0B";
  
  setTimeout(() => {
    statsEl.textContent = "✅ SHIELD SHIFT AUTO-CORRECTED";
    statsEl.style.color = "#10B981";
    
    setTimeout(() => {
      statsEl.textContent = `Targets Active: ${targets.length} | Tier: Studio Professional`;
      statsEl.style.color = '';
    }, 2500);
  }, 1000);
}

function scrollToTarget(id, tabId = null) {
  if (!id) return;
  
  if (id.toString().startsWith('demo-')) {
    return; // No real tab context for demo mocks
  }

  const payload = { type: 'SCROLL_TO_POST', id: id };

  try {
    if (tabId) {
      chrome.tabs.sendMessage(tabId, payload, (res) => {
        if (chrome.runtime.lastError) {
           chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
             if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, payload, () => {});
           });
        }
      });
    } else {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, payload, () => {});
      });
    }
  } catch(e) {
    console.warn('[Radar] scrollToTarget failed:', e);
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerHTML = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// Robust clipboard copy with fallback
async function safeCopyToClipboard(text) {
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch(e) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch(e2) {
      console.warn('[Radar] Copy failed:', e2);
      return false;
    }
  }
}

// ═══════════ TARGET SPAWNING PIPELINE ═══════════

let autoSnipeCount = 0;

function spawnTarget(id, score, name, reason, category, profile=null, replies=null, tabId=null, autoCaptured=false, status=null) {
  // Prevent duplicates
  if (targets.find(t => t.id === id)) return;
  
  const newTarget = { id, score, name: name || 'Target Lead', reason, category, profile, replies, tabId, autoCaptured, status };
  targets.push(newTarget);
  
  updateTargetsListUI();

  // If autoCaptured, update the Capture Queue
  if (autoCaptured) {
    const queueContainer = document.getElementById('snipe-queue-container');
    const queueList = document.getElementById('snipe-queue-list');
    const queueCount = document.getElementById('snipe-queue-count');
    
    if (queueContainer && queueList && queueCount) {
      queueContainer.style.display = 'block';
      autoSnipeCount++;
      queueCount.textContent = autoSnipeCount;
      
      const item = document.createElement('div');
      item.style.cssText = `
        background: #FFFFFF; border: 1px solid #FECDD3; border-radius: 8px; padding: 6px 10px;
        display: flex; justify-content: space-between; align-items: center;
        font-size: 10px; font-weight: 600; color: #881337;
        box-shadow: 0 1px 2px rgba(225,29,72,0.1); cursor: pointer; transition: all 0.2s;
      `;
      item.innerHTML = `
        <span><i class="fas fa-external-link-alt" style="margin-right: 4px;"></i> ${newTarget.name.substring(0, 15)}...</span>
        <span style="background: #FFF1F2; color: #E11D48; padding: 1px 6px; border-radius: 4px; font-weight: 800;">${score}</span>
      `;
      item.onclick = () => { selectTarget(newTarget); };
      
      queueList.insertBefore(item, queueList.firstChild);
    }
  }

  // If this target is high intent (>= 80) and we haven't selected anything yet, select it!
  if (score >= 80 && (!currentSelectedTarget || currentSelectedTarget.id.toString().startsWith('demo-'))) {
    selectTarget(newTarget);
  }
}

// ═══════════ CHROME MESSAGE PIPELINE ═══════════

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'SYNC_3D_RADAR') {
    const p = msg.payload || {};
    // If a demo target is active, clear targets to receive first real target
    if (targets.length === 1 && targets[0].id === 'demo-1') {
      targets = [];
      currentSelectedTarget = null;
    }
    spawnTarget(p.id || Date.now(), p.score, p.name || 'Target', p.reason, p.category, p.profile, p.replies, p.tabId, p.autoCaptured, p.status);
  }
  
  if (msg.type === 'SELECT_TARGET_IN_PANEL') {
    const target = targets.find(t => t.id === msg.id);
    if (target) {
      selectTarget(target);
    }
  }
});

// Stored targets reloading (fetches cached targets on sidepanel load)
function loadStoredTargets() {
  try {
    chrome.runtime.sendMessage({ type: 'GET_RADAR_TARGETS' }, (response) => {
      if (chrome.runtime.lastError) {
        console.warn('[Radar] Stored targets reload error:', chrome.runtime.lastError.message);
        return;
      }
      if (response && response.targets && response.targets.length > 0) {
        console.log(`[Radar] Restoring ${response.targets.length} targets...`);
        response.targets.forEach(p => {
          spawnTarget(p.id || Date.now(), p.score, p.name || 'Target', p.reason, p.category, p.profile, p.replies, p.tabId, p.autoCaptured, p.status);
        });
      }
    });
  } catch(e) {
    console.warn('[Radar] Failed to load stored targets:', e);
  }
}

// ═══════════ STATUS MARKER ACTIONS ═══════════

if (btnStatusDmed) {
  btnStatusDmed.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!currentSelectedTarget) return;

    const newStatus = currentSelectedTarget.status === 'dmed' ? null : 'dmed';
    currentSelectedTarget.status = newStatus;

    chrome.runtime.sendMessage({
      type: 'UPDATE_TARGET_STATUS',
      targetId: currentSelectedTarget.id,
      status: newStatus
    }, (res) => {
      selectTarget(currentSelectedTarget);
      updateTargetsListUI();
      if (newStatus === 'dmed') {
        showToast('✓ Marked as DM\'ed');
      } else {
        showToast('Status Reset');
      }
    });
  });
}

if (btnStatusArchive) {
  btnStatusArchive.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!currentSelectedTarget) return;

    const targetId = currentSelectedTarget.id;
    chrome.runtime.sendMessage({
      type: 'UPDATE_TARGET_STATUS',
      targetId: targetId,
      status: 'archived'
    }, (res) => {
      // Remove from local array
      const idx = targets.findIndex(t => t.id === targetId);
      if (idx !== -1) {
        targets.splice(idx, 1);
      }
      
      showToast('✓ Lead Archived & Removed');
      
      // Select next target
      if (targets.length > 0) {
        selectTarget(targets[0]);
      } else {
        currentSelectedTarget = null;
        if (mainDashboardEl) mainDashboardEl.style.display = 'none';
        if (emptyStateEl) emptyStateEl.style.display = 'flex';
        if (signalsCardEl) signalsCardEl.style.display = 'none';
      }
      updateTargetsListUI();
    });
  });
}

// ═══════════ SYSTEM STARTUP ═══════════

init();
loadStoredTargets();

// Spawn a premium demo target on idle if no targets are detected within 1.5 seconds
setTimeout(() => {
  if (targets.length === 0) {
    spawnTarget(
      "demo-1", 
      92, 
      "Silicon Valley AI Founder", 
      "Experiencing high API friction and conversion degradation. Ready to deploy custom scalable automation.",
      "COMMERCIAL_LEAD",
      { company: "NextGen AI Infrastructures", bio: "Serial founder. Backed by top VCs. Building high-throughput SaaS tools." },
      {
        Professional: "Saw your post regarding scale limitations. We specialize in zero-latency infrastructure overlays that bypass standard pipeline bottlenecks. Let's align.",
        Humor: "Nothing like watching standard selector engines break on React re-renders. If you're ready for an AI agent that doesn't trigger cloud alerts, check our stealth stack.",
        Director: "Every scalable system is just a well-directed sequence of state changes. Let's rewrite the script on your acquisition flow—no backstage setup required."
      }
    );
  }
}, 1500);
