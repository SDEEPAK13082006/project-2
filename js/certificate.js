/* ==========================================================================
   ROMANTIC CERTIFICATE CANVAS GENERATOR & DOWNLOADER
   ========================================================================== */

class LoveCertificateGenerator {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1200;
    this.canvas.height = 850;
    this.ctx = this.canvas.getContext('2d');
  }

  generateCertificate(nickname, score, totalQuestions, tierMessage) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 1. Background Fill
    const bgGradient = ctx.createLinearGradient(0, 0, w, h);
    bgGradient.addColorStop(0, '#fff0f5');
    bgGradient.addColorStop(0.5, '#fffafb');
    bgGradient.addColorStop(1, '#fce4ec');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, w, h);

    // 2. Decorative Double Outer Border
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#b76e79';
    ctx.strokeRect(30, 30, w - 60, h - 60);

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#d4af37';
    ctx.strokeRect(45, 45, w - 90, h - 90);

    // Corner Ornaments
    this.drawCornerFlourish(60, 60, 0);
    this.drawCornerFlourish(w - 60, 60, Math.PI / 2);
    this.drawCornerFlourish(w - 60, h - 60, Math.PI);
    this.drawCornerFlourish(60, h - 60, (Math.PI * 3) / 2);

    // 3. Header Text
    ctx.textAlign = 'center';
    ctx.fillStyle = '#b76e79';
    ctx.font = 'bold 24px "Playfair Display", serif';
    ctx.fillText('OFFICIAL DIPLOMA OF ROMANCE', w / 2, 120);

    ctx.fillStyle = '#ff4081';
    ctx.font = 'bold 52px "Playfair Display", serif';
    ctx.fillText('Certificate of Endless Love ❤️', w / 2, 190);

    // Divider Line
    ctx.beginPath();
    ctx.moveTo(w / 2 - 200, 220);
    ctx.lineTo(w / 2 + 200, 220);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 4. Recipient Name
    ctx.fillStyle = '#7c5269';
    ctx.font = 'italic 26px "Outfit", sans-serif';
    ctx.fillText('This certificate is proudly awarded to:', w / 2, 280);

    ctx.fillStyle = '#d81b60';
    ctx.font = 'bold 64px "Dancing Script", cursive';
    ctx.fillText(nickname || 'My Sweetheart', w / 2, 360);

    // 5. Achievement Details
    ctx.fillStyle = '#4a2c3d';
    ctx.font = '24px "Outfit", sans-serif';
    ctx.fillText(`For knowing my heart and completing Our Love Quiz with a score of:`, w / 2, 430);

    // Big Score Badge
    ctx.fillStyle = '#ff4081';
    ctx.font = 'bold 58px "Playfair Display", serif';
    ctx.fillText(`${score} / ${totalQuestions}`, w / 2, 510);

    // Tier Message
    ctx.fillStyle = '#7c5269';
    ctx.font = 'italic 26px "Outfit", sans-serif';
    ctx.fillText(`“${tierMessage}”`, w / 2, 570);

    // 6. Wax Seal & Signature Line
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Date
    ctx.fillStyle = '#4a2c3d';
    ctx.font = '20px "Outfit", sans-serif';
    ctx.fillText(`Date: ${dateStr}`, 220, 690);
    ctx.beginPath();
    ctx.moveTo(140, 700);
    ctx.lineTo(300, 700);
    ctx.stroke();

    // Signature
    ctx.font = '28px "Dancing Script", cursive';
    ctx.fillStyle = '#ff4081';
    ctx.fillText('Forever Yours ❤️', w - 220, 680);
    ctx.beginPath();
    ctx.moveTo(w - 300, 700);
    ctx.lineTo(w - 140, 700);
    ctx.strokeStyle = '#4a2c3d';
    ctx.stroke();

    // Wax Seal Center
    this.drawWaxSeal(w / 2, 690);

    return this.canvas.toDataURL('image/png');
  }

  drawCornerFlourish(x, y, rotation) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(15, 15, 12, Math.PI, Math.PI * 1.5);
    ctx.lineTo(30, 0);
    ctx.stroke();

    ctx.restore();
  }

  drawWaxSeal(x, y) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);

    // Outer Scalloped Red Seal
    ctx.fillStyle = '#c62828';
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.fill();

    // Inner Gold Ring
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, Math.PI * 2);
    ctx.stroke();

    // Heart Emblem
    ctx.fillStyle = '#ffffff';
    ctx.font = '26px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('❤️', 0, -2);

    ctx.font = 'bold 9px "Outfit", sans-serif';
    ctx.fillStyle = '#ffe0b2';
    ctx.fillText('SEAL OF TRUE LOVE', 0, 24);

    ctx.restore();
  }

  downloadCertificate(nickname, score, totalQuestions, tierMessage) {
    const dataUrl = this.generateCertificate(nickname, score, totalQuestions, tierMessage);
    const link = document.createElement('a');
    link.download = `Our_Love_Quiz_Certificate_${nickname.replace(/\s+/g, '_')}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

window.certificateGenerator = new LoveCertificateGenerator();
