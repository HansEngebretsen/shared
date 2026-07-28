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
    // Resolve logo profile path relative to this script location
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
    const profileUrl = baseUrl + 'hans-profile-small.jpg';
    const githubUrl = this.getAttribute('github-url');

    const githubHtml = githubUrl
      ? `<span class="github-section"><span class="sep">|</span> <span class="github-text-part">source on </span><a href="${this.escapeHtml(githubUrl)}" target="_blank" rel="noopener noreferrer" class="github-link">github</a></span>`
      : '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-top: auto;
          min-height: 76px; /* Reserve height to prevent Cumulative Layout Shift */
          --hans-footer-color: inherit;
        }
        
        .footer {
          padding: 2rem 1rem calc(6px + var(--safe-bottom, 0px));
          display: flex;
          justify-content: center;
        }

        .footer-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .logo-wrapper {
          position: relative;
          width: 30px;
          height: 30px;
        }

        .logo {
          position: absolute;
          transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
        }

        .default-logo {
          top: 3px;
          left: 3px;
          width: 24px;
          height: 24px;
          opacity: 0.4;
          fill: var(--hans-footer-color, inherit);
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
          font: 500 0.65rem/1.4 system-ui, -apple-system, sans-serif;
          letter-spacing: 0.05em;
          color: var(--hans-footer-color, inherit);
          margin: 0;
          text-align: center;
        }

        /* Set default opacity of 0.5 on the spans and links inside the text line */
        .text-line > span:not(.github-section),
        .about-link,
        .sep,
        .github-text-part,
        .github-link {
          opacity: 0.5;
        }

        .about-link,
        .github-link {
          color: inherit;
          text-decoration: underline;
        }

        .github-section {
          white-space: nowrap;
        }

        .sep {
          margin: 0 4px;
        }

        /* Hover States */

        /* 1. Hovering the logo itself: Only increases the default logo opacity to 0.6 */
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

        /* Increase contrast of the links on hover */
        .hans-link:hover,
        .github-link:hover {
          opacity: 1;
        }
      </style>
      <footer class="footer">
        <div class="footer-container">
          <a href="https://haaans.com/about/" target="_blank" rel="noopener noreferrer" class="logo-link">
            <div class="logo-wrapper">
              <svg class="logo default-logo" viewBox="0 0 824 824" preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0.000000,824.000000) scale(0.100000,-0.100000)" stroke="none">
                  <path d="M0 4171 l0 -2919 645 0 645 0 0 1662 0 1661 1003 -2 c551 -1 1029 -3 1062 -3 l60 0 0 -1657 0 -1658 2282 -1 2283 -2 -3 645 -2 645 -1635 1 -1635 2 -1 486 -1 487 161 0 c89 -1 166 0 171 2 6 1 15 1 20 0 28 -5 774 -2 783 4 6 3 13 3 15 -1 4 -7 275 -9 302 -3 6 1 15 1 20 0 14 -2 768 -3 780 0 6 1 15 1 20 0 28 -5 774 -2 783 4 6 3 13 3 15 -1 3 -5 49 -6 104 -4 54 1 141 4 193 4 52 1 97 5 100 9 3 3 5 525 5 1160 l0 1153 -642 0 c-566 0 -643 2 -644 15 0 8 -1 288 -1 623 l-1 607 -1132 0 -1132 0 0 -614 c0 -337 -3 -617 -6 -622 -4 -7 -3279 -12 -3319 -5 -5 0 -8 280 -8 621 l0 620 -645 0 -645 0 0 -2919z m6851 1629 l36 0 0 -494 0 -495 -1091 2 -1091 2 -1 485 c-1 267 2 490 6 495 6 8 1557 12 2141 5z"/>
                </g>
              </svg>
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
