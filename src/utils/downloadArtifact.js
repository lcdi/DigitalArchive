/**
 * Utility function to download an artifact file
 * @param {Object} artifact - The artifact object to download
 */
export const downloadArtifact = async (artifact) => {
    try {
        // Extract file extension from fileType (e.g., "image/png" -> "png")
        const extension = artifact.fileType.split('/')[1];

        // Sanitize the title to create a valid filename
        const sanitizedTitle = artifact.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
            .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens

        const filename = `${sanitizedTitle}.${extension}`;

        // Fetch the image as a blob
        const response = await fetch(artifact.image);
        const blob = await response.blob();

        // Create a temporary download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return true;
    } catch (error) {
        console.error('Error downloading artifact:', error);
        alert('Failed to download artifact. Please try again.');
        return false;
    }
};