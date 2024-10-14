import React, { useEffect, useRef, useState } from 'react';

function Card() {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null); // Reference for file input

  // Load resume from local storage on component mount
  useEffect(() => {
    const savedResumeUrl = localStorage.getItem('resumeFileUrl');
    const savedResumeName = localStorage.getItem('resumeFileName');
    if (savedResumeUrl && savedResumeName) {
      setResumeUrl(savedResumeUrl);
      setResumeFile({ name: savedResumeName });
    }
  }, []);

  // Handle file upload with size validation
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const maxFileSize = 5 * 1024 * 1024; // 5 MB in bytes

    if (file) {
      if (file.size > maxFileSize) {
        setErrorMessage('File size exceeds 5MB. Please upload a smaller file.');
        setResumeFile(null);
        setResumeUrl(null);
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      setResumeFile(file);
      setResumeUrl(fileUrl);
      setErrorMessage('');

      // Store file URL and name in local storage
      localStorage.setItem('resumeFileUrl', fileUrl);
      localStorage.setItem('resumeFileName', file.name);

      // Clear the file input after successful upload
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
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
      <div className='card-container'>
        <div className='card'>
          <img className='profile-pic' src="/src/assets/profile.jpg" alt="Profile Picture" />
          <h2 className='card-title'>Michael Waruiru</h2>
          <p className='card-text'>Backend Developer</p>
        </div>
        <div className='description-container'>
          <p className='description'>I am a backend developer with mastery in Go/Golang, Python (Django framework and Flask microframework)</p>

          {/* File upload section */}
          <div className='upload-section'>
            <label htmlFor="resume-upload">Upload Resume:</label>
            <input
              ref={fileInputRef}
              type="file"
              id="resume-upload"
              accept=".pdf, .doc, .docx"
              onChange={handleFileChange}
            />
            {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
          </div>

          {/* Display resume download link if a file is uploaded */}
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
              <br />
              <br />
              <button onClick={handleDeleteResume} className='delete-btn'>Delete Resume</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Card;
