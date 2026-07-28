/**
 * Hans Footer Web Component
 * Reusable, self-contained footer displaying the Hans logo and "made by hans" link,
 * with an optional GitHub source link.
 */
class HansFooter extends HTMLElement {
  static get observedAttributes() {
    return ['github-url'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'github-url' && oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    // Resolve logo SVG path relative to this script location
    let scriptSrc = '';
    if (document.currentScript && document.currentScript.src) {
      scriptSrc = document.currentScript.src;
    } else {
      // Find script tag that loaded this script (works for modules / deferred scripts)
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src && (scripts[i].src.includes('footer.js') || scripts[i].src.includes('hans-footer.js'))) {
          scriptSrc = scripts[i].src;
          break;
        }
      }
    }

    let baseUrl = '';
    if (scriptSrc) {
      baseUrl = scriptSrc.substring(0, scriptSrc.lastIndexOf('/') + 1);
    } else {
      baseUrl = './';
    }
    const svgUrl = baseUrl + 'hans-logo.svg';
    const profileUrl = baseUrl + 'hans-profile-small.jpg';
    const githubUrl = this.getAttribute('github-url');

    const githubHtml = githubUrl
      ? `<span class="github-section"><span class="sep">|</span> source on <a href="${this.escapeHtml(githubUrl)}" target="_blank" rel="noopener noreferrer" class="github-link">github ↗</a></span>`
      : '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-top: auto;
          width: 100%;
          box-sizing: border-box;
          min-height: 76px; /* Reserve height to prevent Cumulative Layout Shift */
        }
        
        .footer {
          padding-top: 2rem;
          padding-bottom: calc(6px + var(--safe-bottom, 0px));
          padding-left: 1rem;
          padding-right: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          box-sizing: border-box;
        }

        .footer-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .logo-link {
          display: inline-block;
          line-height: 0;
          cursor: pointer;
        }

        .logo-wrapper {
          position: relative;
          width: 30px;
          height: 30px;
        }

        .logo {
          position: absolute;
          display: block;
          transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
        }

        .default-logo {
          top: 3px;
          left: 3px;
          width: 24px;
          height: 24px;
          opacity: 0.4;
          filter: var(--hans-footer-logo-filter, invert(0));
        }

        .profile-pic {
          top: 0;
          left: 0;
          width: 30px;
          height: 30px;
          opacity: 0;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
          box-sizing: border-box;
          object-fit: cover;
          transform: scale(0.8);
        }

        .text-line {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          color: var(--hans-footer-color, rgb(68, 68, 65));
          font-family: system-ui, -apple-system, sans-serif;
          margin: 0;
          text-align: center;
          line-height: 1.4;
          opacity: 0.5;
        }

        .about-link {
          color: var(--hans-footer-color, rgb(68, 68, 65));
          text-decoration: none;
        }

        .github-section {
          white-space: nowrap;
        }

        .sep {
          margin: 0 4px;
        }

        .github-link {
          color: var(--hans-footer-color, rgb(68, 68, 65));
          text-decoration: underline;
        }

        /* Hover States */

        /* 1. Hovering the logo itself: Only increases the default logo opacity */
        .logo-link:hover .default-logo {
          opacity: 0.6;
        }

        /* 2. Hovering the 'hans' link: transitions the logo to the 30px profile photo */
        .footer-container:has(.hans-link:hover) .default-logo {
          opacity: 0;
          transform: scale(0.8);
        }
        .footer-container:has(.hans-link:hover) .profile-pic {
          opacity: 1;
          transform: scale(1);
        }

        .github-link:hover {
          opacity: 0.8;
        }
      </style>
      <footer class="footer">
        <div class="footer-container">
          <a href="https://haaans.com/about/" target="_blank" rel="noopener noreferrer" class="logo-link">
            <div class="logo-wrapper">
              <img class="logo default-logo" alt="Hans Logo" src="${this.escapeHtml(svgUrl)}">
              <img class="logo profile-pic" alt="Hans Profile" src="${this.escapeHtml(profileUrl)}">
            </div>
          </a>
          <p class="text-line">
            <span>made by </span><a href="https://haaans.com/about/" target="_blank" rel="noopener noreferrer" class="about-link hans-link">hans</a>
            ${githubHtml}
          </p>
        </div>
      </footer>
    `;
  }

  escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
}

customElements.define('hans-footer', HansFooter);
