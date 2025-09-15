// Simple toast utility
export const toast = {
  success: (message: string) => {
    console.log('✅ Success:', message);
    // In a real implementation, this would show a toast notification
    // For now, we'll use browser alert as fallback
    alert(`✅ ${message}`);
  },
  error: (message: string) => {
    console.log('❌ Error:', message);
    alert(`❌ ${message}`);
  },
  info: (message: string) => {
    console.log('ℹ️ Info:', message);
    alert(`ℹ️ ${message}`);
  }
};