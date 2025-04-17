document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('download-form');
  const status = document.getElementById('status');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const downloadInfo = document.getElementById('download-info');

  // Connect to Socket.io
  const socket = io();

  // Listen for download progress updates
  socket.on('download-progress', (data) => {
    const { progress, info } = data;

    // Show status area if hidden
    status.classList.remove('hidden');

    // Update progress bar
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${progress.toFixed(1)}%`;

    // Update info text if provided
    if (info) {
      downloadInfo.innerHTML = `<p>${info}</p>`;
    }
  });

  // Listen for download completion
  socket.on('download-complete', (data) => {
    const { filename, filesize } = data;
    downloadInfo.innerHTML = `
          <p>Download complete!</p>
          <p>File: ${filename}</p>
          <p>Size: ${formatFileSize(filesize)}</p>
      `;
  });

  // Listen for errors
  socket.on('download-error', (error) => {
    status.classList.remove('hidden');
    downloadInfo.innerHTML = `<p class="error">Error: ${error}</p>`;
  });

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = document.getElementById('url').value.trim();

    // Reset UI
    status.classList.remove('hidden');
    progressBar.style.width = '0%';
    progressText.textContent = '0%';
    downloadInfo.innerHTML = '<p>Starting download...</p>';

    try {
      // Send the URL to your backend
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start download');
      }

    } catch (error) {
      downloadInfo.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
  });

  // Helper function to format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  }
});