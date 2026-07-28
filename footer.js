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
    const githubUrl = this.getAttribute('github-url');

    const githubHtml = githubUrl
      ? `<span class="github-section"><span class="sep">|</span> source on <a href="${this.escapeHtml(githubUrl)}" target="_blank" rel="noopener noreferrer" class="github-link">github</a> ↗</span>`
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
          padding-bottom: var(--safe-bottom, 0px);
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

        .logo {
          width: 24px;
          height: 24px;
          opacity: 0.4;
          transition: opacity 0.2s ease-in-out;
          filter: var(--hans-footer-logo-filter, invert(0));
          display: block;
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
        }

        .about-link {
          color: var(--hans-footer-color, rgb(68, 68, 65));
          text-decoration: none;
          opacity: 0.3;
          transition: opacity 0.2s ease-in-out;
        }

        .github-section {
          opacity: 0.3;
          transition: opacity 0.2s ease-in-out;
          white-space: nowrap;
        }

        .sep {
          margin: 0 4px;
        }

        .github-link {
          color: var(--hans-footer-color, rgb(68, 68, 65));
          text-decoration: underline;
        }

        /* Hover effects using :has() for true group-hover recreation */
        .footer-container:has(.logo-link:hover) .logo {
          opacity: 0.6;
        }
        .footer-container:has(.logo-link:hover) .about-link {
          opacity: 0.5;
        }

        .footer-container:has(.about-link:hover) .logo {
          opacity: 0.6;
        }
        .footer-container:has(.about-link:hover) .about-link {
          opacity: 0.5;
        }

        .github-section:has(.github-link:hover) {
          opacity: 0.5;
        }
      </style>
      <footer class="footer">
        <div class="footer-container">
          <a href="https://haaans.com/about/" target="_blank" rel="noopener noreferrer" class="logo-link">
            <img class="logo" alt="Hans Logo" src="${this.escapeHtml(svgUrl)}">
          </a>
          <p class="text-line">
            <a href="https://haaans.com/about/" target="_blank" rel="noopener noreferrer" class="about-link">made by hans</a>
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
