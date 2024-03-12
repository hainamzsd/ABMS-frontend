export function generateRandomGUID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 36; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    // Add dashes for typical GUID format (optional)
    return result.slice(0, 8) + '-' + result.slice(8, 12) + '-' + result.slice(12, 16) + '-' + result.slice(16, 20) + '-' + result.slice(20);
  }