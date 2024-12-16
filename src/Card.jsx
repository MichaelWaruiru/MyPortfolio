import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'; // To make HTTP requests

function Card() {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const fileInputRef = useRef(null);

  // On component mount, check if the user is admin
  useEffect(() => {
    // Check URL query parameters for ?admin=true
    const urlParams = new URLSearchParams(window.location.search);
    const isAdminParam = urlParams.get('admin');

    // If admin=true is in the URL or admin flag is set in localStorage
    if (isAdminParam === 'true') {
      setIsAdmin(true); 
      localStorage.setItem('isAdmin', 'true');
    } else if (localStorage.getItem('isAdmin') === 'true') {
      setIsAdmin(true); 
    }

    // Fetch the resume URL from a persistent storage (Cloudinary or external API)
    const fetchResumeUrl = async () => {
      try {
        // Assuming Cloudinary already holds the latest resume URL (you can store and retrieve from your backend if necessary)
        const savedResumeUrl = "https://res.cloudinary.com/dlcl4anlt/raw/upload/v1628600243/sample_resume.pdf"; // Replace with actual fetching logic
        if (savedResumeUrl) {
          setResumeUrl(savedResumeUrl);
          setResumeFile({ name: 'Uploaded Resume' });
        }
      } catch (error) {
        console.error('Error fetching resume:', error);
      }
    };

    fetchResumeUrl();
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
        formData.append('upload_preset', 'do3ltyvk');
        formData.append('resource_type', 'raw'); 

        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dlcl4anlt/raw/upload',
          formData
        );
        console.log(file)

        // Get the URL of the uploaded file
        const fileUrl = response.data.secure_url;
        setResumeFile(file);
        setResumeUrl(fileUrl); // Set the Cloudinary URL dynamically
        setErrorMessage('');

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

    // If you want, send a request to delete the file from Cloudinary
  };

  return (
    <>
      <div className='card-container'>
        <div className='card'>
          <img className='profile-pic' src="/assets/profile.jpg" alt="Profile Picture" />
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

          {resumeUrl && (
            <div className='resume-link'>
              <p>Resume uploaded: {resumeFile?.name || 'Uploaded Resume'}</p>
              <a
                href={resumeUrl}
                download={resumeFile?.name || 'Resume'}
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

      <div className="about-section" id="about">
        <h2>About</h2>
        <p>Content about me</p>
      </div>

      <div className="services-section" id="services">
        <h2>Services</h2>
        <p>M-Pesa Intergrations</p>
        <p>Websites Authentication & Security</p>
        <p>Database Architecture, manipulation & Management</p>
      </div>

      <div className="projects-section" id="projects">
        <h2>Projects</h2>
        <p>Projects completed</p>
      </div>

      <div className="contact-section" id="contact">
        <h2>Contact</h2>
        <p>Feel free to reach out to me via the contact details below:</p>
        <p>Email: <a href="mailto:michaelwaruiru@gmail.com">michaelwaruiru@gmail.com</a></p>
        {/* <p>LinkedIn: <a href="https://www.linkedin.com/in/michaelwaruiru" target="_blank" rel="noopener noreferrer">Michael Waruiru</a></p> */}
        <p>Phone Number: +254 719 453 367</p>
      </div>
    </>
  );
}

export default Card;
