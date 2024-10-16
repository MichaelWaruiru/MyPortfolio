import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'; // To make HTTP requests

function Card() {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // State to check if user is admin
  const fileInputRef = useRef(null);

  // On component mount, check for admin access via URL query or localStorage
  useEffect(() => {
    const savedResumeUrl = localStorage.getItem('resumeFileUrl');
    const savedResumeName = localStorage.getItem('resumeFileName');
    if (savedResumeUrl && savedResumeName) {
      setResumeUrl(savedResumeUrl);
      setResumeFile({ name: savedResumeName });
    }

    // Check URL query parameters for ?admin=true
    const urlParams = new URLSearchParams(window.location.search);
    const isAdminParam = urlParams.get('admin');

    // If admin=true is in the URL or admin flag is set in localStorage
    if (isAdminParam === 'true') {
      setIsAdmin(true); // Grant admin access
      localStorage.setItem('isAdmin', 'true'); // Persist admin access in local storage
    } else if (localStorage.getItem('isAdmin') === 'true') {
      setIsAdmin(true); // Restore admin access from local storage if previously granted
    }
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const maxFileSize = 5 * 1024 * 1024;

    if (file) {
      if (file.size > maxFileSize) {
        setErrorMessage('File size exceeds 5MB. Please upload a smaller file.');
        setResumeFile(null);
        setResumeUrl(null);
        return;
      }

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'do3ltyvk'); // Replace with your Cloudinary's upload preset
        formData.append('resource_type', 'raw'); // Ensure resource type is 'raw' for non-image files

        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dlcl4anlt/raw/upload', 
          formData
        );

        const fileUrl = response.data.secure_url;
        setResumeFile(file);
        setResumeUrl(fileUrl);
        setErrorMessage('');

        // Store file URL and name in local storage
        localStorage.setItem('resumeFileUrl', fileUrl);
        localStorage.setItem('resumeFileName', file.name);

      } catch (error) {
        console.error('Upload error:', error.response ? error.response.data : error.message);
        setErrorMessage('Failed to upload file. Please try again.');
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  // Handle file deletion
  const handleDeleteResume = () => {
    setResumeFile(null);
    setResumeUrl(null);
    setErrorMessage('');

    // Remove file URL and name from local storage
    localStorage.removeItem('resumeFileUrl');
    localStorage.removeItem('resumeFileName');
  };

  return (
    <>
      <h1 className="portfolio-heading">My Portfolio</h1>
      <hr />
      <div className='card-container'>
        <div className='card'>
          <img className='profile-pic' src="/src/assets/profile.jpg" alt="Profile Picture" />
          <h2 className='card-title'>Michael Waruiru</h2>
          <p className='card-text'>Backend Developer</p>
        </div>

        <div className='description-container'>
          <p className='description'>
            I am a backend developer with mastery in Go/Golang, Python (Django framework and Flask microframework)
          </p>

          {/* Only show the upload section if user is admin */}
          {isAdmin && (
            <div className='upload-section'>
              <label htmlFor="resume-upload">Upload Resume:</label>
              <input
                ref={fileInputRef}
                type="file"
                id="resume-upload"
                accept=".pdf, .doc, .docx"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {isUploading && <p>Uploading...</p>}
              {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
            </div>
          )}

          {/* Display resume download link for all users */}
          {resumeUrl && (
            <div className='resume-link'>
              <p>Resume uploaded: {resumeFile?.name || localStorage.getItem('resumeFileName')}</p>
              <a
                href={resumeUrl}
                download={resumeFile?.name || localStorage.getItem('resumeFileName')}
                target='_blank'
                rel='noopener noreferrer'
              >
                Download Resume
              </a>
              {isAdmin && (
                <>
                  <br />
                  <br />
                  <button onClick={handleDeleteResume} className='delete-btn'>Delete Resume</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="social-links">
        <a href="https://github.com/MichaelWaruiru" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="hsl(200, 100%, 40%)" viewBox="0 0 24 24" width="40" height="40">
            <path d="M12 .3c-6.627 0-12 5.373-12 12 0 5.304 3.438 9.8 8.205 11.388.6.111.82-.26.82-.577 0-.284-.01-1.233-.014-2.241-3.338.726-4.048-1.607-4.048-1.607-.546-1.384-1.333-1.754-1.333-1.754-1.089-.743.083-.728.083-.728 1.205.085 1.837 1.237 1.837 1.237 1.07 1.834 2.807 1.302 3.492.996.109-.774.42-1.302.764-1.6-2.665-.303-5.467-1.333-5.467-5.93 0-1.311.467-2.384 1.236-3.22-.124-.303-.536-1.53.117-3.182 0 0 1.008-.322 3.303 1.227.958-.266 1.988-.399 3.004-.403 1.016.004 2.046.137 3.004.403 2.295-1.549 3.303-1.227 3.303-1.227.653 1.652.242 2.879.118 3.182.77.836 1.236 1.909 1.236 3.22 0 4.61-2.805 5.623-5.477 5.923.43.371.815 1.1.815 2.22 0 1.604-.014 2.895-.014 3.283 0 .317.218.692.825.577A12.004 12.004 0 0024 12.3c0-6.627-5.373-12-12-12" />
          </svg>
        </a>
        <a href="https://www.linkedin.com/in/MichaelWaruiru" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="hsl(200, 100%, 40%)" viewBox="0 0 24 24" width="40" height="40">
            <path d="M19 0H5C2.25 0 0 2.25 0 5v14c0 2.75 2.25 5 5 5h14c2.75 0 5-2.25 5-5V5c0-2.75-2.25-5-5-5zM7.5 20H4.5V9h3v11zm-1.5-12.75c-1 0-1.5-.75-1.5-1.5s.5-1.5 1.5-1.5 1.5.75 1.5 1.5-.5 1.5-1.5 1.5zm15 12.75h-3v-5.5c0-1.5-.5-2.5-1.75-2.5-1.25 0-1.75 1-1.75 2.5v5.5h-3v-11h3v1.5c.5-1 1.5-2 3.25-2 2.5 0 4.25 1.75 4.25 5.5v6.5z"/>
          </svg>
        </a>
      </div>
    </>
  );
}

export default Card;
