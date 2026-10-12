import { FormConfig, FormFieldConfig, FormUiTheme } from '../types';

export interface CompiledFormOutput {
  html: string;
  css: string;
  combined: string;
}

/**
 * Generates standalone, pure CSS (no Tailwind dependency) tailored to the chosen form theme.
 */
export function generateFormCss(form: FormConfig): string {
  const formId = form.id;
  const theme: FormUiTheme = form.themeStyle || 'minimalist';
  const prefix = `ankabit-form-${formId}`;

  // Theme-specific CSS definitions
  let themeRules = '';

  switch (theme) {
    case 'material':
      themeRules = `
        .${prefix}-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          padding: 32px;
        }
        .${prefix}-title {
          color: #1e293b;
          font-family: Roboto, -apple-system, sans-serif;
          font-weight: 700;
          font-size: 24px;
          margin-bottom: 8px;
        }
        .${prefix}-desc {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 24px;
        }
        .${prefix}-label {
          color: #475569;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
          display: block;
        }
        .${prefix}-input, .${prefix}-select, .${prefix}-textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 14px;
          color: #1e293b;
          background: #f8fafc;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        .${prefix}-input:focus, .${prefix}-select:focus, .${prefix}-textarea:focus {
          outline: none;
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }
        .${prefix}-submit-btn {
          width: 100%;
          padding: 14px 24px;
          background: #2563eb;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }
        .${prefix}-submit-btn:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
        }
      `;
      break;

    case 'islamic_heritage':
      themeRules = `
        .${prefix}-card {
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 8px 30px rgba(4, 120, 87, 0.08);
          border: 2px solid #047857;
          padding: 36px;
          position: relative;
        }
        .${prefix}-card::before {
          content: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
          display: block;
          text-align: center;
          font-family: 'Amiri', serif;
          font-size: 20px;
          color: #047857;
          margin-bottom: 16px;
          font-weight: bold;
        }
        .${prefix}-title {
          color: #064e3b;
          font-family: 'Amiri', serif, sans-serif;
          font-weight: 800;
          font-size: 26px;
          margin-bottom: 8px;
          text-align: center;
        }
        .${prefix}-desc {
          color: #047857;
          font-size: 13px;
          margin-bottom: 24px;
          text-align: center;
        }
        .${prefix}-label {
          color: #064e3b;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 6px;
          display: block;
        }
        .${prefix}-input, .${prefix}-select, .${prefix}-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #a7f3d0;
          border-radius: 10px;
          font-size: 14px;
          color: #064e3b;
          background: #f0fdf4;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        .${prefix}-input:focus, .${prefix}-select:focus, .${prefix}-textarea:focus {
          outline: none;
          border-color: #047857;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(4, 120, 87, 0.15);
        }
        .${prefix}-submit-btn {
          width: 100%;
          padding: 15px 24px;
          background: #047857;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(4, 120, 87, 0.3);
        }
        .${prefix}-submit-btn:hover {
          background: #065f46;
          box-shadow: 0 6px 18px rgba(4, 120, 87, 0.4);
        }
      `;
      break;

    case 'cyber_dark':
      themeRules = `
        .${prefix}-card {
          background: #0f172a;
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          border: 1px solid #1e293b;
          padding: 32px;
          color: #f8fafc;
        }
        .${prefix}-title {
          color: #38bdf8;
          font-family: 'JetBrains Mono', monospace, sans-serif;
          font-weight: 800;
          font-size: 22px;
          margin-bottom: 8px;
        }
        .${prefix}-desc {
          color: #94a3b8;
          font-size: 13px;
          margin-bottom: 24px;
        }
        .${prefix}-label {
          color: #cbd5e1;
          font-size: 12px;
          font-family: 'JetBrains Mono', monospace;
          margin-bottom: 6px;
          display: block;
        }
        .${prefix}-input, .${prefix}-select, .${prefix}-textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #334155;
          border-radius: 8px;
          font-size: 13px;
          color: #f8fafc;
          background: #1e293b;
          font-family: 'JetBrains Mono', monospace;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        .${prefix}-input:focus, .${prefix}-select:focus, .${prefix}-textarea:focus {
          outline: none;
          border-color: #38bdf8;
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
        }
        .${prefix}-submit-btn {
          width: 100%;
          padding: 14px 24px;
          background: #0284c7;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 0 16px rgba(2, 132, 199, 0.4);
        }
        .${prefix}-submit-btn:hover {
          background: #0369a1;
        }
      `;
      break;

    case 'glassmorphism':
      themeRules = `
        .${prefix}-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.6);
          padding: 36px;
        }
        .${prefix}-title {
          color: #0f172a;
          font-weight: 800;
          font-size: 24px;
          margin-bottom: 8px;
        }
        .${prefix}-desc {
          color: #475569;
          font-size: 14px;
          margin-bottom: 24px;
        }
        .${prefix}-label {
          color: #334155;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 6px;
          display: block;
        }
        .${prefix}-input, .${prefix}-select, .${prefix}-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid rgba(203, 213, 225, 0.8);
          border-radius: 12px;
          font-size: 14px;
          color: #0f172a;
          background: rgba(255, 255, 255, 0.6);
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        .${prefix}-input:focus, .${prefix}-select:focus, .${prefix}-textarea:focus {
          outline: none;
          border-color: #6366f1;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }
        .${prefix}-submit-btn {
          width: 100%;
          padding: 14px 24px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
        }
        .${prefix}-submit-btn:hover {
          opacity: 0.95;
          transform: translateY(-1px);
        }
      `;
      break;

    case 'minimalist':
    default:
      themeRules = `
        .${prefix}-card {
          background: #ffffff;
          border-radius: 14px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          padding: 32px;
        }
        .${prefix}-title {
          color: #0f172a;
          font-weight: 800;
          font-size: 24px;
          margin-bottom: 8px;
        }
        .${prefix}-desc {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 24px;
        }
        .${prefix}-label {
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 6px;
          display: block;
        }
        .${prefix}-input, .${prefix}-select, .${prefix}-textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          color: #0f172a;
          background: #ffffff;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        .${prefix}-input:focus, .${prefix}-select:focus, .${prefix}-textarea:focus {
          outline: none;
          border-color: #0f172a;
          box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.1);
        }
        .${prefix}-submit-btn {
          width: 100%;
          padding: 14px 24px;
          background: #0f172a;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .${prefix}-submit-btn:hover {
          background: #1e293b;
        }
      `;
      break;
  }

  // Common structural CSS (grid layout, field spacing, responsive half/third widths)
  return `
    .${prefix}-container {
      width: 100%;
      max-width: 820px;
      margin: 40px auto;
      padding: 0 16px;
      box-sizing: border-box;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .${prefix}-row {
      display: flex;
      flex-wrap: wrap;
      margin: -8px;
    }
    .${prefix}-col-full {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
    }
    .${prefix}-col-half {
      width: 50%;
      padding: 8px;
      box-sizing: border-box;
    }
    .${prefix}-col-third {
      width: 33.333%;
      padding: 8px;
      box-sizing: border-box;
    }
    @media (max-width: 640px) {
      .${prefix}-col-half, .${prefix}-col-third {
        width: 100%;
      }
    }
    .${prefix}-required-star {
      color: #ef4444;
      margin-left: 2px;
    }
    ${themeRules}
  `.replace(/\s+/g, ' ').trim();
}

/**
 * Generates standalone, pure HTML markup for the form with accessible attributes.
 */
export function generateFormHtml(form: FormConfig): string {
  const formId = form.id;
  const prefix = `ankabit-form-${formId}`;

  const fieldsToRender: FormFieldConfig[] = form.fields && form.fields.length > 0
    ? form.fields
    : [
        { id: 'studentName', label: 'Student / Applicant Name', labelAr: 'اسم الطالب', type: 'text', required: true, placeholder: 'e.g. Zaid Al-Mansoor', width: 'half', order: 1 },
        { id: 'email', label: 'Email Address', labelAr: 'البريد الإلكتروني', type: 'email', required: true, placeholder: 'name@example.com', width: 'half', order: 2 },
        { id: 'phone', label: 'Phone / WhatsApp', labelAr: 'رقم الهاتف', type: 'phone', required: true, placeholder: '+1 (555) 000-0000', width: 'half', order: 3 },
        { id: 'notes', label: 'Questions or Educational Goals', labelAr: 'ملاحظات إضافية', type: 'textarea', required: false, placeholder: 'Tell us about your learning background...', width: 'full', order: 4 },
      ];

  const renderedFields = fieldsToRender
    .map((field) => {
      const colClass =
        field.width === 'third'
          ? `${prefix}-col-third`
          : field.width === 'half'
          ? `${prefix}-col-half`
          : `${prefix}-col-full`;

      let inputMarkup = '';

      if (field.type === 'select') {
        const optionsMarkup = (field.options || ['Option 1', 'Option 2'])
          .map((opt) => `<option value="${opt}">${opt}</option>`)
          .join('');
        inputMarkup = `
          <select id="${field.id}" name="${field.id}" class="${prefix}-select" ${field.required ? 'required' : ''}>
            <option value="">Select an option...</option>
            ${optionsMarkup}
          </select>
        `;
      } else if (field.type === 'textarea') {
        inputMarkup = `
          <textarea id="${field.id}" name="${field.id}" rows="3" class="${prefix}-textarea" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea>
        `;
      } else if (field.type === 'file') {
        inputMarkup = `
          <input id="${field.id}" type="file" name="${field.id}" class="${prefix}-input" ${field.required ? 'required' : ''} />
        `;
      } else {
        const inputType = field.type === 'phone' ? 'tel' : field.type;
        inputMarkup = `
          <input id="${field.id}" type="${inputType}" name="${field.id}" class="${prefix}-input" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} />
        `;
      }

      return `
        <div class="${colClass}">
          <label for="${field.id}" class="${prefix}-label">
            ${field.label}
            ${field.required ? `<span class="${prefix}-required-star" aria-hidden="true">*</span>` : ''}
          </label>
          ${inputMarkup}
        </div>
      `;
    })
    .join('');

  const submitText = form.submitButtonText || 'Submit Application';

  return `
    <section class="${prefix}-container" data-ankabit-form-wrapper="true">
      <div class="${prefix}-card">
        <h2 class="${prefix}-title">${form.title}</h2>
        ${form.description ? `<p class="${prefix}-desc">${form.description}</p>` : ''}
        <form data-hifz-lead-form="true" data-form-id="${form.id}" data-form-title="${form.title}" noValidate>
          <div class="${prefix}-row">
            ${renderedFields}
            <div class="${prefix}-col-full" style="margin-top: 16px;">
              <button type="submit" class="${prefix}-submit-btn">
                ${submitText}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  `.replace(/\s+/g, ' ').trim();
}

/**
 * Compiles a FormConfig into combined HTML with scoped pure CSS.
 */
export function compileFormToHtmlAndCss(form: FormConfig): CompiledFormOutput {
  const css = generateFormCss(form);
  const html = generateFormHtml(form);
  const combined = `<style id="style-form-${form.id}">${css}</style>\n${html}`;

  return { html, css, combined };
}
