import React, { useState, useEffect } from 'react';
import './ResourcesPage.scss';
import Header from '../../Header';
import env from '../../../env';
import AuthService from '../../../api/AuthService';

const totalImages = 49;
const conceptImages = Array.from({ length: totalImages }, (_, i) => `./poc/${i}.png`);

function ResourcesPage({ themeColors, updateTheme }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLogged, setIsLogged] = useState(null);

  const handleGoogleLogin = () => {
    window.location.href = `${env.BACKEND_URL}/oauth2/authorization/google`;
  }

  useEffect(() => {
    const checkAuthStatus = async () => {
      const isLoggedIn = await AuthService.isLogged();
      setIsLogged(isLoggedIn);
    };
    
    checkAuthStatus();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    setZoomLevel(1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setZoomLevel(1);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % conceptImages.length);
    setZoomLevel(1);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + conceptImages.length) % conceptImages.length);
    setZoomLevel(1);
  };

  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 1, 5));
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 1, 1));

  return (
    <div className="resources-page">
      <Header themeColors={themeColors} updateTheme={updateTheme} dynamicButtonScene="play" />

      <div className="resources-content">

        {(isLogged) ? (<></>) : (<div className="second-row">
          <div className="join-section">
            <h2>Únete</h2>
            <p>¡Inicia sesión con Google!</p>
            <div
              onClick={handleGoogleLogin}
              className="button scale google"
              style={{
                width: '63px',
                height: '63px',
                imageRendering: 'pixelated',
                backgroundImage: "url('./icons/google.png')",
                backgroundSize: '63px 63px',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            ></div>
          </div>
        </div>)}

        {/* Primera fila */}
        <div className="first-row">
          <div className="left-column">
            <section className="intro">
              <h2>¿Qué es Codiseum?</h2>
              <p>
                <strong>Codiseum</strong> es una plataforma web competitiva que combina programación y juego.<br /><br />
                Su nombre nace de la unión de <em>Code</em> y <em>Coliseum</em>, y propone un enfoque que combina
                <strong> batallas 1vs1 de código HTML</strong> donde los jugadores compiten resolviendo retos en tiempo real.
              </p>
            </section>
          </div>

          <div className="right-column">
            <section className="image-preview">
              <h2>Pruebas de concepto</h2>
              <div className="image-container" onClick={openModal}>
                <img
                  src={conceptImages[currentImage]}
                  alt={`preview-${currentImage}`}
                  className="preview-image"
                />
              </div>
              <div className="carousel-controls">
                <button className="button" onClick={prevImage}>◀</button>
                <button className="button" onClick={nextImage}>▶</button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="button modal-btn close" onClick={closeModal}>✕</button>
            <button className="button modal-btn left" onClick={prevImage}>◀</button>

            <img
              src={conceptImages[currentImage]}
              alt={`concept-${currentImage}`}
              style={{
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.3s ease',
                cursor: zoomLevel > 1 ? 'zoom-out' : 'zoom-in',
              }}
            />

            <button className="button modal-btn right" onClick={nextImage}>▶</button>

            <div className="zoom-controls">
              <button className="button" onClick={zoomOut}>−</button>
              <span>{zoomLevel.toFixed(1)}x</span>
              <button className="button" onClick={zoomIn}>+</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourcesPage;