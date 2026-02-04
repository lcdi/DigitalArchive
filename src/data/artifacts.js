// Sample artifact data
export const artifacts = [
  {
    id: 1,
    title: "Sample Artifact",
    image: "/src/assets/artifacts/artifact.jpg",
    tags: ["animals", "citywork"],
    uploader: "John Doe",
    uploadDate: "2024-01-15",
    fileType: "image/jpeg",
    description: "A sample artifact for testing the archive system",
    dimensions: "1920x1080",
    fileSize: "2.4 MB"
  }
];

// Filter options
export const filterOptions = {
  tags: ["animals", "citywork", "historical", "architecture", "nature"],
  fileTypes: ["image/png", "image/jpeg", "application/pdf", "video/mp4"],
  uploaders: ["John Doe", "Jane Smith", "Archive Admin"]
};
