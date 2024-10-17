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
            I am a backend developer with mastery in Go/Golang, Python (Django framework and Flask microframework).
            <br />
            Sometimes I train models, mentally! I am a Machine Learning enthusiast because the future is AI. AIn't it? (See what I did there?😎)
            <br />
            And no, I am not a  JavaScript fan but here I am with React😁
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
    </>
  );
}

export default Card;
