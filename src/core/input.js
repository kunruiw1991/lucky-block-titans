// Unified 1-tap touch/mouse + smooth 1-finger yaw drag + laptop WASD/Space input (owner: lucky-director).

export function createInputController(canvas, { onTapCanvas, onDragYaw, onActionKey, onUnlockAudio } = {}) {
  const keys = new Set();
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let dragging = false;
  let holdTimer = null;
  let holdDispatched = false;
  let lastTapAt = -1000;
  const TAP_MAX_MOVE_PX = 10;
  const HOLD_SMASH_MS = 320;
  const TAP_DEBOUNCE_MS = 10;

  const nowMs = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

  function clearHoldTimer() {
    if (holdTimer !== null) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
  }

  function toNdc(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    const ndcX = ((clientX - rect.left) / w) * 2 - 1;
    const ndcY = -(((clientY - rect.top) / h) * 2 - 1);
    return { ndcX, ndcY, clientX, clientY };
  }

  function handlePointerDown(e) {
    if (e.target !== canvas) return;
    if (e.button !== undefined && e.button !== 0) return;
    onUnlockAudio?.();
    clearHoldTimer();
    pointerId = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    lastX = e.clientX;
    lastY = e.clientY;
    dragging = false;
    holdDispatched = false;
    try {
      canvas.setPointerCapture?.(e.pointerId);
    } catch (_err) {
      // Synthetic CDP mouse events may not have an active pointerId.
    }
    holdTimer = setTimeout(() => {
      holdTimer = null;
      if (pointerId !== null && !dragging && !holdDispatched) {
        holdDispatched = true;
        lastTapAt = nowMs();
        onTapCanvas?.(toNdc(lastX, lastY));
      }
    }, HOLD_SMASH_MS);
  }

  function handlePointerMove(e) {
    if (pointerId === null || e.pointerId !== pointerId) return;
    const dxTotal = e.clientX - startX;
    const dyTotal = e.clientY - startY;
    if (!dragging && Math.hypot(dxTotal, dyTotal) >= TAP_MAX_MOVE_PX) {
      dragging = true;
      clearHoldTimer();
    }
    if (dragging) {
      const stepDx = e.clientX - lastX;
      onDragYaw?.(-stepDx * 0.0068);
    }
    lastX = e.clientX;
    lastY = e.clientY;
  }

  function handlePointerUp(e) {
    if (e.target !== canvas && pointerId === null) return;
    if (pointerId !== null && e.pointerId !== pointerId) return;
    onUnlockAudio?.();
    clearHoldTimer();
    const wasDragging = dragging;
    const wasHoldDispatched = holdDispatched;
    const totalMove = Math.hypot(e.clientX - startX, e.clientY - startY);
    pointerId = null;
    dragging = false;
    holdDispatched = false;

    // Stationary presses of ANY duration (< 10px movement) count as 1 clean tap!
    // If a slow/firm press (>= 320ms) already fired while held, skip duplicate on release.
    if (!wasDragging && !wasHoldDispatched && totalMove < TAP_MAX_MOVE_PX) {
      const t = nowMs();
      if (t - lastTapAt >= TAP_DEBOUNCE_MS) {
        lastTapAt = t;
        const coords = toNdc(e.clientX, e.clientY);
        onTapCanvas?.(coords);
      }
    }
  }

  function handlePointerCancel() {
    clearHoldTimer();
    pointerId = null;
    dragging = false;
    holdDispatched = false;
  }

  function handleKeyDown(e) {
    onUnlockAudio?.();
    const code = e.code || e.key;
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
      keys.add(code);
    } else if (code === 'Space') {
      if (!e.repeat) onActionKey?.();
    }
  }

  function handleKeyUp(e) {
    const code = e.code || e.key;
    keys.delete(code);
  }

  canvas.addEventListener('pointerdown', handlePointerDown);
  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', handlePointerUp);
  window.addEventListener('pointercancel', handlePointerCancel);
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  function getMoveAxes() {
    let forward = 0;
    let right = 0;
    if (keys.has('KeyW') || keys.has('ArrowUp')) forward += 1;
    if (keys.has('KeyS') || keys.has('ArrowDown')) forward -= 1;
    if (keys.has('KeyD') || keys.has('ArrowRight')) right += 1;
    if (keys.has('KeyA') || keys.has('ArrowLeft')) right -= 1;
    const len = Math.hypot(forward, right);
    if (len > 1) {
      forward /= len;
      right /= len;
    }
    return { forward, right, active: len > 0.01 };
  }

  function clearKeys() {
    keys.clear();
  }

  return { getMoveAxes, clearKeys };
}
