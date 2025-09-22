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

    // Fetch the resume URL from Cloudinary
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
          <br />
          <p className='card-text'>Backend Developer</p>
        </div>
         <div className='description-container'>
          <p className='description'>
            I am a backend developer with mastery in Go/Golang, Python (Django framework and Flask microframework).
            <br />
            Sometimes I train models, mentally! I have also delved deeper into Machine Learning because the future is AI. AIn't it? (See what I did there?😎)
            <br />
            I explore frontend terminologies for the plot😁
          </p>

          {/* {isAdmin && (
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
          )} */}
        </div>
      </div>

      <div className="about-section" id="about">
        <h2>About Me</h2>
        <p>Hi, I am <strong>Michael Waruiru,</strong> a <strong>backend developer,</strong> based in Nairobi, Kenya.</p>
        <p>I have<strong> backend expertise</strong> which reflects my mastery in building robust, scalable, and efficient solutions. My technical proficiency spans across programming languages like <strong>Go/Golang</strong> and <strong>Python</strong>, where I leverage frameworks such as Django and Flask to create seamless web applications.</p>
        <p>My curiosity and drive extend beyond backend systems—I've recently expanded my expertise to <strong>Machine Learning</strong> and <strong>Deep Learning</strong> using tools and frameworks like LangGraph and Tensorflow. </p>
{/*         <p>While my primary focus lies in backend technologies, I also take pride in stepping into front-end frameworks like React, Vanilla Javascript, HTML and CSS to craft complete, well-rounded applications.</p> */}
        <p>I find joy in solving real-world problems, mentoring, and constantly learning to stay ahead in the fast-evolving tech landscape. Whether it's designing secure database architectures or integrating APIs for services like M-Pesa and Twilio, my goal is always to deliver solutions that empower businesses and individuals alike.</p>
        <p>Outside the world of coding, I live!</p>
      </div>

      <div className="services-section" id="services">
        <h2>Services</h2>
        <p>API Intergrations.</p>
        <p>M-Pesa Intergrations.</p>
        <p>Data Storage & Retrieval.</p>
        <p>Websites Scalability, Authentication & Security.</p>
        <p>Database Architecture, Manipulation & Management.</p>
      </div>

      <div className="projects-section" id="projects">
        <h2>Projects</h2>
        <div id="projectsCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="project-card">
                <a 
                  href="https://github.com/MichaelWaruiru/SaccoManagement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  Sacco Management
                </a>
                <p>A system for managing PSVs, Sacco members like drivers, managers, and route marshals, passengers, and fare.</p>
              </div>
            </div>
            <div className="carousel-item">
              <div className="project-card">
                <a 
                  href="https://github.com/MichaelWaruiru/LibraryProcess"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  Library System
                </a>
                <p>
                  A system for integrating with a school system to run all activities that happen in a library like managing catalogues and book borrowing.
                </p>
              </div>
            </div>
            <div className="carousel-item">
              <div className="project-card">
                <a 
                  href="https://github.com/MichaelWaruiru/ecommerce"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  E-Commerce
                </a>
                <p>
                  A website where admin users can add items with email and M-Pesa integration.
                </p>
              </div>
            </div>
            <div className="carousel-item">
              <div className="project-card">
                <a 
                  href="https://github.com/MichaelWaruiru/qr-scanner"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  QR Scanner
                </a>
                <p>
                  A project where users can scan a QR Code sending an OTP for M-Pesa payment.
                </p>
              </div>
            </div>
          </div>

          {/* Carousel indicators */}
          <div className="carousel-indicators custom-indicators">
            <button
              type="button"
              data-bs-target="#projectsCarousel"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#projectsCarousel"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#projectsCarousel"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
            <button
              type="button"
              data-bs-target="#projectsCarousel"
              data-bs-slide-to="3"
              aria-label="Slide 4"
            ></button>
          </div>

          {/* Carousel controls */}
          <button className="carousel-control-prev" type="button" data-bs-target="#projectsCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#projectsCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>


      <div className="contact-section" id="contact">
        <h2>Contact</h2>
        <p>Feel free to reach out to me via the contact details below:</p>
        <p>Email: <a href="mailto:michaelwaruiru@gmail.com">michaelwaruiru@gmail.com</a></p>
        {/* <p>LinkedIn: <a href="https://www.linkedin.com/in/michaelwaruiru" target="_blank" rel="noopener noreferrer">Michael Waruiru</a></p> */}
        {/* <p>Phone Number: +254 719 453 367</p> */}
      </div>
    </>
  );
}

export default Card;
