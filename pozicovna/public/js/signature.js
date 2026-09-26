// Podpisové pole ovládané prstom / perom. Ťahy si pamätá, aby sa pri otočení
// telefónu (zmena veľkosti plátna) dali znova vykresliť.

export class SignaturePad {
  constructor(canvas, { color = '#13235b', onChange } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.color = color;
    this.onChange = onChange;
    this.strokes = [];
    this.current = null;

    canvas.style.touchAction = 'none';
    canvas.addEventListener('pointerdown', (e) => this.start(e));
    canvas.addEventListener('pointermove', (e) => this.move(e));
    for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) canvas.addEventListener(ev, () => this.end());

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width) return;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.canvas.width = Math.round(rect.width * ratio);
    this.canvas.height = Math.round(rect.height * ratio);
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.scale = rect.width;
    this.redraw();
  }

  // Body ukladáme relatívne k šírke, aby sa podpis pri zmene veľkosti nezdeformoval.
  point(e) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.width, p: e.pressure || 0.5 };
  }

  start(e) {
    e.preventDefault();
    this.canvas.setPointerCapture?.(e.pointerId);
    this.current = [this.point(e)];
    this.strokes.push(this.current);
    this.drawDot(this.current[0]);
  }

  move(e) {
    if (!this.current) return;
    e.preventDefault();
    const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of events.length ? events : [e]) {
      const pt = this.point(ev);
      const prev = this.current[this.current.length - 1];
      this.current.push(pt);
      this.drawSegment(this.current[this.current.length - 3] || prev, prev, pt);
    }
  }

  end() {
    if (!this.current) return;
    this.current = null;
    this.onChange?.(this);
  }

  width() {
    return Math.max(1.6, this.scale / 170);
  }

  drawDot(p) {
    const s = this.scale;
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(p.x * s, p.y * s, this.width() / 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawSegment(a, b, c) {
    const s = this.scale;
    const ctx = this.ctx;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    const m1 = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    const m2 = { x: (b.x + c.x) / 2, y: (b.y + c.y) / 2 };
    ctx.moveTo(m1.x * s, m1.y * s);
    ctx.quadraticCurveTo(b.x * s, b.y * s, m2.x * s, m2.y * s);
    ctx.stroke();
  }

  redraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const stroke of this.strokes) {
      this.drawDot(stroke[0]);
      for (let i = 1; i < stroke.length; i++) this.drawSegment(stroke[i - 2] || stroke[i - 1], stroke[i - 1], stroke[i]);
    }
  }

  clear() {
    this.strokes = [];
    this.redraw();
    this.onChange?.(this);
  }

  // Za podpis považujeme aspoň trochu dlhší ťah, nie náhodné ťuknutie.
  isEmpty() {
    const points = this.strokes.reduce((n, s) => n + s.length, 0);
    return points < 8;
  }

  // PNG s priehľadným pozadím, orezaný na podpis, v pevnom rozlíšení pre PDF.
  toDataURL() {
    const all = this.strokes.flat();
    if (!all.length) return '';
    const pad = 0.02;
    const minX = Math.max(0, Math.min(...all.map((p) => p.x)) - pad);
    const minY = Math.max(0, Math.min(...all.map((p) => p.y)) - pad);
    const maxX = Math.max(...all.map((p) => p.x)) + pad;
    const maxY = Math.max(...all.map((p) => p.y)) + pad;
    const k = 900; // px na šírku plátna
    const out = document.createElement('canvas');
    out.width = Math.max(1, Math.round((maxX - minX) * k));
    out.height = Math.max(1, Math.round((maxY - minY) * k));
    const ctx = out.getContext('2d');
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineWidth = Math.max(2.5, k / 170);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const X = (p) => (p.x - minX) * k;
    const Y = (p) => (p.y - minY) * k;
    for (const stroke of this.strokes) {
      ctx.beginPath();
      ctx.arc(X(stroke[0]), Y(stroke[0]), ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(X(stroke[0]), Y(stroke[0]));
      for (let i = 1; i < stroke.length; i++) {
        const b = stroke[i - 1];
        const c = stroke[i];
        ctx.quadraticCurveTo(X(b), Y(b), (X(b) + X(c)) / 2, (Y(b) + Y(c)) / 2);
      }
      ctx.stroke();
    }
    return out.toDataURL('image/png');
  }

  destroy() {
    this.resizeObserver.disconnect();
  }
}
